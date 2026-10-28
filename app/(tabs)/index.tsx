import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Card, Screen, SettingRow, styles as ui } from '@/components/ui';
import { colors, fonts, radius } from '@/constants/theme';
import { useAeroGrid } from '@/lib/aerogrid';
import { CYCLE_PHASES } from '@/lib/cycle';
import { WEEK, summarise } from '@/lib/energy';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const g = useAeroGrid();
  const today = summarise([WEEK[WEEK.length - 1]]);
  const phase = CYCLE_PHASES[g.phase];
  const statusColor = g.powerOn ? colors.cool : colors.textMuted;

  const quick: { label: string; value: string; icon: IconName; href: '/climate' | '/energy' }[] = [
    { label: 'Mode', value: g.mode, icon: 'snowflake', href: '/climate' },
    { label: 'Airflow', value: g.fanSpeed === 'auto' ? 'Auto' : `Speed ${g.fanSpeed}`, icon: 'wind', href: '/climate' },
    { label: 'Direction', value: g.direction, icon: 'arrow', href: '/climate' },
  ];

  return (
    <Screen
      eyebrow={`${greeting()}, Josh`}
      title="Desk Zone"
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={g.powerOn ? 'Turn AeroGrid off' : 'Turn AeroGrid on'}
          accessibilityState={{ selected: g.powerOn }}
          onPress={() => g.update({ powerOn: !g.powerOn })}
          style={[styles.power, g.powerOn && styles.powerOn]}>
          <Icon name="power" color={g.powerOn ? colors.coolInk : colors.textMuted} strokeWidth={2} />
        </Pressable>
      }>
      <Card style={styles.hero}>
        <View style={styles.between}>
          <Text style={styles.label}>Room now</Text>
          <View style={styles.pill}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={[styles.pillText, { color: statusColor }]}>{g.powerOn ? 'Cooling' : 'Standby'}</Text>
          </View>
        </View>
        <View style={styles.temps}>
          <Text style={styles.roomTemp}>{g.roomTemp.toFixed(1)}°</Text>
          <View style={styles.target}>
            <Text style={styles.label}>Target</Text>
            <Text style={styles.targetTemp}>{g.targetTemp.toFixed(1)}°</Text>
          </View>
        </View>
        <Text style={styles.subline}>
          {g.powerOn
            ? `Reaching target in about 12 min · ${g.humidity}% humidity`
            : `AeroGrid is on standby · ${g.humidity}% humidity`}
        </Text>
        <View style={styles.phaseBar}>
          {CYCLE_PHASES.map((p, i) => {
            const bright = p.kind === 'heat' ? colors.heat : colors.cool;
            const dim = p.kind === 'heat' ? '#5A3A26' : '#1F4E55';
            return <View key={p.title} style={[styles.phaseSeg, { backgroundColor: i === g.phase ? bright : dim }]} />;
          })}
        </View>
        <Text style={styles.label}>
          Cycle phase {g.phase + 1} of 4 · <Text style={{ color: colors.text }}>{phase.title}</Text>
        </Text>
      </Card>

      <View style={styles.quickRow}>
        {quick.map((q) => (
          <Link key={q.label} href={q.href} asChild>
            <Pressable accessibilityRole="link" accessibilityLabel={`${q.label}: ${q.value}`} style={styles.quick}>
              <Icon name={q.icon} color={colors.cool} />
              <View>
                <Text style={styles.label}>{q.label}</Text>
                <Text style={styles.quickValue}>{q.value}</Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>

      <Card style={styles.today}>
        <View style={styles.between}>
          <Text style={ui.cardTitle}>Today</Text>
          <Text style={styles.label}>vs. typical split system</Text>
        </View>
        <View style={styles.statRow}>
          <Stat value={today.aeroKwh.toFixed(1)} unit=" kWh" label="Used" />
          <Stat value={`$${today.savedDollars.toFixed(2)}`} label="Saved" accent />
          <Stat value={today.co2AvoidedKg.toFixed(1)} unit=" kg" label="CO₂ avoided" />
        </View>
      </Card>

      <SettingRow
        title="Focus cooling"
        body={g.focusOn ? 'Only your desk is cooled. Living room and kitchen are off.' : 'Cooling all connected zones.'}
        value={g.focusOn}
        onChange={(focusOn) => g.update({ focusOn })}
      />
    </Screen>
  );
}

function Stat({ value, unit, label, accent }: { value: string; unit?: string; label: string; accent?: boolean }) {
  return (
    <View style={ui.flex}>
      <Text style={[styles.statValue, accent && { color: colors.cool }]}>
        {value}
        {unit && <Text style={styles.statUnit}>{unit}</Text>}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  power: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerOn: { backgroundColor: colors.cool, borderColor: colors.cool },
  hero: { borderRadius: radius.xl, padding: 20, gap: 14 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.coolTint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontFamily: fonts.bodySemiBold, fontSize: 12 },
  temps: { flexDirection: 'row', alignItems: 'flex-end', gap: 14 },
  roomTemp: { fontFamily: fonts.display, fontSize: 76, lineHeight: 76, letterSpacing: -3, color: colors.text },
  target: { paddingBottom: 8, gap: 2 },
  targetTemp: { fontFamily: fonts.displaySemiBold, fontSize: 22, color: colors.cool },
  subline: { fontFamily: fonts.body, fontSize: 13, color: colors.textSecondary },
  phaseBar: { flexDirection: 'row', gap: 6 },
  phaseSeg: { flex: 1, height: 6, borderRadius: 3 },
  quickRow: { flexDirection: 'row', gap: 10 },
  quick: {
    flex: 1,
    gap: 10,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  quickValue: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.text },
  today: { gap: 12 },
  statRow: { flexDirection: 'row', gap: 8 },
  statValue: { fontFamily: fonts.displaySemiBold, fontSize: 22, color: colors.text },
  statUnit: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
});
