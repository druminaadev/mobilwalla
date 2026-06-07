import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft, Calendar, Clock, User, Tag, MapPin,
  Shield, CheckCircle2, XCircle, ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeStackParamList } from '@/types/navigation';
import { useBookingStore } from '@/store/bookingStore';
import { DEMO_SALONS, DEMO_STAFF } from '@/data/demo';
import { colors } from '@/constants/colors';
import { BookingProgress } from '@/components/booking/BookingProgress';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookingSummary'>;

const PINK = '#FF5C8A';

const VALID_COUPONS: Record<string, { pct: number; flat: number; label: string }> = {
  SAVE10:    { pct: 10, flat: 0,   label: '10% off applied!' },
  WEEKEND20: { pct: 20, flat: 0,   label: '20% off applied!' },
  FLAT100:   { pct: 0,  flat: 100, label: '₹100 flat off applied!' },
};

export default function BookingSummaryScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { salonId, staffId, date, time } = route.params;
  const { selectedServices, getTotalAmount, getTotalDuration } = useBookingStore();

  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];
  const staff = staffId && staffId !== 'any' && staffId !== null
    ? (DEMO_STAFF[salonId] ?? DEMO_STAFF.default).find((s) => s.id === staffId)
    : null;

  const [coupon,         setCoupon]         = useState('');
  const [appliedCoupon,  setAppliedCoupon]  = useState<string | null>(null);
  const [couponError,    setCouponError]    = useState('');

  const subtotal     = getTotalAmount();
  const gst          = Math.round(subtotal * 0.18);
  const couponData   = appliedCoupon ? VALID_COUPONS[appliedCoupon] : null;
  const discountAmt  = couponData
    ? couponData.flat > 0 ? couponData.flat : Math.round(subtotal * couponData.pct / 100)
    : 0;
  const total        = subtotal + gst - discountAmt;

  const applyCode = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code); setCouponError('');
    } else {
      setCouponError('Invalid code. Try SAVE10, WEEKEND20 or FLAT100');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCoupon(''); setCouponError(''); };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Review Booking</Text>
          <Text style={styles.headerSub}>Confirm your appointment</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <BookingProgress current={4} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Salon hero */}
        <View style={styles.salonCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80' }}
            style={styles.salonImg}
          />
          <View style={styles.salonInfo}>
            <Text style={styles.salonName}>{salon.name}</Text>
            <View style={styles.salonAddrRow}>
              <MapPin size={12} color={colors.textTertiary} />
              <Text style={styles.salonAddr}>{salon.addressLine1}, {salon.city}</Text>
            </View>
          </View>
        </View>

        {/* Appointment details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <View style={styles.detailGrid}>
            <View style={styles.detailCell}>
              <View style={[styles.detailIcon, { backgroundColor: '#FFF0F5' }]}>
                <Calendar size={17} color={PINK} />
              </View>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailVal}>
                {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </Text>
            </View>

            <View style={styles.detailCell}>
              <View style={[styles.detailIcon, { backgroundColor: '#FEF3C7' }]}>
                <Clock size={17} color="#F59E0B" />
              </View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailVal}>{time}</Text>
              <Text style={styles.detailSub}>{getTotalDuration()} min</Text>
            </View>

            <View style={[styles.detailCell, { width: '100%' }]}>
              <View style={[styles.detailIcon, { backgroundColor: '#ECFDF5' }]}>
                <User size={17} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>Stylist</Text>
                <Text style={styles.detailVal}>{staff ? staff.name : 'Any Available Expert'}</Text>
              </View>
              {staff?.avatarUrl && (
                <Image source={{ uri: staff.avatarUrl }} style={styles.staffThumb} />
              )}
            </View>
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Services</Text>
          <View style={styles.servicesCard}>
            {selectedServices.map((svc, i) => (
              <View
                key={svc.id}
                style={[styles.svcRow, i < selectedServices.length - 1 && styles.svcRowBorder]}
              >
                <View style={styles.svcDot} />
                <View style={styles.svcInfo}>
                  <Text style={styles.svcName}>{svc.name}</Text>
                  <Text style={styles.svcMeta}>{svc.duration} min</Text>
                </View>
                <Text style={styles.svcPrice}>₹{svc.price}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Coupon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          {appliedCoupon ? (
            <View style={styles.couponApplied}>
              <CheckCircle2 size={18} color="#10B981" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.couponAppliedTitle}>{couponData?.label}</Text>
                <Text style={styles.couponAppliedSub}>Saved ₹{discountAmt}</Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <XCircle size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.couponRow}>
                <View style={styles.couponInputWrap}>
                  <Tag size={15} color={colors.textTertiary} />
                  <TextInput
                    style={styles.couponInput}
                    placeholder="Enter promo code"
                    placeholderTextColor={colors.textTertiary}
                    value={coupon}
                    onChangeText={(t) => { setCoupon(t); setCouponError(''); }}
                    autoCapitalize="characters"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.couponApplyBtn, !coupon.trim() && { opacity: 0.5 }]}
                  onPress={applyCode}
                  disabled={!coupon.trim()}
                >
                  <Text style={styles.couponApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {!!couponError && <Text style={styles.couponError}>{couponError}</Text>}
              <View style={styles.couponHints}>
                {['SAVE10', 'WEEKEND20', 'FLAT100'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={styles.couponHintChip}
                    onPress={() => { setCoupon(c); setCouponError(''); }}
                  >
                    <Text style={styles.couponHintText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Bill */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.billCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billVal}>₹{subtotal}</Text>
            </View>
            {discountAmt > 0 && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: '#10B981' }]}>Discount</Text>
                <Text style={[styles.billVal, { color: '#10B981' }]}>−₹{discountAmt}</Text>
              </View>
            )}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>GST (18%)</Text>
              <Text style={styles.billVal}>₹{gst}</Text>
            </View>
            <View style={styles.billDivider} />
            <View style={styles.billRow}>
              <Text style={styles.billTotalLabel}>Total</Text>
              <Text style={styles.billTotalVal}>₹{total}</Text>
            </View>
          </View>
        </View>

        {/* Policy */}
        <View style={styles.policyRow}>
          <Shield size={15} color={colors.textTertiary} />
          <Text style={styles.policyText}>
            Free cancellation up to 2 hours before your appointment.
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.footerAmountRow}>
          <Text style={styles.footerAmountLabel}>Grand Total</Text>
          <Text style={styles.footerAmountVal}>₹{total}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Payment', {
            bookingData: { salonId, staffId, date, time, services: selectedServices, total },
          })}
          activeOpacity={0.9}
        >
          <LinearGradient colors={[PINK, '#FF3366']} style={styles.cta}>
            <Text style={styles.ctaText}>Proceed to Payment</Text>
            <ChevronRight size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F8FC' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#fff',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  headerSub:    { fontSize: 12, color: colors.textSecondary, marginTop: 1 },

  scroll: { paddingBottom: 20 },

  salonCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16,
    borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  salonImg:  { width: 80, height: 80 },
  salonInfo: { flex: 1, padding: 14 },
  salonName: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  salonAddrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  salonAddr: { fontSize: 12, color: colors.textSecondary, flex: 1, lineHeight: 17 },

  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },

  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  detailCell: {
    width: '47%', backgroundColor: '#fff', borderRadius: 16, padding: 14,
    alignItems: 'flex-start',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
    flexDirection: undefined as any,
  },
  detailIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  detailLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 },
  detailVal:   { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  detailSub:   { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  staffThumb:  { width: 44, height: 44, borderRadius: 22, marginLeft: 'auto' as any },

  servicesCard: {
    backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  svcRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  svcRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  svcDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: PINK, marginRight: 12 },
  svcInfo: { flex: 1 },
  svcName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  svcMeta: { fontSize: 12, color: colors.textTertiary },
  svcPrice: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },

  couponRow: { flexDirection: 'row', gap: 10 },
  couponInputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14,
    borderWidth: 1.5, borderColor: '#E2E8F0',
  },
  couponInput: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary, paddingVertical: 13 },
  couponApplyBtn: {
    backgroundColor: PINK, paddingHorizontal: 22, justifyContent: 'center', borderRadius: 14,
  },
  couponApplyText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  couponError: { fontSize: 12, color: '#EF4444', marginTop: 6, fontWeight: '500' },
  couponHints: { flexDirection: 'row', gap: 8, marginTop: 10 },
  couponHintChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1.5, borderColor: PINK, backgroundColor: '#FFF0F5',
  },
  couponHintText: { fontSize: 12, fontWeight: '700', color: PINK },
  couponApplied: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ECFDF5', padding: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#10B981',
  },
  couponAppliedTitle: { fontSize: 14, fontWeight: '800', color: '#10B981' },
  couponAppliedSub:   { fontSize: 12, color: '#10B981', marginTop: 2 },

  billCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  billRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  billLabel:      { fontSize: 14, color: colors.textSecondary },
  billVal:        { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  billDivider:    { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  billTotalLabel: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  billTotalVal:   { fontSize: 20, fontWeight: '800', color: PINK },

  policyRow: {
    flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 16,
    padding: 14, backgroundColor: '#F8FAFC', borderRadius: 14,
  },
  policyText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 16,
  },
  footerAmountRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  footerAmountLabel:{ fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  footerAmountVal:  { fontSize: 22, fontWeight: '800', color: PINK },
  cta: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    paddingVertical: 15, borderRadius: 16,
  },
  ctaText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
