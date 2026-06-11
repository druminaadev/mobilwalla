import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';
import { OTPBoxInput } from '../../components/auth/OTPBoxInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { A } from '../../constants/auth';
import { ChevronLeft } from 'lucide-react-native';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

const RESEND_SECONDS = 60;

// Mask phone: 98765XXXXX → show last 4 digits
const maskPhone = (phone: string) =>
  phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1XXXXXX$3');

export default function OTPScreen({ route, navigation }: Props) {
  const { phone, mode } = route.params;
  const verifyOTP = useAuthStore((s) => s.verifyOTP);
  const sendOTP = useAuthStore((s) => s.sendOTP);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleVerify = useCallback(async () => {
    if (otp.length !== 4) return;
    setLoading(true);
    try {
      await verifyOTP(phone, otp, mode);
      if (mode === 'signup') {
        navigation.replace('AuthSuccess');
      }
      // login mode: verifyOTP sets isAuthenticated → RootNavigator switches to MainStack
    } catch (e: unknown) {
      Alert.alert('Invalid Code', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  }, [otp, phone, mode, verifyOTP, navigation]);

  const handleResend = useCallback(async () => {
    if (resendTimer > 0) return;
    try {
      await sendOTP(phone);
      setResendTimer(RESEND_SECONDS);
      setOtp('');
      Alert.alert('Code Sent', `A new OTP has been sent to +91 ${phone}`);
    } catch {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  }, [resendTimer, phone, sendOTP]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={22} color={A.primary} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Verify Code</Text>

          <Text style={styles.desc}>
            Enter the 4-digit OTP sent to{'\n'}
            <Text style={styles.phone}>+91 {maskPhone(phone)}</Text>
          </Text>

          <View style={styles.boxWrap}>
            <OTPBoxInput value={otp} onChange={setOtp} />
          </View>

          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't receive OTP? </Text>
            <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
              <Text style={[styles.resendLink, resendTimer > 0 && styles.resendDisabled]}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
              </Text>
            </TouchableOpacity>
          </View>

          <AuthButton
            title="Verify"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.length !== 4}
          />

          <Text style={styles.demoHint}>Demo OTP: 1234</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: A.bg },
  kav: { flex: 1 },
  backBtn: {
    margin: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: A.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, paddingHorizontal: A.hPad, paddingTop: 16 },
  title: { fontSize: A.titleSize, fontWeight: '600', color: A.textPrimary, marginBottom: 16 },
  desc: { fontSize: A.bodySize, color: A.textSecondary, lineHeight: 26, marginBottom: 40 },
  phone: { color: A.primary, fontWeight: '700' },
  boxWrap: { marginBottom: 32 },
  resendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 36 },
  resendLabel: { fontSize: A.labelSize, color: A.textSecondary },
  resendLink: {
    fontSize: A.labelSize,
    color: A.accent,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendDisabled: { opacity: 0.45, textDecorationLine: 'none' },
  demoHint: {
    fontSize: 12,
    color: A.placeholder,
    textAlign: 'center',
    marginTop: 20,
  },
});
