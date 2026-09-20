import React from 'react';
import { Smartphone, Monitor, ShieldCheck, Bus, Volume2, VolumeX, RefreshCw } from 'lucide-react';

export default function Header({ currentView, setCurrentView, soundEnabled, setSoundEnabled, onResetDemo }) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '12px 24px', marginBottom: '24px' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)' 
          }}>
            <Bus style={{ width: '24px', height: '24px', color: '#fff' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                StationLock
              </h1>
              <span className="badge badge-available" style={{ fontSize: '0.65rem' }}>
                <span className="led-indicator led-available"></span> ONLINE
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Central Bus Terminal • Luggage Storage
            </p>
          </div>
        </div>

        {/* View Switching Mode Buttons */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'rgba(15, 23, 42, 0.8)', 
          padding: '4px', 
          borderRadius: 'var(--radius-full)', 
          border: '1px solid var(--border-color)' 
        }}>
          <button
            onClick={() => setCurrentView('mobile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: currentView === 'mobile' ? 'var(--primary)' : 'transparent',
              color: currentView === 'mobile' ? '#0f172a' : 'var(--text-muted)',
              boxShadow: currentView === 'mobile' ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none'
            }}
          >
            <Smartphone style={{ width: '16px', height: '16px' }} />
            Passenger App
          </button>

          <button
            onClick={() => setCurrentView('kiosk')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: currentView === 'kiosk' ? 'var(--primary)' : 'transparent',
              color: currentView === 'kiosk' ? '#0f172a' : 'var(--text-muted)',
              boxShadow: currentView === 'kiosk' ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none'
            }}
          >
            <Monitor style={{ width: '16px', height: '16px' }} />
            Station Kiosk Wall
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: currentView === 'admin' ? 'var(--primary)' : 'transparent',
              color: currentView === 'admin' ? '#0f172a' : 'var(--text-muted)',
              boxShadow: currentView === 'admin' ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none'
            }}
          >
            <ShieldCheck style={{ width: '16px', height: '16px' }} />
            Station Admin
          </button>
        </div>

        {/* Audio Toggle & Demo Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio Effects'}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: soundEnabled ? 'var(--primary)' : 'var(--text-dim)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem'
            }}
          >
            {soundEnabled ? <Volume2 style={{ width: '16px', height: '16px' }} /> : <VolumeX style={{ width: '16px', height: '16px' }} />}
            {soundEnabled ? 'Sound ON' : 'Muted'}
          </button>

          <button
            onClick={onResetDemo}
            title="Reset All Locker Data to Default Demo State"
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.1)',
              color: '#fb7185',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 500
            }}
          >
            <RefreshCw style={{ width: '14px', height: '14px' }} />
            Reset Demo
          </button>
        </div>

      </div>
    </header>
  );
}
