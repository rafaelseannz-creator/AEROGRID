// Demo energy data. Replace with real AeroGrid measurements once available.
export const ASSUMPTIONS = {
  pricePerKwh: 0.36, // AUD, Queensland residential tariff
  splitSystemKw: 3.5,
  gridKgCo2PerKwh: 0.73, // Queensland grid
  unitPrice: 1499, // AUD, one AeroGrid unit
};

// AeroGrid's energy use as a share of a split system cooling the same hours.
const AEROGRID_SHARE = 0.14;

type Usage = { aeroKwh: number; splitKwh: number };

export type DayUsage = Usage & {
  short: string;
  label: string;
};

// Last 7 days, ending today. Thursday and Friday are office days.
export const WEEK: DayUsage[] = [
  { short: 'Wed', label: 'Wednesday', aeroKwh: 3.1, splitKwh: 22.4 },
  { short: 'Thu', label: 'Thursday', aeroKwh: 0.8, splitKwh: 6.2 },
  { short: 'Fri', label: 'Friday', aeroKwh: 0.7, splitKwh: 5.8 },
  { short: 'Sat', label: 'Saturday', aeroKwh: 3.8, splitKwh: 26.6 },
  { short: 'Sun', label: 'Sunday', aeroKwh: 3.6, splitKwh: 25.1 },
  { short: 'Mon', label: 'Monday', aeroKwh: 3.0, splitKwh: 21.7 },
  { short: 'Tue', label: 'Today', aeroKwh: 2.9, splitKwh: 23.0 },
];

export type MonthUsage = Usage & {
  short: string;
  label: string;
  savedKwh: number;
};

// Energy saved each month since the Desk Unit was installed. Summer peaks, winter dips.
const MONTHLY_SAVED_KWH: [string, string, number][] = [
  ['Nov', 'November 2025', 490],
  ['Dec', 'December 2025', 590],
  ['Jan', 'January 2026', 670],
  ['Feb', 'February 2026', 620],
  ['Mar', 'March 2026', 500],
  ['Apr', 'April 2026', 320],
  ['May', 'May 2026', 170],
  ['Jun', 'June 2026', 80],
  ['Jul', 'July 2026', 70],
  ['Aug', 'August 2026', 120],
  ['Sep', 'September 2026', 240],
  ['Oct', 'October 2026', 380],
];

export const MONTHS: MonthUsage[] = MONTHLY_SAVED_KWH.map(([short, label, savedKwh]) => {
  const splitKwh = savedKwh / (1 - AEROGRID_SHARE);
  return { short, label, savedKwh, splitKwh, aeroKwh: splitKwh - savedKwh };
});

// This week's AeroGrid energy, split by where it was used.
export const ZONES = [
  { label: 'Desk Unit', kwh: 11.6 },
  { label: 'Bedroom Unit', kwh: 5.4 },
  { label: 'Standby & app', kwh: 0.9 },
];

export function summarise(periods: Usage[]) {
  const aeroKwh = periods.reduce((sum, d) => sum + d.aeroKwh, 0);
  const splitKwh = periods.reduce((sum, d) => sum + d.splitKwh, 0);
  const savedKwh = splitKwh - aeroKwh;
  return {
    aeroKwh,
    splitKwh,
    savedKwh,
    savedDollars: savedKwh * ASSUMPTIONS.pricePerKwh,
    co2AvoidedKg: savedKwh * ASSUMPTIONS.gridKgCo2PerKwh,
    // How much less energy AeroGrid used, as a fraction of the split system.
    reduction: splitKwh > 0 ? savedKwh / splitKwh : 0,
  };
}

// Running total of dollars saved at the end of each month.
export function cumulativeSavings(months: MonthUsage[]) {
  let total = 0;
  return months.map((m) => (total += m.savedKwh * ASSUMPTIONS.pricePerKwh));
}

export const money = (value: number, decimals = 0) =>
  `$${value.toLocaleString('en-AU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
