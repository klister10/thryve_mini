import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DailyTaskCard from '../components/DailyTaskCard';
import LonelinessQuizCard from '../components/LonelinessQuizCard';
import { colors } from '../theme';

// Header row height plus breathing room, below the top safe-area inset.
const HEADER_HEIGHT = 80;

export default function DashboardScreen({
  isComplete,
  onOpenTask,
  onOpenQuiz,
  confettiTrigger,
  onReset,
}) {
  const insets = useSafeAreaInsets();
  // Same padding top and bottom keeps the cards centered in the whole viewport,
  // while still clearing the header overlay when the screen is short and scrolls.
  const edgePadding = insets.top + HEADER_HEIGHT;

  return (
    <View style={styles.root}>
      <ScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={[
          styles.body,
          { paddingTop: edgePadding, paddingBottom: edgePadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <DailyTaskCard
          isComplete={isComplete}
          onPress={onOpenTask}
          onLongPress={onReset}
          confettiTrigger={confettiTrigger}
        />
        <View style={styles.quizWrap}>
          <LonelinessQuizCard onPress={onOpenQuiz} />
        </View>
      </ScrollView>

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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  quizWrap: {
    marginTop: 16,
  },
});
