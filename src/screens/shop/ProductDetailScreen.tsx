import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  Dimensions, Animated, Platform, StatusBar,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, Heart, Share2, Star, Minus, Plus, ShoppingCart,
  Truck, ShieldCheck, RotateCcw, ChevronDown, ChevronUp,
} from 'lucide-react-native';
import { ShopStackParamList } from '@/types/navigation';
import { colors } from '@/constants/colors';
import { Product } from './ProductListScreen';

type RouteType = RouteProp<ShopStackParamList, 'ProductDetail'>;
const { width } = Dimensions.get('window');

const SIZES = ['50ml', '100ml', '150ml', '200ml'];

const REVIEWS = [
  { id: 'rv1', name: 'Priya S.', rating: 5, comment: 'Absolutely love this! My hair feels so smooth and shiny after just one use.', date: '12 Jan 2024' },
  { id: 'rv2', name: 'Meera K.', rating: 4, comment: 'Good product, nice fragrance. Packaging could be better but overall great.', date: '8 Jan 2024' },
  { id: 'rv3', name: 'Anjali P.', rating: 5, comment: 'Best product I\'ve used in years. Highly recommend for damaged hair!', date: '3 Jan 2024' },
];

const PERKS = [
  { icon: Truck, label: 'Free Delivery', sub: 'On orders above ₹999', color: '#3B82F6' },
  { icon: ShieldCheck, label: 'Authentic', sub: '100% genuine products', color: '#10B981' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '7-day return policy', color: '#F59E0B' },
];

export default function ProductDetailScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Use passed product or fallback
  const passedProduct = route.params?.product as Product | undefined;
  const product = passedProduct ?? {
    id: '1', name: 'Keratin Repair Serum', brand: 'L\'Oréal Paris',
    price: 899, originalPrice: 1099, rating: 4.5, reviews: 312,
    category: 'hair', badge: 'Best Seller', badgeColor: '#FF5C8A',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80',
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [wishlisted, setWishlisted] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const headerBg = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
    extrapolate: 'clamp',
  });

  const handleWishlist = () => {
    setWishlisted((w) => !w);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 50 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
  };

  const handleAddCart = () => setInCart(true);

  const avgRating = product.rating ?? 4.5;
  const totalReviews = product.reviews ?? 312;

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}

      {/* ── Sticky transparent → opaque header ── */}
      <Animated.View style={[styles.topBar, { paddingTop: insets.top + 4, backgroundColor: headerBg }]}>
        <TouchableOpacity style={styles.topBarBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Animated.View style={[styles.topBarBtn, { transform: [{ scale: heartScale }] }]}>
          <TouchableOpacity onPress={handleWishlist}>
            <Heart
              size={20}
              color={wishlisted ? '#FF5C8A' : colors.textPrimary}
              fill={wishlisted ? '#FF5C8A' : 'transparent'}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── Product Hero Image ── */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: product.image }} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.18)']} style={styles.heroGradient} />

          {/* Discount badge */}
          {discount > 0 && (
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>

          {/* Brand + name */}
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating row */}
          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s} size={14}
                  color="#F59E0B"
                  fill={s <= Math.round(avgRating) ? '#F59E0B' : 'transparent'}
                />
              ))}
            </View>
            <Text style={styles.ratingVal}>{avgRating}</Text>
            <Text style={styles.ratingCount}>({totalReviews} reviews)</Text>
          </View>

          {/* Price row */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price * quantity}</Text>
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            {discount > 0 && (
              <View style={styles.savingBadge}>
                <Text style={styles.savingText}>Save ₹{product.originalPrice - product.price}</Text>
              </View>
            )}
          </View>

          {/* Size selector */}
          <Text style={styles.sectionLabel}>Select Size</Text>
          <View style={styles.sizesRow}>
            {SIZES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.sizeChip, selectedSize === s && styles.sizeChipActive]}
                onPress={() => setSelectedSize(s)}
                activeOpacity={0.8}
              >
                <Text style={[styles.sizeChipText, selectedSize === s && styles.sizeChipTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity */}
          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              activeOpacity={0.8}
            >
              <Minus size={16} color={quantity === 1 ? colors.textTertiary : colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.qtyVal}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => q + 1)}
              activeOpacity={0.8}
            >
              <Plus size={16} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.qtyTotal}>= ₹{product.price * quantity}</Text>
          </View>

          {/* Perks */}
          <View style={styles.perksRow}>
            {PERKS.map((p) => {
              const Icon = p.icon;
              return (
                <View key={p.label} style={styles.perkItem}>
                  <View style={[styles.perkIcon, { backgroundColor: p.color + '18' }]}>
                    <Icon size={18} color={p.color} />
                  </View>
                  <Text style={styles.perkLabel}>{p.label}</Text>
                  <Text style={styles.perkSub}>{p.sub}</Text>
                </View>
              );
            })}
          </View>

          {/* Description */}
          <TouchableOpacity
            style={styles.descHeader}
            onPress={() => setDescExpanded((e) => !e)}
            activeOpacity={0.8}
          >
            <Text style={styles.sectionLabel}>Description</Text>
            {descExpanded ? <ChevronUp size={18} color={colors.textSecondary} /> : <ChevronDown size={18} color={colors.textSecondary} />}
          </TouchableOpacity>
          {descExpanded && (
            <Text style={styles.descText}>
              Premium {product.name} by {product.brand}. Specially formulated to repair, strengthen and
              nourish for professional-quality results at home. Enriched with active ingredients that
              penetrate deep for long-lasting effects. Suitable for all hair and skin types.
              {'\n\n'}Key ingredients: Keratin · Argan Oil · Vitamin E · Hyaluronic Acid.
            </Text>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Reviews */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionLabel}>Customer Reviews</Text>
            <View style={styles.reviewsSummary}>
              <Text style={styles.reviewsBigRating}>{avgRating}</Text>
              <View>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} color="#F59E0B" fill={s <= Math.round(avgRating) ? '#F59E0B' : 'transparent'} />
                  ))}
                </View>
                <Text style={styles.reviewsTotalText}>Based on {totalReviews} reviews</Text>
              </View>
            </View>
          </View>

          {REVIEWS.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={11} color="#F59E0B" fill={s <= r.rating ? '#F59E0B' : 'transparent'} />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <Text style={styles.reviewComment}>{r.comment}</Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* ── Sticky Footer ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.cartBtn, inCart && styles.cartBtnAdded]}
          onPress={handleAddCart}
          activeOpacity={0.88}
        >
          <ShoppingCart size={18} color={inCart ? '#10B981' : '#FF5C8A'} />
          <Text style={[styles.cartBtnText, inCart && styles.cartBtnTextAdded]}>
            {inCart ? 'Added!' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={handleAddCart} activeOpacity={0.9}>
          <LinearGradient colors={['#FF5C8A', '#FF3366']} style={styles.buyGradient}>
            <Text style={styles.buyBtnText}>Buy Now · ₹{product.price * quantity}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },

  // Top bar
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
  },
  topBarBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },

  // Hero
  heroWrap: { width, height: 360, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  heroBadge: {
    position: 'absolute', bottom: 20, left: 20,
    backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10,
  },
  heroBadgeText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  // Content
  content: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24 },
  brand: { fontSize: 12, color: colors.textTertiary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  name: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.4, marginBottom: 10, lineHeight: 28 },

  // Rating
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  starsRow: { flexDirection: 'row', gap: 2 },
  ratingVal: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  ratingCount: { fontSize: 13, color: colors.textTertiary },

  // Price
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 22 },
  price: { fontSize: 28, fontWeight: '800', color: '#FF5C8A' },
  originalPrice: { fontSize: 16, color: colors.textTertiary, textDecorationLine: 'line-through' },
  savingBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  savingText: { fontSize: 12, fontWeight: '700', color: '#10B981' },

  // Size
  sectionLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  sizesRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  sizeChip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.gray200, backgroundColor: colors.gray100,
  },
  sizeChipActive: { borderColor: '#FF5C8A', backgroundColor: '#FFF0F5' },
  sizeChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  sizeChipTextActive: { color: '#FF5C8A', fontWeight: '700' },

  // Quantity
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  qtyBtn: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1.5, borderColor: colors.gray200,
    justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gray100,
  },
  qtyVal: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, minWidth: 28, textAlign: 'center' },
  qtyTotal: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginLeft: 4 },

  // Perks
  perksRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: colors.gray100, borderRadius: 18, padding: 16, marginBottom: 24,
  },
  perkItem: { flex: 1, alignItems: 'center', gap: 4 },
  perkIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  perkLabel: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  perkSub: { fontSize: 10, color: colors.textTertiary, textAlign: 'center', lineHeight: 13 },

  // Description
  descHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  descText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, marginBottom: 20 },
  divider: { height: 1, backgroundColor: colors.gray200, marginVertical: 20 },

  // Reviews
  reviewsHeader: { marginBottom: 16 },
  reviewsSummary: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 8 },
  reviewsBigRating: { fontSize: 40, fontWeight: '800', color: colors.textPrimary },
  reviewsTotalText: { fontSize: 12, color: colors.textTertiary, marginTop: 3 },
  reviewCard: {
    backgroundColor: colors.gray100, borderRadius: 16, padding: 14, marginBottom: 12,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FF5C8A', justifyContent: 'center', alignItems: 'center',
  },
  reviewAvatarText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  reviewMeta: { flex: 1 },
  reviewName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  reviewDate: { fontSize: 11, color: colors.textTertiary },
  reviewComment: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: colors.gray200,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 8,
  },
  cartBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 16,
    borderWidth: 2, borderColor: '#FF5C8A', backgroundColor: '#FFF0F5',
  },
  cartBtnAdded: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  cartBtnText: { fontSize: 14, fontWeight: '700', color: '#FF5C8A' },
  cartBtnTextAdded: { color: '#10B981' },
  buyBtn: { flex: 1.4, borderRadius: 16, overflow: 'hidden' },
  buyGradient: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  buyBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});
