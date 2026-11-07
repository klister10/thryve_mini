import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Animated, { Easing, withTiming } from 'react-native-reanimated';

import DashboardScreen from './src/screens/DashboardScreen';
import TaskScreen from './src/screens/TaskScreen';
import LonelinessQuizScreen from './src/screens/LonelinessQuizScreen';
import * as Haptics from 'expo-haptics';
import {
  getIsTodayComplete,
  getTodayTask,
  markTodayComplete,
  resetToday,
} from './src/utils/dailyTask';
import { setupDailyReminder } from './src/notifications';
import { paperTheme, colors } from './src/theme';

// Task sheet grows out of the center of the screen and shrinks back into it.
const openFromCenter = () => {
  'worklet';
  return {
    initialValues: { opacity: 0, transform: [{ scale: 0.85 }] },
    animations: {
      opacity: withTiming(1, { duration: 260, easing: Easing.out(Easing.quad) }),
      transform: [
        { scale: withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) }) },
      ],
    },
  };
};

const closeToCenter = () => {
  'worklet';
  return {
    initialValues: { opacity: 1, transform: [{ scale: 1 }] },
    animations: {
      opacity: withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) }),
      transform: [
        { scale: withTiming(0.92, { duration: 220, easing: Easing.in(Easing.cubic) }) },
      ],
    },
  };
};

export default function App() {
  // null until storage is read, so the card never animates a state it already had.
  const [isComplete, setIsComplete] = useState(null);
  const [screen, setScreen] = useState('dashboard');
  const [celebrateKey, setCelebrateKey] = useState(0);
  const todayTask = getTodayTask();

  useEffect(() => {
    getIsTodayComplete().then(setIsComplete);
    setupDailyReminder();
  }, []);

  const handleOpenTask = useCallback(() => setScreen('task'), []);
  const handleCloseTask = useCallback(() => setScreen('dashboard'), []);
  const handleOpenQuiz = useCallback(() => setScreen('quiz'), []);
  const handleCloseQuiz = useCallback(() => setScreen('dashboard'), []);

  const handleCompleteTask = useCallback(async () => {
    await markTodayComplete();
    setIsComplete(true);
    setCelebrateKey((k) => k + 1);
    setScreen('dashboard');
  }, []);

  const handleReset = useCallback(async () => {
    await resetToday();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setIsComplete(false);
  }, []);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <PaperProvider
          theme={paperTheme}
          settings={{ icon: (props) => <MaterialCommunityIcons {...props} /> }}
        >
          <StatusBar style="dark" />
          <View style={styles.root}>
            {isComplete !== null && (
              <DashboardScreen
                isComplete={isComplete}
                onOpenTask={handleOpenTask}
                onOpenQuiz={handleOpenQuiz}
                confettiTrigger={celebrateKey}
                onReset={__DEV__ ? handleReset : undefined}
              />
            )}
            {screen === 'task' && (
              <Animated.View
                entering={openFromCenter}
                exiting={closeToCenter}
                style={StyleSheet.absoluteFill}
              >
                <TaskScreen
                  task={todayTask}
                  isComplete={!!isComplete}
                  onClose={handleCloseTask}
                  onComplete={handleCompleteTask}
                />
              </Animated.View>
            )}
            {screen === 'quiz' && (
              <Animated.View
                entering={openFromCenter}
                exiting={closeToCenter}
                style={StyleSheet.absoluteFill}
              >
                <LonelinessQuizScreen onClose={handleCloseQuiz} />
              </Animated.View>
            )}
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
