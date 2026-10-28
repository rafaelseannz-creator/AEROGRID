// Demo energy data. Replace with real AeroGrid measurements once available.
export const ASSUMPTIONS = {
  pricePerKwh: 0.33, // AUD
  splitSystemKw: 2.5,
  gridKgCo2PerKwh: 0.73, // Queensland grid
};

export type DayUsage = {
  short: string;
  label: string;
  aeroKwh: number;
  // Estimated use of a typical split system running the same hours.
  splitKwh: number;
};

// Last 7 days, ending today. Thursday and Friday are office days.
export const WEEK: DayUsage[] = [
  { short: 'Wed', label: 'Wednesday', aeroKwh: 2.4, splitKwh: 14.8 },
  { short: 'Thu', label: 'Thursday', aeroKwh: 0.6, splitKwh: 4.1 },
  { short: 'Fri', label: 'Friday', aeroKwh: 0.5, splitKwh: 3.6 },
  { short: 'Sat', label: 'Saturday', aeroKwh: 3.0, splitKwh: 18.5 },
  { short: 'Sun', label: 'Sunday', aeroKwh: 2.8, splitKwh: 17.2 },
  { short: 'Mon', label: 'Monday', aeroKwh: 2.3, splitKwh: 14.2 },
  { short: 'Tue', label: 'Today', aeroKwh: 2.1, splitKwh: 15.0 },
];

export function summarise(days: DayUsage[]) {
  const aeroKwh = days.reduce((sum, d) => sum + d.aeroKwh, 0);
  const splitKwh = days.reduce((sum, d) => sum + d.splitKwh, 0);
  const savedKwh = splitKwh - aeroKwh;
  return {
    aeroKwh,
    splitKwh,
    savedKwh,
    savedDollars: savedKwh * ASSUMPTIONS.pricePerKwh,
    co2AvoidedKg: savedKwh * ASSUMPTIONS.gridKgCo2PerKwh,
  };
}
