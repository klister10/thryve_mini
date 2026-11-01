import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DailyTaskCard from '../components/DailyTaskCard';
import { colors } from '../theme';

export default function DashboardScreen({ isComplete, onOpenTask, confettiTrigger, onReset }) {
  return (
    <View style={styles.root}>
      {/* Fills the whole screen, so the card is centered on the screen, not the space under the header. */}
      <View style={styles.body} pointerEvents="box-none">
        <DailyTaskCard
          isComplete={isComplete}
          onPress={onOpenTask}
          onLongPress={onReset}
          confettiTrigger={confettiTrigger}
        />
      </View>

      <SafeAreaView edges={['top']} pointerEvents="box-none">
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Make room for connection</Text>
            <Text style={styles.greeting}>Hey there! 👋</Text>
          </View>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={26} color={colors.text} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentText,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  greeting: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
