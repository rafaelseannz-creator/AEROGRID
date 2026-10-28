import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Card, OptionButton, Screen, SettingRow, styles as ui } from '@/components/ui';
import { colors, fonts, radius } from '@/constants/theme';
import { TEMP_MAX, TEMP_MIN, useAeroGrid, type Direction, type FanSpeed, type Mode } from '@/lib/aerogrid';

const MODES: Mode[] = ['Cool', 'Dry', 'Eco', 'Focus'];
const SPEEDS: FanSpeed[] = ['auto', 1, 2, 3, 4, 5];
const DIRECTIONS: Direction[] = ['Desk', 'Sweep', 'Wide'];
const SPEED_NOTES: Record<string, string> = {
  auto: 'Auto · adjusts to room load',
  1: 'Whisper',
  2: 'Quiet',
  3: 'Balanced',
  4: 'Strong',
  5: 'Max boost',
};

// The dial is a 270° arc: radius 104 in a 240 viewBox.
const DIAL_R = 104;
const CIRCUMFERENCE = 2 * Math.PI * DIAL_R;
const ARC = CIRCUMFERENCE * 0.75;

export default function ClimateScreen() {
  const g = useAeroGrid();
  const fill = (g.targetTemp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN);

  return (
    <Screen eyebrow="Desk Zone" title="Climate & Airflow">
      <View style={styles.dialRow}>
        <StepButton label="−" accessibilityLabel="Lower target temperature" onPress={() => g.nudgeTarget(-0.5)} />
        <View
          style={styles.dial}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={`Target ${g.targetTemp.toFixed(1)} degrees`}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(e) => g.nudgeTarget(e.nativeEvent.actionName === 'increment' ? 0.5 : -0.5)}>
          <View style={styles.dialArc}>
            <Svg width={220} height={220} viewBox="0 0 240 240">
              <Circle
                cx={120}
                cy={120}
                r={DIAL_R}
                fill="none"
                stroke={colors.surfaceRaised}
                strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={`${ARC} ${CIRCUMFERENCE}`}
              />
              <Circle
                cx={120}
                cy={120}
                r={DIAL_R}
                fill="none"
                stroke={colors.cool}
                strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={`${ARC * fill} ${CIRCUMFERENCE}`}
              />
            </Svg>
          </View>
          <View style={styles.dialCenter} pointerEvents="none">
            <Text style={ui.muted}>Target</Text>
            <Text style={styles.dialTemp}>{g.targetTemp.toFixed(1)}°</Text>
            <Text style={styles.dialRoom}>Room {g.roomTemp.toFixed(1)}°</Text>
          </View>
        </View>
        <StepButton label="+" accessibilityLabel="Raise target temperature" onPress={() => g.nudgeTarget(0.5)} />
      </View>

      <View style={styles.segment} accessibilityRole="radiogroup" accessibilityLabel="Mode">
        {MODES.map((m) => (
          <OptionButton key={m} label={m} variant="segment" selected={g.mode === m} onPress={() => g.update({ mode: m })} />
        ))}
      </View>

      <Card style={styles.airflow}>
        <View style={styles.between}>
          <Text style={ui.cardTitle}>Fan speed</Text>
          <Text style={ui.muted}>{SPEED_NOTES[String(g.fanSpeed)]}</Text>
        </View>
        <View style={styles.optionRow}>
          {SPEEDS.map((s) => (
            <OptionButton
              key={s}
              label={s === 'auto' ? 'Auto' : String(s)}
              accessibilityLabel={s === 'auto' ? 'Auto fan speed' : `Fan speed ${s}`}
              labelFont={fonts.displaySemiBold}
              selected={g.fanSpeed === s}
              onPress={() => g.update({ fanSpeed: s })}
            />
          ))}
        </View>
        <Text style={ui.cardTitle}>Direction</Text>
        <View style={styles.optionRow}>
          {DIRECTIONS.map((d) => (
            <OptionButton key={d} label={d} selected={g.direction === d} onPress={() => g.update({ direction: d })} />
          ))}
        </View>
      </Card>

      <SettingRow
        title="Workday schedule"
        body="Mon, Tue, Wed · 9:00–17:00 · 22°"
        value={g.scheduleOn}
        onChange={(scheduleOn) => g.update({ scheduleOn })}
      />
    </Screen>
  );
}

function StepButton({ label, accessibilityLabel, onPress }: { label: string; accessibilityLabel: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={styles.step}>
      <Text style={styles.stepLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dialRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dial: { width: 220, height: 220 },
  // Start the 270° arc at the bottom-left.
  dialArc: { transform: [{ rotate: '135deg' }] },
  dialCenter: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', gap: 2 },
  dialTemp: { fontFamily: fonts.display, fontSize: 58, lineHeight: 62, letterSpacing: -2, color: colors.text },
  dialRoom: { fontFamily: fonts.body, fontSize: 12, color: colors.textSecondary },
  step: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { fontFamily: fonts.bodyMedium, fontSize: 24, lineHeight: 28, color: colors.text },
  segment: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  airflow: { gap: 14 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  optionRow: { flexDirection: 'row', gap: 6 },
});
