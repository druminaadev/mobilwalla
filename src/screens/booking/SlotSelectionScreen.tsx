import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft, Calendar, Clock, Sun, Sunset, Moon, ChevronRight, Zap,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeStackParamList } from '@/types/navigation';
import { useBookingStore } from '@/store/bookingStore';
import { DEMO_SALONS, DEMO_STAFF } from '@/data/demo';
import { colors } from '@/constants/colors';
import { BookingProgress } from '@/components/booking/BookingProgress';

type Props = NativeStackScreenProps<HomeStackParamList, 'SlotSelection'>;

const PINK = '#FF5C8A';
const { width } = Dimensions.get('window');

const DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

const UNAVAILABLE = new Set(['09:30', '11:00', '14:30', '17:00', '18:30']);

const TIME_GROUPS = [
  { label: 'Morning',   icon: Sun,    color: '#F59E0B', slots: ['09:00','09:30','10:00','10:30','11:00','11:30'] },
  { label: 'Afternoon', icon: Sunset, color: '#EC4899', slots: ['12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30'] },
  { label: 'Evening',   icon: Moon,   color: '#8B5CF6', slots: ['16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'] },
];

export default function SlotSelectionScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { salonId, staffId } = route.params;
  const { selectedServices, getTotalAmount, getTotalDuration, setDateTime } = useBookingStore();

  const [dateIdx,       setDateIdx]       = useState(0);
  const [selectedTime,  setSelectedTime]  = useState<string | null>(null);

  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];
  const staff = staffId && staffId !== 'any' && staffId !== null
    ? (DEMO_STAFF[salonId] ?? DEMO_STAFF.default).find((s) => s.id === staffId)
    : null;

  const selectedDate = DATES[dateIdx];

  const handleContinue = () => {
    if (!selectedTime) return;
    setDateTime(selectedDate.toISOString().split('T')[0], { startTime: selectedTime, endTime: selectedTime });
    navigation.navigate('BookingSummary', {
      salonId, staffId,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
    });
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Pick Date & Time</Text>
          <Text style={styles.headerSub}>{salon.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <BookingProgress current={3} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Stylist context */}
        <View style={styles.contextCard}>
          {staff ? (
            <>
              <Image
                source={{ uri: staff.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=FF5C8A&color=fff&size=200` }}
                style={styles.contextAvatar}
              />
              <View>
                <Text style={styles.contextLabel}>Booking with</Text>
                <Text style={styles.contextName}>{staff.name}</Text>
                <Text style={styles.contextSpec}>{staff.specialization}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.contextAvatarPlaceholder}>
                <Zap size={22} color={PINK} />
              </View>
              <View>
                <Text style={styles.contextLabel}>Booking with</Text>
                <Text style={styles.contextName}>Any Available Expert</Text>
                <Text style={styles.contextSpec}>Best available stylist</Text>
              </View>
            </>
          )}
        </View>

        {/* Date strip */}
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
        >
          {DATES.map((date, i) => {
            const active  = dateIdx === i;
            const isToday = i === 0;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => { setDateIdx(i); setSelectedTime(null); }}
                activeOpacity={0.85}
              >
                {active ? (
                  <LinearGradient colors={[PINK, '#FF3366']} style={styles.dateCard}>
                    <Text style={[styles.dateMon, { color: 'rgba(255,255,255,0.8)' }]}>
                      {date.toLocaleDateString('en', { month: 'short' })}
                    </Text>
                    <Text style={[styles.dateDay, { color: '#fff' }]}>{date.getDate()}</Text>
                    <Text style={[styles.dateWkd, { color: 'rgba(255,255,255,0.9)' }]}>
                      {isToday ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' })}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.dateCard}>
                    <Text style={styles.dateMon}>{date.toLocaleDateString('en', { month: 'short' })}</Text>
                    <Text style={styles.dateDay}>{date.getDate()}</Text>
                    <Text style={styles.dateWkd}>
                      {isToday ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' })}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected date bar */}
        <View style={styles.dateBadge}>
          <Calendar size={15} color={PINK} />
          <Text style={styles.dateBadgeText}>
            {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {/* Time groups */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Free</Text>
            <View style={[styles.legendDot, { backgroundColor: '#E2E8F0' }]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>

        {TIME_GROUPS.map(({ label, icon: Icon, color, slots }) => (
          <View key={label} style={styles.timeGroup}>
            <View style={styles.timeGroupHeader}>
              <View style={[styles.timeGroupIcon, { backgroundColor: color + '20' }]}>
                <Icon size={15} color={color} />
              </View>
              <Text style={styles.timeGroupLabel}>{label}</Text>
            </View>
            <View style={styles.timeGrid}>
              {slots.map((time) => {
                const booked   = UNAVAILABLE.has(time);
                const isActive = selectedTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    disabled={booked}
                    onPress={() => setSelectedTime(time)}
                    activeOpacity={0.8}
                    style={[
                      styles.timeChip,
                      booked   && styles.timeChipBooked,
                      isActive && styles.timeChipActive,
                    ]}
                  >
                    <Text style={[
                      styles.timeChipText,
                      booked   && styles.timeChipTextBooked,
                      isActive && styles.timeChipTextActive,
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        {selectedTime ? (
          <View style={styles.selectedPill}>
            <View style={styles.selectedPillIcon}>
              <Clock size={16} color={PINK} />
            </View>
            <View>
              <Text style={styles.selectedPillLabel}>Selected Time</Text>
              <Text style={styles.selectedPillValue}>{selectedTime}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.footerHint}>Select a time slot to continue</Text>
        )}

        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedTime}
          activeOpacity={0.9}
          style={{ marginTop: 14 }}
        >
          <LinearGradient
            colors={selectedTime ? [PINK, '#FF3366'] : ['#CBD5E1', '#CBD5E1']}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Review Booking</Text>
            <ChevronRight size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CHIP_W = (width - 32 - 40) / 3;

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

  scroll: { paddingBottom: 160 },

  contextCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16,
    padding: 14, borderRadius: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  contextAvatar:            { width: 52, height: 52, borderRadius: 26, borderWidth: 2.5, borderColor: PINK },
  contextAvatarPlaceholder: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center' },
  contextLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  contextName:  { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  contextSpec:  { fontSize: 12, color: colors.textSecondary, marginTop: 1 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, paddingHorizontal: 16, marginTop: 22, marginBottom: 12 },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16, marginTop: 22, marginBottom: 12 },
  legend:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:    { width: 8, height: 8, borderRadius: 4 },
  legendText:   { fontSize: 11, color: colors.textTertiary, fontWeight: '600', marginRight: 4 },

  dateList: { paddingHorizontal: 16, gap: 10 },
  dateCard: {
    width: 66, height: 88, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  dateMon: { fontSize: 11, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', marginBottom: 2 },
  dateDay: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  dateWkd: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },

  dateBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 14, padding: 12,
    backgroundColor: '#FFF0F5', borderRadius: 12,
  },
  dateBadgeText: { fontSize: 13, fontWeight: '700', color: PINK },

  timeGroup: { paddingHorizontal: 16, marginBottom: 20 },
  timeGroupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  timeGroupIcon: { width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  timeGroupLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: {
    width: CHIP_W, paddingVertical: 13, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  timeChipActive: { backgroundColor: PINK, borderColor: PINK },
  timeChipBooked: { backgroundColor: '#F8FAFC', borderColor: '#F1F5F9', opacity: 0.6 },
  timeChipText:       { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  timeChipTextActive: { color: '#fff' },
  timeChipTextBooked: { color: colors.textTertiary, textDecorationLine: 'line-through' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 16,
  },
  selectedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFF0F5', padding: 12, borderRadius: 14,
  },
  selectedPillIcon: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  selectedPillLabel: { fontSize: 11, color: PINK, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  selectedPillValue: { fontSize: 18, fontWeight: '800', color: PINK },
  footerHint: { fontSize: 14, color: colors.textTertiary, textAlign: 'center', fontWeight: '500' },
  cta: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    paddingVertical: 15, borderRadius: 16,
  },
  ctaText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
