// Helper utilities for calculation, time formatting, and refund policy

export const formatMoney = (amount) => {
  return `$${Number(amount || 0).toFixed(2)}`;
};

export const formatDuration = (ms) => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const formatTimeShort = (timestamp) => {
  if (!timestamp) return '--:--';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Early Departure Adjustment Calculator (When Bus Arrives Early)
 * Policy:
 * - Calculates remaining time in milliseconds.
 * - If remaining time is > 30 minutes, passenger gets 80% refund of unused full hours.
 * - Minimum retained charge is 1 hour (base minimum fee).
 */
export const calculateEarlyCheckoutRefund = (session, currentMs = Date.now()) => {
  if (!session || !session.endTime) {
    return { remainingMs: 0, unusedHours: 0, refundAmount: 0, penaltyOrFee: 0, isEligible: false };
  }

  const remainingMs = Math.max(0, session.endTime - currentMs);
  const remainingHoursExact = remainingMs / (1000 * 60 * 60);
  
  // Unused full or half hours
  const unusedHours = Math.floor(remainingHoursExact * 2) / 2; // rounds to nearest 0.5hr
  const hourlyRate = session.initialPaymentAmount / Math.max(1, session.originalDurationHours + session.extendedHours);
  
  // Unused value
  const unusedValue = unusedHours * hourlyRate;
  
  // Policy: 80% refund on unused time, 20% early processing administrative fee
  const refundPercentage = 0.80;
  let refundAmount = Math.max(0, unusedValue * refundPercentage);
  
  // Ensure we don't refund more than total paid
  refundAmount = Math.min(session.totalPaid || session.initialPaymentAmount, refundAmount);

  return {
    remainingMs,
    unusedHours,
    hourlyRate,
    unusedValue,
    refundAmount,
    processingFee: unusedValue * 0.20,
    isEligible: unusedHours >= 0.5
  };
};

/**
 * Extension Calculator (When Bus is Delayed)
 * Options: 30m, 1h, 2h, 4h
 */
export const calculateExtensionCost = (hourlyRate, additionalHours) => {
  const baseCost = hourlyRate * additionalHours;
  const taxOrPlatformFee = 0.25; // fixed $0.25 transit digital pass fee
  const totalCost = baseCost + taxOrPlatformFee;
  return {
    additionalHours,
    baseCost,
    taxOrPlatformFee,
    totalCost
  };
};

/**
 * Random PIN generator for new sessions
 */
export const generatePin = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
