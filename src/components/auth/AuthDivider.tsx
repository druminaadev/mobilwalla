import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { A } from '../../constants/auth';

interface AuthDividerProps {
  label?: string;
}

export const AuthDivider = memo<AuthDividerProps>(({ label = 'Or sign in with' }) => (
  <View style={styles.row}>
    <View style={styles.line} />
    <Text style={styles.text}>{label}</Text>
    <View style={styles.line} />
  </View>
));

AuthDivider.displayName = 'AuthDivider';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: A.border },
  text: { fontSize: 13, color: A.textSecondary, marginHorizontal: 12, fontWeight: '500' },
});
