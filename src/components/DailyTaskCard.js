import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import ConfettiBurst from './ConfettiBurst';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme';

const BURST = 124;
const CIRCLE = 68;
const POINTS = 14;
const INNER_RATIO = 0.82;

function starPoints() {
  const c = BURST / 2;
  const outer = BURST / 2 - 2;
  const inner = outer * INNER_RATIO;
  const pts = [];
  for (let i = 0; i < POINTS * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / POINTS - Math.PI / 2;
    pts.push(`${c + r * Math.cos(a)},${c + r * Math.sin(a)}`);
  }
  return pts.join(' ');
}

const STAR = starPoints();

export default function DailyTaskCard({ isComplete, onPress, onLongPress, confettiTrigger }) {
  const isFirstRun = useRef(true);
  const progress = useSharedValue(isComplete ? 1 : 0);
  const checkScale = useSharedValue(isComplete ? 1 : 0);
  const spin = useSharedValue(0);
  const breathe = useSharedValue(0);
  const pop = useSharedValue(1);
  const bounce = useSharedValue(1);

  useEffect(() => {
    const first = isFirstRun.current;
    isFirstRun.current = false;

    if (isComplete) {
      breathe.value = withTiming(0, { duration: 200 });
      if (first) {
        // Already done today: show the finished state without replaying it.
        progress.value = 1;
        checkScale.value = 1;
        return;
      }
      progress.value = withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) });
      spin.value = withTiming(spin.value + 150, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      });
      pop.value = withDelay(
        120,
        withSequence(
          withTiming(1.12, { duration: 140, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 220, easing: Easing.inOut(Easing.quad) })
        )
      );
      checkScale.value = withDelay(
        220,
        withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) })
      );
      bounce.value = withDelay(
        200,
        withSequence(
          withTiming(1.02, { duration: 120, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 200, easing: Easing.inOut(Easing.quad) })
        )
      );
    } else {
      progress.value = withTiming(0, { duration: 250 });
      checkScale.value = withTiming(0, { duration: 150 });
      // Slow idle spin and a gentle breathe invite a tap.
      spin.value = withRepeat(
        withTiming(spin.value + 360, { duration: 24000, easing: Easing.linear }),
        -1,
        false
      );
      breathe.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const cardStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.amber, colors.sage]),
    transform: [{ scale: bounce.value }],
  }));

  const starStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${spin.value}deg` },
      { scale: pop.value * (1 + breathe.value * 0.03) },
    ],
  }));

  // Done-state sunburst sits on top of the orange one and fades in.
  const doneStarStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const spaStyle = useAnimatedStyle(() => ({
    opacity: 1 - checkScale.value,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, checkScale.value * 4),
    transform: [{ scale: checkScale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <>
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.row}>
          <View style={styles.titleCol}>
            <View style={styles.dots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.title}>{'Daily\nTask'}</Text>
            <Text style={styles.status}>
              {isComplete ? 'All done. Nice work! 🎉' : 'Less than 10 minutes'}
            </Text>
          </View>

          <View style={styles.burst}>
            <Animated.View style={[styles.star, starStyle]}>
              <Svg width={BURST} height={BURST} style={styles.starSvg}>
                <Polygon points={STAR} fill={colors.accent} />
              </Svg>
              <Animated.View style={[styles.starSvg, doneStarStyle]}>
                <Svg width={BURST} height={BURST}>
                  <Polygon points={STAR} fill={colors.primary} />
                </Svg>
              </Animated.View>
            </Animated.View>
            <View style={styles.circle}>
              <Animated.View style={[styles.iconLayer, spaStyle]}>
                <MaterialCommunityIcons name="spa-outline" size={34} color={colors.primary} />
              </Animated.View>
              <Animated.View style={[styles.iconLayer, checkStyle]}>
                <MaterialCommunityIcons name="check-bold" size={38} color={colors.success} />
              </Animated.View>
            </View>
            <ConfettiBurst trigger={confettiTrigger} />
          </View>
        </View>

        <PrimaryButton
          label={isComplete ? 'Completed today' : 'Start'}
          icon={isComplete ? 'check' : undefined}
          onPress={handlePress}
          onLongPress={onLongPress}
          accessibilityLabel={isComplete ? 'Daily task complete, view task' : 'Start daily task'}
          style={styles.buttonWrap}
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  titleCol: {
    flex: 1,
    paddingRight: 8,
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 4,
  },
  title: {
    fontSize: 40,
    lineHeight: 42,
    fontWeight: '800',
    color: colors.text,
  },
  status: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  burst: {
    width: BURST,
    height: BURST,
  },
  star: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BURST,
    height: BURST,
  },
  starSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: BURST,
    height: BURST,
  },
  circle: {
    position: 'absolute',
    top: (BURST - CIRCLE) / 2,
    left: (BURST - CIRCLE) / 2,
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: colors.background,
  },
  iconLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CIRCLE,
    height: CIRCLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrap: {
    zIndex: 1,
    marginTop: 20,
  },
});
