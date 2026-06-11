import React, { useState, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { A } from '../../constants/auth';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const AuthInput = memo<AuthInputProps>(
  ({ label, error, leftIcon, rightIcon, containerStyle, ...props }) => {
    const [focused, setFocused] = useState(false);

    return (
      <View style={[styles.wrap, containerStyle]}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.row,
            focused && styles.rowFocused,
            !!error && styles.rowError,
          ]}
        >
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <TextInput
            style={[styles.input, leftIcon ? styles.inputPadL : null]}
            placeholderTextColor={A.placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  },
);

AuthInput.displayName = 'AuthInput';

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: A.labelSize,
    fontWeight: '500',
    color: A.textPrimary,
    marginBottom: 8,
  },
  row: {
    height: A.inputH,
    backgroundColor: A.inputBg,
    borderRadius: A.inputR,
    borderWidth: 1.5,
    borderColor: A.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  rowFocused: { borderColor: A.primary },
  rowError: { borderColor: A.error },
  iconLeft: { marginRight: 10 },
  iconRight: { marginLeft: 8 },
  input: { flex: 1, fontSize: 15, color: A.textPrimary },
  inputPadL: { paddingLeft: 0 },
  error: { fontSize: 12, color: A.error, marginTop: 5 },
});
