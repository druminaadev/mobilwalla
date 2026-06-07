import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Scissors, Users, Calendar, CheckCircle } from 'lucide-react-native';

const STEPS = [
  { label: 'Service', icon: Scissors },
  { label: 'Stylist', icon: Users },
  { label: 'Slot',    icon: Calendar },
  { label: 'Review',  icon: CheckCircle },
];

const PINK = '#FF5C8A';

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
            <View style={styles.stepCol}>
              <View style={[
                styles.circle,
                done   && styles.circleDone,
                active && styles.circleActive,
              ]}>
                <Icon
                  size={14}
                  color={done || active ? '#fff' : '#94A3B8'}
                  strokeWidth={2.5}
                />
              </View>
              <Text style={[
                styles.label,
                done   && styles.labelDone,
                active && styles.labelActive,
              ]}>
                {step.label}
              </Text>
            </View>

            {i < STEPS.length - 1 && (
              <View style={[styles.line, done && styles.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  stepCol:      { alignItems: 'center', width: 48 },
  circle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center',
    marginBottom: 4,
  },
  circleDone:   { backgroundColor: '#10B981' },
  circleActive: { backgroundColor: PINK },
  label:        { fontSize: 11, fontWeight: '600', color: '#94A3B8', textAlign: 'center' },
  labelDone:    { color: '#10B981' },
  labelActive:  { color: PINK, fontWeight: '700' },
  line: {
    flex: 1, height: 2, backgroundColor: '#E2E8F0',
    marginTop: 16, marginHorizontal: 2,
  },
  lineDone: { backgroundColor: '#10B981' },
});
