import React, { useState, memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { AuthInput } from './AuthInput';
import { A } from '../../constants/auth';

interface PasswordInputProps {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
}

export const PasswordInput = memo<PasswordInputProps>(
  ({ label = 'Password', value, onChangeText, placeholder = '••••••••', error }) => {
    const [visible, setVisible] = useState(false);

    return (
      <AuthInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        error={error}
        rightIcon={
          <TouchableOpacity onPress={() => setVisible((v) => !v)} hitSlop={8}>
            {visible ? (
              <Eye size={20} color={A.textSecondary} />
            ) : (
              <EyeOff size={20} color={A.textSecondary} />
            )}
          </TouchableOpacity>
        }
      />
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
