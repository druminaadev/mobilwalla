import React, { memo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { A } from '../../constants/auth';

interface CheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = memo<CheckboxProps>(({ checked, onChange, label, error }) => (
  <View>
    <TouchableOpacity
      style={styles.row}
      onPress={() => onChange(!checked)}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </View>
      {label && <View style={styles.labelWrap}>{label}</View>}
    </TouchableOpacity>
    {!!error && <Text style={styles.error}>{error}</Text>}
  </View>
));

Checkbox.displayName = 'Checkbox';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: A.border,
    backgroundColor: A.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: A.primary, borderColor: A.primary },
  labelWrap: { flex: 1, marginLeft: 10 },
  error: { fontSize: 12, color: A.error, marginTop: 5, marginLeft: 32 },
});
