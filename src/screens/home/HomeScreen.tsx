import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Dimensions, FlatList, Animated, Image,
  StatusBar, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Search, MapPin, Star, Bell, Clock, Zap,
  Heart, Scissors, Sparkles, Droplets, Brush, Palette, LayoutGrid,
  ChevronRight, Gift, Wallet, CalendarCheck, ShoppingBag, Users,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeStackParamList } from '@/types/navigation';
import { DEMO_SALONS, DEMO_BOOKINGS, DEMO_USER, DEMO_WALLET, DEMO_STAFF } from '@/data/demo';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Salon, Staff } from '@/types/models';
import { BookingStatus } from '@/types/models';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;
const { width } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all',     name: 'All',     icon: LayoutGrid, color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'hair',    name: 'Hair',    icon: Scissors,   color: '#8B5CF6', bg: '#EDE9FE' },
  { id: 'facial',  name: 'Facial',  icon: Sparkles,   color: '#EC4899', bg: '#FCE7F3' },
  { id: 'spa',     name: 'Spa',     icon: Droplets,   color: '#14B8A6', bg: '#CCFBF1' },
  { id: 'nails',   name: 'Nails',   icon: Brush,      color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'makeup',  name: 'Makeup',  icon: Palette,    color: '#EF4444', bg: '#FEE2E2' },
  { id: 'massage', name: 'Massage', icon: Heart,      color: '#10B981', bg: '#D1FAE5' },
];

const OFFERS = [
  {
    id: 'o1', title: '20% Off This Weekend!', sub: 'Use code WEEKEND20',
    emoji: '🎉', gradient: ['#FF5C8A', '#FF8BA7'] as const,
  },
  {
    id: 'o2', title: 'Free Hair Spa Today', sub: 'On orders above ₹999',
    emoji: '✨', gradient: ['#8B5CF6', '#6366F1'] as const,
  },
  {
    id: 'o3', title: 'Refer & Earn ₹100', sub: 'Per successful referral',
    emoji: '🎁', gradient: ['#10B981', '#059669'] as const,
  },
];

const QUICK_ACTIONS = [
  { id: 'book',    label: 'Book Now',    icon: CalendarCheck, color: '#FF5C8A', bg: '#FFF0F5' },
  { id: 'wallet',  label: 'Wallet',      icon: Wallet,        color: '#8B5CF6', bg: '#F3F0FF' },
  { id: 'shop',    label: 'Shop',        icon: ShoppingBag,   color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'team',    label: 'Our Team',    icon: Users,         color: '#10B981', bg: '#ECFDF5' },
];

const TRENDING = [
  { id: 'tr1', name: 'Bridal Makeup',   price: 3500, duration: '3h', emoji: '👰', color: '#FF5C8A' },
  { id: 'tr2', name: 'Keratin Treat.',  price: 2800, duration: '2h', emoji: '💆', color: '#8B5CF6' },
  { id: 'tr3', name: 'Nail Extension',  price: 1200, duration: '1h', emoji: '💅', color: '#F59E0B' },
];

const SALON_IMAGES = [
  'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const OfferCard = ({
  item,
  onPress,
}: {
  item: typeof OFFERS[0];
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.92} style={styles.offerTouchable}>
    <LinearGradient colors={item.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.offerCard}>
      <View style={styles.offerCircle1} />
      <View style={styles.offerCircle2} />
      <Text style={styles.offerEmoji}>{item.emoji}</Text>
      <View style={styles.offerTextBlock}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerSub}>{item.sub}</Text>
      </View>
      <View style={styles.offerClaimBtn}>
        <Text style={styles.offerClaimText}>Claim →</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const QuickAction = ({
  item,
  onPress,
}: {
  item: typeof QUICK_ACTIONS[0];
  onPress: () => void;
}) => {
  const Icon = item.icon;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.qaItem}>
      <View style={[styles.qaIconBox, { backgroundColor: item.bg }]}>
        <Icon size={22} color={item.color} />
      </View>
      <Text style={styles.qaLabel}>{item.label}</Text>
    </TouchableOpacity>
  );
};

const TrendingCard = ({
  item,
  onPress,
}: {
  item: typeof TRENDING[0];
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={styles.trendCard}>
    <View style={[styles.trendEmojiBg, { backgroundColor: item.color + '18' }]}>
      <Text style={styles.trendEmoji}>{item.emoji}</Text>
    </View>
    <Text style={styles.trendName} numberOfLines={2}>{item.name}</Text>
    <Text style={styles.trendDuration}>{item.duration}</Text>
    <Text style={[styles.trendPrice, { color: item.color }]}>₹{item.price}</Text>
    <TouchableOpacity onPress={onPress} style={[styles.trendBookBtn, { backgroundColor: item.color }]}>
      <Text style={styles.trendBookText}>Book</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const SalonCardHorizontal = ({
  item,
  index,
  onPress,
}: {
  item: Salon;
  index: number;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.salonCardH}>
    <Image source={{ uri: SALON_IMAGES[(index + 2) % SALON_IMAGES.length] }} style={styles.salonImageH} />
    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.82)']} style={styles.salonGradientH} />
    <View style={styles.salonRatingBadge}>
      <Star size={11} color="#F59E0B" fill="#F59E0B" />
      <Text style={styles.salonRatingText}>{item.rating}</Text>
    </View>
    <View style={styles.salonInfoH}>
      <Text style={styles.salonNameH} numberOfLines={1}>{item.name}</Text>
      <View style={styles.salonMetaRow}>
        <MapPin size={11} color="#CBD5E1" />
        <Text style={styles.salonAddrH} numberOfLines={1}>{item.addressLine1}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const StylistCard = ({
  item,
  onBook,
}: {
  item: Staff;
  onBook: () => void;
}) => (
  <View style={styles.stylistCard}>
    <View style={styles.stylistImageWrap}>
      <Image
        source={{ uri: item.avatarUrl ?? 'https://via.placeholder.com/200' }}
        style={styles.stylistImage}
      />
      <View style={[styles.availBadge, { backgroundColor: item.isAvailable ? '#10B981' : '#94A3B8' }]}>
        <View style={styles.availDot} />
        <Text style={styles.availText}>{item.isAvailable ? 'Available' : 'Busy'}</Text>
      </View>
    </View>
    <Text style={styles.stylistName} numberOfLines={1}>{item.name}</Text>
    <Text style={styles.stylistSpec} numberOfLines={1}>{item.specialization}</Text>
    <View style={styles.stylistMeta}>
      <Star size={11} color="#F59E0B" fill="#F59E0B" />
      <Text style={styles.stylistRating}>{item.rating}</Text>
      <Text style={styles.stylistBookings}> · {item.totalBookings} clients</Text>
    </View>
    <TouchableOpacity
      style={[styles.stylistBookBtn, !item.isAvailable && styles.stylistBookBtnDisabled]}
      onPress={onBook}
      disabled={!item.isAvailable}
      activeOpacity={0.8}
    >
      <Text style={[styles.stylistBookText, !item.isAvailable && styles.stylistBookTextDisabled]}>
        {item.isAvailable ? 'Book' : 'Unavailable'}
      </Text>
    </TouchableOpacity>
  </View>
);

const SalonCardVertical = ({
  item,
  index,
  onPress,
}: {
  item: Salon;
  index: number;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.salonCardV}>
    <View style={styles.salonImageWrapV}>
      <Image source={{ uri: SALON_IMAGES[index % SALON_IMAGES.length] }} style={styles.salonImageV} />
      <View style={styles.distBadge}>
        <MapPin size={9} color={colors.textPrimary} />
        <Text style={styles.distText}>{item.distance} km</Text>
      </View>
    </View>
    <View style={styles.salonInfoV}>
      <Text style={styles.salonNameV} numberOfLines={1}>{item.name}</Text>
      <View style={styles.salonMetaRow}>
        <Star size={13} color={colors.warning} fill={colors.warning} />
        <Text style={styles.salonRatingV}>{item.rating}</Text>
        <Text style={styles.salonReviewsV}>({item.totalReviews})</Text>
      </View>
      <Text style={styles.salonAddrV} numberOfLines={1}>{item.addressLine1}</Text>
      <TouchableOpacity style={styles.bookNowBtn} onPress={onPress}>
        <Text style={styles.bookNowText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user) ?? DEMO_USER;
  const unreadNotifs = useNotificationStore((s) => s.unreadCount());

  const [selectedCat, setSelectedCat] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [offerIdx, setOfferIdx] = useState(0);
  const [flashSecs, setFlashSecs] = useState(3600);

  const scrollX = useRef(new Animated.Value(0)).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  // Flash sale countdown
  useEffect(() => {
    const t = setInterval(() => setFlashSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  // FAB breathing animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(fabScale, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(fabScale, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [fabScale]);

  const fmtCountdown = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const upcomingBooking = DEMO_BOOKINGS.find((b) => b.status === BookingStatus.CONFIRMED);
  const nearbySalons = [...DEMO_SALONS].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  const topRatedSalons = [...DEMO_SALONS].sort((a, b) => b.rating - a.rating);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise<void>((r) => setTimeout(() => r(), 700));
    setRefreshing(false);
  };

  const handleQuickAction = (id: string) => {
    if (id === 'book') navigation.navigate('SalonList', {});
    else if (id === 'wallet') navigation.getParent()?.navigate('ProfileTab', { screen: 'WalletHome' });
    else if (id === 'shop') navigation.getParent()?.navigate('ShopTab', { screen: 'ProductList' });
    else if (id === 'team') navigation.navigate('Team');
  };

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greetLabel}>{greeting()},</Text>
            <Text style={styles.greetName}>{user.name?.split(' ')[0] ?? 'There'} 👋</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.loyaltyChip}>
            <Gift size={13} color="#FF5C8A" />
            <Text style={styles.loyaltyText}>{DEMO_WALLET.loyaltyPoints} pts</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.getParent()?.navigate('ProfileTab', { screen: 'Notifications' })}
          >
            <Bell size={21} color={colors.textPrimary} />
            {unreadNotifs > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5C8A" />}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── Search ── */}
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')} activeOpacity={0.9}>
          <Search size={19} color={colors.textTertiary} />
          <Text style={styles.searchHint}>Search salons, services…</Text>
          <View style={styles.searchZap}>
            <Zap size={15} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* ── Flash Sale Banner ── */}
        <TouchableOpacity activeOpacity={0.9} style={styles.flashWrap} onPress={() => navigation.navigate('SalonList', {})}>
          <LinearGradient colors={['#FF5C8A', '#FF3366']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.flashBanner}>
            <View>
              <Text style={styles.flashLabel}>🔥 Flash Sale — Ends in</Text>
              <Text style={styles.flashTimer}>{fmtCountdown(flashSecs)}</Text>
            </View>
            <View style={styles.flashRight}>
              <Text style={styles.flashDiscount}>Up to 40% OFF</Text>
              <Text style={styles.flashSeeAll}>See deals →</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Upcoming Booking ── */}
        {upcomingBooking && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.getParent()?.navigate('BookingsTab', {
                screen: 'BookingDetail',
                params: { id: upcomingBooking.id },
              })
            }
            style={styles.upcomingWrap}
          >
            <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.upcomingCard}>
              <View style={styles.upcomingLeft}>
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingBadgeText}>Upcoming</Text>
                </View>
                <Text style={styles.upcomingSalon}>{upcomingBooking.salonName}</Text>
                <View style={styles.upcomingMeta}>
                  <Clock size={13} color={colors.gray400} />
                  <Text style={styles.upcomingDate}>
                    {new Date(upcomingBooking.bookingDate).toLocaleDateString('en-IN', {
                      weekday: 'short', day: 'numeric', month: 'short',
                    })}{' '}• {upcomingBooking.startTime}
                  </Text>
                </View>
              </View>
              <View style={styles.upcomingArrow}>
                <ChevronRight size={20} color={colors.gray400} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* ── Quick Actions ── */}
        <View style={styles.qaRow}>
          {QUICK_ACTIONS.map((qa) => (
            <QuickAction key={qa.id} item={qa} onPress={() => handleQuickAction(qa.id)} />
          ))}
        </View>

        {/* ── Offers Carousel ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SalonList', {})}>
              <Text style={styles.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={OFFERS}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.id}
            snapToInterval={width - 40 + 16}
            decelerationRate="fast"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(e) =>
              setOfferIdx(Math.round(e.nativeEvent.contentOffset.x / (width - 40 + 16)))
            }
            contentContainerStyle={styles.offerList}
            renderItem={({ item }) => (
              <OfferCard item={item} onPress={() => navigation.navigate('SalonList', {})} />
            )}
          />
          <View style={styles.offerDots}>
            {OFFERS.map((_, i) => (
              <View key={i} style={[styles.dot, offerIdx === i && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* ── Categories ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What are you looking for?</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
            {CATEGORIES.map((cat) => {
              const active = selectedCat === cat.id;
              const Icon = cat.icon;
              return (
                <TouchableOpacity key={cat.id} style={styles.catItem} onPress={() => setSelectedCat(cat.id)} activeOpacity={0.8}>
                  <View style={[styles.catIcon, { backgroundColor: active ? cat.color : cat.bg }]}>
                    <Icon size={22} color={active ? '#fff' : cat.color} />
                  </View>
                  <Text style={[styles.catName, active && { color: cat.color, fontWeight: '700' }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Trending Services ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Services</Text>
            <TouchableOpacity onPress={() => navigation.getParent()?.navigate('ServicesTab', { screen: 'ServicesCatalogue' })}>
              <Text style={styles.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendList}>
            {TRENDING.map((item) => (
              <TrendingCard
                key={item.id}
                item={item}
                onPress={() => navigation.navigate('SalonDetail', { id: 's1' })}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Meet Our Stylists ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meet Our Stylists</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Team')}>
              <Text style={styles.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stylistList}>
            {DEMO_STAFF['s1'].map((stylist) => (
              <StylistCard
                key={stylist.id}
                item={stylist}
                onBook={() => navigation.navigate('StaffSelection', { salonId: 's1' })}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Top Rated ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Rated Salons</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SalonList', {})}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={topRatedSalons}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(s) => s.id}
            contentContainerStyle={styles.hList}
            renderItem={({ item, index }) => (
              <SalonCardHorizontal
                item={item}
                index={index}
                onPress={() => navigation.navigate('SalonDetail', { id: item.id })}
              />
            )}
          />
        </View>

        {/* ── Nearby ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Near You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SalonList', {})}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.vList}>
            {nearbySalons.slice(0, 4).map((item, i) => (
              <SalonCardVertical
                key={item.id}
                item={item}
                index={i}
                onPress={() => navigation.navigate('SalonDetail', { id: item.id })}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── FAB ── */}
      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SalonList', {})}
          activeOpacity={0.88}
          style={styles.fabInner}
        >
          <LinearGradient colors={['#FF5C8A', '#FF3366']} style={styles.fabGradient}>
            <Scissors size={18} color="#fff" />
            <Text style={styles.fabText}>Book a Service</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F8FC' },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 8, backgroundColor: '#F7F8FC',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    borderWidth: 2.5, borderColor: '#FF5C8A',
  },
  greetLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  greetName: { fontSize: 19, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loyaltyChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FFF0F5', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: '#FFD6E5',
  },
  loyaltyText: { fontSize: 12, fontWeight: '700', color: '#FF5C8A' },
  notifBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  notifDot: {
    position: 'absolute', top: 10, right: 10,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.error, borderWidth: 1.5, borderColor: '#fff',
  },

  // Search
  searchBar: {
    marginHorizontal: 20, marginTop: 4, marginBottom: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.white, borderRadius: 16, paddingVertical: 10, paddingLeft: 14, paddingRight: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  searchHint: { flex: 1, fontSize: 14, color: colors.textTertiary, fontWeight: '500' },
  searchZap: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: '#FF5C8A', justifyContent: 'center', alignItems: 'center',
  },

  // Flash Sale
  flashWrap: { marginHorizontal: 20, marginBottom: 16 },
  flashBanner: {
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  flashLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: 2 },
  flashTimer: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  flashRight: { alignItems: 'flex-end' },
  flashDiscount: { fontSize: 18, fontWeight: '800', color: '#fff' },
  flashSeeAll: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  // Upcoming Booking
  upcomingWrap: {
    marginHorizontal: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 14, elevation: 5,
  },
  upcomingCard: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center' },
  upcomingLeft: { flex: 1 },
  upcomingBadge: {
    alignSelf: 'flex-start', backgroundColor: '#FF5C8A33',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8,
  },
  upcomingBadgeText: { color: '#FF8BA7', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  upcomingSalon: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 6 },
  upcomingMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  upcomingDate: { fontSize: 13, color: colors.gray400, fontWeight: '500' },
  upcomingArrow: { marginLeft: 8 },

  // Quick Actions
  qaRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 20, marginBottom: 24,
  },
  qaItem: { alignItems: 'center', width: (width - 56) / 4 },
  qaIconBox: {
    width: 54, height: 54, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  qaLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },

  // Section
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.4 },
  seeAll: { fontSize: 13, fontWeight: '600', color: '#FF5C8A' },

  // Offers
  offerList: { paddingHorizontal: 20, gap: 14 },
  offerTouchable: { width: width - 48 },
  offerCard: {
    width: width - 48, height: 130, borderRadius: 22,
    padding: 20, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  offerCircle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.1)', right: -40, top: -70,
  },
  offerCircle2: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.07)', right: 60, bottom: -50,
  },
  offerEmoji: { fontSize: 36, zIndex: 2 },
  offerTextBlock: { flex: 1, zIndex: 2 },
  offerTitle: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 4 },
  offerSub: { fontSize: 13, color: 'rgba(255,255,255,0.88)', fontWeight: '500' },
  offerClaimBtn: {
    backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, zIndex: 2,
  },
  offerClaimText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  offerDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gray300 },
  dotActive: { width: 22, backgroundColor: '#FF5C8A' },

  // Categories
  catList: { paddingLeft: 20, paddingRight: 8, gap: 16 },
  catItem: { alignItems: 'center', width: 70 },
  catIcon: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catName: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },

  // Stylists
  stylistList: { paddingLeft: 20, paddingRight: 8, gap: 14 },
  stylistCard: {
    width: 148, backgroundColor: colors.white, borderRadius: 20, padding: 14,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  stylistImageWrap: { width: 90, height: 90, borderRadius: 45, marginBottom: 10, position: 'relative' },
  stylistImage: { width: 90, height: 90, borderRadius: 45, borderWidth: 2.5, borderColor: '#FF5C8A' },
  availBadge: {
    position: 'absolute', bottom: 2, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: 3, borderRadius: 10, marginHorizontal: 6,
  },
  availDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  availText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  stylistName: { fontSize: 14, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', marginBottom: 2 },
  stylistSpec: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', marginBottom: 6, fontWeight: '500' },
  stylistMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  stylistRating: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, marginLeft: 3 },
  stylistBookings: { fontSize: 11, color: colors.textTertiary },
  stylistBookBtn: {
    backgroundColor: '#FF5C8A', paddingHorizontal: 20, paddingVertical: 7,
    borderRadius: 20, width: '100%', alignItems: 'center',
  },
  stylistBookBtnDisabled: { backgroundColor: colors.gray200 },
  stylistBookText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  stylistBookTextDisabled: { color: colors.textTertiary },

  // Trending
  trendList: { paddingLeft: 20, paddingRight: 8, gap: 14 },
  trendCard: {
    width: 140, backgroundColor: colors.white, borderRadius: 18, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  trendEmojiBg: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  trendEmoji: { fontSize: 26 },
  trendName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 4, lineHeight: 18 },
  trendDuration: { fontSize: 11, color: colors.textTertiary, fontWeight: '500', marginBottom: 6 },
  trendPrice: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  trendBookBtn: { paddingVertical: 7, borderRadius: 10, alignItems: 'center' },
  trendBookText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // Horizontal Salon Cards
  hList: { paddingLeft: 20, paddingRight: 8, gap: 14, paddingBottom: 6 },
  salonCardH: {
    width: 240, height: 240, borderRadius: 22, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 4,
  },
  salonImageH: { width: '100%', height: '100%', position: 'absolute' },
  salonGradientH: { width: '100%', height: '60%', position: 'absolute', bottom: 0 },
  salonRatingBadge: {
    position: 'absolute', top: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12,
  },
  salonRatingText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  salonInfoH: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  salonNameH: { fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 5 },
  salonMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  salonAddrH: { fontSize: 12, color: '#CBD5E1', fontWeight: '500', flex: 1 },

  // Vertical Salon Cards
  vList: { paddingHorizontal: 20, gap: 14 },
  salonCardV: {
    flexDirection: 'row', backgroundColor: colors.white, borderRadius: 18, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  salonImageWrapV: { width: 96, height: 96, borderRadius: 14, overflow: 'hidden', position: 'relative' },
  salonImageV: { width: '100%', height: '100%' },
  distBadge: {
    position: 'absolute', bottom: 6, left: 6,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8,
  },
  distText: { fontSize: 10, fontWeight: '700', color: colors.textPrimary },
  salonInfoV: { flex: 1, paddingLeft: 14, justifyContent: 'space-between' },
  salonNameV: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: 5, letterSpacing: -0.2 },
  salonRatingV: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  salonReviewsV: { fontSize: 12, color: colors.textTertiary },
  salonAddrV: { fontSize: 12, color: colors.textSecondary, fontWeight: '500', flex: 1 },
  bookNowBtn: {
    alignSelf: 'flex-start', backgroundColor: '#FFF0F5',
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 10, marginTop: 6,
  },
  bookNowText: { color: '#FF5C8A', fontSize: 13, fontWeight: '700' },

  // FAB
  fab: {
    position: 'absolute', bottom: 90, alignSelf: 'center',
    shadowColor: '#FF5C8A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10,
  },
  fabInner: { borderRadius: 32, overflow: 'hidden' },
  fabGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 28, paddingVertical: 14, borderRadius: 32,
  },
  fabText: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});
