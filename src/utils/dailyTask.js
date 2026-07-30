import AsyncStorage from '@react-native-async-storage/async-storage';

import { dummyTasks } from '../data/tasks';

const LAST_COMPLETED_KEY = 'thryve_mini_last_completed_date';

// Local (not UTC) date key, so "today" matches the device's calendar day.
export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Deterministic per-day pick, cycling through every task before repeating.
export function getTodayTask(date = new Date()) {
  const index = dayOfYear(date) % dummyTasks.length;
  return dummyTasks[index];
}

export async function getIsTodayComplete(date = new Date()) {
  const stored = await AsyncStorage.getItem(LAST_COMPLETED_KEY);
  return stored === todayKey(date);
}

export async function markTodayComplete(date = new Date()) {
  await AsyncStorage.setItem(LAST_COMPLETED_KEY, todayKey(date));
}
