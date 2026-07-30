import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import DashboardScreen from './src/screens/DashboardScreen';
import TaskScreen from './src/screens/TaskScreen';
import { getIsTodayComplete, getTodayTask, markTodayComplete } from './src/utils/dailyTask';
import { setupDailyReminder } from './src/notifications';
import { paperTheme, colors } from './src/theme';

export default function App() {
  const [isComplete, setIsComplete] = useState(false);
  const [screen, setScreen] = useState('dashboard');
  const [celebrateKey, setCelebrateKey] = useState(0);
  const todayTask = getTodayTask();

  useEffect(() => {
    getIsTodayComplete().then(setIsComplete);
    setupDailyReminder();
  }, []);

  const handleOpenTask = useCallback(() => setScreen('task'), []);
  const handleCloseTask = useCallback(() => setScreen('dashboard'), []);

  const handleCompleteTask = useCallback(async () => {
    await markTodayComplete();
    setIsComplete(true);
    setCelebrateKey((k) => k + 1);
    setScreen('dashboard');
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
            <DashboardScreen
              isComplete={isComplete}
              onOpenTask={handleOpenTask}
              confettiTrigger={celebrateKey}
            />
            {screen === 'task' && (
              <Animated.View
                entering={SlideInDown.springify().damping(18).mass(0.7)}
                exiting={SlideOutDown.duration(260)}
                style={StyleSheet.absoluteFill}
              >
                <TaskScreen
                  task={todayTask}
                  isComplete={isComplete}
                  onClose={handleCloseTask}
                  onComplete={handleCompleteTask}
                />
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
