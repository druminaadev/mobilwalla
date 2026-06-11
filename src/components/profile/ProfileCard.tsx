import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'lucide-react-native';
import { colors } from '../../constants/colors';

interface ProfileCardProps {
  name: string;
  phone: string;
  email?: string;
  onEditPhoto?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, phone, email, onEditPhoto }) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarGlow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>
        
        {onEditPhoto && (
          <TouchableOpacity style={styles.cameraButton} onPress={onEditPhoto}>
            <Camera size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.phone}>+91 {phone}</Text>
      {email && <Text style={styles.email}>{email}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGlow: {
    padding: 4,
    borderRadius: 60,
    backgroundColor: '#EEF1ED',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5C8A',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 42,
    fontWeight: '700',
    color: 'white',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF5C8A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#FF5C8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  phone: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  email: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
});
