// Lightweight credit engine for hackathon demo.
// - Distance-based calculation using a flat rate per mile.
// - In-memory wallet for demo (reset on reload). Replace with real storage later.

const CREDIT_RATE_PER_MILE = Number(process.env.EXPO_PUBLIC_CREDIT_RATE_PER_MILE || 4); // credits per mile
const WEEKLY_EARN_CAP = Number(process.env.EXPO_PUBLIC_WEEKLY_EARN_CAP || 200); // demo cap

// In-memory wallet + earnings tracker (demo only; not persisted)
const wallet = new Map(); // userId -> balance
const weeklyEarned = new Map(); // userId -> credits earned this week

export function estimateCredits(distanceMiles) {
  if (!distanceMiles || distanceMiles <= 0) return 0;
  return Math.round(distanceMiles * CREDIT_RATE_PER_MILE);
}

export function getWalletBalance(userId) {
  return wallet.get(userId) || 0;
}

export function getWeeklyEarned(userId) {
  return weeklyEarned.get(userId) || 0;
}

// Process a completed ride: riders pay, driver earns (within a weekly cap).
// Returns a transaction summary.
export function processRideCompletion({ rideId, distanceMiles, riderIds = [], driverId }) {
  const amount = estimateCredits(distanceMiles);
  const txs = [];

  // Riders spend
  riderIds.forEach((rid) => {
    const current = wallet.get(rid) || 0;
    wallet.set(rid, current - amount);
    txs.push({ userId: rid, delta: -amount, type: 'spend', rideId });
  });

  // Driver earns (respect weekly cap)
  const earnedSoFar = weeklyEarned.get(driverId) || 0;
  const allowable = Math.max(0, WEEKLY_EARN_CAP - earnedSoFar);
  const driverEarn = Math.min(amount, allowable);
  const driverCurrent = wallet.get(driverId) || 0;
  wallet.set(driverId, driverCurrent + driverEarn);
  weeklyEarned.set(driverId, earnedSoFar + driverEarn);
  txs.push({ userId: driverId, delta: driverEarn, type: 'earn', rideId, capped: driverEarn < amount });

  return { amount, driverEarned: driverEarn, transactions: txs };
}
