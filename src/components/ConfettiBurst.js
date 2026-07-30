import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../theme';

const NUM_PARTICLES = 28;

function buildParticles() {
  return Array.from({ length: NUM_PARTICLES }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 160;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance - 40,
      rotation: (Math.random() - 0.5) * 900,
      size: 6 + Math.random() * 9,
      color: colors.confetti[i % colors.confetti.length],
      delay: Math.random() * 0.25,
      isSquare: Math.random() > 0.5,
    };
  });
}

function ConfettiParticle({ progress, config }) {
  const style = useAnimatedStyle(() => {
    const p = interpolate(
      progress.value,
      [config.delay, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateX = config.dx * p;
    const translateY = config.dy * p + 200 * p * p;
    const scale = interpolate(p, [0, 0.15, 1], [0, 1, 1], Extrapolation.CLAMP);
    const opacity = interpolate(
      p,
      [0, 0.1, 0.65, 1],
      [0, 1, 1, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        { translateX },
        { translateY },
        { rotate: `${config.rotation * p}deg` },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          width: config.size,
          height: config.isSquare ? config.size : config.size * 0.42,
          borderRadius: config.isSquare ? 2 : config.size,
          backgroundColor: config.color,
        },
      ]}
    />
  );
}

export default function ConfettiBurst({ trigger }) {
  const progress = useSharedValue(0);
  const particles = useMemo(() => buildParticles(), []);

  useEffect(() => {
    if (trigger > 0) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 1050,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [trigger]);

  return (
    <View style={styles.overlay} pointerEvents="none">
      {particles.map((config, i) => (
        <ConfettiParticle key={i} progress={progress} config={config} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
});
