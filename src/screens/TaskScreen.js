import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { colors } from '../theme';

export default function TaskScreen({ task, isComplete, onClose, onComplete }) {
  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton icon="close" size={26} onPress={onClose} iconColor={colors.text} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(380).springify()}>
          <View style={[styles.badge, isComplete && styles.badgeComplete]}>
            <MaterialCommunityIcons
              name="spa-outline"
              size={22}
              color={isComplete ? colors.success : colors.coral}
            />
            <Text style={[styles.badgeText, isComplete && styles.badgeTextComplete]}>
              Today's task
            </Text>
          </View>
          <Text style={styles.title}>{task.title}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(420).delay(80).springify()}>
          <Text style={styles.body}>{task.text}</Text>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        {isComplete ? (
          <View style={styles.doneRow}>
            <MaterialCommunityIcons name="check-circle" size={22} color={colors.success} />
            <Text style={styles.doneText}>Completed today — see you tomorrow!</Text>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={handleComplete}
            buttonColor={colors.coral}
            textColor="#FFFFFF"
            contentStyle={styles.buttonContent}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Mark as Done
          </Button>
        )}
      </View>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 40,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.coralSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeComplete: {
    backgroundColor: colors.successSoft,
  },
  badgeTextComplete: {
    color: colors.success,
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: colors.coral,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 36,
  },
  body: {
    marginTop: 20,
    fontSize: 17,
    lineHeight: 26,
    color: colors.text,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    paddingTop: 8,
  },
  button: {
    borderRadius: 999,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  doneText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
