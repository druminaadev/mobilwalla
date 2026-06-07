import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { Card } from '@/components/common/Card';
import { BookingStatus } from '@/types/models';
import { colors } from '@/constants/colors';

const STATUS_COLOR: Record<string, string> = {
  [BookingStatus.CONFIRMED]: colors.success,
  [BookingStatus.PENDING_PAYMENT]: colors.warning,
  [BookingStatus.COMPLETED]: colors.primary,
  [BookingStatus.CANCELLED]: colors.error,
  [BookingStatus.CHECKED_IN]: colors.info,
  [BookingStatus.NO_SHOW]: colors.textSecondary,
};

const STATUS_LABEL: Record<string, string> = {
  [BookingStatus.CONFIRMED]: 'Confirmed',
  [BookingStatus.PENDING_PAYMENT]: 'Pending',
  [BookingStatus.COMPLETED]: 'Completed',
  [BookingStatus.CANCELLED]: 'Cancelled',
  [BookingStatus.CHECKED_IN]: 'Checked In',
  [BookingStatus.NO_SHOW]: 'No Show',
};

interface Props {
  salonName: string;
  serviceNames: string[];
  bookingDate: string;
  startTime: string;
  finalAmount: number;
  status: BookingStatus;
  onPress: () => void;
}

export const BookingCard: React.FC<Props> = ({ salonName, serviceNames, bookingDate, startTime, finalAmount, status, onPress }) => {
  const color = STATUS_COLOR[status] ?? colors.textSecondary;
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.salon} numberOfLines={1}>{salonName}</Text>
        <View style={[styles.badge, { backgroundColor: color + '22' }]}>
          <Text style={[styles.badgeText, { color }]}>{STATUS_LABEL[status]}</Text>
        </View>
      </View>
      <Text style={styles.services} numberOfLines={1}>{serviceNames.join(', ')}</Text>
      <View style={styles.row}>
        <Calendar size={14} color={colors.textSecondary} />
        <Text style={styles.meta}>{new Date(bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
        <Clock size={14} color={colors.textSecondary} />
        <Text style={styles.meta}>{startTime}</Text>
      </View>
      <Text style={styles.amount}>₹{finalAmount}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 12, padding: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  salon: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  services: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  meta: { fontSize: 13, color: colors.textSecondary },
  amount: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
});
