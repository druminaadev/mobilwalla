import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Phone } from 'lucide-react-native';
import { designTokens } from '../../screens/home/theme/tokens';

interface LuxuryInputProps extends TextInputProps {
  label: string;
}

export const LuxuryInput: React.FC<LuxuryInputProps> = ({ label, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, focused && styles.inputFocused]}>
        <Phone size={20} color={designTokens.colors.iconGray} />
        <TextInput
          style={styles.input}
          placeholderTextColor={designTokens.colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: designTokens.spacing.sm,
  },
  label: {
    fontSize: designTokens.typography.sizes.label,
    fontWeight: designTokens.typography.weights.medium,
    color: designTokens.colors.white,
    opacity: 0.8,
    marginBottom: designTokens.spacing.xs,
  },
  inputContainer: {
    height: 56,
    backgroundColor: designTokens.colors.white,
    borderRadius: designTokens.borderRadius.sm,
    paddingHorizontal: designTokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#FF5C8A',
  },
  input: {
    flex: 1,
    fontSize: designTokens.typography.sizes.input,
    marginLeft: designTokens.spacing.sm,
    color: designTokens.colors.dark,
  },
});
