import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft, Star, Check, Zap, Users, ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeStackParamList } from '@/types/navigation';
import { DEMO_STAFF, DEMO_SALONS } from '@/data/demo';
import { useBookingStore } from '@/store/bookingStore';
import { colors } from '@/constants/colors';
import { BookingProgress } from '@/components/booking/BookingProgress';

type Props = NativeStackScreenProps<HomeStackParamList, 'StaffSelection'>;

const PINK = '#FF5C8A';

export default function StaffSelectionScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { salonId } = route.params;
  const [selected, setSelected] = useState<string>('any');
  const { selectedServices, getTotalAmount, getTotalDuration } = useBookingStore();

  const salon    = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];
  const staffList = DEMO_STAFF[salonId] ?? DEMO_STAFF.default;
  const available = staffList.filter((s) => s.isAvailable).length;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Choose Stylist</Text>
          <Text style={styles.headerSub}>{salon.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('SlotSelection', { salonId, staffId: null })}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <BookingProgress current={2} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {/* Available count */}
        <View style={styles.availBanner}>
          <View style={styles.availIconWrap}>
            <Users size={16} color="#10B981" />
          </View>
          <Text style={styles.availText}>
            <Text style={{ fontWeight: '800', color: colors.textPrimary }}>{available} stylists</Text>
            {' '}available today
          </Text>
        </View>

        {/* Any available */}
        <TouchableOpacity
          style={[styles.anyCard, selected === 'any' && styles.anyCardActive]}
          onPress={() => setSelected('any')}
          activeOpacity={0.9}
        >
          {selected === 'any' ? (
            <LinearGradient colors={[PINK, '#FF3366']} style={styles.anyInner}>
              <View style={styles.anyIconWrap}>
                <Zap size={24} color={PINK} />
              </View>
              <View style={styles.anyInfo}>
                <Text style={[styles.anyTitle, { color: '#fff' }]}>Any Available</Text>
                <Text style={[styles.anySub, { color: 'rgba(255,255,255,0.85)' }]}>We pick the next free expert for you</Text>
              </View>
              <View style={styles.anyCheck}>
                <Check size={14} color={PINK} strokeWidth={3} />
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.anyInnerInactive}>
              <View style={styles.anyIconWrap}>
                <Zap size={24} color={PINK} />
              </View>
              <View style={styles.anyInfo}>
                <Text style={styles.anyTitle}>Any Available</Text>
                <Text style={styles.anySub}>We pick the next free expert for you</Text>
              </View>
              <View style={styles.radioEmpty} />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.orLabel}>— or choose a specific stylist —</Text>

        {/* Staff cards */}
        {staffList.map((member) => {
          const isSelected = selected === member.id;
          const avatarUri  = member.avatarUrl
            ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=FF5C8A&color=fff&size=200`;

          return (
            <TouchableOpacity
              key={member.id}
              style={[
                styles.staffCard,
                isSelected && styles.staffCardActive,
                !member.isAvailable && styles.staffCardDisabled,
              ]}
              onPress={() => member.isAvailable && setSelected(member.id)}
              activeOpacity={member.isAvailable ? 0.88 : 1}
            >
              {/* Avatar */}
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: avatarUri }}
                  style={[styles.avatar, !member.isAvailable && { opacity: 0.5 }]}
                />
                <View style={[
                  styles.statusDot,
                  { backgroundColor: member.isAvailable ? '#10B981' : '#94A3B8' },
                ]} />
              </View>

              {/* Info */}
              <View style={styles.staffInfo}>
                <View style={styles.staffNameRow}>
                  <Text style={styles.staffName}>{member.name}</Text>
                  {!member.isAvailable && (
                    <View style={styles.busyTag}>
                      <Text style={styles.busyTagText}>Busy</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.staffSpec, isSelected && { color: PINK }]}>
                  {member.specialization}
                </Text>
                <View style={styles.staffStats}>
                  <View style={styles.statChip}>
                    <Star size={11} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.statText}>{member.rating}</Text>
                  </View>
                  <View style={styles.statChip}>
                    <Text style={styles.statText}>✂ {member.totalBookings} clients</Text>
                  </View>
                </View>
              </View>

              {/* Radio */}
              {member.isAvailable && (
                <View style={[styles.radio, isSelected && styles.radioDone]}>
                  {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.footerInfo}>
          <View>
            <Text style={styles.footerServices}>
              {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''}
              {'  '}·{'  '}{getTotalDuration()} min
            </Text>
          </View>
          <Text style={styles.footerTotal}>₹{getTotalAmount()}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('SlotSelection', { salonId, staffId: selected })}
          activeOpacity={0.9}
        >
          <LinearGradient colors={[PINK, '#FF3366']} style={styles.cta}>
            <Text style={styles.ctaText}>Pick Date & Time</Text>
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
  skipBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  skipText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },

  list: { paddingHorizontal: 16, paddingTop: 16 },

  availBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#ECFDF5', padding: 14, borderRadius: 16, marginBottom: 20,
  },
  availIconWrap: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  availText: { fontSize: 14, color: '#10B981', fontWeight: '600' },

  anyCard: {
    borderRadius: 20, marginBottom: 8, overflow: 'hidden',
    borderWidth: 2, borderColor: 'transparent',
  },
  anyCardActive: { borderColor: '#FF5C8A' },
  anyInner: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  anyInnerInactive: {
    flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  anyIconWrap: {
    width: 50, height: 50, borderRadius: 16, backgroundColor: '#FFF0F5',
    justifyContent: 'center', alignItems: 'center',
  },
  anyInfo: { flex: 1 },
  anyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 3 },
  anySub:   { fontSize: 13, color: colors.textSecondary },
  anyCheck: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  radioEmpty: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#E2E8F0',
  },

  orLabel: {
    textAlign: 'center', fontSize: 12, fontWeight: '600',
    color: colors.textTertiary, marginVertical: 16,
  },

  staffCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 20, padding: 14, marginBottom: 12,
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  staffCardActive:   { borderColor: '#FF5C8A', backgroundColor: '#FFF5F8' },
  staffCardDisabled: { opacity: 0.55 },

  avatarWrap: { position: 'relative', marginRight: 14 },
  avatar: {
    width: 62, height: 62, borderRadius: 31,
    borderWidth: 2.5, borderColor: '#E2E8F0',
  },
  statusDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff',
  },

  staffInfo: { flex: 1 },
  staffNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  staffName: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  busyTag: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  busyTagText: { fontSize: 10, fontWeight: '700', color: '#EF4444', textTransform: 'uppercase' },
  staffSpec: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  staffStats: { flexDirection: 'row', gap: 8 },
  statChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  statText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },

  radio: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center',
  },
  radioDone: { backgroundColor: '#FF5C8A', borderColor: '#FF5C8A' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 16,
  },
  footerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  footerServices: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  footerTotal: { fontSize: 22, fontWeight: '800', color: '#FF5C8A' },
  cta: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    paddingVertical: 15, borderRadius: 16,
  },
  ctaText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
