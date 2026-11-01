import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors } from '../theme';

// The one button style used across screens: deep green, rounded, shrinks on touch.
export default function PrimaryButton({
  label,
  icon,
  onPress,
  onLongPress,
  accessibilityLabel,
  style,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 260 });
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={style}
    >
      <Animated.View style={[styles.button, animatedStyle]}>
        {icon ? <MaterialCommunityIcons name={icon} size={24} color={colors.onPrimary} /> : null}
        <Text style={[styles.label, icon ? styles.labelWithIcon : null]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  labelWithIcon: {
    marginLeft: 8,
  },
});
