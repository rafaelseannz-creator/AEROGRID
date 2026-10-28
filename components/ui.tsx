import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, radius } from '@/constants/theme';

export function Screen({
  eyebrow,
  title,
  right,
  children,
}: {
  eyebrow: string;
  title: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.title} accessibilityRole="header">
              {title}
            </Text>
          </View>
          {right}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      hitSlop={8}
      style={[styles.track, value && styles.trackOn]}>
      <View style={[styles.knob, value && styles.knobOn]} />
    </Pressable>
  );
}

// A selectable button used in option rows (modes, fan speeds, directions).
export function OptionButton({
  label,
  selected,
  onPress,
  accessibilityLabel,
  variant = 'outlined',
  labelFont = fonts.bodySemiBold,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  variant?: 'outlined' | 'segment';
  labelFont?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.option,
        variant === 'outlined' && styles.optionOutlined,
        selected && styles.optionSelected,
      ]}>
      <Text
        style={[
          styles.optionLabel,
          { fontFamily: labelFont },
          variant === 'segment' && !selected && { color: colors.textSecondary },
          selected && { color: colors.coolInk },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SettingRow({
  title,
  body,
  value,
  onChange,
}: {
  title: string;
  body: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <Card style={styles.settingRow}>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.small}>{body}</Text>
      </View>
      <Toggle value={value} onChange={onChange} label={title} />
    </Card>
  );
}

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  headerText: { flex: 1, gap: 2 },
  eyebrow: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  title: { fontFamily: fonts.displaySemiBold, fontSize: 26, letterSpacing: -0.5, color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
  cardTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.text },
  small: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginTop: 3 },
  muted: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  track: {
    width: 52,
    height: 32,
    borderRadius: 16,
    padding: 3,
    backgroundColor: colors.borderStrong,
    justifyContent: 'center',
  },
  trackOn: { backgroundColor: colors.cool },
  knob: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.text },
  knobOn: { alignSelf: 'flex-end' },
  option: {
    flex: 1,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionOutlined: { borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface },
  optionSelected: { backgroundColor: colors.cool, borderColor: colors.cool },
  optionLabel: { fontSize: 14, color: colors.text },
});
