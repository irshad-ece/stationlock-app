import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Monitor, Lock, Unlock, Clock, Bus, ShieldCheck, AlertCircle, RefreshCw, QrCode } from 'lucide-react';
import { formatMoney, formatDuration } from '../../utils/helpers';

export default function LockerWall({ lockers, onSelectLocker, onOpenScanner }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalLockers = lockers.length;
  const availableCount = lockers.filter((l) => l.status === 'available').length;
  const occupiedCount = lockers.filter((l) => l.status === 'occupied').length;

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Terminal Kiosk Header */}
      <div className="glass-panel-glow" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(6, 182, 212, 0.2)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              BUS TERMINAL KIOSK DISPLAY #04
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            Smart Luggage Storage Wall
          </h2>
        </div>

        {/* Live Station Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVAILABLE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>{availableCount} / {totalLockers}</div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>OCCUPIED</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fb7185' }}>{occupiedCount}</div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>TERMINAL TIME</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>{currentTime}</div>
          </div>
        </div>
      </div>

      {/* Interactive Locker Doors Grid */}
      <div className="locker-door-grid">
        {lockers.map((locker) => {
          const isAvail = locker.status === 'available';
          const isOccupied = locker.status === 'occupied';

          return (
            <div
              key={locker.id}
              className={`locker-box-card ${isOccupied ? 'occupied' : ''}`}
              onClick={() => onSelectLocker(locker)}
              style={{ cursor: 'pointer' }}
            >
              {/* Top Door Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`led-indicator ${isAvail ? 'led-available' : isOccupied ? 'led-occupied' : ''}`} />
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>
                    {locker.id}
                  </span>
                </div>
                <span className={`badge ${isAvail ? 'badge-available' : isOccupied ? 'badge-occupied' : 'badge-maintenance'}`}>
                  {locker.status.toUpperCase()}
                </span>
              </div>

              {/* Middle Door Content: Locker Handle & Physical QR Code */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{locker.size}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatMoney(locker.hourlyRate)} / hr</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{locker.dimensions}</span>
                </div>

                {/* Printed QR Sticker on Locker Door */}
                <div style={{
                  background: '#fff',
                  padding: '5px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
                  textAlign: 'center'
                }}>
                  <QRCodeSVG value={`STATIONLOCK-BOX-${locker.id}`} size={56} />
                  <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    SCAN TO UNLOCK
                  </div>
                </div>

                {/* Metallic Door Handle */}
                <div className="locker-handle" />
              </div>

              {/* Bottom Session Info */}
              {isOccupied && locker.activeSession ? (
                <div style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  fontSize: '0.75rem',
                  color: '#fb7185'
                }}>
                  <div style={{ fontWeight: 700 }}>Occupied by {locker.activeSession.passengerName}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    {locker.activeSession.busNumber || 'Bus passenger'}
                  </div>
                </div>
              ) : isAvail ? (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  fontSize: '0.75rem',
                  color: '#34d399',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  Tap or Scan QR to Reserve Box
                </div>
              ) : (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  fontSize: '0.75rem',
                  color: '#fbbf24',
                  textAlign: 'center'
                }}>
                  Under Station Maintenance
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
