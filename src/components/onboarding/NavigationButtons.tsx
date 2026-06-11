import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ONBOARDING_COLORS } from '../../constants/onboarding';
import { PaginationDots } from './PaginationDots';

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext: () => void;
  showPrevious?: boolean;
  total: number;
  activeIndex: number;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  showPrevious = true,
  total,
  activeIndex,
}) => {
  return (
    <View style={styles.row}>
      {showPrevious && onPrevious ? (
        <TouchableOpacity style={styles.outlineBtn} onPress={onPrevious} activeOpacity={0.8}>
          <ChevronLeft size={26} color={ONBOARDING_COLORS.primaryTeal} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <PaginationDots total={total} activeIndex={activeIndex} />

      <TouchableOpacity style={styles.filledBtn} onPress={onNext} activeOpacity={0.8}>
        <ChevronRight size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  outlineBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: ONBOARDING_COLORS.primaryTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ONBOARDING_COLORS.primaryTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 64,
    height: 64,
  },
});
