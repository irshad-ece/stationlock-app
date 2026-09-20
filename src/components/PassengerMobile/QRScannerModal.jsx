import React, { useState } from 'react';
import { Camera, X, QrCode, CheckCircle2, Sparkles, Flashlight } from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';

export default function QRScannerModal({ isOpen, onClose, lockers, onSelectLocker, soundEnabled }) {
  const [flashlight, setFlashlight] = useState(false);
  const [scanningStatus, setScanningStatus] = useState(null);

  if (!isOpen) return null;

  const handleSimulatedScan = (locker) => {
    if (soundEnabled) soundEngine.playScanBeep();
    setScanningStatus(`QR Code Verified: Box ${locker.id}`);
    
    setTimeout(() => {
      setScanningStatus(null);
      onSelectLocker(locker);
      onClose();
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 16, 0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="glass-panel-glow animate-slideUp" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '24px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Scan Locker QR Code</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', color: 'var(--text-muted)', padding: '4px' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          borderRadius: '16px',
          background: flashlight ? 'rgba(255, 255, 255, 0.15)' : '#0f172a',
          border: '2px dashed var(--primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          {/* Animated Scanning Laser Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
            boxShadow: '0 0 15px var(--primary)',
            animation: 'scanLaser 2s ease-in-out infinite alternate'
          }} />

          <style>{`
            @keyframes scanLaser {
              0% { top: 10%; }
              100% { top: 90%; }
            }
          `}</style>

          <QrCode style={{ width: '64px', height: '64px', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }} />
          
          {scanningStatus ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 600 }}>
              <CheckCircle2 style={{ width: '18px', height: '18px' }} />
              {scanningStatus}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0 20px' }}>
              Point phone camera at QR Code on the physical locker door
            </p>
          )}

          {/* Flashlight toggle */}
          <button
            onClick={() => setFlashlight(!flashlight)}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: flashlight ? 'var(--primary)' : 'rgba(0, 0, 0, 0.5)',
              color: flashlight ? '#0f172a' : '#fff',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Flashlight style={{ width: '14px', height: '14px' }} />
            {flashlight ? 'Flash ON' : 'Flash OFF'}
          </button>
        </div>

        {/* Demo Quick Scanner - Tap to scan specific box */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Sparkles style={{ width: '14px', height: '14px', color: 'var(--amber)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              SIMULATE SCANNING LOCKER QR CODE:
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
            {lockers.map((locker) => (
              <button
                key={locker.id}
                onClick={() => handleSimulatedScan(locker)}
                style={{
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  background: locker.status === 'occupied' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                  border: `1px solid ${locker.status === 'occupied' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`,
                  color: locker.status === 'occupied' ? '#fb7185' : '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              >
                QR: {locker.id}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
