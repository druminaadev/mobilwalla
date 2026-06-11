import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Calendar, Clock } from 'lucide-react-native';
import { BookingsStackParamList } from '../../types/navigation';
import { Button } from '../../components/common/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { DEMO_SALONS } from '../../data/demo';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { Booking } from '../../types/models';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = NativeStackScreenProps<BookingsStackParamList, 'Reschedule'>;

const DATES = Array.from({ length: 10 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  return d;
});

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function RescheduleScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;

  // Dummy mock booking to avoid dependencies breaking
  const booking: Booking = {
    id: bookingId,
    salonId: DEMO_SALONS[0].id,
    salonName: DEMO_SALONS[0].name,
    salonImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
    services: [],
    staff: null,
    date: new Date().toISOString(),
    time: '10:00',
    status: 'pending',
    totalAmount: 1200,
    paymentStatus: 'PENDING',
    paymentMethod: 'upi',
    createdAt: new Date().toISOString(),
  };

  const salon = DEMO_SALONS.find((s) => s.id === booking.salonId) ?? DEMO_SALONS[0];

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleConfirm = () => {
    Alert.alert('Rescheduled!', `Your booking at ${salon.name} has been rescheduled.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Reschedule Booking" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Booking Info */}
        <Animated.View entering={FadeInDown} style={styles.currentCard}>
          <Text style={styles.currentLabel}>Current Appointment</Text>
          <Text style={styles.currentSalon}>{salon.name}</Text>
          <Text style={styles.currentTime}>
            {new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {booking.time}
          </Text>
        </Animated.View>

        {/* Date Picker */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Select New Date</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
            {DATES.map((date, i) => {
              const selected = selectedDate?.toDateString() === date.toDateString();
              return (
                <TouchableOpacity key={i} style={[styles.dateCard, selected && styles.dateCardActive]} onPress={() => setSelectedDate(date)}>
                  <Text style={[styles.weekday, selected && styles.textActive]}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                  <Text style={[styles.day, selected && styles.textActive]}>{date.getDate()}</Text>
                  <Text style={[styles.month, selected && styles.textActive]}>{date.toLocaleDateString('en-US', { month: 'short' })}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Time Picker */}
        {selectedDate && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Select Time</Text>
            </View>
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map((time) => {
                const selected = selectedTime === time;
                return (
                  <TouchableOpacity key={time} style={[styles.timeChip, selected && styles.timeChipActive]} onPress={() => setSelectedTime(time)}>
                    <Text style={[styles.timeText, selected && styles.textActive]}>{time}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {selectedDate && selectedTime && (
        <Animated.View entering={FadeInDown} style={styles.footer}>
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedLabel}>New appointment</Text>
            <Text style={styles.selectedValue}>
              {selectedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {selectedTime}
            </Text>
          </View>
          <Button title="Confirm Reschedule" onPress={handleConfirm} fullWidth />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  currentCard: { margin: 16, padding: 16, backgroundColor: colors.primaryLight, borderRadius: 14 },
  currentLabel: { ...typography.caption, color: colors.primary, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase' },
  currentSalon: { ...typography.subtitle1, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  currentTime: { ...typography.body2, color: colors.textSecondary },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { ...typography.h6, color: colors.textPrimary },
  dateRow: { paddingBottom: 8, gap: 10 },
  dateCard: { width: 64, paddingVertical: 12, backgroundColor: colors.gray100, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  dateCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  weekday: { ...typography.caption, color: colors.textSecondary, marginBottom: 4 },
  day: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  month: { ...typography.caption, color: colors.textSecondary },
  textActive: { color: colors.primary, fontWeight: '700' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: colors.gray100, borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
  timeChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  timeText: { ...typography.body2, fontWeight: '600', color: colors.textPrimary },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border, gap: 10, backgroundColor: '#fff' },
  selectedInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectedLabel: { ...typography.body2, color: colors.textSecondary },
  selectedValue: { ...typography.subtitle2, color: colors.textPrimary },
});
