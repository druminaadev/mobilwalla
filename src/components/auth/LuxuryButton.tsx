import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { designTokens } from '../../screens/home/theme/tokens';

interface LuxuryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({ title, onPress, loading, disabled }) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.97,
      duration: designTokens.animations.press,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: designTokens.animations.press,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator color={designTokens.colors.white} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    backgroundColor: '#FF5C8A',
    borderRadius: designTokens.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...designTokens.shadows.button,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: designTokens.typography.sizes.button,
    fontWeight: designTokens.typography.weights.semibold,
    color: '#0F172A',
  },
});
