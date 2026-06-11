import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ONBOARDING_COLORS, ONBOARDING_TYPOGRAPHY } from '../../constants/onboarding';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Hero section */}
      <View style={styles.heroSection}>
        {/* Stylist image — centred, takes full hero height */}
        <Image
          source={require('../../../assets/onboarding/stylist.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />

        {/* Three floating service cards stacked on the right */}
        <View style={styles.serviceStack}>
          <View style={styles.serviceCard}>
            <Image
              source={require('../../../assets/onboarding/service1.png')}
              style={styles.serviceImage}
              resizeMode="cover"
            />
          </View>
          <View style={[styles.serviceCard, styles.serviceCardMid]}>
            <Image
              source={require('../../../assets/onboarding/service2.png')}
              style={styles.serviceImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.serviceCard}>
            <Image
              source={require('../../../assets/onboarding/service3.png')}
              style={styles.serviceImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* Text + CTA */}
      <View style={styles.bottom}>
        <Text style={styles.heading}>
          <Text style={styles.gold}>Beauty Salon</Text>
          <Text style={styles.dark}>{' & Barber\nBooking Made Easy'}</Text>
        </Text>

        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        </Text>

        <TouchableOpacity style={styles.ctaBtn} onPress={onGetStarted} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Let's Get Started</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onSignIn}>
            <Text style={styles.signIn}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const CARD_W = 96;
const CARD_H = 118;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ONBOARDING_COLORS.background,
  },

  /* ── Hero ── */
  heroSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: 20,
  },
  heroImage: {
    width: width * 0.62,
    height: '100%',
    zIndex: 1,
  },
  serviceStack: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    alignItems: 'flex-end',
    zIndex: 2,
  },
  serviceCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: -20,
  },
  serviceCardMid: {
    marginRight: 12,
    marginBottom: -20,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },

  /* ── Bottom ── */
  bottom: {
    paddingHorizontal: width * 0.075,
    paddingBottom: 36,
    alignItems: 'center',
    gap: 18,
  },
  heading: {
    ...ONBOARDING_TYPOGRAPHY.heading,
    textAlign: 'center',
  },
  gold: {
    color: ONBOARDING_COLORS.accentGold,
    fontWeight: '700',
  },
  dark: {
    color: ONBOARDING_COLORS.textPrimary,
    fontWeight: '700',
  },
  description: {
    ...ONBOARDING_TYPOGRAPHY.description,
    color: ONBOARDING_COLORS.textSecondary,
    textAlign: 'center',
    width: '85%',
    lineHeight: 24,
  },
  ctaBtn: {
    width: '85%',
    height: 60,
    borderRadius: 30,
    backgroundColor: ONBOARDING_COLORS.primaryTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  ctaText: {
    ...ONBOARDING_TYPOGRAPHY.button,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: ONBOARDING_COLORS.textSecondary,
  },
  signIn: {
    fontSize: 14,
    fontWeight: '600',
    color: ONBOARDING_COLORS.accentGold,
    textDecorationLine: 'underline',
  },
});
