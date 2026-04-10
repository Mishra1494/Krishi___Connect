/**
 * AvatarDisplay — CSS-animated SVG farmer avatar
 * States: idle | listening | thinking | speaking
 */

import { useEffect, useRef, useState } from 'react';

const MOUTH_FRAMES_SPEAKING = [
  'M 58 78 Q 70 83 82 78',   // slight open
  'M 58 78 Q 70 88 82 78',   // medium open
  'M 58 78 Q 70 85 82 78',   // medium
  'M 58 78 Q 70 80 82 78',   // closed
];

export default function AvatarDisplay({ state = 'idle', audioLevel = 0 }) {
  const [mouthFrame, setMouthFrame] = useState(0);
  const [blinkOpen, setBlinkOpen] = useState(true);
  const mouthIntervalRef = useRef(null);
  const blinkTimeoutRef = useRef(null);

  // Mouth animation when speaking
  useEffect(() => {
    clearInterval(mouthIntervalRef.current);
    if (state === 'speaking') {
      let frame = 0;
      mouthIntervalRef.current = setInterval(() => {
        frame = (frame + 1) % MOUTH_FRAMES_SPEAKING.length;
        setMouthFrame(frame);
      }, 100 + Math.random() * 80);
    } else {
      setMouthFrame(0);
    }
    return () => clearInterval(mouthIntervalRef.current);
  }, [state]);

  // Random blink
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 4000;
      blinkTimeoutRef.current = setTimeout(() => {
        setBlinkOpen(false);
        setTimeout(() => {
          setBlinkOpen(true);
          scheduleBlink();
        }, 150);
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(blinkTimeoutRef.current);
  }, []);

  // Dynamic colors per state
  const stateColors = {
    idle:      { ring: '#059669', glow: 'rgba(5,150,105,0.15)', skin: '#FDB97D', bg: '#f0fdf4' },
    listening: { ring: '#10b981', glow: 'rgba(16,185,129,0.35)', skin: '#FDB97D', bg: '#ecfdf5' },
    thinking:  { ring: '#f59e0b', glow: 'rgba(245,158,11,0.30)', skin: '#FDB97D', bg: '#fffbeb' },
    speaking:  { ring: '#3b82f6', glow: 'rgba(59,130,246,0.35)', skin: '#FDB97D', bg: '#eff6ff' },
  };

  const colors = stateColors[state] || stateColors.idle;
  const eyeScaleY = blinkOpen ? 1 : 0.1;
  const mouthPath = MOUTH_FRAMES_SPEAKING[mouthFrame];

  // Audio level affects ring size
  const ringScale = state === 'listening' ? 1 + audioLevel * 0.15 : 1;

  return (
    <div className="avatar-wrapper" style={{ '--ring-color': colors.ring, '--glow-color': colors.glow }}>
      {/* Pulsing ring */}
      <div
        className={`avatar-ring ${state === 'listening' ? 'avatar-ring--active' : ''} ${state === 'speaking' ? 'avatar-ring--speaking' : ''}`}
        style={{ transform: `scale(${ringScale})`, borderColor: colors.ring, boxShadow: `0 0 30px ${colors.glow}` }}
      >
        {/* SVG Avatar */}
        <svg
          viewBox="0 0 140 160"
          xmlns="http://www.w3.org/2000/svg"
          className="avatar-svg"
          aria-label={`Avatar — ${state}`}
        >
          {/* Background circle */}
          <circle cx="70" cy="80" r="65" fill={colors.bg} />

          {/* Hat */}
          <ellipse cx="70" cy="44" rx="42" ry="8" fill="#92400e" />
          <rect x="36" y="20" width="68" height="26" rx="8" fill="#a16207" />
          <rect x="28" y="42" width="84" height="8" rx="4" fill="#78350f" />

          {/* Face / neck */}
          <ellipse cx="70" cy="90" rx="32" ry="36" fill={colors.skin} />
          <rect x="58" y="122" width="24" height="14" rx="4" fill={colors.skin} />

          {/* Shirt / body */}
          <path d="M 30 150 Q 35 130 70 125 Q 105 130 110 150 Z" fill="#166534" />

          {/* Eyes */}
          <g style={{ transform: `scaleY(${eyeScaleY})`, transformOrigin: '70px 83px' }}>
            <ellipse cx="56" cy="83" rx="6" ry="7" fill="#1e3a5f" />
            <ellipse cx="84" cy="83" rx="6" ry="7" fill="#1e3a5f" />
            {/* Eye shine */}
            <circle cx="58" cy="81" r="2" fill="white" />
            <circle cx="86" cy="81" r="2" fill="white" />
          </g>

          {/* Eyebrows */}
          <path d={state === 'thinking' ? 'M 50 74 Q 56 70 62 74' : 'M 50 74 Q 56 72 62 74'}
            stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d={state === 'thinking' ? 'M 78 74 Q 84 70 90 74' : 'M 78 74 Q 84 72 90 74'}
            stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Nose */}
          <path d="M 70 87 Q 66 96 70 98 Q 74 96 70 87" fill="#e89b5e" />

          {/* Mouth */}
          <path
            d={state === 'listening'
              ? 'M 58 110 Q 70 116 82 110'   // smile when listening
              : state === 'speaking'
                ? mouthPath.replace('78', '110')
                : 'M 60 110 Q 70 114 80 110'  // neutral smile
            }
            stroke="#78350f"
            strokeWidth="2.5"
            fill={state === 'speaking' ? '#fee2e2' : 'none'}
            strokeLinecap="round"
          />

          {/* Ears */}
          <ellipse cx="38" cy="90" rx="6" ry="8" fill={colors.skin} />
          <ellipse cx="102" cy="90" rx="6" ry="8" fill={colors.skin} />
          <ellipse cx="38" cy="90" rx="3.5" ry="5" fill="#f0a66d" />
          <ellipse cx="102" cy="90" rx="3.5" ry="5" fill="#f0a66d" />

          {/* Mustache (for farmer look) */}
          <path d="M 60 104 Q 70 108 80 104" stroke="#78350f" strokeWidth="3.5" fill="none" strokeLinecap="round" />

          {/* Sound waves — only when speaking */}
          {state === 'speaking' && (
            <g opacity="0.7">
              <path d="M 112 75 Q 120 82 112 89" stroke={colors.ring} strokeWidth="2.5" fill="none" strokeLinecap="round" className="avatar-wave" />
              <path d="M 118 70 Q 130 82 118 94" stroke={colors.ring} strokeWidth="2" fill="none" strokeLinecap="round" className="avatar-wave avatar-wave--2" />
            </g>
          )}

          {/* Ear/listen indicator — only when listening */}
          {state === 'listening' && (
            <g opacity="0.8">
              <path d="M 20 83 Q 12 89 20 95" stroke={colors.ring} strokeWidth="2.5" fill="none" strokeLinecap="round" className="avatar-wave" />
              <path d="M 14 78 Q 2 89 14 100" stroke={colors.ring} strokeWidth="2" fill="none" strokeLinecap="round" className="avatar-wave avatar-wave--2" />
            </g>
          )}

          {/* Thinking dots */}
          {state === 'thinking' && (
            <g>
              <circle cx="55" cy="140" r="5" fill="#f59e0b" className="think-dot" />
              <circle cx="70" cy="140" r="5" fill="#f59e0b" className="think-dot think-dot--2" />
              <circle cx="85" cy="140" r="5" fill="#f59e0b" className="think-dot think-dot--3" />
            </g>
          )}
        </svg>
      </div>

      {/* State label */}
      <div className="avatar-label" style={{ color: colors.ring }}>
        {state === 'idle'      && '● Ready'}
        {state === 'listening' && '🎙️ Listening...'}
        {state === 'thinking'  && '⏳ Processing...'}
        {state === 'speaking'  && '🔊 Speaking'}
      </div>
    </div>
  );
}
