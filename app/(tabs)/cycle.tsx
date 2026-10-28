import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Screen, styles as ui } from '@/components/ui';
import { colors, fonts, radius } from '@/constants/theme';
import { useAeroGrid } from '@/lib/aerogrid';
import { CYCLE_PHASES } from '@/lib/cycle';

const FEATURES = ['No compressor', 'No refrigerant gas', 'Near-silent'];

export default function CycleScreen() {
  const g = useAeroGrid();
  const current = CYCLE_PHASES[g.phase];
  const accent = current.kind === 'heat' ? colors.heat : colors.cool;

  return (
    <Screen
      eyebrow="Solid-state cooling"
      title="How AeroGrid cools"
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: g.cyclePlaying }}
          onPress={() => g.update({ cyclePlaying: !g.cyclePlaying })}
          style={styles.play}>
          <Text style={styles.playText}>{g.cyclePlaying ? 'Pause' : 'Play cycle'}</Text>
        </Pressable>
      }>
      <Card style={styles.live}>
        <View style={styles.between}>
          <Text style={ui.muted}>Live · phase {g.phase + 1} of 4</Text>
          <Text style={[styles.field, { color: accent }]}>Field {current.fieldOn ? 'ON' : 'OFF'}</Text>
        </View>
        <View style={styles.readouts} accessibilityLiveRegion="polite">
          <View style={ui.flex}>
            <Text style={[styles.readout, { color: accent }]}>{current.plateTemp.toFixed(1)}°</Text>
            <Text style={ui.muted}>Ceramic plate</Text>
          </View>
          <View style={ui.flex}>
            <Text style={styles.readout}>{g.roomTemp.toFixed(1)}°</Text>
            <Text style={ui.muted}>Room air</Text>
          </View>
        </View>
      </Card>

      <View style={styles.steps} accessibilityRole="list">
        {CYCLE_PHASES.map((p, i) => {
          const on = i === g.phase;
          const kindColor = p.kind === 'heat' ? colors.heat : colors.cool;
          return (
            <Pressable
              key={p.title}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`Phase ${i + 1}, ${p.title}. ${p.body}`}
              onPress={() => g.update({ phase: i, cyclePlaying: false })}
              style={[styles.step, on && styles.stepOn]}>
              <View style={[styles.stepDot, { backgroundColor: on ? kindColor : colors.surfaceRaised }]}>
                <Text style={[styles.stepNum, { color: on ? colors.coolInk : kindColor }]}>{i + 1}</Text>
              </View>
              <View style={styles.stepText}>
                <View style={styles.stepTitleRow}>
                  <Text style={styles.stepTitle}>{p.title}</Text>
                  <Text style={[styles.tag, { color: kindColor }]}>{p.kind.toUpperCase()}</Text>
                </View>
                <Text style={styles.stepBody}>{p.body}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chips}>
        {FEATURES.map((f) => (
          <Text key={f} style={styles.chip}>
            {f}
          </Text>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  play: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  playText: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.text },
  live: { gap: 12 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  field: { fontFamily: fonts.bodySemiBold, fontSize: 12 },
  readouts: { flexDirection: 'row', gap: 10 },
  readout: { fontFamily: fonts.display, fontSize: 34, letterSpacing: -1, color: colors.text },
  steps: { gap: 6 },
  step: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  stepOn: { backgroundColor: colors.surface, borderColor: colors.borderStrong },
  stepDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontFamily: fonts.displayBold, fontSize: 14 },
  stepText: { flex: 1, gap: 3 },
  stepTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.text },
  tag: { fontFamily: fonts.bodySemiBold, fontSize: 11 },
  stepBody: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
});
