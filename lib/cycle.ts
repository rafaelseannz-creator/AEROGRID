export type CyclePhase = {
  title: string;
  kind: 'heat' | 'cool';
  fieldOn: boolean;
  // Demo plate temperature (°C) shown while this phase runs.
  plateTemp: number;
  body: string;
};

export const CYCLE_PHASES: CyclePhase[] = [
  {
    title: 'Electric field on',
    kind: 'heat',
    fieldOn: true,
    plateTemp: 31.0,
    body: 'High voltage aligns the ceramic’s dipoles, instantly heating the plate.',
  },
  {
    title: 'Heat exhaust',
    kind: 'heat',
    fieldOn: true,
    plateTemp: 27.5,
    body: 'With the voltage still on, that heat is routed outside.',
  },
  {
    title: 'Electric field off',
    kind: 'cool',
    fieldOn: false,
    plateTemp: 13.8,
    body: 'Voltage off: the dipoles scatter and the plate temperature plummets.',
  },
  {
    title: 'Room heat absorption',
    kind: 'cool',
    fieldOn: false,
    plateTemp: 18.6,
    body: 'Warm room air passes over the chilled plates and returns cool and dry. Then it repeats.',
  },
];
