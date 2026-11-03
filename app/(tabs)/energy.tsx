import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ChartCard, DonutChart, LineChart } from '@/components/charts';
import { Screen, styles as ui } from '@/components/ui';
import { colors, fonts, radius } from '@/constants/theme';
import { ASSUMPTIONS, MONTHS, WEEK, ZONES, cumulativeSavings, money, summarise } from '@/lib/energy';

const BAR_HEIGHT = 128;
const BAR_AXIS_MAX_KWH = 30;
const PX_PER_KWH = (BAR_HEIGHT - 12) / BAR_AXIS_MAX_KWH;
const BAR_GRIDLINES = [30, 15, 0];

const kiloDollars = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${Math.round(v)}`);

export default function EnergyScreen() {
  const [selected, setSelected] = useState(WEEK.length - 1);
  const today = summarise([WEEK[WEEK.length - 1]]);
  const week = summarise(WEEK);
  const year = summarise(MONTHS);
  const cumulative = cumulativeSavings(MONTHS);
  const paybackMonths = cumulative.findIndex((v) => v >= ASSUMPTIONS.unitPrice) + 1;
  const splitCost = MONTHS.map((m) => m.splitKwh * ASSUMPTIONS.pricePerKwh);
  const aeroCost = MONTHS.map((m) => m.aeroKwh * ASSUMPTIONS.pricePerKwh);
  const monthLabels = MONTHS.map((m) => m.short);
  const monthNames = MONTHS.map((m) => m.label);
  const zoneTotal = ZONES.reduce((sum, z) => sum + z.kwh, 0);
  const day = WEEK[selected];

  return (
    <Screen eyebrow="Last 12 months" title="Energy & Savings">
      <View style={styles.hero}>
        <Text style={styles.heroValue}>
          {money(year.savedDollars)} <Text style={styles.heroUnit}>saved</Text>
        </Text>
        <Text style={styles.heroSub}>
          {Math.round(year.savedKwh).toLocaleString('en-AU')} kWh less than a typical split system
          {paybackMonths > 0 ? ' · your unit has paid for itself' : ''}
        </Text>
      </View>

      <View style={styles.kpis}>
        <Kpi value={money(week.savedDollars, 2)} label="Saved this week" accent />
        <Kpi value={money(today.savedDollars, 2)} label="Saved today" />
        <Kpi value={paybackMonths > 0 ? `${paybackMonths} months` : 'In progress'} label="Payback time" />
        <Kpi value={`${Math.round(year.reduction * 100)}%`} label="Less energy than a split system" />
      </View>

      <ChartCard
        title="Money saved over time"
        subtitle="Running total since your Desk Unit was installed"
        table={{
          columns: ['Month', 'Saved', 'Running total'],
          rows: MONTHS.map((m, i) => [m.label, money(m.savedKwh * ASSUMPTIONS.pricePerKwh), money(cumulative[i])]),
        }}>
        <LineChart
          series={[{ label: 'Saved', color: colors.cool, values: cumulative }]}
          labels={monthLabels}
          fullLabels={monthNames}
          yMax={1800}
          yTicks={[0, 600, 1200, 1800]}
          format={(v) => money(v)}
          formatAxis={kiloDollars}
          reference={{ value: ASSUMPTIONS.unitPrice, label: `Unit price ${money(ASSUMPTIONS.unitPrice)}` }}
          area
          labelEvery={2}
        />
      </ChartCard>

      <ChartCard
        title="Monthly cooling cost"
        subtitle="What a split system would have cost vs. what you paid"
        legend={[
          { label: 'Split system (est.)', color: colors.seriesSplit },
          { label: 'AeroGrid', color: colors.seriesAeroGrid },
        ]}
        table={{
          columns: ['Month', 'Split system', 'AeroGrid'],
          rows: MONTHS.map((m, i) => [m.label, money(splitCost[i]), money(aeroCost[i])]),
        }}>
        <LineChart
          series={[
            { label: 'Split system', color: colors.seriesSplit, values: splitCost },
            { label: 'AeroGrid', color: colors.seriesAeroGrid, values: aeroCost },
          ]}
          labels={monthLabels}
          fullLabels={monthNames}
          yMax={300}
          yTicks={[0, 100, 200, 300]}
          format={(v) => money(v)}
          labelEvery={2}
        />
      </ChartCard>

      <ChartCard
        title="Daily energy use"
        subtitle="Last 7 days"
        legend={[
          { label: 'AeroGrid', color: colors.seriesAeroGrid },
          { label: 'Split system (est.)', color: colors.seriesSplit },
        ]}
        table={{
          columns: ['Day', 'AeroGrid kWh', 'Split kWh'],
          rows: WEEK.map((d) => [d.label, d.aeroKwh.toFixed(1), d.splitKwh.toFixed(1)]),
        }}>
        <View style={styles.chartWrap}>
          <Text style={ui.muted} accessibilityLiveRegion="polite">
            <Text style={styles.readoutDay}>{day.label}</Text> · AeroGrid {day.aeroKwh.toFixed(1)} kWh · Split
            system {day.splitKwh.toFixed(1)} kWh
          </Text>
          <View style={styles.plotRow}>
            <View style={styles.yAxis}>
              {BAR_GRIDLINES.map((v) => (
                <Text key={v} style={[styles.yLabel, { bottom: v * PX_PER_KWH - 6 }]}>
                  {v}
                </Text>
              ))}
            </View>
            <View style={styles.plot}>
              {BAR_GRIDLINES.map((v) => (
                <View key={v} style={[styles.gridline, { bottom: v * PX_PER_KWH }, v === 0 && styles.baseline]} />
              ))}
              <View style={styles.columns}>
                {WEEK.map((d, i) => (
                  <Pressable
                    key={d.short}
                    accessibilityRole="button"
                    accessibilityLabel={`${d.label}: AeroGrid ${d.aeroKwh.toFixed(1)} kWh, split system ${d.splitKwh.toFixed(1)} kWh`}
                    accessibilityState={{ selected: i === selected }}
                    onPress={() => setSelected(i)}
                    onHoverIn={() => setSelected(i)}
                    style={[styles.column, i === selected && styles.columnSelected]}>
                    <View style={[styles.bar, { height: Math.max(3, d.aeroKwh * PX_PER_KWH), backgroundColor: colors.seriesAeroGrid }]} />
                    <View style={[styles.bar, { height: Math.max(3, d.splitKwh * PX_PER_KWH), backgroundColor: colors.seriesSplit }]} />
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.xAxis}>
            {WEEK.map((d, i) => (
              <Text key={d.short} style={[styles.xLabel, i === selected && styles.xLabelSelected]}>
                {d.short}
              </Text>
            ))}
          </View>
        </View>
      </ChartCard>

      <ChartCard
        title="Where your energy went"
        subtitle="This week, by unit"
        table={{
          columns: ['Unit', 'kWh', 'Share'],
          rows: ZONES.map((z) => [z.label, z.kwh.toFixed(1), `${Math.round((z.kwh / zoneTotal) * 100)}%`]),
        }}>
        <DonutChart
          segments={ZONES.map((z, i) => ({
            label: z.label,
            value: z.kwh,
            color: [colors.seriesAeroGrid, colors.seriesGold, colors.seriesViolet][i],
          }))}
          unit="kWh"
          centerCaption="this week"
        />
      </ChartCard>

      <View style={styles.tiles}>
        <Tile value={(year.co2AvoidedKg / 1000).toFixed(1)} unit=" t" label="CO₂ avoided / yr" />
        <Tile value={(year.savedKwh / 1000).toFixed(2)} unit=" MWh" label="Energy saved / yr" />
        <Tile value="0" unit=" g" label="Refrigerant gas" />
      </View>

      <Text style={styles.footnote}>
        Estimates assume {money(ASSUMPTIONS.pricePerKwh, 2)}/kWh, a {ASSUMPTIONS.splitSystemKw} kW split system and a{' '}
        {money(ASSUMPTIONS.unitPrice)} AeroGrid unit.
      </Text>
    </Screen>
  );
}

function Kpi({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <View style={styles.kpi}>
      <Text style={[styles.kpiValue, accent && { color: colors.cool }]}>{value}</Text>
      <Text style={ui.muted}>{label}</Text>
    </View>
  );
}

function Tile({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileValue}>
        {value}
        <Text style={styles.tileUnit}>{unit}</Text>
      </Text>
      <Text style={ui.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 4 },
  heroValue: { fontFamily: fonts.display, fontSize: 52, lineHeight: 56, letterSpacing: -2, color: colors.text },
  heroUnit: { fontFamily: fonts.display, fontSize: 18, letterSpacing: 0, color: colors.cool },
  heroSub: { fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary },
  kpis: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpi: {
    flexGrow: 1,
    flexBasis: '45%',
    gap: 2,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  kpiValue: { fontFamily: fonts.displaySemiBold, fontSize: 22, color: colors.text },
  chartWrap: { gap: 10 },
  readoutDay: { fontFamily: fonts.bodySemiBold, color: colors.text },
  plotRow: { flexDirection: 'row', gap: 8, height: BAR_HEIGHT },
  yAxis: { width: 18 },
  yLabel: { position: 'absolute', right: 0, fontFamily: fonts.body, fontSize: 10, lineHeight: 12, color: colors.textMuted },
  plot: { flex: 1 },
  gridline: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderTopColor: colors.border },
  baseline: { borderTopColor: '#3A4656' },
  columns: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, flexDirection: 'row', gap: 4 },
  column: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
    borderRadius: 8,
    paddingBottom: 1,
  },
  columnSelected: { backgroundColor: colors.surfaceRaised },
  bar: { width: 11, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  xAxis: { flexDirection: 'row', gap: 4, paddingLeft: 26 },
  xLabel: { flex: 1, textAlign: 'center', fontFamily: fonts.body, fontSize: 11, color: colors.textMuted },
  xLabelSelected: { fontFamily: fonts.bodySemiBold, color: colors.text },
  tiles: { flexDirection: 'row', gap: 10 },
  tile: {
    flex: 1,
    gap: 2,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tileValue: { fontFamily: fonts.displaySemiBold, fontSize: 20, color: colors.text },
  tileUnit: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  footnote: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16, color: colors.textMuted },
});
