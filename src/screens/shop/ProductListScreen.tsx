import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  TextInput, ScrollView, Dimensions, Animated, StatusBar, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ShoppingCart, Search, Heart, Star, SlidersHorizontal,
  Zap, Tag, TrendingUp, Sparkles, X,
} from 'lucide-react-native';
import { ShopStackParamList } from '@/types/navigation';
import { colors } from '@/constants/colors';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'ProductList'>;
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// ─── Data ─────────────────────────────────────────────────────────────────────

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  isNew?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: '1', name: 'Keratin Repair Serum', brand: 'L\'Oréal Paris', price: 899, originalPrice: 1099,
    rating: 4.5, reviews: 312, category: 'hair', badge: 'Best Seller', badgeColor: '#FF5C8A',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2', name: 'Vitamin C Glow Cream', brand: 'Neutrogena', price: 1299, originalPrice: 1599,
    rating: 4.3, reviews: 198, category: 'skin', badge: 'Top Rated', badgeColor: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3', name: 'Gel Nail Polish Set', brand: 'OPI', price: 799, originalPrice: 999,
    rating: 4.7, reviews: 445, category: 'nails',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80',
    isNew: true,
  },
  {
    id: '4', name: 'Argan Oil Hair Mask', brand: 'Moroccan Oil', price: 1599, originalPrice: 1999,
    rating: 4.6, reviews: 267, category: 'hair', badge: '20% OFF', badgeColor: '#10B981',
    image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '5', name: 'Matte Lipstick Kit', brand: 'MAC', price: 1899, originalPrice: 2200,
    rating: 4.8, reviews: 530, category: 'makeup', badge: 'Trending', badgeColor: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2abb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '6', name: 'Lavender Body Scrub', brand: 'The Body Shop', price: 699, originalPrice: 899,
    rating: 4.4, reviews: 189, category: 'body',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80',
    isNew: true,
  },
  {
    id: '7', name: 'Hyaluronic Face Serum', brand: 'The Ordinary', price: 2199, originalPrice: 2499,
    rating: 4.9, reviews: 712, category: 'skin', badge: 'Best Seller', badgeColor: '#FF5C8A',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '8', name: 'Bridal Makeup Kit', brand: 'Huda Beauty', price: 4999, originalPrice: 6000,
    rating: 4.7, reviews: 88, category: 'makeup', badge: 'Premium', badgeColor: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '9', name: 'Collagen Body Lotion', brand: 'Dove', price: 449, originalPrice: 599,
    rating: 4.2, reviews: 344, category: 'body',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '10', name: 'Anti-Dandruff Shampoo', brand: 'Head & Shoulders', price: 349, originalPrice: 449,
    rating: 4.1, reviews: 621, category: 'hair',
    image: 'https://images.unsplash.com/photo-1631390503308-c7f9e1fd3c70?auto=format&fit=crop&w=400&q=80',
  },
];

const CATEGORIES = [
  { id: 'all',    label: 'All',    emoji: '✨' },
  { id: 'hair',   label: 'Hair',   emoji: '💆' },
  { id: 'skin',   label: 'Skin',   emoji: '🧴' },
  { id: 'nails',  label: 'Nails',  emoji: '💅' },
  { id: 'makeup', label: 'Makeup', emoji: '💄' },
  { id: 'body',   label: 'Body',   emoji: '🛁' },
];

const SORT_OPTIONS = ['Popular', 'Price: Low', 'Price: High', 'Newest', 'Rating'];

const BANNERS = [
  { id: 'b1', title: 'Salon Essentials Sale', sub: 'Up to 40% off on premium brands', gradient: ['#FF5C8A', '#FF3366'] as const },
  { id: 'b2', title: 'New Arrivals 🌟', sub: 'Fresh picks added this week', gradient: ['#8B5CF6', '#6D28D9'] as const },
  { id: 'b3', title: 'Buy 2 Get 1 Free', sub: 'On all skincare products', gradient: ['#10B981', '#059669'] as const },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const HeroBanner = ({ onPress }: { onPress: () => void }) => {
  const [idx, setIdx] = useState(0);
  return (
    <View style={styles.bannerWrap}>
      <ScrollView
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIdx(Math.round(e.nativeEvent.contentOffset.x / (width - 32)))}
      >
        {BANNERS.map((b) => (
          <TouchableOpacity key={b.id} activeOpacity={0.9} onPress={onPress} style={{ width: width - 32 }}>
            <LinearGradient colors={b.gradient} style={styles.bannerCard}>
              <View style={styles.bannerCircle1} />
              <View style={styles.bannerCircle2} />
              <View style={styles.bannerTag}>
                <Zap size={11} color="#fff" />
                <Text style={styles.bannerTagText}>SALE</Text>
              </View>
              <Text style={styles.bannerTitle}>{b.title}</Text>
              <Text style={styles.bannerSub}>{b.sub}</Text>
              <View style={styles.bannerCta}>
                <Text style={styles.bannerCtaText}>Shop Now →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.bannerDots}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[styles.bannerDot, i === idx && styles.bannerDotActive]} />
        ))}
      </View>
    </View>
  );
};

const ProductCard = ({
  item,
  wishlisted,
  inCart,
  onPress,
  onWishlist,
  onAddCart,
}: {
  item: Product;
  wishlisted: boolean;
  inCart: boolean;
  onPress: () => void;
  onWishlist: () => void;
  onAddCart: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Image */}
        <View style={styles.cardImageWrap}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />

          {/* Discount pill */}
          {discount > 0 && (
            <View style={styles.discountPill}>
              <Text style={styles.discountText}>{discount}% off</Text>
            </View>
          )}

          {/* Badge */}
          {item.badge && (
            <View style={[styles.badgePill, { backgroundColor: item.badgeColor ?? '#FF5C8A' }]}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}

          {/* New tag */}
          {item.isNew && !item.badge && (
            <View style={styles.newPill}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          )}

          {/* Wishlist */}
          <TouchableOpacity style={styles.wishBtn} onPress={onWishlist} activeOpacity={0.8}>
            <Heart
              size={16}
              color={wishlisted ? '#FF5C8A' : '#94A3B8'}
              fill={wishlisted ? '#FF5C8A' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.cardBody}>
          <Text style={styles.cardBrand}>{item.brand}</Text>
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Star size={11} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingVal}>{item.rating}</Text>
            <Text style={styles.ratingCount}>({item.reviews})</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Add to cart */}
      <TouchableOpacity
        style={[styles.addBtn, inCart && styles.addBtnAdded]}
        onPress={onAddCart}
        activeOpacity={0.85}
      >
        {inCart ? (
          <Text style={styles.addBtnText}>✓ Added</Text>
        ) : (
          <>
            <ShoppingCart size={14} color="#fff" />
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProductListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [selectedCat, setSelectedCat] = useState('all');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [sortIdx, setSortIdx] = useState(0);
  const [showSort, setShowSort] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleCart = (id: string) =>
    setCart((c) => c.includes(id) ? c : [...c, id]);

  const toggleWishlist = (id: string) =>
    setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);

  const filtered = PRODUCTS
    .filter((p) =>
      (selectedCat === 'all' || p.category === selectedCat) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) ||
       p.brand.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortIdx === 1) return a.price - b.price;
      if (sortIdx === 2) return b.price - a.price;
      if (sortIdx === 4) return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  const renderHeader = useCallback(() => (
    <>
      {/* Hero Banner */}
      {!searchFocused && query === '' && selectedCat === 'all' && (
        <HeroBanner onPress={() => {}} />
      )}

      {/* Quick stats row */}
      {!searchFocused && query === '' && (
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <TrendingUp size={13} color="#FF5C8A" />
            <Text style={styles.statText}>Top Deals</Text>
          </View>
          <View style={styles.statChip}>
            <Sparkles size={13} color="#8B5CF6" />
            <Text style={styles.statText}>New Arrivals</Text>
          </View>
          <View style={styles.statChip}>
            <Tag size={13} color="#10B981" />
            <Text style={styles.statText}>Free Delivery ₹999+</Text>
          </View>
        </View>
      )}

      {/* Results label */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsLabel}>
          {query ? `"${query}"` : CATEGORIES.find((c) => c.id === selectedCat)?.label ?? 'All'}{' '}
          <Text style={styles.resultsCount}>({filtered.length})</Text>
        </Text>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSort((s) => !s)}>
          <SlidersHorizontal size={15} color={colors.textSecondary} />
          <Text style={styles.sortLabel}>{SORT_OPTIONS[sortIdx]}</Text>
        </TouchableOpacity>
      </View>

      {/* Sort sheet */}
      {showSort && (
        <View style={styles.sortSheet}>
          {SORT_OPTIONS.map((opt, i) => (
            <TouchableOpacity
              key={opt}
              style={[styles.sortOption, i === sortIdx && styles.sortOptionActive]}
              onPress={() => { setSortIdx(i); setShowSort(false); }}
            >
              <Text style={[styles.sortOptionText, i === sortIdx && styles.sortOptionTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  ), [searchFocused, query, selectedCat, filtered.length, sortIdx, showSort]);

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerSub}>Hair Ahmedabad</Text>
            <Text style={styles.headerTitle}>Shop</Text>
          </View>
          <View style={styles.headerActions}>
            {wishlist.length > 0 && (
              <View style={styles.headerIconWrap}>
                <Heart size={22} color="#FF5C8A" fill="#FF5C8A" />
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{wishlist.length}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity style={styles.headerIconWrap} onPress={() => navigation.navigate('Cart')}>
              <ShoppingCart size={22} color={colors.textPrimary} />
              {cart.length > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <Search size={18} color={searchFocused ? '#FF5C8A' : colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands…"
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCat === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catPill, active && styles.catPillActive]}
                onPress={() => setSelectedCat(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catLabel, active && styles.catLabelActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Product Grid ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySub}>Try a different category or search term</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            wishlisted={wishlist.includes(item.id)}
            inCart={cart.includes(item.id)}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            onWishlist={() => toggleWishlist(item.id)}
            onAddCart={() => toggleCart(item.id)}
          />
        )}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F8FC' },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 3,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 },
  headerSub: { fontSize: 12, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  headerIconWrap: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: colors.gray100,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  headerBadge: {
    position: 'absolute', top: -2, right: -2,
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: '#FF5C8A', justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 3, borderWidth: 2, borderColor: '#fff',
  },
  headerBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.gray100, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  searchBarFocused: { borderColor: '#FF5C8A', backgroundColor: '#FFF0F5' },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '500' },

  // Categories
  catList: { gap: 8, paddingRight: 4 },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 22,
    backgroundColor: colors.gray100, borderWidth: 1.5, borderColor: 'transparent',
  },
  catPillActive: { backgroundColor: '#FFF0F5', borderColor: '#FF5C8A' },
  catEmoji: { fontSize: 14 },
  catLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  catLabelActive: { color: '#FF5C8A', fontWeight: '700' },

  // Hero Banner
  bannerWrap: { marginHorizontal: 16, marginTop: 16, marginBottom: 4 },
  bannerCard: {
    width: width - 32, height: 160, borderRadius: 22,
    padding: 22, overflow: 'hidden', justifyContent: 'center',
  },
  bannerCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)', right: -40, top: -80,
  },
  bannerCircle2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)', right: 80, bottom: -50,
  },
  bannerTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, marginBottom: 10,
  },
  bannerTagText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  bannerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginBottom: 14 },
  bannerCta: {
    alignSelf: 'flex-start', backgroundColor: '#fff',
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
  },
  bannerCtaText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  bannerDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  bannerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gray300 },
  bannerDotActive: { width: 20, backgroundColor: '#FF5C8A' },

  // Stats row
  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 16, marginBottom: 4, flexWrap: 'wrap' },
  statChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: colors.gray200,
  },
  statText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  // Results row
  resultsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  resultsLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  resultsCount: { fontSize: 15, fontWeight: '500', color: colors.textTertiary },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: colors.gray200,
  },
  sortLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  // Sort sheet
  sortSheet: {
    marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16,
    padding: 8, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  sortOption: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
  sortOptionActive: { backgroundColor: '#FFF0F5' },
  sortOptionText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  sortOptionTextActive: { color: '#FF5C8A', fontWeight: '700' },

  // Grid
  listContent: { paddingBottom: 100 },
  row: { paddingHorizontal: 16, gap: 16, marginBottom: 16 },

  // Product Card
  card: {
    width: CARD_WIDTH, backgroundColor: '#fff', borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  cardImageWrap: { width: '100%', height: 170, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  discountPill: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  discountText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  badgePill: {
    position: 'absolute', bottom: 10, left: 10,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  newPill: {
    position: 'absolute', bottom: 10, left: 10,
    backgroundColor: '#3B82F6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  newText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  wishBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  cardBody: { padding: 12, paddingBottom: 8 },
  cardBrand: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 3 },
  cardName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, lineHeight: 18, marginBottom: 6, minHeight: 36 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  ratingVal: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  ratingCount: { fontSize: 11, color: colors.textTertiary },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  price: { fontSize: 16, fontWeight: '800', color: '#FF5C8A' },
  originalPrice: { fontSize: 12, color: colors.textTertiary, textDecorationLine: 'line-through' },
  addBtn: {
    margin: 10, marginTop: 0, backgroundColor: '#FF5C8A',
    paddingVertical: 9, borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  addBtnAdded: { backgroundColor: '#10B981' },
  addBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // Empty
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 6 },
  emptySub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
