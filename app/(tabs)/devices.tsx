import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Card, Screen, SettingRow, Toggle, styles as ui } from '@/components/ui';
import { colors, fonts, radius } from '@/constants/theme';
import { useAeroGrid } from '@/lib/aerogrid';

export default function DevicesScreen() {
  const g = useAeroGrid();
  const running = g.units.filter((u) => u.on).length;

  return (
    <Screen eyebrow={`${running} of ${g.units.length} units running`} title="Devices & Zones">
      {g.units.map((u) => (
        <Card key={u.id} style={styles.unit}>
          <View style={styles.unitHead}>
            <View style={styles.unitIcon}>
              <Icon name="unit" color={u.on ? colors.cool : colors.textMuted} />
            </View>
            <View style={ui.flex}>
              <Text style={styles.unitName}>{u.name}</Text>
              <Text style={ui.muted}>{u.room}</Text>
            </View>
            <Toggle value={u.on} onChange={() => g.toggleUnit(u.id)} label={u.name} />
          </View>
          <View style={styles.unitStats}>
            <UnitStat label="Status" value={u.on ? 'Cooling' : u.offLabel} color={u.on ? colors.cool : colors.textSecondary} />
            <UnitStat label="Target" value={`${u.targetTemp.toFixed(1)}°`} />
            <UnitStat label="Today" value={`${u.todayKwh.toFixed(1)} kWh`} />
          </View>
        </Card>
      ))}

      <SettingRow
        title="Whole-home sync"
        body="Run every unit together as one larger system."
        value={g.syncOn}
        onChange={(syncOn) => g.update({ syncOn })}
      />

      <Pressable accessibilityRole="button" style={styles.add}>
        <View style={styles.addIcon}>
          <Icon name="plus" color={colors.coolInk} strokeWidth={2.2} />
        </View>
        <View style={ui.flex}>
          <Text style={styles.unitName}>Add an AeroGrid unit</Text>
          <Text style={ui.small}>Pair over Bluetooth. No installation, no venting hose, rental-friendly.</Text>
        </View>
      </Pressable>
    </Screen>
  );
}

function UnitStat({ label, value, color = colors.text }: { label: string; value: string; color?: string }) {
  return (
    <View style={ui.flex}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  unit: { gap: 14 },
  unitHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  unitIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitName: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.text },
  unitStats: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted },
  statValue: { fontFamily: fonts.bodySemiBold, fontSize: 13, marginTop: 2 },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#33404F',
  },
  addIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cool,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
