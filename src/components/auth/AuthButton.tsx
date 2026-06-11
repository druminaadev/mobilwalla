import React, { useRef, memo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ViewStyle,
} from 'react-native';
import { A } from '../../constants/auth';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'outline';
}

export const AuthButton = memo<AuthButtonProps>(
  ({ title, onPress, loading, disabled, style, variant = 'primary' }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () =>
      Animated.timing(scale, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
    const pressOut = () =>
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }).start();

    const isDisabled = disabled || loading;

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[
            styles.btn,
            variant === 'outline' && styles.outline,
            isDisabled && styles.disabled,
            style,
          ]}
          onPress={onPress}
          onPressIn={pressIn}
          onPressOut={pressOut}
          disabled={isDisabled}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={title}
        >
          {loading ? (
            <ActivityIndicator color={variant === 'outline' ? A.primary : '#fff'} />
          ) : (
            <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>{title}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

AuthButton.displayName = 'AuthButton';

const styles = StyleSheet.create({
  btn: {
    height: A.buttonH,
    borderRadius: A.buttonR,
    backgroundColor: A.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: A.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: A.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabled: { opacity: 0.55 },
  text: { fontSize: A.buttonSize, fontWeight: '700', color: '#0F172A' },
  outlineText: { color: A.primary },
});
