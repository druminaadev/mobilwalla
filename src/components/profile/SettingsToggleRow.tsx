import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface SettingsToggleRowProps {
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function SettingsToggleRow({ icon: Icon, label, subtitle, value, onChange }: SettingsToggleRowProps) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={styles.row}
      accessibilityLabel={`${label}, ${value ? 'enabled' : 'disabled'}`}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={styles.iconWrapper}>
        <Icon size={24} color={colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.gray300, true: colors.primary }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.gray300}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    minHeight: 64,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
});
