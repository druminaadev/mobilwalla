import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { loginSchema, LoginForm } from '../../utils/authValidation';
import { useAuthStore } from '../../store/authStore';
import { AuthHeroLayout } from '../../components/auth/AuthHeroLayout';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { A } from '../../constants/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const sendOTP = useAuthStore((s) => s.sendOTP);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '' },
  });

  const onSubmit = useCallback(
    async (data: LoginForm) => {
      try {
        await sendOTP(data.phone);
        navigation.navigate('OTPVerification', { phone: data.phone, mode: 'login' });
      } catch (e: unknown) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Please try again.');
      }
    },
    [sendOTP, navigation],
  );

  return (
    <AuthHeroLayout
      bgImage={require('../../../assets/images/auth/login-bg.webp')}
      title="Let's get you Login!"
      subtitle="Hi! Welcome back, you've been missed"
    >
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <AuthInput
            label="Mobile Number"
            placeholder="Enter 10-digit mobile number"
            value={value}
            onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.phone?.message}
            leftIcon={
              <View style={styles.dialCode}>
                <Text style={styles.dialText}>+91</Text>
              </View>
            }
          />
        )}
      />

      <Text style={styles.hint}>
        We'll send a 4-digit OTP to verify your number
      </Text>

      <AuthButton
        title="Get OTP"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        style={styles.ctaBtn}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </AuthHeroLayout>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: A.captionSize,
    color: A.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  dialCode: {
    borderRightWidth: 1,
    borderRightColor: A.border,
    paddingRight: 10,
    marginRight: 4,
  },
  dialText: {
    fontSize: 15,
    fontWeight: '600',
    color: A.textPrimary,
  },
  ctaBtn: { marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: A.labelSize, color: A.textSecondary },
  footerLink: { fontSize: A.labelSize, color: A.primary, fontWeight: '700' },
});
