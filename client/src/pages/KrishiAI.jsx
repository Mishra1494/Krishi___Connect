import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane, faSpinner, faLeaf, faMicrophone,
  faMicrophoneSlash, faShieldAlt, faWifi, faSignal,
  faExclamationTriangle, faTimes, faUser, faSeedling
} from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../context/AppContext';
import { fetchFieldData } from '../services/dataService';
import { useVoiceWebSocket } from '../hooks/useVoiceWebSocket';
import InsuranceAgent from '../components/insurance/InsuranceAgent';
import avatarImg from '../assets/avatar.png';
import './KrishiAI.css';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
];

const LANG_CONFIG = {
  en: {
    prompt: `You are Krishi AI, an expert Indian farming assistant. You MUST respond ONLY in English. Even if the user writes in Hindi, Marathi or any other language, you MUST translate and respond strictly in English. Never mix languages. Provide expert guidance on crops, diseases, irrigation, fertilizers, weather, market prices, and government schemes. Keep answers concise (under 150 words), structured with bullet points, farmer-friendly. Current date: ${new Date().toLocaleDateString('en-IN')}.`,
    placeholder: 'Ask about crops, weather, diseases…',
    welcome: '🌾 Hello! I am Krishi AI — your smart farming companion.\nAsk me anything about crops, weather, diseases, irrigation, market prices, or government schemes!',
    micSpeak: 'Tap to speak',
    micStop: 'Tap to stop',
    processing: 'Processing...',
  },
  hi: {
    prompt: `आप कृषि AI हैं, एक विशेषज्ञ भारतीय कृषि सहायक। आपको केवल हिंदी (देवनागरी लिपि) में उत्तर देना है। चाहे उपयोगकर्ता किसी भी भाषा में लिखे, आपको हमेशा शुद्ध हिंदी देवनागरी में जवाब देना है। कभी भी अंग्रेजी या अन्य भाषा न मिलाएं। फसल, रोग, सिंचाई, उर्वरक, मौसम, बाजार भाव और सरकारी योजनाओं पर विशेषज्ञ मार्गदर्शन दें। उत्तर संक्षिप्त (150 शब्दों से कम), बिंदुओं में, किसान-अनुकूल रखें। आज की तारीख: ${new Date().toLocaleDateString('hi-IN')}।`,
    placeholder: 'फसल, मौसम, रोग के बारे में पूछें…',
    welcome: '🌾 नमस्ते! मैं कृषि AI हूं — आपका स्मार्ट खेती सहायक।\nफसल, मौसम, रोग, सिंचाई, बाजार भाव या सरकारी योजनाओं के बारे में कुछ भी पूछें!',
    micSpeak: 'बोलने के लिए दबाएं',
    micStop: 'रोकने के लिए दबाएं',
    processing: 'प्रक्रिया हो रही है...',
  },
  mr: {
    prompt: `तुम्ही कृषी AI आहात, एक तज्ञ भारतीय शेती सहाय्यक. तुम्हाला फक्त मराठी (देवनागरी लिपी) मध्ये उत्तर द्यायचे आहे. वापरकर्ता कोणत्याही भाषेत लिहिला तरी तुम्ही नेहमी शुद्ध मराठी देवनागरीत उत्तर द्या. कधीही इंग्रजी किंवा अन्य भाषा मिसळू नका. पीक, रोग, सिंचन, खते, हवामान, बाजारभाव आणि सरकारी योजनांवर तज्ञ मार्गदर्शन द्या. उत्तरे संक्षिप्त (150 शब्दांपेक्षा कमी), मुद्द्यांमध्ये, शेतकरी-अनुकूल ठेवा. आजची तारीख: ${new Date().toLocaleDateString('mr-IN')}.`,
    placeholder: 'पीक, हवामान, रोग बद्दल विचारा…',
    welcome: '🌾 नमस्कार! मी कृषी AI आहे — तुमचा स्मार्ट शेती सहाय्यक.\nपीक, हवामान, रोग, सिंचन, बाजारभाव किंवा सरकारी योजनांबद्दल काहीही विचारा!',
    micSpeak: 'बोलण्यासाठी दाबा',
    micStop: 'थांबवण्यासाठी दाबा',
    processing: 'प्रक्रिया सुरू...',
  },
};

const SUGGESTIONS = {
  en: [
    { emoji: '🌾', text: 'What crop should I grow this season?' },
    { emoji: '🌦️', text: 'Weather forecast for my area' },
    { emoji: '🍃', text: 'My crop leaves are turning yellow' },
    { emoji: '💧', text: 'Best irrigation schedule for wheat' },
    { emoji: '💰', text: "Today's market price for soybean" },
  ],
  hi: [
    { emoji: '🌾', text: 'इस मौसम में कौन सी फसल उगाऊं?' },
    { emoji: '🌦️', text: 'आज का मौसम कैसा रहेगा?' },
    { emoji: '🍃', text: 'मेरी फसल के पत्ते पीले हो रहे हैं' },
    { emoji: '💧', text: 'गेहूं की सिंचाई कब करें?' },
    { emoji: '💰', text: 'आज सोयाबीन का भाव क्या है?' },
  ],
  mr: [
    { emoji: '🌾', text: 'या हंगामात कोणते पीक घ्यावे?' },
    { emoji: '🌦️', text: 'आजचे हवामान कसे आहे?' },
    { emoji: '🍃', text: 'माझ्या पिकाची पाने पिवळी होत आहेत' },
    { emoji: '💧', text: 'गव्हाला पाणी कधी द्यावे?' },
    { emoji: '💰', text: 'आजचा सोयाबीनचा बाजारभाव सांगा' },
  ],
};

const FOLLOWUPS = [
  { keys: ['disease','yellow','pest','रोग','पिवळ','पीली','कीड','फफूंद','बुरशी'], fn: {
    en: ['What fertilizer should I use?','Is this fungal or bacterial?','How to prevent this?'],
    hi: ['कौन सा खाद इस्तेमाल करूं?','क्या यह फफूंद है या कीट?','इसे कैसे रोकें?'],
    mr: ['कोणते खत वापरू?','हा बुरशीजन्य रोग आहे का?','हे पुन्हा होऊ नये म्हणून काय करावे?'],
  }},
  { keys: ['weather','rain','मौसम','हवामान','बारिश','पाऊस'], fn: {
    en: ['Should I irrigate today?','Is it safe to spray pesticide?','Best sowing time?'],
    hi: ['क्या आज सिंचाई करनी चाहिए?','क्या आज कीटनाशक छिड़काव सही रहेगा?','बुवाई का सही समय?'],
    mr: ['आज पाणी द्यावे का?','आज फवारणी करता येईल का?','पेरणी कधी करावी?'],
  }},
  { keys: ['price','market','भाव','बाजार','mandi','मंडी'], fn: {
    en: ['Which mandi has best price?','Price trend for next week?','Sell now or wait?'],
    hi: ['सबसे अच्छा भाव किस मंडी में है?','अगले हफ्ते भाव बढ़ेगा?','अभी बेचूं या रुकूं?'],
    mr: ['सर्वात चांगला भाव कोणत्या बाजारात?','पुढच्या आठवड्यात भाव वाढेल?','आता विकू की थांबू?'],
  }},
  { keys: ['insurance','bima','विमा','बीमा','pmfby'], fn: {
    en: ['How to apply for crop insurance?','What documents needed?','Check claim status'],
    hi: ['फसल बीमा कैसे करवाएं?','कौन से दस्तावेज चाहिए?','दावा स्थिति जांचें'],
    mr: ['पीक विमा कसा काढावा?','कोणती कागदपत्रे लागतात?','दाव्याची स्थिती तपासा'],
  }},
];

function getFollowups(text, lang) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const e of FOLLOWUPS) {
    if (e.keys.some(k => lower.includes(k))) return e.fn[lang] || e.fn.en;
  }
  return null;
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function KrishiAI() {
  const { selectedField } = useAppContext();
  const voice = useVoiceWebSocket();

  const [activeLang, setActiveLang] = useState('en');
  const cfg = LANG_CONFIG[activeLang];

  const [messages, setMessages] = useState([{
    id: 'welcome', sender: 'bot', text: cfg.welcome,
    timestamp: Date.now(), source: 'system', language: activeLang,
  }]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [fieldData, setFieldData] = useState(null);
  const [followups, setFollowups] = useState(null);

  const bottomRef = useRef(null);
  const voiceSyncRef = useRef(1);

  // Update welcome on language change
  useEffect(() => {
    setMessages([{
      id: 'welcome', sender: 'bot', text: LANG_CONFIG[activeLang].welcome,
      timestamp: Date.now(), source: 'system', language: activeLang,
    }]);
    setFollowups(null);
    voiceSyncRef.current = voice.messages.length;
  }, [activeLang]);

  useEffect(() => {
    if (selectedField) fetchFieldData(selectedField).then(setFieldData).catch(() => setFieldData(null));
  }, [selectedField]);

  // Sync voice messages
  useEffect(() => {
    const vMsgs = voice.messages;
    if (vMsgs.length > voiceSyncRef.current) {
      const newMsgs = vMsgs.slice(voiceSyncRef.current).map(m => ({
        id: m.id, sender: m.type, text: m.text, language: m.language,
        intent: m.intent, timestamp: m.timestamp, source: 'voice',
      }));
      setMessages(prev => [...prev, ...newMsgs]);
      voiceSyncRef.current = vMsgs.length;
      const lastBot = [...newMsgs].reverse().find(m => m.sender === 'bot');
      if (lastBot) setFollowups(getFollowups(lastBot.text, activeLang));
    }
  }, [voice.messages, activeLang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, voice.isProcessing]);

  const handleLangSwitch = useCallback((code) => {
    setActiveLang(code);
    voice.switchLanguage(code);
    setFollowups(null);
  }, [voice]);

  // Groq API
  const callGroq = useCallback(async (userText) => {
    let sysPrompt = LANG_CONFIG[activeLang].prompt;
    if (fieldData) {
      sysPrompt += `\nFarmer's field: ${fieldData.name}, ${fieldData.location}, ${fieldData.size} acres, Crop: ${fieldData.crop || fieldData.mainCrop || 'N/A'}, Soil: ${fieldData.soilType || 'Unknown'}.`;
    }
    const history = messages.filter(m => m.id !== 'welcome').slice(-8).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant', content: m.text,
    }));
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: sysPrompt }, ...history, { role: 'user', content: userText }],
        temperature: 0.7, max_tokens: 500,
      }),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Error processing request.';
  }, [activeLang, fieldData, messages]);

  // Send message
  const handleSend = useCallback(async (text) => {
    const trimmed = (text || inputText).trim();
    if (!trimmed || isLoading) return;
    setInputText('');

    const insuranceKw = ['insurance','bima','pmfby','crop insurance','fasal bima','विमा','बीमा','पीक विमा'];
    if (insuranceKw.some(k => trimmed.toLowerCase().includes(k))) { setShowInsurance(true); return; }

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: trimmed, timestamp: Date.now(), source: 'text', language: activeLang };
    setMessages(prev => [...prev, userMsg]);

    if (voice.connectionStatus === 'connected') {
      voice.sendTextMessage(trimmed, activeLang);
      return;
    }

    setIsLoading(true);
    try {
      const reply = await callGroq(trimmed);
      setMessages(prev => [...prev, { id: `b-${Date.now()}`, sender: 'bot', text: reply, timestamp: Date.now(), source: 'groq', language: activeLang }]);
      setFollowups(getFollowups(reply, activeLang));
    } catch {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, sender: 'bot', text: 'Error. Please try again.', timestamp: Date.now(), source: 'error' }]);
    } finally { setIsLoading(false); }
  }, [inputText, isLoading, activeLang, voice, callGroq]);

  const handleMicToggle = useCallback(() => {
    if (voice.isRecording) voice.stopRecording(); else voice.startRecording();
  }, [voice]);

  const micState = voice.isProcessing ? 'processing' : voice.isRecording ? 'recording' : 'idle';
  const currentSuggestions = SUGGESTIONS[activeLang] || SUGGESTIONS.en;
  const botCount = messages.filter(m => m.sender === 'bot' && m.id !== 'welcome').length;
  const isAnyLoading = isLoading || voice.isProcessing;

  const avColors = {
    idle: { ring: '#16a34a', glow: 'rgba(22,163,74,0.2)', label: '● Ready' },
    listening: { ring: '#22c55e', glow: 'rgba(34,197,94,0.3)', label: '🎙️ ' + (activeLang === 'hi' ? 'सुन रहा है...' : activeLang === 'mr' ? 'ऐकत आहे...' : 'Listening...') },
    thinking: { ring: '#f59e0b', glow: 'rgba(245,158,11,0.25)', label: '⏳ ' + cfg.processing },
    speaking: { ring: '#3b82f6', glow: 'rgba(59,130,246,0.3)', label: '🔊 ' + (activeLang === 'hi' ? 'बोल रहा है' : activeLang === 'mr' ? 'बोलत आहे' : 'Speaking') },
  };
  const av = avColors[voice.avatarState] || avColors.idle;

  if (showInsurance) {
    return (<div className="flex flex-col h-[100vh] bg-white"><InsuranceAgent onClose={() => setShowInsurance(false)} onApplicationSubmitted={() => {}} /></div>);
  }

  return (
    <div className="kai-page">
      <header className="kai-header">
        <div className="kai-header-inner">
          <div className="kai-brand">
            <div className="kai-brand-icon"><FontAwesomeIcon icon={faSeedling} /></div>
            <div>
              <span className="kai-brand-title">{activeLang === 'hi' ? 'कृषि AI' : activeLang === 'mr' ? 'कृषी AI' : 'Krishi AI'}</span>
              <span className="kai-brand-sub">{activeLang === 'hi' ? 'स्मार्ट खेती सहायक • आवाज + टेक्स्ट' : activeLang === 'mr' ? 'स्मार्ट शेती सहाय्यक • आवाज + मजकूर' : 'Smart Farming • Voice + Text • Multilingual'}</span>
            </div>
          </div>
          <div className="kai-controls">
            <div className={`kai-conn-badge kai-conn-badge--${voice.connectionStatus}`}>
              <span className="kai-conn-dot" />
              <FontAwesomeIcon icon={voice.connectionStatus === 'connected' ? faWifi : faSignal} style={{ fontSize: '0.6rem' }} />
              <span>{voice.connectionStatus === 'connected' ? (activeLang === 'hi' ? 'आवाज तैयार' : activeLang === 'mr' ? 'आवाज तयार' : 'Voice Ready') : 'Text Only'}</span>
            </div>
            <nav className="kai-lang-switcher">
              {LANGUAGES.map(l => (
                <button key={l.code} className={`kai-lang-btn ${activeLang === l.code ? 'kai-lang-btn--active' : ''}`} onClick={() => handleLangSwitch(l.code)}>{l.label}</button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="kai-body">
        <aside className="kai-left">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <div className={`kai-avatar-ring ${voice.avatarState === 'listening' ? 'kai-avatar-ring--listening' : ''} ${voice.avatarState === 'speaking' ? 'kai-avatar-ring--speaking' : ''} ${voice.avatarState === 'thinking' ? 'kai-avatar-ring--thinking' : ''}`}
              style={{ '--kai-ring-color': av.ring, '--kai-glow': av.glow, borderColor: av.ring, boxShadow: `0 0 20px ${av.glow}`, transform: `scale(${voice.avatarState === 'listening' ? 1 + voice.audioLevel * 0.1 : 1})` }}>
              <img src={avatarImg} alt="Krishi AI" />
              {voice.avatarState === 'thinking' && <div className="kai-think-dots"><span /><span /><span /></div>}
            </div>
            <div className="kai-avatar-label" style={{ color: av.ring }}>{av.label}</div>
          </div>

          <div className="kai-mic-wrap">
            <button className="kai-mic-btn" onClick={handleMicToggle}
              disabled={voice.connectionStatus !== 'connected' || voice.isProcessing}
              style={{
                background: micState === 'recording' ? 'linear-gradient(135deg,#dc2626,#ef4444)' : micState === 'processing' ? 'linear-gradient(135deg,#d97706,#f59e0b)' : 'linear-gradient(135deg,#16a34a,#22c55e)',
                boxShadow: micState === 'recording' ? '0 0 16px rgba(239,68,68,0.4)' : '0 4px 12px rgba(22,163,74,0.25)',
              }}>
              <FontAwesomeIcon icon={micState === 'recording' ? faMicrophoneSlash : micState === 'processing' ? faSpinner : faMicrophone} className={micState === 'processing' ? 'fa-spin' : ''} />
              {micState === 'recording' && <span className="kai-mic-pulse" />}
            </button>
            <p className="kai-mic-label">{micState === 'recording' ? cfg.micStop : micState === 'processing' ? cfg.processing : cfg.micSpeak}</p>
          </div>

          {voice.error && (
            <div className="kai-error">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <span style={{ flex: 1 }}>{voice.error}</span>
              <button className="kai-error-close" onClick={() => voice.setError(null)}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
          )}

          <div className="kai-stats">
            <div className="kai-stat"><span className="kai-stat-label">{activeLang === 'hi' ? 'भाषा' : activeLang === 'mr' ? 'भाषा' : 'Language'}</span><span className="kai-stat-value">{LANGUAGES.find(l => l.code === activeLang)?.label}</span></div>
            <div className="kai-stat"><span className="kai-stat-label">{activeLang === 'hi' ? 'उत्तर' : activeLang === 'mr' ? 'उत्तरे' : 'Responses'}</span><span className="kai-stat-value">{botCount}</span></div>
            <div className="kai-stat" style={{ gridColumn: '1/-1' }}><span className="kai-stat-label">{activeLang === 'hi' ? 'मोड' : activeLang === 'mr' ? 'मोड' : 'Mode'}</span><span className="kai-stat-value" style={{ fontSize: '0.72rem' }}>{voice.connectionStatus === 'connected' ? '🎙️+⌨️' : '⌨️'}</span></div>
          </div>
        </aside>

        <section className="kai-right">
          <div className="kai-suggestions">
            {currentSuggestions.map((s, i) => (
              <button key={i} className="kai-chip" onClick={() => handleSend(s.text)} disabled={isAnyLoading}>{s.emoji} {s.text}</button>
            ))}
            <button className="kai-chip kai-chip--insurance" onClick={() => setShowInsurance(true)} disabled={isAnyLoading}>
              🛡️ {activeLang === 'hi' ? 'फसल बीमा' : activeLang === 'mr' ? 'पीक विमा' : 'Crop Insurance'}
            </button>
          </div>

          <div className="kai-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`kai-msg ${msg.sender === 'user' ? 'kai-msg--user' : ''}`}>
                <div className={`kai-msg-avatar ${msg.sender === 'user' ? 'kai-msg-avatar--user' : 'kai-msg-avatar--bot'}`}>
                  <FontAwesomeIcon icon={msg.sender === 'user' ? faUser : faLeaf} />
                </div>
                <div className="kai-msg-body">
                  <div className="kai-msg-meta">
                    {msg.language && <span className="kai-msg-lang">{msg.language === 'mr' ? 'मराठी' : msg.language === 'hi' ? 'हिंदी' : 'EN'}</span>}
                    {msg.source === 'voice' && <span className="kai-msg-source">🎙️</span>}
                    {msg.source === 'groq' && <span className="kai-msg-source">⚡</span>}
                  </div>
                  <div className={`kai-bubble ${msg.sender === 'user' ? 'kai-bubble--user' : 'kai-bubble--bot'}`}>
                    <p className="kai-bubble-text">{msg.text}</p>
                  </div>
                  <span className="kai-msg-time">{fmtTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}

            {voice.currentTranscript && <div className="kai-live"><div className="kai-live-dot" /><span>{voice.currentTranscript}</span></div>}

            {(isLoading || voice.isProcessing) && !voice.currentTranscript && (
              <div className="kai-msg">
                <div className="kai-msg-avatar kai-msg-avatar--bot"><FontAwesomeIcon icon={faLeaf} /></div>
                <div className="kai-msg-body"><div className="kai-bubble kai-bubble--bot"><div className="kai-typing"><span /><span /><span /></div></div></div>
              </div>
            )}

            {followups && !isAnyLoading && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', paddingLeft: '2rem' }}>
                {followups.map((f, i) => (
                  <button key={i} className="kai-chip" onClick={() => { handleSend(f); setFollowups(null); }} style={{ fontSize: '0.63rem' }}>💡 {f}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form className="kai-input-bar" onSubmit={e => { e.preventDefault(); handleSend(); }}>
            <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
              placeholder={cfg.placeholder} className="kai-input" disabled={isAnyLoading} autoComplete="off" dir="auto" />
            <button type="button" className={`kai-input-mic kai-input-mic--${micState}`} onClick={handleMicToggle}
              disabled={voice.connectionStatus !== 'connected' || voice.isProcessing} title={micState === 'recording' ? 'Stop' : 'Speak'}>
              <FontAwesomeIcon icon={micState === 'recording' ? faMicrophoneSlash : micState === 'processing' ? faSpinner : faMicrophone} className={micState === 'processing' ? 'fa-spin' : ''} />
              {micState === 'recording' && <span className="kai-input-mic-pulse" />}
            </button>
            <button type="submit" className="kai-send-btn" disabled={!inputText.trim() || isAnyLoading}><FontAwesomeIcon icon={faPaperPlane} /></button>
          </form>
        </section>
      </main>
    </div>
  );
}
