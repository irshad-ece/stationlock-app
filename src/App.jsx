import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LockerScanOrSelect from './components/PassengerMobile/LockerScanOrSelect';
import ActivePassView from './components/PassengerMobile/ActivePassView';
import QRScannerModal from './components/PassengerMobile/QRScannerModal';
import BookingModal from './components/PassengerMobile/BookingModal';
import TimeExtensionModal from './components/PassengerMobile/TimeExtensionModal';
import EarlyCheckoutModal from './components/PassengerMobile/EarlyCheckoutModal';
import LockerWall from './components/StationKiosk/LockerWall';
import AdminDashboard from './components/Admin/AdminDashboard';

import { INITIAL_LOCKERS } from './data/defaultLockers';
import { soundEngine } from './utils/audioEngine';

const STORAGE_KEY = 'stationlock_app_state_v1';

export default function App() {
  const [currentView, setCurrentView] = useState('mobile'); // 'mobile' | 'kiosk' | 'admin'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load lockers state from LocalStorage or preset defaults
  const [lockers, setLockers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load local storage:', e);
    }
    return INITIAL_LOCKERS;
  });

  // Active locker selected for booking or viewing pass
  const [selectedLockerId, setSelectedLockerId] = useState('A104');

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isExtensionOpen, setIsExtensionOpen] = useState(false);
  const [isEarlyCheckoutOpen, setIsEarlyCheckoutOpen] = useState(false);

  // Persist lockers to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lockers));
    } catch (e) {
      console.warn('Failed to save to local storage:', e);
    }
  }, [lockers]);

  const selectedLocker = lockers.find((l) => l.id === selectedLockerId) || lockers[0];

  // Handle new booking confirmation
  const handleBookingSuccess = (lockerId, newSession) => {
    setLockers((prev) =>
      prev.map((l) =>
        l.id === lockerId
          ? { ...l, status: 'occupied', activeSession: newSession }
          : l
      )
    );
    setSelectedLockerId(lockerId);
  };

  // Handle extension confirmation
  const handleExtendSuccess = (lockerId, updatedSession) => {
    setLockers((prev) =>
      prev.map((l) =>
        l.id === lockerId
          ? { ...l, activeSession: updatedSession }
          : l
      )
    );
  };

  // Handle early checkout / time adjustment confirmation
  const handleCheckoutSuccess = (lockerId, receipt) => {
    setLockers((prev) =>
      prev.map((l) =>
        l.id === lockerId
          ? { ...l, status: 'available', activeSession: null }
          : l
      )
    );
  };

  // Handle admin force unlock
  const handleForceUnlock = (lockerId) => {
    setLockers((prev) =>
      prev.map((l) =>
        l.id === lockerId
          ? { ...l, status: 'available', activeSession: null }
          : l
      )
    );
  };

  // Handle admin toggle maintenance
  const handleToggleMaintenance = (lockerId) => {
    setLockers((prev) =>
      prev.map((l) =>
        l.id === lockerId
          ? {
              ...l,
              status: l.status === 'maintenance' ? 'available' : 'maintenance',
              activeSession: null
            }
          : l
      )
    );
  };

  // Reset demo state
  const handleResetDemo = () => {
    if (window.confirm('Reset all lockers to default station state?')) {
      setLockers(INITIAL_LOCKERS);
      setSelectedLockerId('A104');
      localStorage.removeItem(STORAGE_KEY);
      if (soundEnabled) soundEngine.playLockSound(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Navigation */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onResetDemo={handleResetDemo}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, padding: '0 16px 40px' }}>
        
        {/* VIEW 1: Passenger Experience Portal */}
        {currentView === 'mobile' && (
          <div className="passenger-app-container glass-panel">
            {/* Passenger App Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.85)',
              borderTopLeftRadius: 'var(--radius-md)',
              borderTopRightRadius: 'var(--radius-md)'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  BUS TERMINAL 4 • PASSENGER PORTAL
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  StationLock Storage Pass
                </div>
              </div>
              
              <button
                onClick={() => setIsScannerOpen(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary)',
                  color: '#0f172a',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  boxShadow: '0 0 12px rgba(6, 182, 212, 0.3)'
                }}
              >
                Scan QR Code
              </button>
            </div>

            {/* Passenger Body Content */}
            <div style={{ padding: '24px' }}>
              {selectedLocker && selectedLocker.status === 'occupied' && selectedLocker.activeSession ? (
                /* Show Active Session Pass */
                <ActivePassView
                  activeLocker={selectedLocker}
                  onOpenExtensionModal={() => setIsExtensionOpen(true)}
                  onOpenEarlyCheckoutModal={() => setIsEarlyCheckoutOpen(true)}
                  soundEnabled={soundEnabled}
                />
              ) : (
                /* Show Locker Selection & QR Scan Trigger */
                <LockerScanOrSelect
                  lockers={lockers}
                  onOpenScanner={() => setIsScannerOpen(true)}
                  onSelectLocker={(l) => {
                    setSelectedLockerId(l.id);
                    if (l.status === 'available') {
                      setIsBookingOpen(true);
                    }
                  }}
                  onSwitchToActiveSession={(l) => {
                    setSelectedLockerId(l.id);
                  }}
                />
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: Station Touch Kiosk Wall Display */}
        {currentView === 'kiosk' && (
          <LockerWall
            lockers={lockers}
            onOpenScanner={() => setIsScannerOpen(true)}
            onSelectLocker={(l) => {
              setSelectedLockerId(l.id);
              if (l.status === 'available') {
                setIsBookingOpen(true);
              } else if (l.status === 'occupied') {
                setCurrentView('mobile');
              }
            }}
          />
        )}

        {/* VIEW 3: Station Operator Admin Telemetry */}
        {currentView === 'admin' && (
          <AdminDashboard
            lockers={lockers}
            onForceUnlock={handleForceUnlock}
            onToggleMaintenance={handleToggleMaintenance}
            soundEnabled={soundEnabled}
          />
        )}

      </main>

      {/* MODALS */}

      {/* 1. Camera QR Scanner Simulator Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        lockers={lockers}
        soundEnabled={soundEnabled}
        onSelectLocker={(l) => {
          setSelectedLockerId(l.id);
          if (l.status === 'available') {
            setIsBookingOpen(true);
          } else {
            setCurrentView('mobile');
          }
        }}
      />

      {/* 2. Initial Booking & Payment Settlement Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        locker={selectedLocker}
        onBookingSuccess={handleBookingSuccess}
        soundEnabled={soundEnabled}
      />

      {/* 3. Time Extension Modal (Bus Delayed) */}
      <TimeExtensionModal
        isOpen={isExtensionOpen}
        onClose={() => setIsExtensionOpen(false)}
        activeLocker={selectedLocker}
        onExtendSuccess={handleExtendSuccess}
        soundEnabled={soundEnabled}
      />

      {/* 4. Early Departure / Time Adjustment Modal (Bus Arrived Early) */}
      <EarlyCheckoutModal
        isOpen={isEarlyCheckoutOpen}
        onClose={() => setIsEarlyCheckoutOpen(false)}
        activeLocker={selectedLocker}
        onCheckoutSuccess={handleCheckoutSuccess}
        soundEnabled={soundEnabled}
      />

    </div>
  );
}
