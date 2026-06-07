import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LuxuryInput } from '@/components/auth/LuxuryInput';
import { LuxuryButton } from '@/components/auth/LuxuryButton';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useAuthStore } from '@/store/authStore';
import { DEMO_USER } from '@/data/demo';
import { designTokens } from '@/theme/tokens';

export default function EditProfileScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user) ?? DEMO_USER;
  const [name, setName] = useState(user.name ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [dob, setDob] = useState('15/03/1995');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>(user.gender ?? 'FEMALE');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 1000);
  };

  const initial = name.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarGlow}>
            <LinearGradient
              colors={[designTokens.colors.primaryGold, '#B8942F']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{initial}</Text>
            </LinearGradient>
          </View>
          
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={18} color={designTokens.colors.white} />
          </TouchableOpacity>
          
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.input}>{name}</Text>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.input}>{email || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputContainer, styles.disabledInput]}>
              <Text style={[styles.input, styles.disabledText]}>+91 {user.phone}</Text>
            </View>
            <Text style={styles.helperText}>Phone number cannot be changed</Text>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.input}>{dob}</Text>
            </View>
          </View>

          <View style={styles.inputWrapper}>
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
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <LuxuryButton title="Save Changes" onPress={handleSave} loading={loading} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarGlow: {
    padding: 4,
    borderRadius: 64,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: designTokens.colors.white,
  },
  avatarText: {
    fontSize: 46,
    fontWeight: designTokens.typography.weights.bold,
    color: designTokens.colors.white,
  },
  cameraButton: {
    position: 'absolute',
    right: '28%',
    bottom: 45,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: designTokens.colors.primaryGold,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: designTokens.colors.white,
    ...designTokens.shadows.social,
  },
  changePhotoText: {
    fontSize: 13,
    color: designTokens.colors.primaryGold,
    fontWeight: designTokens.typography.weights.semibold,
    marginTop: 12,
  },
  formSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: designTokens.typography.weights.bold,
    color: designTokens.colors.dark,
    marginBottom: 16,
    marginLeft: 4,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: designTokens.typography.weights.semibold,
    color: designTokens.colors.dark,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: designTokens.colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
  },
  input: {
    fontSize: 15,
    color: designTokens.colors.dark,
    fontWeight: designTokens.typography.weights.medium,
  },
  disabledText: {
    color: designTokens.colors.textMuted,
  },
  helperText: {
    fontSize: 11,
    color: designTokens.colors.textMuted,
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
    backgroundColor: designTokens.colors.white,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  genderChipActive: {
    borderColor: designTokens.colors.primaryGold,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  genderText: {
    fontSize: 15,
    fontWeight: designTokens.typography.weights.semibold,
    color: designTokens.colors.textMuted,
  },
  genderTextActive: {
    color: designTokens.colors.primaryGold,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
});
