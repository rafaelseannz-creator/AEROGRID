# AeroGrid

The control centre app for **AeroGrid**, a solid-state, non-compression air conditioner built on a hybrid electrocaloric / magnetocaloric system. No compressor, no refrigerant gas, near-silent.

**Live app:** https://rafaelseannz-creator.github.io/AEROGRID/ (redeploys automatically on every push to `main`)

**How it works (animated diagram):** https://rafaelseannz-creator.github.io/AEROGRID/how-it-works.html

The app lets you adjust temperature and airflow, track energy use and savings against a traditional split system, see how the four-phase cooling cycle works, and manage multiple units as zones.

## Screens

| Tab | What it does |
|---|---|
| **Home** | Room vs target temperature, live cycle phase, quick controls, today's energy and savings, 12-month savings trend, Focus cooling (desk zone only) |
| **Climate** | Target temperature dial, modes (Cool / Dry / Eco / Focus), fan speed, airflow direction, workday schedule |
| **Energy** | 12-month savings and payback time, money saved over time (line), monthly cooling cost vs a split system (line), 7-day usage (bars), energy by unit (donut), CO₂ avoided. Every chart has a table view |
| **Cycle** | The four phases explained, with a live, animated phase readout |
| **Devices** | Units and zones, on/off per unit, whole-home sync, add a unit |

![AeroGrid app screens](design/screenshots.png)

Designs live in [`design/`](design/) (Claude Design artboards, one `.dc.html` per screen).

## Tech stack

- [Expo](https://expo.dev) SDK 58 + React Native, TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) (file-based tab navigation in `app/`)

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (iOS or Android), or press `w` to open it in a browser.

## Project structure

```
app/          screens and navigation (Expo Router)
components/   shared UI components
constants/    theme colours, fonts and radii
lib/          app state, cooling-cycle phases and energy demo data
assets/       icons, splash, fonts
design/       screen designs
```

## Data note

Energy and savings figures in the app are demo data, set in `lib/energy.ts`. They assume $0.36/kWh, a 3.5 kW split system for comparison (about 4,900 kWh a year, within the 3,500–5,000 kWh typical for Australian homes), AeroGrid using 14% of that energy, a $1,499 unit price and Queensland grid emissions. Swap in real AeroGrid efficiency figures once they are measured.
