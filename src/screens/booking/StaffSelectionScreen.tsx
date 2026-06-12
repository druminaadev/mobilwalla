import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft, Star, Check, Zap, Users, ChevronRight, Award
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from '@shopify/flash-list';

import { HomeStackParamList } from '../../types/navigation';
import { DEMO_SALONS } from '../../data/demo';
import { useBookingStore } from '../../store/bookingStore';
import { useStaff } from '../../hooks/useStaff';
import { Staff } from '../../types/models';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { BookingProgress } from '../../components/booking/BookingProgress';

type Props = NativeStackScreenProps<HomeStackParamList, 'StaffSelection'>;

export default function StaffSelectionScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { salonId } = route.params;

  const [selected, setSelected] = useState<string>('any');

  const {
    services: selectedServices,
    getTotal,
    getTotalDuration,
    setStaff,
    setStaffPriceModifier
  } = useBookingStore();

  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];

  const { data: staffList = [], isLoading, isError, refetch } = useStaff(salonId);
  const available = useMemo(() => staffList.filter((s) => s.isAvailable).length, [staffList]);

  const handleNext = () => {
    if (selected === 'any') {
      setStaff(null);
      setStaffPriceModifier(1.0);
      navigation.navigate('SlotSelection', { salonId, staffId: null });
    } else {
      const selectedStaff = staffList.find(s => s.id === selected);
      if (selectedStaff) {
        setStaff(selectedStaff);
        setStaffPriceModifier(selectedStaff.priceModifier || 1.0);
        navigation.navigate('SlotSelection', { salonId, staffId: selected });
      }
    }
  };

  const handleSkip = () => {
    setStaff(null);
    setStaffPriceModifier(1.0);
    navigation.navigate('SlotSelection', { salonId, staffId: null });
  };

  const renderHeader = () => (
    <>
      {/* Available count */}
      <View style={styles.availBanner}>
        <View style={styles.availIconWrap}>
          <Users size={16} color={colors.success} />
        </View>
        <Text style={styles.availText}>
          <Text style={{ fontWeight: '800', color: colors.textPrimary }}>{available} stylists</Text>
          {' '}available today
        </Text>
      </View>

      {/* Any available */}
      <View>
        <TouchableOpacity
          style={[styles.anyCard, selected === 'any' && styles.anyCardActive]}
          onPress={() => setSelected('any')}
          activeOpacity={0.9}
        >
          {selected === 'any' ? (
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.anyInner}>
              <View style={styles.anyIconWrap}>
                <Zap size={24} color={colors.primary} />
              </View>
              <View style={styles.anyInfo}>
                <Text style={[styles.anyTitle, { color: '#fff' }]}>Any Available</Text>
                <Text style={[styles.anySub, { color: 'rgba(255,255,255,0.85)' }]}>We pick the next free expert for you</Text>
              </View>
              <View style={styles.anyCheck}>
                <Check size={14} color={colors.primary} strokeWidth={3} />
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.anyInnerInactive}>
              <View style={styles.anyIconWrapInactive}>
                <Zap size={24} color={colors.primary} />
              </View>
              <View style={styles.anyInfo}>
                <Text style={styles.anyTitle}>Any Available</Text>
                <Text style={styles.anySub}>We pick the next free expert for you</Text>
              </View>
              <View style={styles.radioEmpty} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.orLabel}>— or choose a specific stylist —</Text>
    </>
  );

  const renderStaffCard = useCallback(({ item: member, index }: { item: Staff, index: number }) => {
    const isSelected = selected === member.id;
    const avatarUri = member.photo
      ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=606C5D&color=fff&size=200`;

    return (
      <View>
        <TouchableOpacity
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
              { backgroundColor: member.isAvailable ? colors.success : colors.gray400 },
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
            <Text style={[styles.staffSpec, isSelected && { color: colors.primary }]}>
              {member.designation}
            </Text>

            {member.specializations && member.specializations.length > 0 && (
              <Text style={styles.specializations} numberOfLines={1}>
                {member.specializations.join(' • ')}
              </Text>
            )}

            <View style={styles.staffStats}>
              <View style={styles.statChip}>
                <Star size={11} color={colors.rating} fill={colors.rating} />
                <Text style={styles.statText}>{member.rating} ({member.reviewCount})</Text>
              </View>
              <View style={styles.statChip}>
                <Award size={11} color={colors.textSecondary} />
                <Text style={styles.statText}>{member.experience} yrs exp</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightSection}>
            {member.priceModifier && member.priceModifier > 1.0 ? (
              <Text style={styles.premiumText}>+{(member.priceModifier * 100 - 100).toFixed(0)}%</Text>
            ) : <View />}
            {/* Radio */}
            {member.isAvailable && (
              <View style={[styles.radio, isSelected && styles.radioDone]}>
                {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [selected]);

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
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <BookingProgress current={2} />

      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading stylists...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>Failed to load stylists</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : staffList.length === 0 ? (
          <View style={styles.centerBox}>
            <Text style={styles.emptyIcon}>👤</Text>
            <Text style={styles.emptyTitle}>No staff available</Text>
          </View>
        ) : (
          <FlashList
            data={staffList}
            renderItem={renderStaffCard}
            // @ts-ignore - TS thinks estimatedItemSize is missing from intrinsic attributes
            estimatedItemSize={120}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.flashListContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Footer */}
      <View
        style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}
      >
        <View style={styles.footerInfo}>
          <View>
            <Text style={styles.footerServices}>
              {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''}
              {'  '}·{'  '}{getTotalDuration()} min
            </Text>
          </View>
          <Text style={styles.footerTotal}>₹{getTotal()}</Text>
        </View>
        <TouchableOpacity onPress={handleNext} activeOpacity={0.9}>
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.cta}>
            <Text style={styles.ctaText}>Pick Date & Time</Text>
            <ChevronRight size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  headerSub: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  skipBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.gray100 },
  skipText: { ...typography.subtitle2, color: colors.textSecondary },

  listContainer: { flex: 1 },
  flashListContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 180 },

  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
  loadingText: { ...typography.body2, color: colors.textSecondary, marginTop: 12 },
  errorText: { ...typography.body1, color: colors.error, marginBottom: 12 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: colors.primary, borderRadius: 20 },
  retryText: { ...typography.button, color: '#fff' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { ...typography.subtitle1, color: colors.textSecondary },

  availBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.successLight, padding: 14, borderRadius: 16, marginBottom: 20,
  },
  availIconWrap: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  availText: { ...typography.body2, color: colors.success },

  anyCard: {
    borderRadius: 20, marginBottom: 8, overflow: 'hidden',
    borderWidth: 2, borderColor: 'transparent',
  },
  anyCardActive: { borderColor: colors.primary },
  anyInner: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  anyInnerInactive: {
    flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  anyIconWrap: {
    width: 50, height: 50, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  anyIconWrapInactive: {
    width: 50, height: 50, borderRadius: 16, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  anyInfo: { flex: 1 },
  anyTitle: { ...typography.subtitle1, color: colors.textPrimary, marginBottom: 3 },
  anySub: { ...typography.caption, color: colors.textSecondary },
  anyCheck: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  radioEmpty: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: colors.border,
  },

  orLabel: {
    textAlign: 'center', ...typography.caption,
    color: colors.textTertiary, marginVertical: 16,
  },

  cardWrapper: { marginBottom: 12 },
  staffCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 20, padding: 14,
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  staffCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  staffCardDisabled: { opacity: 0.55 },

  avatarWrap: { position: 'relative', marginRight: 14 },
  avatar: {
    width: 62, height: 62, borderRadius: 31,
    borderWidth: 2.5, borderColor: colors.border,
  },
  statusDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff',
  },

  staffInfo: { flex: 1 },
  staffNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  staffName: { ...typography.subtitle1, color: colors.textPrimary },
  busyTag: { backgroundColor: colors.errorLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  busyTagText: { fontSize: 10, fontWeight: '700', color: colors.error, textTransform: 'uppercase' },
  staffSpec: { ...typography.subtitle2, color: colors.textSecondary, marginBottom: 4 },
  specializations: { ...typography.caption, color: colors.textTertiary, marginBottom: 8 },
  staffStats: { flexDirection: 'row', gap: 8 },
  statChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.gray100, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  statText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },

  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  premiumText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
    marginBottom: 8,
  },

  radio: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center',
  },
  radioDone: { backgroundColor: colors.primary, borderColor: colors.primary },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 16,
  },
  footerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  footerServices: { ...typography.subtitle2, color: colors.textPrimary },
  footerTotal: { ...typography.h2, color: colors.primary },
  cta: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    paddingVertical: 15, borderRadius: 16,
  },
  ctaText: { ...typography.button, color: '#fff' },
});
