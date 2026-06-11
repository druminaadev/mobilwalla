import React, { useRef, memo, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { A } from '../../constants/auth';

const BOX = 4;

interface OTPBoxInputProps {
  value: string;
  onChange: (v: string) => void;
}

export const OTPBoxInput = memo<OTPBoxInputProps>(({ value, onChange }) => {
  const refs = useRef<(TextInput | null)[]>(Array(BOX).fill(null));

  const focus = (i: number) => refs.current[i]?.focus();

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Handle paste — up to BOX digits
      const digits = text.replace(/\D/g, '').slice(0, BOX);
      if (digits.length > 1) {
        const next = value.slice(0, index) + digits;
        onChange(next.slice(0, BOX));
        focus(Math.min(index + digits.length, BOX - 1));
        return;
      }
      const next = value.slice(0, index) + (digits[0] ?? '') + value.slice(index + 1);
      onChange(next.slice(0, BOX));
      if (digits[0] && index < BOX - 1) focus(index + 1);
    },
    [value, onChange],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        if (value[index]) {
          const next = value.slice(0, index) + '' + value.slice(index + 1);
          onChange(next);
        } else if (index > 0) {
          const next = value.slice(0, index - 1) + '' + value.slice(index);
          onChange(next);
          focus(index - 1);
        }
      }
    },
    [value, onChange],
  );

  return (
    <View style={styles.row}>
      {Array.from({ length: BOX }).map((_, i) => (
        <TextInput
          key={i}
          ref={(r) => { refs.current[i] = r; }}
          style={[styles.box, value[i] ? styles.boxFilled : null]}
          value={value[i] ?? ''}
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={BOX}
          textAlign="center"
          selectTextOnFocus
          autoFocus={i === 0}
          accessibilityLabel={`OTP digit ${i + 1}`}
        />
      ))}
    </View>
  );
});

OTPBoxInput.displayName = 'OTPBoxInput';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  box: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: A.border,
    fontSize: 28,
    fontWeight: '700',
    color: A.textPrimary,
  },
  boxFilled: { borderColor: A.primary, backgroundColor: '#EAF3F3' },
});
