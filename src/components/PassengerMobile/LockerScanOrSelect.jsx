import React, { useState } from 'react';
import { Camera, Lock, QrCode, Sparkles, Luggage, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatMoney } from '../../utils/helpers';

export default function LockerScanOrSelect({ lockers, onOpenScanner, onSelectLocker, onSwitchToActiveSession }) {
  const [sizeFilter, setSizeFilter] = useState('ALL');

  const filteredLockers = lockers.filter((l) => {
    if (sizeFilter === 'ALL') return true;
    return l.size.toUpperCase() === sizeFilter;
  });

  // Find any active occupied locker for quick access
  const occupiedLocker = lockers.find((l) => l.status === 'occupied' && l.activeSession);

  return (
    <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Scan QR Code Hero Card */}
      <div className="glass-panel-glow" style={{
        padding: '20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
        }}>
          <QrCode style={{ width: '28px', height: '28px', color: '#fff' }} />
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
          Scan Locker QR Code
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', margin: '0 auto 16px' }}>
          At the bus station? Point your camera at the QR sticker on any locker door to open & lock.
        </p>

        <button
          onClick={onOpenScanner}
          style={{
            width: '100%',
            padding: '14px',
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
          <Camera style={{ width: '20px', height: '20px' }} />
          Scan QR Code with Camera
        </button>
      </div>

      {/* Demo Shortcut: Load Active Occupied Pass */}
      {occupiedLocker && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 700 }}>DEMO PASS DETECTED</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
              Active Pass for Box {occupiedLocker.id} ({occupiedLocker.activeSession?.passengerName})
            </div>
          </div>
          <button
            onClick={() => onSwitchToActiveSession(occupiedLocker)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: '#f43f5e',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            View Ticket
          </button>
        </div>
      )}

      {/* Section Header & Filter */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            OR CHOOSE AVAILABLE LOCKER:
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            {lockers.filter(l => l.status === 'available').length} Available
          </span>
        </div>

        {/* Size Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          {['ALL', 'SMALL', 'MEDIUM', 'LARGE'].map((size) => (
            <button
              key={size}
              onClick={() => setSizeFilter(size)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: sizeFilter === size ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: sizeFilter === size ? '#0f172a' : 'var(--text-muted)',
                border: '1px solid var(--border-color)'
              }}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Locker Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredLockers.map((locker) => {
            const isAvail = locker.status === 'available';
            const isOccupied = locker.status === 'occupied';

            return (
              <div
                key={locker.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: `1px solid ${isAvail ? 'rgba(6, 182, 212, 0.2)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: isAvail ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: isAvail ? '#34d399' : '#fb7185',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    {locker.id}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{locker.label}</span>
                      <span className={`badge ${isAvail ? 'badge-available' : isOccupied ? 'badge-occupied' : 'badge-maintenance'}`} style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                        {locker.size}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatMoney(locker.hourlyRate)}/hr • {locker.dimensions}
                    </div>
                  </div>
                </div>

                {isAvail ? (
                  <button
                    onClick={() => onSelectLocker(locker)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--primary)',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    Select Box
                  </button>
                ) : isOccupied ? (
                  <button
                    onClick={() => onSwitchToActiveSession(locker)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(244, 63, 94, 0.2)',
                      color: '#fb7185',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      border: '1px solid rgba(244, 63, 94, 0.3)'
                    }}
                  >
                    Manage
                  </button>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Out of Service</span>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
