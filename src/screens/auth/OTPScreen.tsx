import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { GlassContainer } from '@/components/auth/GlassContainer';
import { LuxuryInput } from '@/components/auth/LuxuryInput';
import { LuxuryButton } from '@/components/auth/LuxuryButton';
import { useAuthStore } from '@/store/authStore';
import { designTokens } from '@/theme/tokens';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

const { height } = Dimensions.get('window');

export default function OTPScreen({ route }: Props) {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: designTokens.animations.fade,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setError('');
    try {
      await login(phone, otp);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 6) {
      setOtp(cleaned);
      setError('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#2A1F1A', '#1A1A1A']}
        style={styles.background}
      />

      <View style={styles.content}>
        <Animated.View style={[styles.brandSection, { opacity: fadeAnim }]}>
          <Text style={styles.logo}>HAIR AHMEDABAD</Text>
          <Text style={styles.tagline}>Verify your account</Text>
        </Animated.View>

        <View style={styles.bottomSheet}>
          <GlassContainer>
            <Text style={styles.loginTitle}>Enter OTP</Text>
            <Text style={styles.subtitle}>
              Code sent to <Text style={styles.phone}>+91 {phone}</Text>
            </Text>

            <LuxuryInput
              label="OTP Code"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={handleOTPChange}
              keyboardType="number-pad"
              maxLength={6}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.buttonContainer}>
              <LuxuryButton
                title="Verify & Continue"
                onPress={handleVerifyOTP}
                loading={loading}
                disabled={otp.length !== 6}
              />
            </View>

            <TouchableOpacity style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive code? </Text>
              <Text style={[styles.resendText, styles.resendLink]}>Resend OTP</Text>
            </TouchableOpacity>
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
  background: {
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: designTokens.colors.textSubtle,
    marginBottom: 20,
  },
  phone: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.typography.weights.semibold,
  },
  errorText: {
    fontSize: designTokens.typography.sizes.caption,
    color: '#EF4444',
    marginTop: designTokens.spacing.xs,
  },
  buttonContainer: {
    marginTop: designTokens.spacing.lg,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: designTokens.spacing.lg,
  },
  resendText: {
    fontSize: 13,
    color: designTokens.colors.textSubtle,
  },
  resendLink: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.typography.weights.semibold,
  },
});
