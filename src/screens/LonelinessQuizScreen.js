import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import ConfettiBurst from '../components/ConfettiBurst';
import PrimaryButton from '../components/PrimaryButton';
import Sunburst from '../components/Sunburst';
import {
  MAX_SCORE,
  OPTIONS,
  QUESTIONS,
  getResult,
  scoreAnswers,
} from '../data/lonelinessQuiz';
import { colors } from '../theme';

// Short pause so the chosen answer visibly "lands" before the next question.
const ADVANCE_DELAY_MS = 380;
const BURST = 150;
const CIRCLE = 92;

function ProgressBar({ step, total }) {
  return (
    <View style={styles.progress}>
      {Array.from({ length: total }).map((_, i) => (
        <ProgressSegment key={i} filled={i <= step} />
      ))}
    </View>
  );
}

function ProgressSegment({ filled }) {
  const fill = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    fill.value = withTiming(filled ? 1 : 0, { duration: 320 });
  }, [filled]);

  const style = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  return (
    <View style={styles.segment}>
      <Animated.View style={[styles.segmentFill, style]} />
    </View>
  );
}

function AnswerOption({ label, selected, disabled, onPress }) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 260 });
      }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.option, selected && styles.optionSelected, style]}>
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
        {selected ? (
          <Animated.View entering={ZoomIn.duration(220)}>
            <MaterialCommunityIcons name="check-bold" size={24} color={colors.onPrimary} />
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

function Result({ score, onDone, onRetake }) {
  const { isLonely, title, message } = getResult(score);

  return (
    <>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.resultCenter}>
          <Animated.View entering={ZoomIn.duration(420).springify()} style={styles.burst}>
            <Sunburst size={BURST} color={isLonely ? colors.accent : colors.primary} />
            <View style={styles.circle}>
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.scoreOutOf}>out of {MAX_SCORE}</Text>
            </View>
            {!isLonely && <ConfettiBurst trigger={1} />}
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.duration(380).delay(150).springify()}
            style={[styles.title, styles.centerText]}
          >
            {title}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.duration(420).delay(250).springify()}
            style={[styles.body, styles.centerText]}
          >
            {message}
          </Animated.Text>
        </View>
      </ScrollView>

      <Animated.View entering={FadeInUp.duration(420).delay(350)} style={styles.footer}>
        <PrimaryButton label="Done" onPress={onDone} />
        <Pressable onPress={onRetake} accessibilityRole="button" style={styles.retake}>
          <Text style={styles.retakeText}>Retake the quiz</Text>
        </Pressable>
      </Animated.View>
    </>
  );
}

export default function LonelinessQuizScreen({ onClose }) {
  const [step, setStep] = useState(0);
  // Points per question, null until answered.
  const [answers, setAnswers] = useState(() => QUESTIONS.map(() => null));
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleSelect = (points) => {
    Haptics.selectionAsync();
    setAnswers((prev) => prev.map((p, i) => (i === step ? points : p)));
    setLocked(true);

    timer.current = setTimeout(() => {
      setLocked(false);
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowResult(true);
      }
    }, ADVANCE_DELAY_MS);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleRetake = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAnswers(QUESTIONS.map(() => null));
    setStep(0);
    setShowResult(false);
  };

  const question = QUESTIONS[step];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        {!showResult && step > 0 ? (
          <IconButton icon="arrow-left" size={26} onPress={handleBack} iconColor={colors.text} />
        ) : (
          <View />
        )}
        <IconButton icon="close" size={26} onPress={onClose} iconColor={colors.text} />
      </View>

      {showResult ? (
        <Result score={scoreAnswers(answers)} onDone={onClose} onRetake={handleRetake} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ProgressBar step={step} total={QUESTIONS.length} />

          {/* Re-keyed per question so each one springs in fresh. */}
          <Animated.View key={step} entering={FadeInDown.duration(380).springify()}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="heart-outline" size={22} color={colors.accentText} />
              <Text style={styles.badgeText}>
                Question {step + 1} of {QUESTIONS.length}
              </Text>
            </View>
            <Text style={styles.title}>{question.text}</Text>

            <View style={styles.options}>
              {OPTIONS.map((opt, i) => (
                <Animated.View
                  key={opt.label}
                  entering={FadeInUp.duration(380)
                    .delay(80 + i * 70)
                    .springify()}
                >
                  <AnswerOption
                    label={opt.label}
                    selected={answers[step] === opt.points}
                    disabled={locked}
                    onPress={() => handleSelect(opt.points)}
                  />
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 40,
  },
  progress: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.track,
    overflow: 'hidden',
    marginRight: 8,
  },
  segmentFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: colors.accentText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 36,
  },
  options: {
    marginTop: 32,
  },
  option: {
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.sage,
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.onPrimary,
  },
  resultCenter: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burst: {
    width: BURST,
    height: BURST,
    marginBottom: 32,
  },
  circle: {
    position: 'absolute',
    top: (BURST - CIRCLE) / 2,
    left: (BURST - CIRCLE) / 2,
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800',
    color: colors.text,
  },
  scoreOutOf: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  centerText: {
    textAlign: 'center',
  },
  body: {
    marginTop: 16,
    fontSize: 17,
    lineHeight: 26,
    color: colors.text,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    paddingTop: 8,
  },
  retake: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  retakeText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accentText,
  },
});
