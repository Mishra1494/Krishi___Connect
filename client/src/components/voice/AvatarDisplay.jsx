/**
 * AvatarDisplay — Professional AI Bot Avatar
 * States: idle | listening | thinking | speaking
 */

import { useEffect, useState } from 'react';
import avatarImg from '../../assets/avatar.png';

export default function AvatarDisplay({ state = 'idle', audioLevel = 0 }) {
  // Dynamic colors per state matching the professional dark theme
  const stateColors = {
    idle:      { ring: '#059669', glow: 'rgba(5,150,105,0.15)' },
    listening: { ring: '#10b981', glow: 'rgba(16,185,129,0.35)' },
    thinking:  { ring: '#f59e0b', glow: 'rgba(245,158,11,0.30)' },
    speaking:  { ring: '#3b82f6', glow: 'rgba(59,130,246,0.35)' },
  };

  const colors = stateColors[state] || stateColors.idle;

  // Audio level affects ring size dynamically when listening/speaking
  const ringScale = state === 'listening' ? 1 + audioLevel * 0.15 : 1;

  return (
    <div className="avatar-wrapper" style={{ '--ring-color': colors.ring, '--glow-color': colors.glow }}>
      {/* Pulsing professional ring */}
      <div
        className={`avatar-ring ${state === 'listening' ? 'avatar-ring--active' : ''} ${state === 'speaking' ? 'avatar-ring--speaking' : ''}`}
        style={{ 
          transform: `scale(${ringScale})`, 
          borderColor: colors.ring, 
          boxShadow: `0 0 30px ${colors.glow}`,
          padding: '4px',
          background: '#020617'
        }}
      >
        {/* Render the generated 3D Professional Avatar */}
        <img 
          src={avatarImg} 
          alt={`AI Assistant — ${state}`} 
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
        
        {/* Thinking dots overlay when thinking */}
        {state === 'thinking' && (
          <div style={{ position: 'absolute', bottom: '15px', display: 'flex', gap: '5px', background: 'rgba(0,0,0,0.6)', padding: '5px 12px', borderRadius: '15px' }}>
            <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }} className="think-dot" />
            <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }} className="think-dot think-dot--2" />
            <div style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%' }} className="think-dot think-dot--3" />
          </div>
        )}
      </div>

      {/* State label */}
      <div className="avatar-label" style={{ color: colors.ring, marginTop: '8px' }}>
        {state === 'idle'      && '● Ready'}
        {state === 'listening' && '🎙️ Listening...'}
        {state === 'thinking'  && '⏳ Processing...'}
        {state === 'speaking'  && '🔊 Speaking'}
      </div>
    </div>
  );
}
