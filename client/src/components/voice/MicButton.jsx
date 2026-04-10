/**
 * MicButton — Large, accessible microphone toggle with audio-level visualizer
 */

import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function MicButton({ isRecording, isProcessing, audioLevel, onClick, disabled }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const levelRef = useRef(0);

  // Smooth audio level canvas visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    const draw = () => {
      // Smooth lerp
      levelRef.current += (audioLevel - levelRef.current) * 0.15;
      const level = levelRef.current;

      ctx.clearRect(0, 0, W, H);

      if (isRecording && level > 0.02) {
        // Draw concentric rings based on audio level
        const maxRings = 3;
        for (let i = maxRings; i >= 1; i--) {
          const ringLevel = level * (i / maxRings);
          const radius = 44 + ringLevel * 30 * i;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.6 - i * 0.15})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isRecording, audioLevel]);

  const getButtonState = () => {
    if (isProcessing) return 'processing';
    if (isRecording) return 'recording';
    return 'idle';
  };

  const state = getButtonState();

  const stateConfig = {
    idle: {
      bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      shadow: '0 0 0 0 rgba(16,185,129,0)',
      icon: faMicrophone,
      label: 'बोलण्यासाठी दाबा / Press to speak',
      ariaLabel: 'Start recording',
    },
    recording: {
      bg: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      shadow: '0 0 20px rgba(239,68,68,0.5)',
      icon: faMicrophoneSlash,
      label: 'थांबण्यासाठी दाबा / Tap to stop',
      ariaLabel: 'Stop recording',
    },
    processing: {
      bg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      shadow: '0 0 20px rgba(245,158,11,0.4)',
      icon: faSpinner,
      label: 'प्रक्रिया सुरू / Processing...',
      ariaLabel: 'Processing audio',
    },
  };

  const cfg = stateConfig[state];

  return (
    <div className="mic-button-container">
      {/* Canvas for audio visualizer rings */}
      <canvas
        ref={canvasRef}
        width={160}
        height={160}
        className="mic-canvas"
        aria-hidden="true"
      />

      {/* Main mic button */}
      <button
        id="voice-mic-btn"
        className={`mic-btn mic-btn--${state}`}
        onClick={onClick}
        disabled={disabled || isProcessing}
        aria-label={cfg.ariaLabel}
        aria-pressed={isRecording}
        style={{ background: cfg.bg, boxShadow: cfg.shadow }}
      >
        <FontAwesomeIcon
          icon={cfg.icon}
          className={`mic-icon ${state === 'processing' ? 'fa-spin' : ''}`}
        />
        {/* Pulse ring when recording */}
        {state === 'recording' && <span className="mic-pulse-ring" />}
      </button>

      {/* Label below button */}
      <p className="mic-label" aria-live="polite">{cfg.label}</p>
    </div>
  );
}
