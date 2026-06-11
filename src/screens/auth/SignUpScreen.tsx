import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { signUpSchema, SignUpForm } from '../../utils/authValidation';
import { useAuthStore } from '../../store/authStore';
import { AuthHeroLayout } from '../../components/auth/AuthHeroLayout';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { Checkbox } from '../../components/auth/Checkbox';
import { A } from '../../constants/auth';
import { User } from 'lucide-react-native';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const { sendOTP, signUp } = useAuthStore((s) => ({ sendOTP: s.sendOTP, signUp: s.signUp }));

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', phone: '', terms: undefined as unknown as true },
  });

  const onSubmit = useCallback(
    async (data: SignUpForm) => {
      try {
        await signUp(data.name.trim(), data.phone);
        await sendOTP(data.phone);
        navigation.navigate('OTPVerification', { phone: data.phone, mode: 'signup' });
      } catch (e: unknown) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Please try again.');
      }
    },
    [signUp, sendOTP, navigation],
  );

  return (
    <AuthHeroLayout
      bgImage={require('../../../assets/images/auth/signup-bg.webp')}
      title="Create Account"
      subtitle="Enter your details to register and get started."
    >
      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <AuthInput
            label="Full Name"
            placeholder="Your full name"
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
            error={errors.name?.message}
            leftIcon={<User size={18} color={A.placeholder} />}
          />
        )}
      />

      {/* Phone */}
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

      {/* Terms */}
      <Controller
        control={control}
        name="terms"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={!!value}
            onChange={onChange}
            error={errors.terms?.message}
            label={
              <Text style={styles.termsText}>
                Agree with <Text style={styles.termsLink}>Terms & Condition</Text>
              </Text>
            }
          />
        )}
      />

      <AuthButton
        title="Send OTP"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        style={styles.ctaBtn}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </AuthHeroLayout>
  );
}

const styles = StyleSheet.create({
  dialCode: {
    borderRightWidth: 1,
    borderRightColor: A.border,
    paddingRight: 10,
    marginRight: 4,
  },
  dialText: { fontSize: 15, fontWeight: '600', color: A.textPrimary },
  termsText: { fontSize: A.captionSize, color: A.textSecondary },
  termsLink: { color: A.accent, fontWeight: '600' },
  ctaBtn: { marginTop: 20 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: A.labelSize, color: A.textSecondary },
  footerLink: { fontSize: A.labelSize, color: A.primary, fontWeight: '700' },
});
