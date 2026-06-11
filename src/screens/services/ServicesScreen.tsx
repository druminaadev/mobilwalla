import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, Dimensions, FlatList, Platform, Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Search, Clock, Star, Plus, Sparkles,
  Scissors, Smile, Zap, Droplets, Heart, Flower2, ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ServicesStackParamList } from '../../types/navigation';
import { DEMO_SALONS, DEMO_SERVICES } from '../../data/demo';
import { Service } from '../../types/models';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<ServicesStackParamList, 'ServicesCatalogue'>;

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all',    label: 'All',    Icon: Sparkles, color: '#FF5C8A', bg: '#EEF1ED' },
  { id: 'hair',   label: 'Hair',   Icon: Scissors, color: '#FF3366', bg: '#EEF1ED' },
  { id: 'skin',   label: 'Skin',   Icon: Smile,    color: '#D9A355', bg: '#FDF3E0' },
  { id: 'body',   label: 'Body',   Icon: Zap,      color: '#14B8A6', bg: '#CCFBF1' },
  { id: 'nails',  label: 'Nails',  Icon: Droplets, color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'makeup', label: 'Makeup', Icon: Flower2,  color: '#EF4444', bg: '#FEE2E2' },
  { id: 'spa',    label: 'Spa',    Icon: Heart,    color: '#10B981', bg: '#D1FAE5' },
];

function getAllServices(): (Service & { salonName: string; salonId: string })[] {
  const seen = new Set<string>();
  const result: (Service & { salonName: string; salonId: string })[] = [];
  DEMO_SALONS.forEach((salon) => {
    const services = DEMO_SERVICES[salon.id] ?? DEMO_SERVICES.default;
    services.forEach((svc) => {
      const key = svc.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ ...svc, salonId: salon.id, salonName: salon.name });
      }
    });
  });
  return result;
}

// ─── Category Pill ────────────────────────────────────────────────────────────
function CategoryPill({
  cat, isActive, onPress,
}: { cat: typeof CATEGORIES[0]; isActive: boolean; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={[
          styles.catPill,
          { backgroundColor: isActive ? cat.color : colors.white, borderColor: isActive ? cat.color : colors.gray200 },
        ]}
      >
        <cat.Icon size={16} color={isActive ? '#fff' : colors.textSecondary} strokeWidth={2} />
        <Text style={[styles.catPillText, { color: isActive ? '#fff' : colors.textSecondary }]}>{cat.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, onBook, onDetail }: { service: Service & { salonName: string; salonId: string }; onBook: () => void; onDetail: () => void }) {
  const cat = CATEGORIES.find((c) => c.id === service.category) ?? CATEGORIES[0];

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onDetail} style={styles.card}>
      <View style={[styles.cardIconWrap, { backgroundColor: cat.bg }]}>
        <cat.Icon size={24} color={cat.color} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{service.name}</Text>
        <Text style={styles.cardDesc} numberOfLines={1}>{service.description}</Text>
        <View style={styles.cardMeta}>
          <Clock size={12} color={colors.textTertiary} />
          <Text style={styles.metaText}>{service.duration} min</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{service.salonName}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardPrice}>₹{service.price}</Text>
        <TouchableOpacity onPress={onBook} style={styles.bookBtn}>
          <Text style={styles.bookBtnText}>Book</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Featured Banner ──────────────────────────────────────────────────────────
function FeaturedBanner({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95} style={styles.bannerContainer}>
      <LinearGradient colors={['#FF5C8A', '#FF3366']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.banner}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerBadge}>
            <Sparkles size={12} color={colors.white} />
            <Text style={styles.bannerBadgeText}>TRENDING</Text>
          </View>
          <Text style={styles.bannerTitle}>Premium Glow-Up</Text>
          <Text style={styles.bannerSub}>Complete Hair & Spa combo from ₹1,499</Text>
          <View style={styles.bannerCta}>
            <Text style={styles.bannerCtaText}>Explore Packages</Text>
            <ChevronRight size={14} color={colors.primary} />
          </View>
        </View>
        <View style={styles.bannerDecorCircle1} />
        <View style={styles.bannerDecorCircle2} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ServicesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [activeCat, setActiveCat] = useState('all');
  const [query, setQuery]         = useState('');

  const allServices = useMemo(() => getAllServices(), []);

  const filtered = useMemo(() =>
    allServices.filter((s) =>
      (activeCat === 'all' || s.category === activeCat) &&
      (s.name.toLowerCase().includes(query.toLowerCase()) ||
       (s.description ?? '').toLowerCase().includes(query.toLowerCase()))
    ), [activeCat, query]);

  const handleBook = (service: Service & { salonName: string; salonId: string }) => {
    navigation.navigate('ServiceBooking', {
      salonId: service.salonId || DEMO_SALONS[0].id,
      preSelectedServiceId: service.id,
    });
  };

  const handleDetail = (service: Service & { salonName: string; salonId: string }) => {
    navigation.navigate('ServiceDetail', { service });
  };

  const handleNewBooking = () =>
    navigation.navigate('ServiceBooking', { salonId: DEMO_SALONS[0].id });

  return (
    <View style={styles.container}>
      {/* ── Modern Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <View>
          <Text style={styles.headerGreet}>Discover</Text>
          <Text style={styles.headerTitle}>Our Services</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{allServices.length}+</Text>
        </View>
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for haircut, spa, facial..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => `${item.id}-${item.salonId}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Category Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
              {CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat.id}
                  cat={cat}
                  isActive={activeCat === cat.id}
                  onPress={() => setActiveCat(cat.id)}
                />
              ))}
            </ScrollView>

            {/* Featured Banner */}
            {activeCat === 'all' && query === '' && <FeaturedBanner onPress={handleNewBooking} />}

            {/* Section Title */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>
                {activeCat === 'all' ? 'All Services' : `${CATEGORIES.find((c) => c.id === activeCat)?.label} Services`}
              </Text>
              <Text style={styles.sectionCount}>{filtered.length} results</Text>
            </View>
          </>
        }
        renderItem={({ item }) => <ServiceCard service={item} onBook={() => handleBook(item)} onDetail={() => handleDetail(item)} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Search size={48} color={colors.gray200} />
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptySub}>Try adjusting your search criteria</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, paddingBottom: 10 },
  headerGreet: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  countBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 4 },
  countBadgeText: { color: colors.primary, fontSize: 13, fontWeight: '700' },

  // Search
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: 20, marginBottom: 16, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary, fontWeight: '500', marginLeft: 10 },
  clearBtn: { padding: 4, backgroundColor: colors.gray100, borderRadius: 12 },
  clearText: { fontSize: 12, color: colors.textSecondary, fontWeight: '700' },

  // List & Layout
  list: { paddingBottom: 100 },
  
  // Category Pills
  catRow: { paddingHorizontal: 20, gap: 10, paddingBottom: 16, paddingTop: 4 },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1 },
  catPillText: { fontSize: 14, fontWeight: '600' },

  // Featured Banner
  bannerContainer: { paddingHorizontal: 20, marginBottom: 24 },
  banner: { borderRadius: 24, padding: 24, overflow: 'hidden', position: 'relative' },
  bannerContent: { position: 'relative', zIndex: 10 },
  bannerBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  bannerBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: colors.white, marginBottom: 6 },
  bannerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginBottom: 16 },
  bannerCta: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.white, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  bannerCtaText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  
  bannerDecorCircle1: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.1)', top: -50, right: -20 },
  bannerDecorCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', bottom: -20, right: 80 },

  // Sections
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  sectionCount: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },

  // Service Card
  card: { flexDirection: 'row', backgroundColor: colors.white, marginHorizontal: 20, marginBottom: 16, padding: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: colors.gray100 },
  cardIconWrap: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardBody: { flex: 1, justifyContent: 'center' },
  cardName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: colors.textTertiary, fontWeight: '500' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textTertiary },
  
  cardRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  cardPrice: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  bookBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12 },
  bookBtnText: { color: colors.primary, fontSize: 13, fontWeight: '700' },

  // Empty
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: 16 },
  emptySub: { fontSize: 14, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
});