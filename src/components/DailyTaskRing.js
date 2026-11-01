import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 248;
const STROKE_WIDTH = 18;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DailyTaskRing({ isComplete, onPress }) {
  const progress = useSharedValue(isComplete ? 1 : 0);
  const pressScale = useSharedValue(1);
  const bounce = useSharedValue(1);
  const checkScale = useSharedValue(isComplete ? 1 : 0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (isComplete) {
      pulse.value = withTiming(0, { duration: 200 });
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 420,
        easing: Easing.out(Easing.cubic),
      });
      checkScale.value = withDelay(
        240,
        withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) })
      );
      bounce.value = withDelay(
        320,
        withSequence(
          withTiming(1.05, { duration: 130, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 200, easing: Easing.inOut(Easing.quad) })
        )
      );
    } else {
      progress.value = withTiming(0, { duration: 250 });
      checkScale.value = withTiming(0, { duration: 150 });
      bounce.value = 1;
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
    stroke: interpolateColor(
      progress.value,
      [0, 1],
      [colors.coralSoft, colors.success]
    ),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value * bounce.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: isComplete ? 0 : pulse.value * 0.35,
    transform: [{ scale: 1 + pulse.value * 0.08 }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, checkScale.value * 4),
    transform: [{ scale: checkScale.value }],
  }));

  const plusStyle = useAnimatedStyle(() => ({
    opacity: 1 - checkScale.value,
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.94, { damping: 16, stiffness: 320 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, { damping: 12, stiffness: 260 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={16}
      accessibilityRole="button"
      accessibilityLabel={isComplete ? 'Daily task complete' : 'Open daily task'}
    >
      <Animated.View style={[styles.wrap, containerStyle]}>
        <Animated.View
          style={[
            styles.glow,
            glowStyle,
            { backgroundColor: colors.coral },
          ]}
        />
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.track}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE}, ${CIRCUMFERENCE}`}
            animatedProps={animatedCircleProps}
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Animated.View style={[styles.badge, badgeStyle]}>
            <MaterialCommunityIcons name="check-bold" size={104} color="#FFFFFF" />
          </Animated.View>
          <Animated.View style={plusStyle}>
            <MaterialCommunityIcons
              name="spa-outline"
              size={72}
              color={colors.coral}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Same diameter as the ring's outer edge, so the finished state is one solid circle.
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
