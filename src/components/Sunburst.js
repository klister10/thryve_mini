import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const POINTS = 14;
const INNER_RATIO = 0.82;

function starPoints(size) {
  const c = size / 2;
  const outer = size / 2 - 2;
  const inner = outer * INNER_RATIO;
  const pts = [];
  for (let i = 0; i < POINTS * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / POINTS - Math.PI / 2;
    pts.push(`${c + r * Math.cos(a)},${c + r * Math.sin(a)}`);
  }
  return pts.join(' ');
}

// The slowly spinning scalloped sunburst from the Daily Task card.
export default function Sunburst({ size, color }) {
  const spin = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(360, { duration: 24000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, styles.abs, style]}>
      <Svg width={size} height={size}>
        <Polygon points={starPoints(size)} fill={color} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  abs: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
