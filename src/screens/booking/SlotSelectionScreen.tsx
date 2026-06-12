import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft, Calendar, Clock, Sun, Sunset, Moon, ChevronRight, Zap,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeStackParamList } from '../../types/navigation';
import { useBookingStore } from '../../store/bookingStore';
import { useTimeSlots } from '../../hooks/useTimeSlots';
import { DEMO_SALONS, DEMO_STAFF } from '../../data/demo';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { BookingProgress } from '../../components/booking/BookingProgress';
import { TimeSlot } from '../../types/models';

type Props = NativeStackScreenProps<HomeStackParamList, 'SlotSelection'>;

const { width } = Dimensions.get('window');

const DATES = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

const TIME_GROUP_META = [
  { label: 'Morning',   icon: Sun,    color: '#F59E0B' },
  { label: 'Afternoon', icon: Sunset, color: '#D9A355' },
  { label: 'Evening',   icon: Moon,   color: colors.primary },
];

export default function SlotSelectionScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { salonId, staffId } = route.params;
  const { setDateTime } = useBookingStore();

  const [dateIdx, setDateIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);

  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];
  const staff = staffId && staffId !== 'any' 
    ? (DEMO_STAFF[salonId] ?? DEMO_STAFF.default).find((s) => s.id === staffId)
    : null;

  const selectedDate = DATES[dateIdx];
  const dateStr = selectedDate.toISOString().split('T')[0];

  const { data: allSlots = [], isLoading, isError, refetch } = useTimeSlots(salonId, staffId ?? null, dateStr);

  // 2-Hour buffer rule if it's today
  const processedSlots = useMemo(() => {
    const isToday = dateIdx === 0;
    const now = new Date();
    
    return allSlots.map(slot => {
      let isPast = false;
      let isAvailable = slot.isAvailable;

      if (isToday) {
        const [hour, min] = slot.time.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hour, min, 0, 0);

        // 2-hour buffer rule
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        
        if (slotTime < twoHoursFromNow) {
          isPast = true;
          isAvailable = false;
        }
      }

      return { ...slot, isPast, isAvailable };
    });
  }, [allSlots, dateIdx]);

  const groupedSlots = useMemo(() => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];
    const evening: TimeSlot[] = [];

    processedSlots.forEach(slot => {
      const hour = parseInt(slot.time.split(':')[0], 10);
      if (hour < 12) morning.push(slot);
      else if (hour < 16) afternoon.push(slot);
      else evening.push(slot);
    });

    return [
      { ...TIME_GROUP_META[0], slots: morning },
      { ...TIME_GROUP_META[1], slots: afternoon },
      { ...TIME_GROUP_META[2], slots: evening },
    ].filter(g => g.slots.length > 0);
  }, [processedSlots]);

  // Reset selected time if date changes
  useEffect(() => {
    setSelectedTime(null);
  }, [dateIdx]);

  const handleContinue = () => {
    if (!selectedTime) return;
    
    setDateTime(dateStr, selectedTime);
    navigation.navigate('BookingSummary', {
      salonId, 
      staffId,
      date: dateStr,
      time: selectedTime.time,
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
                source={{ uri: staff.photo ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=606C5D&color=fff&size=200` }}
                style={styles.contextAvatar}
              />
              <View>
                <Text style={styles.contextLabel}>Booking with</Text>
                <Text style={styles.contextName}>{staff.name}</Text>
                <Text style={styles.contextSpec}>{staff.designation}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.contextAvatarPlaceholder}>
                <Zap size={22} color={colors.primary} />
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
        <View>
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
                  onPress={() => setDateIdx(i)}
                  activeOpacity={0.85}
                >
                  {active ? (
                    <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.dateCard}>
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
        </View>

        {/* Selected date bar */}
        <View style={styles.dateBadge}>
          <Calendar size={15} color={colors.primary} />
          <Text style={styles.dateBadgeText}>
            {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {/* Time groups */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Available Slots</Text>
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Free</Text>
            <View style={[styles.legendDot, { backgroundColor: colors.gray200 }]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading time slots...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>Failed to load slots</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : groupedSlots.length === 0 ? (
          <View style={styles.centerBox}>
             <Text style={styles.emptyIcon}>🕒</Text>
             <Text style={styles.emptyTitle}>No slots available</Text>
          </View>
        ) : (
          groupedSlots.map(({ label, icon: Icon, color, slots }, index) => (
            <View key={label} style={styles.timeGroup}>
              <View style={styles.timeGroupHeader}>
                <View style={[styles.timeGroupIcon, { backgroundColor: color + '20' }]}>
                  <Icon size={15} color={color} />
                </View>
                <Text style={styles.timeGroupLabel}>{label}</Text>
              </View>
              <View style={styles.timeGrid}>
                {slots.map((slot) => {
                  const booked   = !slot.isAvailable;
                  const isActive = selectedTime?.id === slot.id;
                  return (
                    <TouchableOpacity
                      key={slot.id}
                      disabled={booked}
                      onPress={() => setSelectedTime(slot)}
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
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Footer */}
      <View 
        style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}
      >
        {selectedTime ? (
          <View style={styles.selectedPill}>
            <View style={styles.selectedPillIcon}>
              <Clock size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.selectedPillLabel}>Selected Time</Text>
              <Text style={styles.selectedPillValue}>{selectedTime.time}</Text>
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
            colors={selectedTime ? [colors.primary, colors.primaryDark] : [colors.gray300, colors.gray300]}
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
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#fff',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray100,
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { ...typography.h3, color: colors.textPrimary },
  headerSub:    { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  scroll: { paddingBottom: 160 },

  contextCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16,
    padding: 14, borderRadius: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  contextAvatar:            { width: 52, height: 52, borderRadius: 26, borderWidth: 2.5, borderColor: colors.primary },
  contextAvatarPlaceholder: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  contextLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  contextName:  { ...typography.subtitle1, color: colors.textPrimary },
  contextSpec:  { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  sectionTitle: { ...typography.h4, color: colors.textPrimary, paddingHorizontal: 16, marginTop: 22, marginBottom: 12 },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16, marginTop: 22, marginBottom: 12 },
  legend:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:    { width: 8, height: 8, borderRadius: 4 },
  legendText:   { ...typography.caption, color: colors.textTertiary, marginRight: 4 },

  dateList: { paddingHorizontal: 16, gap: 10 },
  dateCard: {
    width: 66, height: 88, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  dateMon: { fontSize: 11, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', marginBottom: 2 },
  dateDay: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  dateWkd: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },

  dateBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 14, padding: 12,
    backgroundColor: colors.gray100, borderRadius: 12,
  },
  dateBadgeText: { ...typography.subtitle2, color: colors.primary },

  timeGroup: { paddingHorizontal: 16, marginBottom: 20 },
  timeGroupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  timeGroupIcon: { width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  timeGroupLabel: { ...typography.subtitle1, color: colors.textPrimary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: {
    width: CHIP_W, paddingVertical: 13, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center',
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeChipBooked: { backgroundColor: colors.gray100, borderColor: colors.gray100, opacity: 0.6 },
  timeChipText:       { ...typography.subtitle2, color: colors.textPrimary },
  timeChipTextActive: { color: '#fff' },
  timeChipTextBooked: { color: colors.textTertiary, textDecorationLine: 'line-through' },

  centerBox: { justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  loadingText: { ...typography.body2, color: colors.textSecondary, marginTop: 12 },
  errorText: { ...typography.body1, color: colors.error, marginBottom: 12 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: colors.primary, borderRadius: 20 },
  retryText: { ...typography.button, color: '#fff' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { ...typography.subtitle1, color: colors.textSecondary },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 16,
  },
  selectedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.primaryLight, padding: 12, borderRadius: 14,
  },
  selectedPillIcon: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  selectedPillLabel: { fontSize: 11, color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  selectedPillValue: { ...typography.h3, color: colors.primary },
  footerHint: { ...typography.body2, color: colors.textTertiary, textAlign: 'center' },
  cta: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    paddingVertical: 15, borderRadius: 16,
  },
  ctaText: { ...typography.button, color: '#fff' },
});
