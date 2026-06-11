import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft, Search, Clock, Plus, Minus, Scissors,
  Sparkles, Heart, Brush, Palette, Droplets, X,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, Layout, BounceIn } from 'react-native-reanimated';
import { useBookingStore } from '../../store/bookingStore';
import { DEMO_SALONS, DEMO_SERVICES } from '../../data/demo';
import { Service } from '../../types/models';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { BookingProgress } from '../../components/booking/BookingProgress';

type Props = NativeStackScreenProps<any, any>;

const PINK = colors.primary; // Using primary from our new color scheme
const GOLD = colors.accent;

const CAT_META: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  all:    { label: 'All',     icon: Sparkles, color: colors.primary, bg: colors.primaryLight },
  hair:   { label: 'Hair',    icon: Scissors, color: '#FF3366', bg: '#FFF0F3' },
  skin:   { label: 'Skin',    icon: Sparkles, color: '#D9A355', bg: '#FDF3E0' },
  body:   { label: 'Body',    icon: Heart,    color: '#14B8A6', bg: '#CCFBF1' },
  nails:  { label: 'Nails',   icon: Brush,    color: '#F59E0B', bg: '#FEF3C7' },
  makeup: { label: 'Makeup',  icon: Palette,  color: '#EF4444', bg: '#FEE2E2' },
  spa:    { label: 'Spa',     icon: Droplets, color: '#10B981', bg: '#D1FAE5' },
};

type GenderToggle = 'ALL' | 'MALE' | 'FEMALE';

export default function ServiceSelectionScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const salonId = route.params?.salonId ?? 's1';

  const { services: selectedServices, addService, removeService, setSalon, resetBooking,
    getTotal, getTotalDuration } = useBookingStore();

  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];
  const allServices: Service[] = DEMO_SERVICES[salonId] ?? DEMO_SERVICES.default ?? [];
  const categories = ['all', ...new Set(allServices.map((s) => s.category))];

  const [activeCat, setActiveCat] = useState('all');
  const [activeGender, setActiveGender] = useState<GenderToggle>('ALL');
  const [query, setQuery] = useState('');

  useEffect(() => { 
    resetBooking(); 
    if (salon) {
      setSalon(salon.id, salon.name, salon.coverImageUrl || salon.logoUrl || '');
    }
  }, [salonId]);

  const filtered = useMemo(() =>
    allServices.filter((s) => {
      const matchCat = activeCat === 'all' || s.category === activeCat;
      const matchQuery = s.name.toLowerCase().includes(query.toLowerCase());
      // Assuming Service model might get a gender tag in the future, simulating for now
      // If no gender tag, we just show all.
      const matchGender = activeGender === 'ALL' || true; 
      return matchCat && matchQuery && matchGender;
    }), [activeCat, query, activeGender, allServices]);

  const isSelected = (id: string) => selectedServices.some((s) => s.id === id);
  const toggle = (svc: Service) =>
    isSelected(svc.id) ? removeService(svc.id) : addService(svc);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Select Services</Text>
          <Text style={styles.headerSub}>{salon.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <BookingProgress current={1} />

      {/* Gender Toggle */}
      <View style={styles.genderToggleContainer}>
        {(['ALL', 'MALE', 'FEMALE'] as GenderToggle[]).map((gender) => (
          <TouchableOpacity 
            key={gender}
            style={[styles.genderBtn, activeGender === gender && styles.genderBtnActive]}
            onPress={() => setActiveGender(gender)}
          >
            <Text style={[styles.genderText, activeGender === gender && styles.genderTextActive]}>
              {gender === 'ALL' ? 'Unisex' : gender === 'MALE' ? 'Men' : 'Women'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Search size={17} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services…"
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X size={15} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category pills */}
      <ScrollView
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catList}
        style={styles.catScroll}
      >
        {categories.map((cat, index) => {
          const meta   = CAT_META[cat] ?? CAT_META.all;
          const active = activeCat === cat;
          const Icon   = meta.icon;
          return (
            <Animated.View entering={FadeIn.delay(index * 50)} key={cat}>
              <TouchableOpacity
                style={[styles.catPill, active && { backgroundColor: meta.color, borderColor: meta.color }]}
                onPress={() => setActiveCat(cat)}
                activeOpacity={0.8}
              >
                <Icon size={14} color={active ? '#fff' : meta.color} />
                <Text style={[styles.catPillText, active && { color: '#fff' }]}>{cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Services list */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No services found</Text>
          </View>
        )}
        {filtered.map((svc, index) => {
          const selected = isSelected(svc.id);
          const meta = CAT_META[svc.category] ?? CAT_META.all;
          const Icon = meta.icon;
          return (
            <Animated.View 
              key={svc.id} 
              entering={FadeInDown.delay(index * 50)} 
              layout={Layout.springify()}
            >
              <TouchableOpacity
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => toggle(svc)}
                activeOpacity={0.88}
              >
                <View style={[styles.cardIcon, { backgroundColor: selected ? PINK : meta.bg }]}>
                  <Icon size={20} color={selected ? '#fff' : meta.color} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{svc.name}</Text>
                  <Text style={styles.cardDesc} numberOfLines={1}>{svc.description}</Text>
                  <View style={styles.cardMeta}>
                    <Clock size={12} color={colors.textTertiary} />
                    <Text style={styles.cardMetaText}>{svc.duration} min</Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  {svc.discountedPrice ? (
                    <View style={styles.priceContainer}>
                      <Text style={styles.strikethroughPrice}>₹{svc.price}</Text>
                      <Text style={[styles.cardPrice, selected && { color: PINK }]}>₹{svc.discountedPrice}</Text>
                    </View>
                  ) : (
                    <Text style={[styles.cardPrice, selected && { color: PINK }]}>₹{svc.price}</Text>
                  )}
                  
                  <View style={[styles.toggleBtn, selected && styles.toggleBtnOn]}>
                    {selected
                      ? <Minus size={14} color="#fff" strokeWidth={3} />
                      : <Plus  size={14} color={PINK} strokeWidth={3} />}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Footer */}
      {selectedServices.length > 0 && (
        <Animated.View 
          entering={BounceIn}
          style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}
        >
          <View style={styles.footerTop}>
            <View>
              <Text style={styles.footerCount}>
                {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}
                {'  '}·{'  '}{getTotalDuration()} min
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                <View style={styles.chips}>
                  {selectedServices.map((s) => (
                    <TouchableOpacity key={s.id} style={styles.chip} onPress={() => removeService(s.id)}>
                      <Text style={styles.chipText}>{s.name}</Text>
                      <X size={10} color="#fff" strokeWidth={3} />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            <Text style={styles.footerTotal}>₹{getTotal()}</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('StaffSelection', { salonId })}
            activeOpacity={0.9}
          >
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.cta}>
              <Text style={styles.ctaText}>Choose Stylist</Text>
              <ArrowLeft size={18} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
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
  headerTitle:  { ...typography.h3, color: colors.textPrimary, letterSpacing: -0.3 },
  headerSub:    { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  genderToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: 4,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  genderBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
  },
  genderText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
  },
  genderTextActive: {
    color: colors.primary,
  },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginVertical: 12,
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  searchInput: { flex: 1, ...typography.body2, color: colors.textPrimary },

  catScroll: { maxHeight: 52 },
  catList:   { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.border,
  },
  catPillText: { ...typography.subtitle2, color: colors.textSecondary },

  list: { paddingHorizontal: 16, paddingTop: 14 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { ...typography.subtitle1, color: colors.textSecondary },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12,
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  cardIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardBody: { flex: 1 },
  cardName: { ...typography.subtitle1, color: colors.textPrimary, marginBottom: 3 },
  cardDesc: { ...typography.caption, color: colors.textSecondary, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { ...typography.caption, color: colors.textTertiary },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  priceContainer: { alignItems: 'flex-end' },
  strikethroughPrice: { ...typography.caption, textDecorationLine: 'line-through', color: colors.textTertiary },
  cardPrice: { ...typography.subtitle1, color: colors.textPrimary },
  toggleBtn: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: colors.gray100, borderWidth: 1.5, borderColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  toggleBtnOn: { backgroundColor: colors.primary, borderColor: colors.primary },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 16,
  },
  footerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  footerCount: { ...typography.subtitle2, color: colors.textPrimary },
  footerTotal: { ...typography.h2, color: colors.primary },
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  chipText: { ...typography.caption, color: '#fff' },
  cta: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    paddingVertical: 15, borderRadius: 16,
  },
  ctaText: { ...typography.button, color: '#fff' },
});
