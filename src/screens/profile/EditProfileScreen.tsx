import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Camera, Lock, User, Mail, Calendar, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { DEMO_USER } from '../../data/demo';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { ProfileStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user) ?? DEMO_USER;
  
  const [name, setName] = useState(user.name ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [dob, setDob] = useState(user.dateOfBirth ?? '15/03/1995');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>(user.gender ?? 'FEMALE');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulate API save
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Profile Updated', 'Your profile details have been successfully saved.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 1000);
  };

  const initial = name.charAt(0).toUpperCase() || 'U';

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* Avatar Section */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.avatarSection}>
          <View style={styles.avatarGlow}>
            <LinearGradient
              colors={[colors.primary, '#0A3245']}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>{initial}</Text>
            </LinearGradient>
          </View>

          <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8}>
            <Camera size={18} color={colors.white} />
          </TouchableOpacity>

          <Text style={styles.changePhotoText}>Change Photo</Text>
        </Animated.View>

        {/* Form Section */}
        <View style={styles.formSection}>
          
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color={colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.inputWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputContainer, styles.disabledInputContainer]}>
              <Phone size={20} color={colors.textTertiary} style={styles.inputIcon} />
              <Text style={[styles.input, styles.disabledText]}>+91 {user.phone}</Text>
              <Lock size={16} color={colors.textTertiary} />
            </View>
            <Text style={styles.helperText}>Phone number is your primary ID and cannot be changed.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.inputWrapper}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color={colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={dob}
                onChangeText={setDob}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.inputWrapper}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {(['MALE', 'FEMALE'] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderChip, gender === g && styles.genderChipActive]}
                  onPress={() => setGender(g)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                    {g === 'MALE' ? '👨 Male' : '👩 Female'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* Save Button */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.buttonContainer}>
          <Button 
             title="Save Changes" 
             onPress={handleSave} 
             loading={loading} 
             fullWidth 
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarGlow: {
    padding: 6,
    borderRadius: 70,
    backgroundColor: 'rgba(15, 70, 92, 0.1)', // Primary color with low opacity
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarText: {
    ...typography.h1,
    fontSize: 42,
    color: colors.white,
  },
  cameraButton: {
    position: 'absolute',
    right: '32%',
    bottom: 45,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  changePhotoText: {
    ...typography.subtitle2,
    color: colors.primary,
    marginTop: 12,
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  disabledInputContainer: {
    backgroundColor: colors.gray100,
    borderColor: 'transparent',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...typography.body1,
    color: colors.textPrimary,
  },
  disabledText: {
    color: colors.textTertiary,
  },
  helperText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 6,
    marginLeft: 4,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  genderChipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(15, 70, 92, 0.05)',
  },
  genderText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
  },
  genderTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
});
