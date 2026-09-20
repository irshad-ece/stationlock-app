import React, { useState } from 'react';
import { Clock, X, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';
import { formatMoney, calculateExtensionCost } from '../../utils/helpers';
import confetti from 'canvas-confetti';

export default function TimeExtensionModal({ isOpen, onClose, activeLocker, onExtendSuccess, soundEnabled }) {
  const [selectedHours, setSelectedHours] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !activeLocker || !activeLocker.activeSession) return null;

  const session = activeLocker.activeSession;
  const costInfo = calculateExtensionCost(activeLocker.hourlyRate, selectedHours);

  const handleConfirmExtension = () => {
    setIsProcessing(true);
    if (soundEnabled) soundEngine.playLockSound(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (soundEnabled) soundEngine.playSuccessChime();

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}

      // Calculate new end time
      const additionalMs = selectedHours * 60 * 60 * 1000;
      const newEndTime = session.endTime + additionalMs;
      const updatedTotalPaid = (session.totalPaid || session.initialPaymentAmount) + costInfo.totalCost;

      const newHistoryItem = {
        id: Date.now(),
        type: 'EXTENSION',
        timestamp: new Date().toISOString(),
        title: `Extended by +${selectedHours} ${selectedHours === 1 ? 'Hour' : 'Hours'}`,
        detail: `Added time. Extra paid: ${formatMoney(costInfo.totalCost)} (${paymentMethod.toUpperCase()})`
      };

      const updatedSession = {
        ...session,
        endTime: newEndTime,
        extendedHours: (session.extendedHours || 0) + selectedHours,
        totalPaid: updatedTotalPaid,
        history: [newHistoryItem, ...(session.history || [])]
      };

      onExtendSuccess(activeLocker.id, updatedSession);
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(8px)',
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: 'var(--amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Extend Storage Time</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bus delayed? Keep your bag safe</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            style={{ background: 'transparent', color: 'var(--text-muted)', padding: '4px' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Locker Info Pill */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Locker Assigned</div>
            <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{activeLocker.label} ({activeLocker.size})</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hourly Rate</div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{formatMoney(activeLocker.hourlyRate)}/hr</div>
          </div>
        </div>

        {/* Select Additional Hours */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            SELECT EXTRA TIME:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { label: '+30 min', hours: 0.5 },
              { label: '+1 Hour', hours: 1 },
              { label: '+2 Hours', hours: 2 },
              { label: '+4 Hours', hours: 4 },
            ].map((option) => (
              <button
                key={option.hours}
                onClick={() => setSelectedHours(option.hours)}
                style={{
                  padding: '10px 4px',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedHours === option.hours ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedHours === option.hours ? '#0f172a' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: `1px solid ${selectedHours === option.hours ? 'var(--primary)' : 'var(--border-color)'}`,
                  boxShadow: selectedHours === option.hours ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Calculation Summary */}
        <div style={{
          background: 'rgba(6, 182, 212, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Additional Time Charge ({selectedHours}h @ {formatMoney(activeLocker.hourlyRate)}/h):</span>
            <span style={{ fontWeight: 600 }}>{formatMoney(costInfo.baseCost)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '10px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Digital Pass Extension Fee:</span>
            <span style={{ fontWeight: 600 }}>{formatMoney(costInfo.taxOrPlatformFee)}</span>
          </div>
          <div style={{
            borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
            paddingTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Total Extra Payable:</span>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
              {formatMoney(costInfo.totalCost)}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            PAYMENT METHOD:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { id: 'upi', label: 'UPI / GPay' },
              { id: 'card', label: 'Card' },
              { id: 'apple', label: 'Apple Pay' }
            ].map((pm) => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id)}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  background: paymentMethod === pm.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: paymentMethod === pm.id ? '#818cf8' : 'var(--text-muted)',
                  border: `1px solid ${paymentMethod === pm.id ? '#6366f1' : 'var(--border-color)'}`,
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {pm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirmExtension}
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
            opacity: isProcessing ? 0.7 : 1
          }}
        >
          {isProcessing ? (
            <>Processing Instant Payment...</>
          ) : (
            <>
              Pay {formatMoney(costInfo.totalCost)} & Extend Locker <ArrowRight style={{ width: '18px', height: '18px' }} />
            </>
          )}
        </button>

      </div>
    </div>
  );
}
