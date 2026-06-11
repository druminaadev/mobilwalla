import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Camera } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface AvatarUploadProps {
  uri?: string | null;
  initials: string;
  size: number;
  onPress: () => void;
  editable?: boolean;
}

export function AvatarUpload({ uri, initials, size, onPress, editable = false }: AvatarUploadProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!editable}
      style={[styles.container, { width: size, height: size }]}
      accessibilityLabel={editable ? 'Upload profile photo' : 'Profile photo'}
      accessibilityRole="button"
    >
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
        {uri ? (
          <Image
            source={{ uri }}
            style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
            accessibilityLabel="Profile photo"
          />
        ) : (
          <Text style={[styles.initials, { fontSize: size / 2.5 }]}>{initials}</Text>
        )}
      </View>
      {editable && (
        <View style={[styles.cameraBadge, { bottom: 0, right: 0 }]}>
          <Camera size={spacing.md} color={colors.white} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  circle: {
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  cameraBadge: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
});
