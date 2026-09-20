import React, { useState } from 'react';
import { ShieldCheck, DollarSign, Lock, Unlock, AlertOctagon, Activity, FileText, CheckCircle2, User, Phone, Bus } from 'lucide-react';
import { formatMoney, formatDateTime, formatDuration } from '../../utils/helpers';
import { soundEngine } from '../../utils/audioEngine';

export default function AdminDashboard({ lockers, onForceUnlock, onToggleMaintenance, soundEnabled }) {
  const [selectedSessionFilter, setSelectedSessionFilter] = useState('ALL');

  const totalLockers = lockers.length;
  const occupiedLockers = lockers.filter((l) => l.status === 'occupied');
  const occupiedCount = occupiedLockers.length;
  const availableCount = lockers.filter((l) => l.status === 'available').length;
  const occupancyPercentage = Math.round((occupiedCount / totalLockers) * 100);

  // Revenue calculation
  let totalRevenue = 0;
  let totalRefunds = 0;
  lockers.forEach((l) => {
    if (l.activeSession) {
      totalRevenue += (l.activeSession.totalPaid || l.activeSession.initialPaymentAmount || 0);
    }
  });

  const handleAdminForceUnlock = (locker) => {
    if (window.confirm(`⚠️ SECURITY OVERRIDE: Are you sure you want to force unlock Box ${locker.id}?`)) {
      if (soundEnabled) soundEngine.playLockSound(false);
      onForceUnlock(locker.id);
    }
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Admin Control Bar */}
      <div className="glass-panel-glow" style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <ShieldCheck style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              Station Control & Admin Portal
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time security telemetry, force unlock override, and financial metrics
            </p>
          </div>
        </div>

        <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
          ADMIN ACCESS GRANTED
        </span>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
            TOTAL STATION REVENUE
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald)' }}>
            {formatMoney(totalRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active & completed locker bookings
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
            OCCUPANCY RATE
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
            {occupancyPercentage}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {occupiedCount} of {totalLockers} lockers currently in use
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
            AVAILABLE CAPACITY
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
            {availableCount} Lockers
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Ready for instant QR check-in
          </div>
        </div>

      </div>

      {/* Active Passenger Sessions Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            Active Passenger Sessions & Force Unlock Controls
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {occupiedCount} Active Locker Sessions
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>Locker #</th>
                <th style={{ padding: '10px' }}>Passenger Name</th>
                <th style={{ padding: '10px' }}>Bus Details</th>
                <th style={{ padding: '10px' }}>Time Remaining</th>
                <th style={{ padding: '10px' }}>Amount Paid</th>
                <th style={{ padding: '10px' }}>PIN Key</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Security Actions</th>
              </tr>
            </thead>
            <tbody>
              {lockers.map((locker) => {
                const session = locker.activeSession;
                const isOcc = locker.status === 'occupied';

                return (
                  <tr key={locker.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--primary)' }}>
                      {locker.id} ({locker.size})
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {session ? (
                        <div>
                          <strong style={{ color: '#fff' }}>{session.passengerName}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{session.passengerPhone}</div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>Vacant</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 10px', color: session?.busNumber ? '#fde68a' : 'var(--text-dim)' }}>
                      {session?.busNumber || '--'}
                    </td>
                    <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)' }}>
                      {session ? (
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          {formatDuration(Math.max(0, session.endTime - Date.now()))}
                        </span>
                      ) : (
                        '--:--:--'
                      )}
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: 600 }}>
                      {session ? formatMoney(session.totalPaid || session.initialPaymentAmount) : '--'}
                    </td>
                    <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                      {session?.pin ? session.pin : '--'}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      {isOcc ? (
                        <button
                          onClick={() => handleAdminForceUnlock(locker)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(244, 63, 94, 0.2)',
                            color: '#fb7185',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Unlock style={{ width: '12px', height: '12px' }} /> Force Unlock
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleMaintenance(locker.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            background: locker.status === 'maintenance' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            color: locker.status === 'maintenance' ? '#fbbf24' : 'var(--text-muted)',
                            fontSize: '0.75rem'
                          }}
                        >
                          {locker.status === 'maintenance' ? 'Exit Maintenance' : 'Set Maintenance'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
