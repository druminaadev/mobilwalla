import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Scissors, Users, Calendar, CheckCircle } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, interpolateColor } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const STEPS = [
  { label: 'Service', icon: Scissors },
  { label: 'Stylist', icon: Users },
  { label: 'Slot',    icon: Calendar },
  { label: 'Review',  icon: CheckCircle },
];

export function BookingProgress({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <View style={styles.wrap}>
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const done    = stepNum < current;
        const active  = stepNum === current;
        const Icon    = step.icon;

        return (
          <React.Fragment key={step.label}>
            <StepItem step={step} active={active} done={done} Icon={Icon} />
            {i < STEPS.length - 1 && (
              <ProgressLine done={done} active={active} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

function StepItem({ step, active, done, Icon }: any) {
  const scale = useSharedValue(active ? 1.1 : 1);
  const opacity = useSharedValue(active || done ? 1 : 0.5);

  useEffect(() => {
    scale.value = withSpring(active ? 1.1 : 1);
    opacity.value = withTiming(active || done ? 1 : 0.5);
  }, [active, done]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const bgStyle = useAnimatedStyle(() => {
    const bgColor = done ? colors.success : active ? colors.primary : colors.gray200;
    return {
      backgroundColor: withTiming(bgColor, { duration: 300 }),
    };
  });

  return (
    <View style={styles.stepCol}>
      <Animated.View style={[styles.circle, animatedStyle, bgStyle]}>
        <Icon
          size={16}
          color={colors.white}
          strokeWidth={2.5}
        />
      </Animated.View>
      <Text style={[
        styles.label,
        done && styles.labelDone,
        active && styles.labelActive,
      ]}>
        {step.label}
      </Text>
    </View>
  );
}

function ProgressLine({ done, active }: { done: boolean; active: boolean }) {
  const progress = useSharedValue(done ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(done ? 1 : 0, { duration: 400 });
  }, [done]);

  const lineStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.gray200, colors.success]
    )
  }));

  return <Animated.View style={[styles.line, lineStyle]} />;
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', 
    alignItems: 'flex-start',
    paddingHorizontal: 20, 
    paddingVertical: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, 
    borderBottomColor: colors.border,
  },
  stepCol: { 
    alignItems: 'center', 
    width: 52 
  },
  circle: {
    width: 36, 
    height: 36, 
    borderRadius: 18,
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { 
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center' 
  },
  labelDone: { 
    color: colors.success,
  },
  labelActive: { 
    color: colors.primary, 
    ...typography.subtitle2,
  },
  line: {
    flex: 1, 
    height: 2, 
    marginTop: 18, 
    marginHorizontal: 4,
    borderRadius: 1,
  },
});
