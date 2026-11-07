import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../theme';

// Dashboard card that launches the 3-question loneliness check-in.
export default function LonelinessQuizCard({ onPress }) {
  const press = useSharedValue(1);
  const breathe = useSharedValue(0);
  const nudge = useSharedValue(0);

  useEffect(() => {
    // Gentle heartbeat on the icon and a small nudge on the arrow invite a tap.
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    nudge.value = withRepeat(
      withSequence(
        withTiming(4, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathe.value * 0.12 }],
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: nudge.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => {
        press.value = withSpring(0.96, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        press.value = withSpring(1, { damping: 12, stiffness: 260 });
      }}
      accessibilityRole="button"
      accessibilityLabel="Connection check-in. Take a 3 question quiz"
    >
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.iconWrap}>
          <Animated.View style={heartStyle}>
            <MaterialCommunityIcons name="heart-outline" size={32} color={colors.accent} />
          </Animated.View>
        </View>

        <View style={styles.textCol}>
          <Text style={styles.title}>Connection check-in</Text>
          <Text style={styles.subtitle}>3 quick questions · about a minute</Text>
        </View>

        <View style={styles.arrow}>
          <Animated.View style={arrowStyle}>
            <MaterialCommunityIcons name="arrow-right" size={22} color={colors.onPrimary} />
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.sage,
    padding: 16,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
