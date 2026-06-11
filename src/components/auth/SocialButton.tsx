import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { A } from '../../constants/auth';

interface SocialButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
}

export const SocialButton = memo<SocialButtonProps>(({ icon, onPress, accessibilityLabel }) => (
  <TouchableOpacity
    style={styles.btn}
    onPress={onPress}
    activeOpacity={0.75}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
  >
    <View>{icon}</View>
  </TouchableOpacity>
));

SocialButton.displayName = 'SocialButton';

const styles = StyleSheet.create({
  btn: {
    width: A.socialSize,
    height: A.socialSize,
    borderRadius: A.socialSize / 2,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: A.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
});
