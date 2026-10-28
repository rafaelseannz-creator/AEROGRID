import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Screen, styles as ui } from '@/components/ui';
import { colors, fonts, radius } from '@/constants/theme';
import { ASSUMPTIONS, WEEK, summarise } from '@/lib/energy';

const CHART_HEIGHT = 128;
const AXIS_MAX_KWH = 20;
const PX_PER_KWH = (CHART_HEIGHT - 12) / AXIS_MAX_KWH;
const GRIDLINES = [20, 10, 0];

export default function EnergyScreen() {
  const [selected, setSelected] = useState(WEEK.length - 1);
  const [showTable, setShowTable] = useState(false);
  const week = summarise(WEEK);
  const day = WEEK[selected];

  return (
    <Screen eyebrow="Last 7 days" title="Energy & Savings">
      <View style={styles.hero}>
        <Text style={styles.heroValue}>
          ${week.savedDollars.toFixed(2)} <Text style={styles.heroUnit}>saved</Text>
        </Text>
        <Text style={styles.heroSub}>
          {week.savedKwh.toFixed(1)} kWh less than a typical split system running the same hours
        </Text>
      </View>

      <Card style={styles.chartCard}>
        <View style={styles.between}>
          <Text style={ui.cardTitle}>Daily energy use</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showTable ? 'Show chart' : 'Show table'}
            onPress={() => setShowTable(!showTable)}
            hitSlop={6}
            style={styles.viewToggle}>
            <Text style={styles.viewToggleText}>{showTable ? 'Chart' : 'Table'}</Text>
          </Pressable>
        </View>
        <View style={styles.legend}>
          <LegendItem color={colors.seriesAeroGrid} label="AeroGrid" />
          <LegendItem color={colors.seriesSplit} label="Split system (est.)" />
        </View>

        {showTable ? (
          <View accessibilityRole="list">
            <View style={styles.tableRow}>
              <Text style={[styles.th, styles.tableDay]}>Day</Text>
              <Text style={styles.th}>AeroGrid kWh</Text>
              <Text style={styles.th}>Split kWh</Text>
            </View>
            {WEEK.map((d) => (
              <View key={d.short} style={[styles.tableRow, styles.tableBorder]}>
                <Text style={[styles.td, styles.tableDay]}>{d.label}</Text>
                <Text style={styles.td}>{d.aeroKwh.toFixed(1)}</Text>
                <Text style={styles.td}>{d.splitKwh.toFixed(1)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.chartWrap}>
            <Text style={ui.muted} accessibilityLiveRegion="polite">
              <Text style={styles.readoutDay}>{day.label}</Text> · AeroGrid {day.aeroKwh.toFixed(1)} kWh · Split
              system {day.splitKwh.toFixed(1)} kWh
            </Text>
            <View style={styles.plotRow}>
              <View style={styles.yAxis}>
                {GRIDLINES.map((v) => (
                  <Text key={v} style={[styles.yLabel, { bottom: v * PX_PER_KWH - 6 }]}>
                    {v}
                  </Text>
                ))}
              </View>
              <View style={styles.plot}>
                {GRIDLINES.map((v) => (
                  <View
                    key={v}
                    style={[styles.gridline, { bottom: v * PX_PER_KWH }, v === 0 && styles.baseline]}
                  />
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
        )}
      </Card>

      <View style={styles.tiles}>
        <Tile value={week.aeroKwh.toFixed(1)} unit=" kWh" label="Used" />
        <Tile value={week.co2AvoidedKg.toFixed(1)} unit=" kg" label="CO₂ avoided" />
        <Tile value="0" unit=" g" label="Refrigerant gas" />
      </View>

      <Text style={styles.footnote}>
        Estimates assume ${ASSUMPTIONS.pricePerKwh.toFixed(2)}/kWh and a {ASSUMPTIONS.splitSystemKw} kW split system.
      </Text>
    </Screen>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
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
  chartCard: { gap: 12 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewToggle: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
  },
  viewToggleText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textSecondary },
  legend: { flexDirection: 'row', gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary },
  chartWrap: { gap: 10 },
  readoutDay: { fontFamily: fonts.bodySemiBold, color: colors.text },
  plotRow: { flexDirection: 'row', gap: 8, height: CHART_HEIGHT },
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
  tableRow: { flexDirection: 'row', paddingVertical: 5 },
  tableBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  tableDay: { textAlign: 'left' },
  th: { flex: 1, textAlign: 'right', fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textMuted },
  td: { flex: 1, textAlign: 'right', fontFamily: fonts.body, fontSize: 12, color: colors.text },
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
