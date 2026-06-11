import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ONBOARDING_COLORS, ONBOARDING_TYPOGRAPHY } from '../../constants/onboarding';
import { NavigationButtons } from '../../components/onboarding/NavigationButtons';

const { width, height } = Dimensions.get('window');

interface SeamlessBookingScreenProps {
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

export const SeamlessBookingScreen: React.FC<SeamlessBookingScreenProps> = ({
  onNext,
  onPrevious,
  onSkip,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.previewContainer}>
        <Image
          source={require('../../../assets/onboarding/home-preview.png')}
          style={styles.previewImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>
          <Text style={styles.gold}>Seamless</Text>
          <Text style={styles.dark}>{' Salon\nBooking Experience'}</Text>
        </Text>

        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        </Text>

        <NavigationButtons
          onPrevious={onPrevious}
          onNext={onNext}
          showPrevious={true}
          total={3}
          activeIndex={0}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ONBOARDING_COLORS.background },
  skipBtn: { position: 'absolute', top: 60, right: 24, zIndex: 100, padding: 8 },
  skipText: { fontSize: 16, fontWeight: '600', color: ONBOARDING_COLORS.accentGold },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  previewImage: { width: width * 0.85, height: height * 0.5 },
  card: {
    height: height * 0.42,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 32,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  heading: { ...ONBOARDING_TYPOGRAPHY.heading, textAlign: 'center' },
  gold: { color: ONBOARDING_COLORS.accentGold, fontWeight: '700' },
  dark: { color: ONBOARDING_COLORS.textPrimary, fontWeight: '700' },
  description: {
    ...ONBOARDING_TYPOGRAPHY.description,
    color: ONBOARDING_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
