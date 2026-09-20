import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, Lock, Key, Bus, PlusCircle, FastForward, CheckCircle2, History, AlertCircle, Eye, EyeOff, Shield, BellRing, Radio, Volume2, VolumeX, Navigation } from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';
import { formatDuration, formatMoney, formatDateTime, formatTimeShort } from '../../utils/helpers';

export default function ActivePassView({ activeLocker, onOpenExtensionModal, onOpenEarlyCheckoutModal, onUnlockComplete, soundEnabled }) {
  const [now, setNow] = useState(Date.now());
  const [showPin, setShowPin] = useState(false);
  const [activeTab, setActiveTab] = useState('pass'); // 'pass' | 'history'
  const [isUnlocking, setIsUnlocking] = useState(false);

  // 5-Minute Bus Arrival Alarm States
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isAlarmDismissed, setIsAlarmDismissed] = useState(false);
  const [simulatedBusNearby, setSimulatedBusNearby] = useState(false);

  // Live timer tick every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!activeLocker || !activeLocker.activeSession) return null;

  const session = activeLocker.activeSession;
  const remainingMs = Math.max(0, session.endTime - now);
  const isExpired = remainingMs === 0;

  // Auto-trigger 5-minute alarm if remaining time <= 5 minutes (300,000 ms) or if bus simulated nearby
  useEffect(() => {
    const isWithin5Mins = remainingMs > 0 && remainingMs <= 5 * 60 * 1000;
    if ((isWithin5Mins || simulatedBusNearby) && !isAlarmActive && !isAlarmDismissed) {
      setIsAlarmActive(true);
      if (soundEnabled) {
        soundEngine.playAlarmSound();
      }
    }
  }, [remainingMs, simulatedBusNearby, isAlarmActive, isAlarmDismissed, soundEnabled]);

  const handleQuickUnlock = () => {
    setIsUnlocking(true);
    if (soundEnabled) soundEngine.playLockSound(false);

    setTimeout(() => {
      setIsUnlocking(false);
      if (soundEnabled) soundEngine.playSuccessChime();
      alert(`🔑 Lock Solenoid Triggered! Box ${activeLocker.id} door is unlocked.`);
    }, 800);
  };

  const handleToggleSimulatedBus = () => {
    if (!simulatedBusNearby) {
      setSimulatedBusNearby(true);
      setIsAlarmActive(true);
      setIsAlarmDismissed(false);
      if (soundEnabled) soundEngine.playAlarmSound();
    } else {
      setSimulatedBusNearby(false);
      setIsAlarmActive(false);
    }
  };

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 5-MINUTE BUS ARRIVAL ALARM ALERT BANNER */}
      {isAlarmActive && !isAlarmDismissed && (
        <div className="animate-slideUp" style={{
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)',
          border: '2px solid #f43f5e',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          boxShadow: '0 0 35px rgba(244, 63, 94, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#f43f5e',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px #f43f5e',
                flexShrink: 0
              }}>
                <BellRing style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚨 BUS IS NEARBY! (5 MIN ALARM)</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#fecdd3', marginTop: '2px', lineHeight: 1.4 }}>
                  Bus <strong>{session.busNumber || 'Express'}</strong> is 5 minutes from terminal. Please retrieve your luggage from Box <strong>{activeLocker.id}</strong>!
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAlarmDismissed(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              Mute Alarm
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleQuickUnlock}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: '#f43f5e',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(244, 63, 94, 0.5)'
              }}
            >
              <Key style={{ width: '16px', height: '16px' }} />
              Unlock Box {activeLocker.id} Now
            </button>

            <button
              onClick={onOpenEarlyCheckoutModal}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <FastForward style={{ width: '16px', height: '16px' }} />
              Claim Early Refund
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="glass-panel-glow" style={{
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)'
      }}>
        
        {/* Pass Status Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span className="badge badge-occupied" style={{ fontSize: '0.65rem' }}>
              <span className="led-indicator led-occupied"></span> ACTIVE STORAGE PASS
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {activeLocker.label} ({activeLocker.size})
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {activeLocker.terminal}
            </p>
          </div>

          {/* QR Code Pass Key */}
          <div style={{
            background: '#fff',
            padding: '6px',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
          }}>
            <QRCodeSVG value={session.sessionCode || `STATIONLOCK-PASS-${activeLocker.id}`} size={64} />
          </div>
        </div>

        {/* Live Countdown Timer Clock */}
        <div style={{
          background: 'rgba(11, 17, 32, 0.9)',
          border: `1px solid ${isExpired ? 'rgba(244, 63, 94, 0.4)' : 'rgba(6, 182, 212, 0.3)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '16px',
          boxShadow: isExpired ? '0 0 20px rgba(244, 63, 94, 0.2)' : '0 0 20px rgba(6, 182, 212, 0.15)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>
            {isExpired ? '⚠️ STORAGE TIME EXPIRED' : 'REMAINING STORAGE TIME'}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '2.2rem',
            fontWeight: 800,
            color: isExpired ? '#fb7185' : 'var(--primary)',
            letterSpacing: '0.05em'
          }}>
            {formatDuration(remainingMs)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Scheduled End: <strong style={{ color: '#fff' }}>{formatTimeShort(session.endTime)}</strong>
          </div>
        </div>

        {/* Bus Info & GPS Proximity Alarm Bar */}
        {session.busNumber && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bus style={{ width: '18px', height: '18px', color: 'var(--amber)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Passenger Bus</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fde68a' }}>{session.busNumber}</div>
              </div>
            </div>
            <span style={{ fontSize: '0.7rem', background: 'rgba(245, 158, 11, 0.2)', padding: '2px 8px', borderRadius: '4px', color: '#fbbf24' }}>
              ON SCHEDULE
            </span>
          </div>
        )}

        {/* Bus Proximity Radar & Alarm Controller */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: `1px solid ${simulatedBusNearby || (remainingMs > 0 && remainingMs <= 300000) ? 'rgba(244, 63, 94, 0.5)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: simulatedBusNearby || (remainingMs > 0 && remainingMs <= 300000) ? 'rgba(244, 63, 94, 0.2)' : 'rgba(6, 182, 212, 0.15)',
              color: simulatedBusNearby || (remainingMs > 0 && remainingMs <= 300000) ? '#fb7185' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Radio style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>GPS Bus Radar & 5-Min Alarm</span>
                <span className="badge" style={{
                  fontSize: '0.6rem',
                  padding: '1px 6px',
                  background: simulatedBusNearby || (remainingMs > 0 && remainingMs <= 300000) ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: simulatedBusNearby || (remainingMs > 0 && remainingMs <= 300000) ? '#fb7185' : '#34d399',
                  border: `1px solid ${simulatedBusNearby || (remainingMs > 0 && remainingMs <= 300000) ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                }}>
                  {simulatedBusNearby ? '🚨 ALARM PLAYING' : (remainingMs > 0 && remainingMs <= 300000) ? '🚨 5 MIN ALARM' : 'MONITORING'}
                </span>
              </div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Triggers audio alarm 5 mins before bus reaches station
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleSimulatedBus}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: simulatedBusNearby ? '#f43f5e' : 'rgba(6, 182, 212, 0.15)',
              color: simulatedBusNearby ? '#fff' : 'var(--primary)',
              border: `1px solid ${simulatedBusNearby ? '#f43f5e' : 'rgba(6, 182, 212, 0.3)'}`,
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {simulatedBusNearby ? (
              <>
                <VolumeX style={{ width: '14px', height: '14px' }} /> Reset Radar
              </>
            ) : (
              <>
                <Volume2 style={{ width: '14px', height: '14px' }} /> Test 5-Min Alarm
              </>
            )}
          </button>
        </div>

        {/* Tab Switcher: Pass vs History */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('pass')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'pass' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === 'pass' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid var(--border-color)'
            }}
          >
            Digital Key & PIN
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'history' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === 'history' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <History style={{ width: '14px', height: '14px' }} /> History Logs ({session.history?.length || 1})
          </button>
        </div>

        {activeTab === 'pass' ? (
          <>
            {/* PIN Code Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emergency Unlock PIN</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.2em' }}>
                  {showPin ? session.pin : '••••'}
                </div>
              </div>
              <button
                onClick={() => setShowPin(!showPin)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-muted)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {showPin ? <EyeOff style={{ width: '14px', height: '14px' }} /> : <Eye style={{ width: '14px', height: '14px' }} />}
                {showPin ? 'Hide PIN' : 'Show PIN'}
              </button>
            </div>

            {/* DYNAMIC ACTION BUTTONS (Core Requirements) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* BUTTON 1: Bus Arrived Early / Time Adjustment */}
              <button
                onClick={onOpenEarlyCheckoutModal}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#34d399',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FastForward style={{ width: '18px', height: '18px' }} />
                  <span>Bus Arrived Early? Adjust Time</span>
                </div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                  Partial Refund
                </span>
              </button>

              {/* BUTTON 2: Bus Delayed / Time Extension */}
              <button
                onClick={onOpenExtensionModal}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#fbbf24',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle style={{ width: '18px', height: '18px' }} />
                  <span>Bus Delayed? Extend Time</span>
                </div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                  Add +30m / +1h
                </span>
              </button>

              {/* BUTTON 3: Instant Phone Door Unlock */}
              <button
                onClick={handleQuickUnlock}
                disabled={isUnlocking}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary)',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)'
                }}
              >
                <Key style={{ width: '18px', height: '18px' }} />
                {isUnlocking ? 'Unlocking Solenoid...' : 'Unlock Locker Door Now'}
              </button>

            </div>
          </>
        ) : (
          /* History Logs Tab */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
            {session.history && session.history.length > 0 ? (
              session.history.map((log) => (
                <div key={log.id} style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ color: log.type === 'EXTENSION' ? '#fbbf24' : log.type === 'REFUND' ? '#34d399' : 'var(--primary)' }}>
                      {log.title}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {formatTimeShort(log.timestamp)}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>{log.detail}</div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
                No history entries yet.
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
