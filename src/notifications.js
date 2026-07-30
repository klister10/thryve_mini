import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const SCHEDULED_KEY = 'thryve_mini_daily_reminder_scheduled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupDailyReminder() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-task', {
      name: 'Daily task reminder',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return;
  }

  const alreadyScheduled = await AsyncStorage.getItem(SCHEDULED_KEY);
  if (alreadyScheduled) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your daily task is waiting 🌱',
      body: "Take less than 10 minutes to nurture a connection today.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 17,
      minute: 30,
    },
  });

  await AsyncStorage.setItem(SCHEDULED_KEY, 'true');
}
