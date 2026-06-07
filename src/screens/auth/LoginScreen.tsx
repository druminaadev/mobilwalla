import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { GlassContainer } from '@/components/auth/GlassContainer';
import { LuxuryInput } from '@/components/auth/LuxuryInput';
import { LuxuryButton } from '@/components/auth/LuxuryButton';
import { designTokens } from '@/theme/tokens';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const { height, width } = Dimensions.get('window');

export default function LoginScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: designTokens.animations.fade,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGetOTP = () => {
    if (!phone.trim() || phone.length !== 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OTPVerification', { phone });
    }, 800);
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setPhone(cleaned);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f0f0f']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <Animated.View style={[styles.brandSection, { opacity: fadeAnim }]}>
          <Text style={styles.logo}>HAIR AHMEDABAD</Text>
          <Text style={styles.tagline}>Premium Salon Experience</Text>
        </Animated.View>

        <View style={styles.bottomSheet}>
          <GlassContainer>
            <Text style={styles.loginTitle}>Login</Text>

            <LuxuryInput
              label="Phone Number"
              placeholder="Enter 10-digit mobile number"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Text style={styles.otpDescription}>
              We'll send you an OTP to verify your account
            </Text>

            <View style={styles.buttonContainer}>
              <LuxuryButton
                title="Get OTP"
                onPress={handleGetOTP}
                loading={loading}
                disabled={phone.length !== 10}
              />
            </View>
          </GlassContainer>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.dark,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  brandSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.15,
    paddingHorizontal: designTokens.spacing.lg,
  },
  logo: {
    fontSize: designTokens.typography.sizes.logo,
    fontWeight: designTokens.typography.weights.bold,
    color: designTokens.colors.primary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  tagline: {
    fontSize: designTokens.typography.sizes.tagline,
    fontWeight: designTokens.typography.weights.medium,
    color: designTokens.colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  bottomSheet: {
    height: height * 0.42,
  },
  loginTitle: {
    fontSize: designTokens.typography.sizes.heading,
    fontWeight: designTokens.typography.weights.bold,
    color: designTokens.colors.white,
    marginBottom: 20,
  },
  otpDescription: {
    fontSize: designTokens.typography.sizes.caption,
    color: designTokens.colors.textSubtle,
    lineHeight: 18,
    marginTop: designTokens.spacing.sm,
  },
  buttonContainer: {
    marginTop: designTokens.spacing.lg,
  },
});
