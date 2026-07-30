import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DailyTaskRing from '../components/DailyTaskRing';
import ConfettiBurst from '../components/ConfettiBurst';
import { colors } from '../theme';

export default function DashboardScreen({ isComplete, onOpenTask, confettiTrigger }) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Thryve Mini</Text>
          <Text style={styles.greeting}>Hey there 👋</Text>
        </View>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account" size={26} color={colors.coral} />
        </View>
      </View>

      <View style={styles.body}>
        <DailyTaskRing isComplete={isComplete} onPress={onOpenTask} />
        <Text style={styles.ringLabel}>Daily Task</Text>
        <Text style={styles.ringHint}>
          {isComplete ? 'All done for today. Nice work! 🎉' : 'Tap to see today’s task'}
        </Text>
      </View>

      <ConfettiBurst trigger={confettiTrigger} />
    </SafeAreaView>
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
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.coralSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  ringHint: {
    marginTop: 6,
    fontSize: 15,
    color: colors.textMuted,
  },
});
