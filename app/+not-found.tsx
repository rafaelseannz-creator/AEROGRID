import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <Link href="/" style={styles.link}>
        Go to home screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
    backgroundColor: colors.bg,
  },
  title: { fontFamily: fonts.displaySemiBold, fontSize: 20, color: colors.text },
  link: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.cool, paddingVertical: 12 },
});
