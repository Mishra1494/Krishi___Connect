/**
 * VoiceAssistant — Main Page
 * Multilingual avatar-driven voice interface for farmers.
 * Languages: Marathi (mr), Hindi (hi), English (en)
 */

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone, faWifi, faSignal,
  faExclamationTriangle, faTimes, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

import AvatarDisplay  from '../components/voice/AvatarDisplay';
import MicButton      from '../components/voice/MicButton';
import TranscriptPanel from '../components/voice/TranscriptPanel';
import { useVoiceWebSocket } from '../hooks/useVoiceWebSocket';

import './VoiceAssistant.css';

// Language options
const LANGUAGES = [
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export default function VoiceAssistant() {
  const { t } = useTranslation();
  
  const CONNECTION_STATUS_LABEL = {
    connected:    t('pages.voiceAssistant.connected', 'Connected'),
    connecting:   t('pages.voiceAssistant.connecting', 'Connecting…'),
    disconnected: t('pages.voiceAssistant.offline', 'Offline'),
    error:        t('pages.voiceAssistant.error', 'Error'),
  };

  const {
    connectionStatus,
    connect,
    isRecording,
    isProcessing,
    audioLevel,
    startRecording,
    stopRecording,
    currentLanguage,
    languageDisplay,
    switchLanguage,
    messages,
    sendTextMessage,
    clearMessages,
    avatarState,
    currentTranscript,
    error,
    setError,
  } = useVoiceWebSocket();

  // Toggle mic on/off
  const handleMicToggle = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  // Stats derived from messages
  const botMessageCount = messages.filter(m => m.type === 'bot' && m.id !== 'welcome').length;
  const lastIntent = [...messages].reverse().find(m => m.intent && m.intent !== 'greeting')?.intent;

  return (
    <div className="va-page">
      {/* ── Header ── */}
      <header className="va-header">
        <div className="va-header-inner">
          {/* Brand */}
          <div className="va-header-brand">
            <div className="va-header-icon">
              <FontAwesomeIcon icon={faMicrophone} />
            </div>
            <div>
              <span className="va-header-title">{t('pages.voiceAssistant.title', 'कृषी मित्र')}</span>
              <span className="va-header-subtitle">{t('pages.voiceAssistant.subtitle', 'AI Voice Assistant • Multilingual')}</span>
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Connection badge */}
            <div className={`va-connection-badge va-connection-badge--${connectionStatus}`}>
              <span className="va-connection-dot" />
              <FontAwesomeIcon icon={connectionStatus === 'connected' ? faWifi : faSignal} style={{ fontSize: '0.7rem' }} />
              <span>{CONNECTION_STATUS_LABEL[connectionStatus] || connectionStatus}</span>
              {connectionStatus !== 'connected' && (
                <button
                  onClick={connect}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: '0.7rem', textDecoration: 'underline' }}
                  aria-label={t('pages.voiceAssistant.reconnect', 'Reconnect')}
                >
                  {t('pages.voiceAssistant.retry', 'Retry')}
                </button>
              )}
            </div>

            {/* Language switcher */}
            <nav className="va-lang-switcher" aria-label="Language switcher">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className={`va-lang-btn ${currentLanguage === lang.code ? 'va-lang-btn--active' : ''}`}
                  onClick={() => switchLanguage(lang.code)}
                  aria-pressed={currentLanguage === lang.code}
                  title={`Switch to ${lang.label}`}
                  id={`lang-btn-${lang.code}`}
                >
                  {lang.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main Body ── */}
      <main className="va-body">
        {/* ── Left: Avatar Panel ── */}
        <aside className="va-avatar-panel" aria-label="Avatar and microphone controls">
          {/* Avatar */}
          <AvatarDisplay state={avatarState} audioLevel={audioLevel} />

          {/* Microphone button */}
          <MicButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            audioLevel={audioLevel}
            onClick={handleMicToggle}
            disabled={connectionStatus !== 'connected' && connectionStatus !== 'error'}
          />

          {/* Error display */}
          {error && (
            <div className="va-error-banner" role="alert">
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span style={{ flex: 1 }}>{error}</span>
              <button
                className="va-error-dismiss"
                onClick={() => setError(null)}
                aria-label="Dismiss error"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          {/* Session stats */}
          <div className="va-stats">
            <div className="va-stat-card">
              <span className="va-stat-label">{t('pages.voiceAssistant.language', 'Language')}</span>
              <span className="va-stat-value" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                {languageDisplay}
              </span>
            </div>
            <div className="va-stat-card">
              <span className="va-stat-label">{t('pages.voiceAssistant.responses', 'Responses')}</span>
              <span className="va-stat-value">{botMessageCount}</span>
            </div>
            <div className="va-stat-card" style={{ gridColumn: '1 / -1' }}>
              <span className="va-stat-label">{t('pages.voiceAssistant.lastIntent', 'Last Intent')}</span>
              <span className="va-stat-value" style={{ fontSize: '0.78rem', fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                {lastIntent
                  ? {
                      insurance_inquiry: t('pages.voiceAssistant.intents.insurance', '🛡 पीक विमा'),
                      crop_price: t('pages.voiceAssistant.intents.price', '📊 बाजारभाव'),
                      weather: t('pages.voiceAssistant.intents.weather', '🌦 हवामान'),
                      disease_help: t('pages.voiceAssistant.intents.disease', '🔬 रोग'),
                      irrigation_advice: t('pages.voiceAssistant.intents.irrigation', '💧 सिंचन'),
                      general: t('pages.voiceAssistant.intents.general', '🌾 सामान्य'),
                    }[lastIntent] || lastIntent
                  : '—'}
              </span>
            </div>
          </div>

          {/* Usage tip */}
          <div
            style={{
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.15)',
              borderRadius: '0.75rem',
              padding: '0.65rem 0.85rem',
              width: '100%',
            }}
          >
            <p style={{ color: '#6ee7b7', fontSize: '0.7rem', margin: 0, lineHeight: 1.6, fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
              <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '0.4rem' }} />
              <strong>{t('pages.voiceAssistant.howToUseBold', 'कसे वापरावे:')}</strong> {t('pages.voiceAssistant.howToUse', 'मायक्रोफोन बटणावर क्लिक करा आणि बोला. मराठी, हिंदी किंवा इंग्रजी — कोणत्याही भाषेत.')}
            </p>
          </div>
        </aside>

        {/* ── Right: Transcript Panel ── */}
        <section aria-label="Conversation transcript">
          <TranscriptPanel
            messages={messages}
            isProcessing={isProcessing}
            currentTranscript={currentTranscript}
            currentLanguage={currentLanguage}
            onSendText={sendTextMessage}
            onClear={clearMessages}
          />
        </section>
      </main>
    </div>
  );
}
