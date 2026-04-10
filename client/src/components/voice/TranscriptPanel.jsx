/**
 * TranscriptPanel — Chat-style conversation transcript
 * Shows user speech and bot responses with language tags, intent badges, and timestamps.
 */

import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot, faUser, faLeaf, faTimes } from '@fortawesome/free-solid-svg-icons';

const INTENT_BADGES = {
  insurance_inquiry: { label: 'पीक विमा', emoji: '🛡️', color: '#7c3aed' },
  crop_price:        { label: 'बाजारभाव', emoji: '📊', color: '#0369a1' },
  weather:           { label: 'हवामान',   emoji: '🌦️', color: '#0891b2' },
  disease_help:      { label: 'रोग',       emoji: '🔬', color: '#dc2626' },
  irrigation_advice: { label: 'सिंचन',     emoji: '💧', color: '#0d9488' },
  general:           { label: 'सामान्य',   emoji: '🌾', color: '#059669' },
  greeting:          { label: 'स्वागत',    emoji: '👋', color: '#6d28d9' },
};

const QUICK_CHIPS = [
  { text: 'पीक विमा माहिती द्या', lang: 'mr', emoji: '🛡️' },
  { text: 'आजचा गहू बाजारभाव',   lang: 'mr', emoji: '📊' },
  { text: 'Crop insurance info',  lang: 'en', emoji: '🛡️' },
  { text: 'मौसम की जानकारी दें', lang: 'hi', emoji: '🌦️' },
  { text: 'रोग ओळखण्यास मदत करा', lang: 'mr', emoji: '🔬' },
  { text: 'सिंचन सल्ला द्या',    lang: 'mr', emoji: '💧' },
];

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg, isLatest }) {
  const isUser = msg.type === 'user';
  const badge = INTENT_BADGES[msg.intent];

  return (
    <div
      className={`transcript-msg ${isUser ? 'transcript-msg--user' : 'transcript-msg--bot'} ${isLatest ? 'transcript-msg--latest' : ''}`}
    >
      {/* Avatar icon */}
      <div className={`transcript-avatar-icon ${isUser ? 'transcript-avatar-icon--user' : 'transcript-avatar-icon--bot'}`}>
        <FontAwesomeIcon icon={isUser ? faUser : faRobot} />
      </div>

      <div className="transcript-bubble-content">
        {/* Intent badge */}
        {!isUser && badge && (
          <div className="transcript-intent-badge" style={{ backgroundColor: badge.color + '18', color: badge.color, borderColor: badge.color + '30' }}>
            <span>{badge.emoji}</span>
            <span>{badge.label}</span>
          </div>
        )}

        {/* Language pill */}
        {msg.language && (
          <span className="transcript-lang-pill">
            {msg.language === 'mr' ? 'मराठी' : msg.language === 'hi' ? 'हिंदी' : 'EN'}
          </span>
        )}

        {/* Message text */}
        <div className={`transcript-bubble ${isUser ? 'transcript-bubble--user' : 'transcript-bubble--bot'}`}>
          <p className="transcript-text">{msg.text}</p>
        </div>

        {/* Missing slots hint */}
        {!isUser && msg.missingSlots && msg.missingSlots.length > 0 && (
          <div className="transcript-slots">
            <span>📋 Still need: </span>
            {msg.missingSlots.map(s => (
              <span key={s} className="transcript-slot-chip">{s.replace('_', ' ')}</span>
            ))}
          </div>
        )}

        <span className="transcript-timestamp">{formatTime(msg.timestamp)}</span>
      </div>
    </div>
  );
}

export default function TranscriptPanel({
  messages = [],
  isProcessing = false,
  currentTranscript = '',
  currentLanguage = 'hi',
  onSendText,
  onClear,
}) {
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, currentTranscript]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendText?.(inputText, currentLanguage);
    setInputText('');
  };

  const handleChip = (chip) => {
    onSendText?.(chip.text, chip.lang);
  };

  return (
    <div className="transcript-panel">
      {/* Header */}
      <div className="transcript-header">
        <div className="transcript-header-left">
          <FontAwesomeIcon icon={faLeaf} className="transcript-header-icon" />
          <span className="transcript-header-title">Conversation</span>
          <span className="transcript-msg-count">{messages.length}</span>
        </div>
        {messages.length > 1 && (
          <button
            className="transcript-clear-btn"
            onClick={onClear}
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      {/* Quick chips */}
      <div className="transcript-chips">
        {QUICK_CHIPS.map((chip, i) => (
          <button
            key={i}
            className="transcript-chip"
            onClick={() => handleChip(chip)}
            disabled={isProcessing}
            type="button"
          >
            {chip.emoji} {chip.text}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="transcript-messages" role="log" aria-live="polite" aria-label="Conversation transcript">
        {messages.map((msg, idx) => (
          <MessageBubble key={msg.id} msg={msg} isLatest={idx === messages.length - 1} />
        ))}

        {/* Live transcript while recording */}
        {currentTranscript && (
          <div className="transcript-live">
            <div className="transcript-live-dot" />
            <span>{currentTranscript}</span>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && !currentTranscript && (
          <div className="transcript-msg transcript-msg--bot">
            <div className="transcript-avatar-icon transcript-avatar-icon--bot">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <div className="transcript-bubble-content">
              <div className="transcript-bubble transcript-bubble--bot">
                <div className="transcript-thinking">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Text input fallback */}
      <form className="transcript-input-bar" onSubmit={handleSubmit}>
        <input
          id="voice-text-input"
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Type here (or use microphone above)..."
          className="transcript-input"
          disabled={isProcessing}
          autoComplete="off"
          dir="auto"
        />
        <button
          type="submit"
          className="transcript-send-btn"
          disabled={!inputText.trim() || isProcessing}
          aria-label="Send message"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
}
