import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ONBOARDING_COLORS } from '../../constants/onboarding';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({ total, activeIndex }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === activeIndex ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 28,
    backgroundColor: ONBOARDING_COLORS.primaryTeal,
  },
  dotInactive: {
    width: 10,
    backgroundColor: ONBOARDING_COLORS.indicatorInactive,
  },
});
