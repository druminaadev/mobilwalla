import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  CheckCircle, Calendar, Clock, MapPin, User, Scissors,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeStackParamList } from '@/types/navigation';
import { useBookingStore } from '@/store/bookingStore';
import { DEMO_SALONS } from '@/data/demo';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookingSuccess'>;

const PINK = '#FF5C8A';

export default function BookingSuccessScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { bookingId } = route.params;
  const { salonId, selectedServices, selectedDate, selectedSlot, selectedStaff, clearBooking } = useBookingStore();
  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];

  const scaleAnim   = useRef(new Animated.Value(0)).current;
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const totalAmount   = selectedServices.reduce((s, sv) => s + sv.price, 0);
  const totalDuration = selectedServices.reduce((s, sv) => s + sv.duration, 0);
  const finalAmount   = Math.round(totalAmount * 1.18);

  const handleViewBookings = () => {
    clearBooking();
    navigation.getParent()?.navigate('BookingsTab', { screen: 'BookingList' });
  };

  const handleHome = () => {
    clearBooking();
    navigation.navigate('Home');
  };

  const DETAILS = [
    {
      icon: MapPin,   bg: '#FFF0F5', color: PINK,
      label: 'Salon',
      val: salon.name, sub: `${salon.addressLine1}, ${salon.city}`,
    },
    {
      icon: Calendar, bg: '#EDE9FE', color: '#8B5CF6',
      label: 'Date',
      val: selectedDate
        ? new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
        : '—',
      sub: '',
    },
    {
      icon: Clock,    bg: '#FEF3C7', color: '#F59E0B',
      label: 'Time',
      val: selectedSlot?.startTime ?? '—',
      sub: `${totalDuration} min session`,
    },
    {
      icon: User,     bg: '#ECFDF5', color: '#10B981',
      label: 'Stylist',
      val: selectedStaff?.name ?? 'Any Available Expert',
      sub: selectedStaff?.specialization ?? '',
    },
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24 }]}
      >
        {/* Animated check */}
        <View style={styles.heroSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={styles.checkOuter}>
              <View style={styles.checkInner}>
                <CheckCircle size={52} color="#10B981" strokeWidth={1.5} />
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.heroText, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.heroTitle}>Booking Confirmed! 🎉</Text>
            <Text style={styles.heroSub}>Your appointment has been successfully booked</Text>

            {/* Booking ID */}
            <View style={styles.bookingIdChip}>
              <Scissors size={13} color={PINK} />
              <Text style={styles.bookingIdText}>ID: #{bookingId.toUpperCase()}</Text>
            </View>
          </Animated.View>
        </View>

        {/* Details card */}
        <Animated.View style={[styles.detailsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {DETAILS.map((d, i) => {
            const Icon = d.icon;
            if (!d.val) return null;
            return (
              <View key={d.label} style={[styles.detailRow, i < DETAILS.length - 1 && styles.detailRowBorder]}>
                <View style={[styles.detailIcon, { backgroundColor: d.bg }]}>
                  <Icon size={17} color={d.color} />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>{d.label}</Text>
                  <Text style={styles.detailVal}>{d.val}</Text>
                  {!!d.sub && <Text style={styles.detailSub}>{d.sub}</Text>}
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Services + Amount */}
        <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
          <Text style={styles.summaryTitle}>Services Booked</Text>
          {selectedServices.map((svc) => (
            <View key={svc.id} style={styles.svcRow}>
              <View style={styles.svcDot} />
              <Text style={styles.svcName}>{svc.name}</Text>
              <Text style={styles.svcPrice}>₹{svc.price}</Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalVal}>₹{finalAmount}</Text>
          </View>
        </Animated.View>

        {/* Info chips */}
        <Animated.View style={[styles.infoBox, { opacity: fadeAnim }]}>
          {[
            '📱 Confirmation sent to your phone',
            '🔔 Reminder 1 hour before your appointment',
            '❌ Cancel up to 2 hours before for full refund',
          ].map((msg) => (
            <Text key={msg} style={styles.infoText}>{msg}</Text>
          ))}
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity onPress={handleViewBookings} activeOpacity={0.9}>
          <LinearGradient colors={[PINK, '#FF3366']} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>View My Bookings</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleHome} activeOpacity={0.85}>
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#F7F8FC' },
  scroll: { paddingHorizontal: 16, paddingBottom: 20 },

  heroSection: { alignItems: 'center', marginBottom: 28 },
  checkOuter:  {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginBottom: 22,
  },
  checkInner: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
  },
  heroText:     { alignItems: 'center' },
  heroTitle:    { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginBottom: 6, letterSpacing: -0.4, textAlign: 'center' },
  heroSub:      { fontSize: 14, color: colors.textSecondary, fontWeight: '500', textAlign: 'center', marginBottom: 16 },
  bookingIdChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF0F5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#FFD6E5',
  },
  bookingIdText: { fontSize: 13, fontWeight: '800', color: '#FF5C8A' },

  detailsCard: {
    backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden', marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  detailRow:       { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 12 },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  detailIcon:      { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  detailInfo:      { flex: 1 },
  detailLabel:     { fontSize: 11, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 },
  detailVal:       { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  detailSub:       { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  summaryCard: {
    backgroundColor: '#fff', borderRadius: 22, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  summaryTitle:   { fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  svcRow:         { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  svcDot:         { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF5C8A', marginRight: 10 },
  svcName:        { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  svcPrice:       { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  summaryDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  totalRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel:     { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  totalVal:       { fontSize: 20, fontWeight: '800', color: '#FF5C8A' },

  infoBox: {
    backgroundColor: '#ECFDF5', borderRadius: 18, padding: 16, gap: 8,
  },
  infoText: { fontSize: 13, color: colors.textPrimary, lineHeight: 20 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10,
    gap: 10,
  },
  primaryBtn: {
    paddingVertical: 14, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  primaryBtnText:   { fontSize: 16, fontWeight: '800', color: '#fff' },
  secondaryBtn:     { paddingVertical: 13, borderRadius: 16, alignItems: 'center', backgroundColor: '#F1F5F9' },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
});
