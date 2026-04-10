/**
 * useVoiceWebSocket — Custom React hook for Voice Assistant
 *
 * Manages the full lifecycle:
 *  1. WebSocket connection to backend
 *  2. MediaRecorder audio capture (browser microphone)
 *  3. Web Audio API visualizer data
 *  4. Base64 audio decoding and playback (TTS responses)
 *  5. Avatar state transitions
 *  6. Auto-reconnection
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// WebSocket connects directly to Flask on dev; through Node proxy in production
const WS_URL = import.meta.env.VITE_VOICE_WS_URL
  || (window.location.protocol === 'https:' ? 'wss://' : 'ws://')
    + (import.meta.env.VITE_FLASK_URL
        ? import.meta.env.VITE_FLASK_URL.replace(/^https?:\/\//, '')
        : 'localhost:5002')
    + '/api/voice/ws';

const HTTP_BASE = import.meta.env.VITE_FLASK_URL || 'http://localhost:5002';

const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECTS = 5;

export function useVoiceWebSocket() {
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // connected | connecting | disconnected | error
  const wsRef = useRef(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const sessionId = useRef(uuidv4());

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioFormatRef = useRef('webm');

  // Avatar & UI state
  const [avatarState, setAvatarState] = useState('idle'); // idle | listening | thinking | speaking
  const [currentLanguage, setCurrentLanguage] = useState('hi');
  const [languageDisplay, setLanguageDisplay] = useState('हिंदी');
  const [audioLevel, setAudioLevel] = useState(0); // 0-1 for visualizer
  const animFrameRef = useRef(null);

  // Transcript / chat state
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      text: 'नमस्ते! मी कृषी मित्र आहे. मी Marathi, Hindi किंवा English मध्ये बोलू शकतो. आपली सेवा करण्यासाठी तत्पर आहे! 🌾',
      language: 'mr',
      intent: 'greeting',
      timestamp: Date.now(),
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState(null);

  // Audio playback
  const currentAudioRef = useRef(null);

  // ──────────────────────────────────────────────────────────
  // WebSocket management
  // ──────────────────────────────────────────────────────────

  const handleWsMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'config_ack':
          break;

        case 'avatar_state':
          setAvatarState(data.state || 'idle');
          break;

        case 'transcript':
          setCurrentTranscript(data.transcript || '');
          setCurrentLanguage(data.language || 'hi');
          setLanguageDisplay(data.language_display || data.language);
          setMessages(prev => [...prev, {
            id: `user-${Date.now()}`,
            type: 'user',
            text: data.transcript,
            language: data.language,
            timestamp: Date.now(),
          }]);
          break;

        case 'response':
          setIsProcessing(false);
          setCurrentTranscript('');
          setCurrentLanguage(data.language || 'hi');
          setLanguageDisplay(data.language_display || data.language);

          setMessages(prev => [...prev, {
            id: `bot-${Date.now()}`,
            type: 'bot',
            text: data.response_text,
            language: data.language,
            intent: data.intent,
            missingSlots: data.missing_slots || [],
            isComplete: data.is_complete,
            timestamp: Date.now(),
          }]);

          // Play TTS audio
          if (data.audio_base64) {
            playAudio(data.audio_base64, data.audio_format || 'mp3', data.duration_estimate || 3);
          } else {
            setAvatarState('idle');
          }
          break;

        case 'error':
          setIsProcessing(false);
          setAvatarState('idle');
          setError(data.message || 'Unknown error');
          break;

        case 'pong':
          break;

        default:
          break;
      }
    } catch (e) {
      console.error('[Voice WS] Failed to parse message:', e);
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

    setConnectionStatus('connecting');
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus('connected');
      reconnectCountRef.current = 0;
      setError(null);
      // Send session config
      ws.send(JSON.stringify({
        type: 'config',
        session_id: sessionId.current,
        language: currentLanguage,
        audio_format: audioFormatRef.current,
      }));
    };

    ws.onmessage = handleWsMessage;

    ws.onclose = (event) => {
      setConnectionStatus('disconnected');
      wsRef.current = null;
      // Auto-reconnect unless intentionally closed
      if (event.code !== 1000 && reconnectCountRef.current < MAX_RECONNECTS) {
        reconnectCountRef.current += 1;
        reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };

    ws.onerror = () => {
      setConnectionStatus('error');
      setError('Cannot connect to Voice Assistant service. Is the Flask server running?');
    };
  }, [currentLanguage, handleWsMessage]);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimerRef.current);
    reconnectCountRef.current = MAX_RECONNECTS; // Prevent auto-reconnect
    wsRef.current?.close(1000, 'User disconnected');
    wsRef.current = null;
    setConnectionStatus('disconnected');
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close(1000, 'Component unmounted');
      cancelAnimationFrame(animFrameRef.current);
      stopAudioLevel();
    };
  }, []);

  // ──────────────────────────────────────────────────────────
  // Audio level visualizer
  // ──────────────────────────────────────────────────────────

  const startAudioLevel = useCallback((stream) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);
    audioContextRef.current = ctx;
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setAudioLevel(avg / 128); // Normalize to 0-1
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const stopAudioLevel = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

  // ──────────────────────────────────────────────────────────
  // Audio playback (TTS)
  // ──────────────────────────────────────────────────────────

  const playAudio = useCallback((base64Audio, format, durationEstimate) => {
    if (!base64Audio) {
      setAvatarState('idle');
      return;
    }
    try {
      // Stop any current audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: `audio/${format}` });
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      currentAudioRef.current = audio;
      setAvatarState('speaking');

      audio.onended = () => {
        URL.revokeObjectURL(url);
        currentAudioRef.current = null;
        setAvatarState('idle');
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        currentAudioRef.current = null;
        setAvatarState('idle');
      };

      audio.play().catch(err => {
        console.warn('[Voice] Audio playback error:', err);
        setAvatarState('idle');
      });
    } catch (e) {
      console.error('[Voice] Failed to play audio:', e);
      setAvatarState('idle');
    }
  }, []);

  // ──────────────────────────────────────────────────────────
  // Microphone recording
  // ──────────────────────────────────────────────────────────

  const startRecording = useCallback(async () => {
    try {
      // Stop current TTS first
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      audioStreamRef.current = stream;
      startAudioLevel(stream);

      // Determine best format
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
        .find(m => MediaRecorder.isTypeSupported(m)) || '';
      
      // Extract base format for Flask
      if (mimeType.includes('webm')) audioFormatRef.current = 'webm';
      else if (mimeType.includes('ogg')) audioFormatRef.current = 'ogg';
      else if (mimeType.includes('mp4')) audioFormatRef.current = 'mp4';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = recorder;

      // Send config with current audio format
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'config',
          session_id: sessionId.current,
          language: currentLanguage,
          audio_format: audioFormatRef.current,
        }));
      }

      audioChunksRef.current = [];

      // Send audio chunks as they arrive
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        if (wsRef.current?.readyState === WebSocket.OPEN && audioChunksRef.current.length > 0) {
          // Send all accumulated data as a single perfect Blob/Buffer
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          const buffer = await blob.arrayBuffer();
          
          wsRef.current.send(buffer);
          
          // Small delay to ensure binary frame goes out before text control frame
          setTimeout(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({ type: 'audio_end' }));
            }
          }, 50);
        }
        audioChunksRef.current = [];
      };

      recorder.start(); // Record whole stream until stopped
      setIsRecording(true);
      setAvatarState('listening');
      setError(null);
    } catch (err) {
      console.error('[Voice] Failed to start recording:', err);
      if (err.name === 'NotAllowedError') {
        setError('Microphone permission denied. Please allow microphone access.');
      } else {
        setError(`Cannot start recording: ${err.message}`);
      }
    }
  }, [currentLanguage, startAudioLevel]);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

    mediaRecorderRef.current.stop(); // Triggers onstop above
    audioStreamRef.current?.getTracks().forEach(t => t.stop());
    stopAudioLevel();
    setIsRecording(false);
    setIsProcessing(true);
    setAvatarState('thinking');
  }, [stopAudioLevel]);

  // ──────────────────────────────────────────────────────────
  // Text-only input (fallback)
  // ──────────────────────────────────────────────────────────

  const sendTextMessage = useCallback(async (text, lang = null) => {
    const language = lang || currentLanguage;
    if (!text.trim()) return;

    setIsProcessing(true);
    setAvatarState('thinking');

    // Add user message immediately
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: 'user',
      text,
      language,
      timestamp: Date.now(),
    }]);

    // Try WebSocket first, fall back to HTTP
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'text_only',
        session_id: sessionId.current,
        language,
        text,
      }));
    } else {
      // HTTP fallback
      try {
        const res = await fetch(`${HTTP_BASE}/api/voice/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId.current, language, text }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages(prev => [...prev, {
          id: `bot-${Date.now()}`,
          type: 'bot',
          text: data.response_text,
          language: data.language || language,
          intent: data.intent,
          missingSlots: data.missing_slots || [],
          isComplete: data.is_complete,
          timestamp: Date.now(),
        }]);

        if (data.audio_base64) {
          playAudio(data.audio_base64, data.audio_format || 'mp3', data.duration_estimate || 3);
        }
      } catch (err) {
        setError(`Failed to get response: ${err.message}`);
        setAvatarState('idle');
      } finally {
        setIsProcessing(false);
      }
    }
  }, [currentLanguage, playAudio]);

  // ──────────────────────────────────────────────────────────
  // Language switcher
  // ──────────────────────────────────────────────────────────

  const switchLanguage = useCallback((lang) => {
    const display = { mr: 'मराठी', hi: 'हिंदी', en: 'English' };
    setCurrentLanguage(lang);
    setLanguageDisplay(display[lang] || lang);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: 'welcome',
      type: 'bot',
      text: 'नवीन संभाषण सुरू झाले. 🌾',
      language: currentLanguage,
      intent: 'greeting',
      timestamp: Date.now(),
    }]);
  }, [currentLanguage]);

  return {
    // Connection
    connectionStatus,
    connect,
    disconnect,
    // Recording
    isRecording,
    startRecording,
    stopRecording,
    audioLevel,
    // Processing
    isProcessing,
    currentTranscript,
    // Language
    currentLanguage,
    languageDisplay,
    switchLanguage,
    // Messages
    messages,
    sendTextMessage,
    clearMessages,
    // Avatar
    avatarState,
    // Error
    error,
    setError,
  };
}
