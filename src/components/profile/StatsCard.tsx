import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { designTokens } from '../../screens/home/theme/tokens';

interface StatItemProps {
  value: string | number;
  label: string;
  isPoints?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, isPoints }) => (
  <View style={styles.statItem}>
    {isPoints ? (
      <View style={styles.pointsRow}>
        <Star size={16} color={designTokens.colors.primaryGold} fill={designTokens.colors.primaryGold} />
        <Text style={styles.statValue}>{value}</Text>
      </View>
    ) : (
      <Text style={styles.statValue}>{value}</Text>
    )}
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface StatsCardProps {
  bookings: number;
  points: number;
  wallet: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ bookings, points, wallet }) => {
  return (
    <View style={styles.container}>
      <StatItem value={bookings} label="Bookings" />
      <View style={styles.divider} />
      <StatItem value={points} label="Points" isPoints />
      <View style={styles.divider} />
      <StatItem value={`₹${wallet}`} label="Wallet" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    ...designTokens.shadows.card,
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: designTokens.typography.weights.bold,
    color: designTokens.colors.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: designTokens.colors.textMuted,
    fontWeight: designTokens.typography.weights.medium,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginHorizontal: 8,
  },
});
