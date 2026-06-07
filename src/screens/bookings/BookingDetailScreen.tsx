import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, User, Check } from 'lucide-react-native';
import { BookingsStackParamList } from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { DEMO_BOOKINGS, DEMO_SALONS, DEMO_STAFF } from '@/data/demo';
import { BookingStatus } from '@/types/models';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<BookingsStackParamList, 'BookingDetail'>;

const STATUS_COLOR: Record<string, string> = {
  [BookingStatus.CONFIRMED]: colors.success,
  [BookingStatus.PENDING_PAYMENT]: colors.warning,
  [BookingStatus.COMPLETED]: colors.primary,
  [BookingStatus.CANCELLED]: colors.error,
};

export default function BookingDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const booking = DEMO_BOOKINGS.find((b) => b.id === id) ?? DEMO_BOOKINGS[0];
  const salon = DEMO_SALONS.find((s) => s.id === booking.salonId) ?? DEMO_SALONS[0];
  const staff = booking.staffId ? DEMO_STAFF[booking.salonId]?.find((s) => s.id === booking.staffId) : null;

  const isUpcoming = [BookingStatus.CONFIRMED, BookingStatus.PENDING_PAYMENT].includes(booking.status);
  const statusColor = STATUS_COLOR[booking.status] ?? colors.textSecondary;

  const timeline = [
    { label: 'Booking Placed', done: true },
    { label: 'Confirmed', done: booking.status !== BookingStatus.PENDING_PAYMENT },
    { label: 'In Progress', done: booking.status === BookingStatus.CHECKED_IN || booking.status === BookingStatus.COMPLETED },
    { label: 'Completed', done: booking.status === BookingStatus.COMPLETED },
  ];

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Booking Details" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusColor + '18' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {booking.status.replace('_', ' ')}
          </Text>
          <Text style={styles.bookingId}>Booking ID: #{booking.id.toUpperCase()}</Text>
        </View>

        {/* Timeline */}
        {isUpcoming && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Timeline</Text>
            {timeline.map((item, i) => (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.dot, item.done && styles.dotDone]}>
                    {item.done && <Check size={11} color="white" />}
                  </View>
                  {i < timeline.length - 1 && <View style={[styles.line, item.done && styles.lineDone]} />}
                </View>
                <Text style={[styles.timelineLabel, item.done && styles.timelineLabelDone]}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Salon Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salon</Text>
          <View style={styles.infoCard}>
            <Text style={styles.salonName}>{salon.name}</Text>
            <View style={styles.infoRow}>
              <MapPin size={15} color={colors.textSecondary} />
              <Text style={styles.infoText}>{salon.addressLine1}, {salon.city}</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone size={15} color={colors.textSecondary} />
              <Text style={styles.infoText}>{salon.phone}</Text>
            </View>
          </View>
        </View>

        {/* Appointment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment</Text>
          <View style={styles.detailRow}>
            <Calendar size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {new Date(booking.bookingDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Clock size={20} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{booking.startTime} – {booking.endTime}</Text>
            </View>
          </View>
          {staff && (
            <View style={styles.detailRow}>
              <User size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Staff</Text>
                <Text style={styles.detailValue}>{staff.name} · {staff.specialization}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          {booking.serviceNames.map((name, i) => (
            <View key={i} style={styles.serviceRow}>
              <Text style={styles.serviceName}>{name}</Text>
            </View>
          ))}
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₹{booking.totalAmount}</Text>
          </View>
          {booking.discountAmount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Discount</Text>
              <Text style={[styles.priceValue, { color: colors.success }]}>-₹{booking.discountAmount}</Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>GST (18%)</Text>
            <Text style={styles.priceValue}>₹{Math.round(booking.totalAmount * 0.18)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{booking.finalAmount}</Text>
          </View>
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentText}>
              {booking.paymentStatus === 'SUCCESS' ? '✅ Paid' : booking.paymentStatus === 'REFUNDED' ? '↩️ Refunded' : '⏳ Pending'}
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {isUpcoming && (
        <View style={styles.footer}>
          <Button title="Reschedule" onPress={() => navigation.navigate('Reschedule', { bookingId: id })} variant="outline" style={styles.btn} />
          <Button title="Cancel" onPress={handleCancel} variant="outline" style={[styles.btn, styles.cancelBtn]} />
        </View>
      )}

      {booking.status === BookingStatus.COMPLETED && (
        <View style={styles.footer}>
          <Button title="Write a Review" onPress={() => navigation.navigate('WriteReview', { bookingId: id })} fullWidth />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  statusBanner: { padding: 16, alignItems: 'center' },
  statusText: { fontSize: 15, fontWeight: '700', textTransform: 'capitalize', marginBottom: 4 },
  bookingId: { fontSize: 13, color: colors.textSecondary },
  section: { padding: 16, borderBottomWidth: 8, borderBottomColor: colors.background },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  timelineLeft: { alignItems: 'center', marginRight: 12, width: 24 },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  dotDone: { backgroundColor: colors.success },
  line: { width: 2, height: 24, backgroundColor: colors.border, marginVertical: 2 },
  lineDone: { backgroundColor: colors.success },
  timelineLabel: { fontSize: 14, color: colors.textSecondary, paddingTop: 2 },
  timelineLabelDone: { color: colors.textPrimary, fontWeight: '600' },
  infoCard: { padding: 14, backgroundColor: colors.background, borderRadius: 12 },
  salonName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  infoText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  detailValue: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  serviceRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  serviceName: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priceLabel: { fontSize: 14, color: colors.textSecondary },
  priceValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  paymentBadge: { marginTop: 10, padding: 10, backgroundColor: colors.background, borderRadius: 8 },
  paymentText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  footer: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1, borderTopColor: colors.border },
  btn: { flex: 1 },
  cancelBtn: { borderColor: colors.error },
});
