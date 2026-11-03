import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { Card, styles as ui } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';

export type TableData = { columns: string[]; rows: (string | number)[][] };

// A chart card with a title, optional legend and a chart/table toggle.
export function ChartCard({
  title,
  subtitle,
  legend,
  table,
  children,
}: {
  title: string;
  subtitle?: string;
  legend?: { label: string; color: string }[];
  table: TableData;
  children: ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);

  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <View style={ui.flex}>
          <Text style={ui.cardTitle}>{title}</Text>
          {subtitle && <Text style={ui.small}>{subtitle}</Text>}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={showTable ? `Show ${title} as a chart` : `Show ${title} as a table`}
          onPress={() => setShowTable(!showTable)}
          hitSlop={6}
          style={styles.toggle}>
          <Text style={styles.toggleText}>{showTable ? 'Chart' : 'Table'}</Text>
        </Pressable>
      </View>
      {legend && legend.length > 1 && <Legend items={legend} />}
      {showTable ? <DataTable data={table} /> : children}
    </Card>
  );
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <View style={styles.legend}>
      {items.map((item) => (
        <View key={item.label} style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: item.color }]} />
          <Text style={styles.legendText}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function DataTable({ data }: { data: TableData }) {
  return (
    <View accessibilityRole="list">
      <View style={styles.tableRow}>
        {data.columns.map((c, i) => (
          <Text key={c} style={[styles.th, i === 0 && styles.cellFirst]}>
            {c}
          </Text>
        ))}
      </View>
      {data.rows.map((row) => (
        <View key={String(row[0])} style={[styles.tableRow, styles.tableBorder]}>
          {row.map((cell, i) => (
            <Text key={i} style={[styles.td, i === 0 && styles.cellFirst]}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

type Series = { label: string; color: string; values: number[] };

const LINE_HEIGHT = 150;
const TOP_PAD = 10;
const Y_AXIS_W = 40;

// Line chart with gridlines, an optional dashed reference line and a tap/hover readout.
export function LineChart({
  series,
  labels,
  fullLabels = labels,
  yMax,
  yTicks,
  format,
  formatAxis = format,
  reference,
  area = false,
  labelEvery = 1,
}: {
  series: Series[];
  labels: string[];
  fullLabels?: string[];
  yMax: number;
  yTicks: number[];
  format: (value: number) => string;
  formatAxis?: (value: number) => string;
  reference?: { value: number; label: string };
  area?: boolean;
  labelEvery?: number;
}) {
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState(labels.length - 1);
  const plotW = Math.max(0, width - Y_AXIS_W);
  const n = labels.length;
  const inset = plotW / n / 2;
  const x = (i: number) => inset + (i * (plotW - inset * 2)) / Math.max(1, n - 1);
  const y = (v: number) => LINE_HEIGHT - (v / yMax) * (LINE_HEIGHT - TOP_PAD);
  const linePath = (values: number[]) => values.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ');

  return (
    <View style={styles.chart} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
      <Text style={ui.muted} accessibilityLiveRegion="polite">
        <Text style={styles.readoutLabel}>{fullLabels[selected]}</Text>
        {series.map((s) => ` · ${series.length > 1 ? `${s.label} ` : ''}${format(s.values[selected])}`).join('')}
      </Text>
      <View style={styles.plotRow}>
        <View style={styles.yAxis}>
          {yTicks.map((t) => (
            <Text key={t} style={[styles.yLabel, { top: y(t) - 6 }]}>
              {formatAxis(t)}
            </Text>
          ))}
        </View>
        {plotW > 0 && (
          <View style={{ width: plotW, height: LINE_HEIGHT }}>
            <Svg width={plotW} height={LINE_HEIGHT}>
              {yTicks.map((t) => (
                <Line key={t} x1={0} x2={plotW} y1={y(t)} y2={y(t)} stroke={t === 0 ? '#3A4656' : colors.border} strokeWidth={1} />
              ))}
              {reference && (
                <Line
                  x1={0}
                  x2={plotW}
                  y1={y(reference.value)}
                  y2={y(reference.value)}
                  stroke={colors.textMuted}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              )}
              {area && series[0] && (
                <Path
                  d={`${linePath(series[0].values)} L${x(n - 1)} ${y(0)} L${x(0)} ${y(0)} Z`}
                  fill={series[0].color}
                  fillOpacity={0.14}
                />
              )}
              <Line x1={x(selected)} x2={x(selected)} y1={TOP_PAD} y2={y(0)} stroke={colors.borderStrong} strokeWidth={1} />
              {series.map((s) => (
                <Path key={s.label} d={linePath(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              ))}
              {series.map((s) => (
                <Circle key={s.label} cx={x(selected)} cy={y(s.values[selected])} r={4.5} fill={s.color} stroke={colors.surface} strokeWidth={2} />
              ))}
            </Svg>
            {reference && (
              <Text style={[styles.refLabel, { top: y(reference.value) - 17 }]}>{reference.label}</Text>
            )}
            <View style={styles.hitRow}>
              {labels.map((l, i) => (
                <Pressable
                  key={l + i}
                  accessibilityRole="button"
                  accessibilityLabel={`${fullLabels[i]}: ${series.map((s) => `${s.label} ${format(s.values[i])}`).join(', ')}`}
                  onPress={() => setSelected(i)}
                  onHoverIn={() => setSelected(i)}
                  style={ui.flex}
                />
              ))}
            </View>
          </View>
        )}
      </View>
      <View style={styles.xAxis}>
        {labels.map((l, i) => (
          <Text key={l + i} style={[styles.xLabel, i === selected && styles.xLabelSelected]}>
            {i % labelEvery === 0 || i === selected ? l : ''}
          </Text>
        ))}
      </View>
    </View>
  );
}

const DONUT_SIZE = 132;
const DONUT_STROKE = 18;
const DONUT_R = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_C = 2 * Math.PI * DONUT_R;
const SEGMENT_GAP = 2;

// Donut chart with a pressable legend; the centre shows the total or the selected segment.
export function DonutChart({
  segments,
  unit,
  centerCaption,
}: {
  segments: { label: string; value: number; color: string }[];
  unit: string;
  centerCaption: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const arcs = segments.map((s, i) => ({
    ...s,
    len: (s.value / total) * DONUT_C,
    offset: (segments.slice(0, i).reduce((sum, p) => sum + p.value, 0) / total) * DONUT_C,
  }));
  const focus = selected === null ? null : segments[selected];

  return (
    <View style={styles.donutRow}>
      <View style={styles.donut}>
        <View style={styles.donutSvg}>
          <Svg width={DONUT_SIZE} height={DONUT_SIZE}>
            {arcs.map((a, i) => (
              <Circle
                key={a.label}
                cx={DONUT_SIZE / 2}
                cy={DONUT_SIZE / 2}
                r={DONUT_R}
                fill="none"
                stroke={a.color}
                strokeWidth={DONUT_STROKE}
                strokeDasharray={`${Math.max(0, a.len - SEGMENT_GAP)} ${DONUT_C}`}
                strokeDashoffset={-a.offset}
                opacity={selected === null || selected === i ? 1 : 0.35}
              />
            ))}
          </Svg>
        </View>
        <View style={styles.donutCenter} pointerEvents="none">
          <Text style={styles.donutValue}>
            {(focus ? focus.value : total).toFixed(1)}
            <Text style={styles.donutUnit}>{` ${unit}`}</Text>
          </Text>
          <Text style={styles.donutCaption}>{focus ? focus.label : centerCaption}</Text>
        </View>
      </View>
      <View style={styles.donutLegend}>
        {segments.map((s, i) => (
          <Pressable
            key={s.label}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === i }}
            accessibilityLabel={`${s.label}: ${s.value.toFixed(1)} ${unit}, ${Math.round((s.value / total) * 100)} percent`}
            onPress={() => setSelected(selected === i ? null : i)}
            onHoverIn={() => setSelected(i)}
            onHoverOut={() => setSelected(null)}
            style={[styles.donutLegendRow, selected === i && styles.donutLegendRowOn]}>
            <View style={[styles.swatch, { backgroundColor: s.color }]} />
            <View style={ui.flex}>
              <Text style={styles.donutLegendLabel}>{s.label}</Text>
              <Text style={ui.muted}>
                {s.value.toFixed(1)} {unit}
              </Text>
            </View>
            <Text style={styles.donutPct}>{Math.round((s.value / total) * 100)}%</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// Small trend line without axes, for summary cards.
export function Sparkline({ values, color, width = 96, height = 36 }: { values: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...values);
  const pts = values.map((v, i) => `${i ? 'L' : 'M'}${(i / (values.length - 1)) * (width - 4) + 2} ${height - 2 - (v / max) * (height - 6)}`);
  return (
    <Svg width={width} height={height} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Path d={`${pts.join(' ')} L${width - 2} ${height} L2 ${height} Z`} fill={color} fillOpacity={0.14} />
      <Path d={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  toggle: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    justifyContent: 'center',
  },
  toggleText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textSecondary },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary },
  tableRow: { flexDirection: 'row', paddingVertical: 5 },
  tableBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  cellFirst: { textAlign: 'left' },
  th: { flex: 1, textAlign: 'right', fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textMuted },
  td: { flex: 1, textAlign: 'right', fontFamily: fonts.body, fontSize: 12, color: colors.text },
  chart: { gap: 10 },
  readoutLabel: { fontFamily: fonts.bodySemiBold, color: colors.text },
  plotRow: { flexDirection: 'row', height: LINE_HEIGHT },
  yAxis: { width: Y_AXIS_W },
  yLabel: {
    position: 'absolute',
    right: 8,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textMuted,
  },
  refLabel: {
    position: 'absolute',
    left: 6,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  hitRow: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, flexDirection: 'row' },
  xAxis: { flexDirection: 'row', paddingLeft: Y_AXIS_W },
  xLabel: { flex: 1, textAlign: 'center', fontFamily: fonts.body, fontSize: 10, color: colors.textMuted },
  xLabelSelected: { fontFamily: fonts.bodySemiBold, color: colors.text },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  donut: { width: DONUT_SIZE, height: DONUT_SIZE },
  donutSvg: { transform: [{ rotate: '-90deg' }] },
  donutCenter: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  donutValue: { fontFamily: fonts.displaySemiBold, fontSize: 20, color: colors.text },
  donutUnit: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted },
  donutCaption: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted, textAlign: 'center' },
  donutLegend: { flex: 1, gap: 4 },
  donutLegendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10 },
  donutLegendRowOn: { backgroundColor: colors.surfaceRaised },
  donutLegendLabel: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.text },
  donutPct: { fontFamily: fonts.displaySemiBold, fontSize: 14, color: colors.text },
});
