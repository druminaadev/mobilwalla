import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin, Edit2, Trash2 } from 'lucide-react-native';
import { Address } from '@/types/models';
import { colors } from '@/constants/colors';
import { spacing, borderRadius } from '@/constants/spacing';
import { typography } from '@/constants/typography';

interface AddressCardProps {
  address: Address;
  isDefault: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

export function AddressCard({ address, isDefault, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <Pressable
      onPress={onSetDefault}
      onLongPress={onSetDefault}
      style={styles.card}
      accessibilityLabel={`Address: ${address.line1}`}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <MapPin size={20} color={colors.primary} />
        </View>
        <View style={styles.actions}>
          <Pressable onPress={onEdit} style={styles.actionBtn} accessibilityLabel="Edit address" accessibilityRole="button">
            <Edit2 size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable onPress={onDelete} style={styles.actionBtn} accessibilityLabel="Delete address" accessibilityRole="button">
            <Trash2 size={18} color={colors.error} />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.addressLine1}>{address.line1}</Text>
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressDetails}>
          {[address.line2, address.city, address.state, address.pincode].filter(Boolean).join(', ')}
        </Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{address.type.toUpperCase()}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressLine1: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  defaultBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
  addressDetails: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    lineHeight: typography.lineHeight.sm,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  typeBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
});
