import React, { useState } from 'react';
import { Lock, X, Bus, User, Phone, Clock, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../utils/audioEngine';
import { formatMoney, generatePin } from '../../utils/helpers';
import confetti from 'canvas-confetti';

export default function BookingModal({ isOpen, onClose, locker, onBookingSuccess, soundEnabled }) {
  const [durationHours, setDurationHours] = useState(2);
  const [passengerName, setPassengerName] = useState('Alex Mercer');
  const [passengerPhone, setPassengerPhone] = useState('+1 (555) 234-8891');
  const [busNumber, setBusNumber] = useState('Express Bus #402 (Boston)');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !locker) return null;

  const baseCost = locker.hourlyRate * durationHours;
  const digitalFee = 0.25;
  const totalAmount = baseCost + digitalFee;

  const handleSettlePayment = () => {
    if (!passengerName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsProcessing(true);
    if (soundEnabled) soundEngine.playLockSound(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (soundEnabled) soundEngine.playSuccessChime();

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      const startTime = Date.now();
      const endTime = startTime + durationHours * 60 * 60 * 1000;
      const pin = generatePin();

      const newSession = {
        sessionCode: `STATIONLOCK-PASS-${locker.id}`,
        passengerName,
        passengerPhone,
        busNumber,
        startTime,
        endTime,
        originalDurationHours: durationHours,
        extendedHours: 0,
        pin,
        initialPaymentAmount: totalAmount,
        totalPaid: totalAmount,
        paymentMethod: paymentMethod === 'upi' ? 'UPI / GPay Instant' : paymentMethod === 'apple' ? 'Apple Pay' : 'Credit Card',
        history: [
          {
            id: 1,
            type: 'CHECKIN',
            timestamp: new Date().toISOString(),
            title: 'Locker Reserved & Locked',
            detail: `Reserved ${locker.label} for ${durationHours} hrs. Total paid: ${formatMoney(totalAmount)}`
          }
        ]
      };

      onBookingSuccess(locker.id, newSession);
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
        maxWidth: '440px',
        padding: '24px',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-available" style={{ fontSize: '0.7rem' }}>READY TO LOCK</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{locker.label}</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {locker.terminal} • {locker.size} ({locker.dimensions})
            </p>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            style={{ background: 'transparent', color: 'var(--text-muted)', padding: '4px' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Form Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
          
          {/* Duration Selector */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              SELECT STORAGE DURATION:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[1, 2, 4, 8].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setDurationHours(hours)}
                  style={{
                    padding: '10px 4px',
                    borderRadius: 'var(--radius-sm)',
                    background: durationHours === hours ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: durationHours === hours ? '#0f172a' : '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: `1px solid ${durationHours === hours ? 'var(--primary)' : 'var(--border-color)'}`
                  }}
                >
                  {hours} {hours === 1 ? 'Hour' : 'Hours'}
                </button>
              ))}
            </div>
          </div>

          {/* Passenger Name & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="e.g. Alex M."
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 30px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
                <User style={{ width: '14px', height: '14px', color: 'var(--text-dim)', position: 'absolute', left: '10px', top: '10px' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="+1 (555)..."
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 30px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
                <Phone style={{ width: '14px', height: '14px', color: 'var(--text-dim)', position: 'absolute', left: '10px', top: '10px' }} />
              </div>
            </div>
          </div>

          {/* Bus Info */}
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Bus / Platform Details (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                placeholder="e.g. Express Bus #402"
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 30px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
              <Bus style={{ width: '14px', height: '14px', color: 'var(--text-dim)', position: 'absolute', left: '10px', top: '10px' }} />
            </div>
          </div>

        </div>

        {/* Price Breakdown Box */}
        <div style={{
          background: 'rgba(6, 182, 212, 0.05)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Storage ({durationHours} hrs @ {formatMoney(locker.hourlyRate)}/hr):</span>
            <span style={{ fontWeight: 600 }}>{formatMoney(baseCost)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Station Digital Pass Fee:</span>
            <span style={{ fontWeight: 600 }}>{formatMoney(digitalFee)}</span>
          </div>
          <div style={{
            borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
            paddingTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Total Amount:</span>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
              {formatMoney(totalAmount)}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            SELECT PAYMENT METHOD:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { id: 'upi', label: 'UPI / GPay' },
              { id: 'card', label: 'Debit/Credit' },
              { id: 'apple', label: 'Apple Pay' }
            ].map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMethod(pm.id)}
                style={{
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  background: paymentMethod === pm.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: paymentMethod === pm.id ? '#818cf8' : 'var(--text-muted)',
                  border: `1px solid ${paymentMethod === pm.id ? '#6366f1' : 'var(--border-color)'}`,
                  fontSize: '0.75rem',
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
          onClick={handleSettlePayment}
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
            opacity: isProcessing ? 0.7 : 1
          }}
        >
          {isProcessing ? (
            <>Locking Door & Processing...</>
          ) : (
            <>
              <Lock style={{ width: '18px', height: '18px' }} /> Pay {formatMoney(totalAmount)} & Lock Box
            </>
          )}
        </button>

      </div>
    </div>
  );
}
