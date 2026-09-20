import React, { useState } from 'react';
import { Bus, X, DollarSign, Lock, AlertTriangle, CheckCircle2, RefreshCw, FileText } from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';
import { formatMoney, calculateEarlyCheckoutRefund, formatDuration } from '../../utils/helpers';
import confetti from 'canvas-confetti';

export default function EarlyCheckoutModal({ isOpen, onClose, activeLocker, onCheckoutSuccess, soundEnabled }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [checkoutReceipt, setCheckoutReceipt] = useState(null);

  if (!isOpen || !activeLocker || !activeLocker.activeSession) return null;

  const session = activeLocker.activeSession;
  const refundInfo = calculateEarlyCheckoutRefund(session);

  const handleExecuteEarlyCheckout = () => {
    setIsConfirming(true);
    if (soundEnabled) soundEngine.playLockSound(false); // unlock sound

    setTimeout(() => {
      setIsConfirming(false);
      if (soundEnabled) soundEngine.playSuccessChime();

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      const receipt = {
        lockerId: activeLocker.id,
        lockerLabel: activeLocker.label,
        passengerName: session.passengerName,
        busNumber: session.busNumber,
        checkoutTime: new Date().toISOString(),
        totalPaid: session.totalPaid || session.initialPaymentAmount,
        refundAmount: refundInfo.refundAmount,
        netSpent: (session.totalPaid || session.initialPaymentAmount) - refundInfo.refundAmount,
        reason: 'Early Bus Arrival Adjustment'
      };

      setCheckoutReceipt(receipt);
      onCheckoutSuccess(activeLocker.id, receipt);
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
        maxWidth: '440px',
        padding: '24px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.2)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bus style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Adjust Time / Bus Arrived Early</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Early departure luggage retrieval</span>
            </div>
          </div>
          {!checkoutReceipt && (
            <button 
              onClick={onClose}
              disabled={isConfirming}
              style={{ background: 'transparent', color: 'var(--text-muted)', padding: '4px' }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          )}
        </div>

        {!checkoutReceipt ? (
          <>
            {/* Early Bus Alert Banner */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              marginBottom: '16px',
              display: 'flex',
              gap: '10px'
            }}>
              <AlertTriangle style={{ width: '20px', height: '20px', color: 'var(--amber)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', color: '#fde68a', lineHeight: '1.4' }}>
                <strong>Bus Arrived Early?</strong> You can end your locker rental now. Remaining unused time will be credited back according to our bus station early retrieval policy.
              </div>
            </div>

            {/* Time & Refund Calculation Summary */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Unused Remaining Storage Time:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {formatDuration(refundInfo.remainingMs)} ({refundInfo.unusedHours} hrs)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Amount Paid:</span>
                <span style={{ fontWeight: 600 }}>{formatMoney(session.totalPaid || session.initialPaymentAmount)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Early Processing Policy:</span>
                <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>80% Refund on Unused Time</span>
              </div>

              <div style={{
                borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Instant Refund Amount:</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Credited to {session.paymentMethod || 'Original Payment'}</div>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--emerald)' }}>
                  {formatMoney(refundInfo.refundAmount)}
                </div>
              </div>
            </div>

            {/* Confirmation Buttons */}
            <button
              onClick={handleExecuteEarlyCheckout}
              disabled={isConfirming}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                opacity: isConfirming ? 0.7 : 1
              }}
            >
              {isConfirming ? (
                <>Unlocking Locker & Refunding...</>
              ) : (
                <>
                  <Lock style={{ width: '18px', height: '18px' }} /> Unlock {activeLocker.id} & Claim {formatMoney(refundInfo.refundAmount)}
                </>
              )}
            </button>
          </>
        ) : (
          /* Final Receipt View */
          <div>
            <div style={{
              textAlign: 'center',
              padding: '16px 0',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '16px'
            }}>
              <CheckCircle2 style={{ width: '48px', height: '48px', color: 'var(--emerald)', margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Locker Unlocked & Session Ended</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Thank you for using StationLock! Please collect your bags from Box {checkoutReceipt.lockerId}.
              </p>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              fontSize: '0.85rem',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Passenger:</span>
                <span style={{ fontWeight: 600 }}>{checkoutReceipt.passengerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Locker Box:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{checkoutReceipt.lockerLabel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Net Charged:</span>
                <span style={{ fontWeight: 600 }}>{formatMoney(checkoutReceipt.netSpent)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald)', fontWeight: 700 }}>
                <span>Refund Processed:</span>
                <span>{formatMoney(checkoutReceipt.refundAmount)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary)',
                color: '#0f172a',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              Done & Return Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
