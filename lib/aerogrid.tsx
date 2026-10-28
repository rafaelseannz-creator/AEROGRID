import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { CYCLE_PHASES } from '@/lib/cycle';

export type Mode = 'Cool' | 'Dry' | 'Eco' | 'Focus';
export type FanSpeed = 'auto' | 1 | 2 | 3 | 4 | 5;
export type Direction = 'Desk' | 'Sweep' | 'Wide';

export type Unit = {
  id: string;
  name: string;
  room: string;
  targetTemp: number;
  todayKwh: number;
  on: boolean;
  // Status shown when the unit is off.
  offLabel: string;
};

export const TEMP_MIN = 16;
export const TEMP_MAX = 30;
const CYCLE_STEP_MS = 2200;

type AeroGridState = {
  powerOn: boolean;
  roomTemp: number;
  humidity: number;
  targetTemp: number;
  mode: Mode;
  fanSpeed: FanSpeed;
  direction: Direction;
  focusOn: boolean;
  scheduleOn: boolean;
  syncOn: boolean;
  phase: number;
  cyclePlaying: boolean;
  units: Unit[];
};

const initialState: AeroGridState = {
  powerOn: true,
  roomTemp: 24.5,
  humidity: 38,
  targetTemp: 22,
  mode: 'Cool',
  fanSpeed: 'auto',
  direction: 'Desk',
  focusOn: true,
  scheduleOn: true,
  syncOn: false,
  phase: 3,
  cyclePlaying: false,
  units: [
    { id: 'desk', name: 'Desk Unit', room: 'Study · beside desk', targetTemp: 22, todayKwh: 2.1, on: true, offLabel: 'Off' },
    { id: 'bedroom', name: 'Bedroom Unit', room: 'Bedroom', targetTemp: 20, todayKwh: 0, on: false, offLabel: 'Starts 21:00' },
  ],
};

type AeroGridContextValue = AeroGridState & {
  update: (patch: Partial<AeroGridState>) => void;
  nudgeTarget: (delta: number) => void;
  toggleUnit: (id: string) => void;
};

const AeroGridContext = createContext<AeroGridContextValue | null>(null);

export function AeroGridProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!state.cyclePlaying) return;
    const timer = setInterval(() => {
      setState((s) => ({ ...s, phase: (s.phase + 1) % CYCLE_PHASES.length }));
    }, CYCLE_STEP_MS);
    return () => clearInterval(timer);
  }, [state.cyclePlaying]);

  const value: AeroGridContextValue = {
    ...state,
    update: (patch) => setState((s) => ({ ...s, ...patch })),
    nudgeTarget: (delta) =>
      setState((s) => ({
        ...s,
        targetTemp: Math.min(TEMP_MAX, Math.max(TEMP_MIN, s.targetTemp + delta)),
      })),
    toggleUnit: (id) =>
      setState((s) => ({
        ...s,
        units: s.units.map((u) => (u.id === id ? { ...u, on: !u.on } : u)),
      })),
  };

  return <AeroGridContext.Provider value={value}>{children}</AeroGridContext.Provider>;
}

export function useAeroGrid() {
  const ctx = useContext(AeroGridContext);
  if (!ctx) throw new Error('useAeroGrid must be used inside AeroGridProvider');
  return ctx;
}
