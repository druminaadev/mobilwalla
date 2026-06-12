import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Scissors, Smile, Sparkles, Tag, Heart, Copy, Star } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type Props = NativeStackScreenProps<any, any>;

const { width } = Dimensions.get('window');

// ─── Mock Data ─────────────────────────────────────────────────────────────

type OfferCategory = 'all' | 'hair' | 'spa' | 'packages';

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  validity: string;
  image: string;
  category: OfferCategory;
  isFeatured?: boolean;
}

const CATEGORIES: { id: OfferCategory; label: string; icon: any }[] = [
  { id: 'all', label: 'All Offers', icon: Sparkles },
  { id: 'hair', label: 'Hair Care', icon: Scissors },
  { id: 'spa', label: 'Spa & Relax', icon: Smile },
  { id: 'packages', label: 'Packages', icon: Heart },
];

const OFFERS: Offer[] = [
  {
    id: '1',
    title: 'Bridal Glow-Up',
    subtitle: 'Complete pre-wedding package with premium facial and hair spa.',
    code: 'BRIDE25',
    validity: 'Valid till 30th Dec',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
    category: 'packages',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Flat 20% Off Haircuts',
    subtitle: 'Upgrade your look with our senior stylists. Limited time offer.',
    code: 'HAIR20',
    validity: 'Valid till Sunday',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    category: 'hair',
  },
  {
    id: '3',
    title: 'Weekend Spa Retreat',
    subtitle: 'Relax with our signature deep tissue massage. Book for 2, pay for 1.',
    code: 'RELAX50',
    validity: 'Valid on Weekends',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    category: 'spa',
  },
  {
    id: '4',
    title: 'Keratin Treatment',
    subtitle: 'Say goodbye to frizz. Get an extra free wash & blow-dry.',
    code: 'KERATIN10',
    validity: 'Valid till 15th Jan',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&w=800&q=80',
    category: 'hair',
  },
];

const BEST_SELLERS = [
  { id: '1', name: 'Keratin Repair Serum', brand: 'L\'Oréal Paris', price: 899, rating: 4.8, image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=400&q=80' },
  { id: '7', name: 'Hyaluronic Serum', brand: 'The Ordinary', price: 2199, rating: 4.9, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
  { id: '2', name: 'Vitamin C Cream', brand: 'Neutrogena', price: 1299, rating: 4.5, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OffersScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [activeCat, setActiveCat] = useState<OfferCategory>('all');

  const filteredOffers = OFFERS.filter((offer) => activeCat === 'all' || offer.category === activeCat);
  const featuredOffer = OFFERS.find((offer) => offer.isFeatured);
  const regularOffers = filteredOffers.filter((offer) => !offer.isFeatured || activeCat !== 'all');

  const copyToClipboard = (code: string) => {
    Alert.alert('Code Copied!', `Promo code ${code} has been copied to your clipboard.`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Exclusive Offers</Text>
          <Text style={styles.headerSubtitle}>Curated just for you</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.catContainer}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCat === cat.id;
            const Icon = cat.icon;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCat(cat.id)}
                activeOpacity={0.8}
                style={[styles.catPill, isActive && styles.catPillActive]}
              >
                <Icon size={16} color={isActive ? '#fff' : colors.textSecondary} />
                <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Offer */}
        {activeCat === 'all' && featuredOffer && (
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.featuredContainer}>
            <ImageBackground 
              source={{ uri: featuredOffer.image }} 
              style={styles.featuredImage}
              imageStyle={{ borderRadius: 24 }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.featuredOverlay}
              />
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Sparkles size={14} color="#FFF" />
                  <Text style={styles.featuredBadgeText}>DEAL OF THE MONTH</Text>
                </View>
                <Text style={styles.featuredTitle}>{featuredOffer.title}</Text>
                <Text style={styles.featuredSubtitle}>{featuredOffer.subtitle}</Text>
                
                <View style={styles.featuredCodeWrap}>
                  <View style={styles.codeBoxDark}>
                    <Tag size={16} color="#FFF" />
                    <Text style={styles.codeTextDark}>{featuredOffer.code}</Text>
                  </View>
                  <TouchableOpacity style={styles.copyBtnDark} onPress={() => copyToClipboard(featuredOffer.code)}>
                    <Copy size={16} color="#1A1A1A" />
                    <Text style={styles.copyBtnTextDark}>Copy Code</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </Animated.View>
        )}

        {/* Section Title */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>{activeCat === 'all' ? 'More Offers' : 'Available Offers'}</Text>
          <Text style={styles.offerCount}>{filteredOffers.length} available</Text>
        </View>

        {/* Offers List */}
        <View style={styles.listContainer}>
          {regularOffers.map((offer, index) => (
            <Animated.View 
              key={offer.id} 
              entering={FadeInDown.delay(200 + index * 100).springify()} 
              style={styles.offerCard}
            >
              <Image source={{ uri: offer.image }} style={styles.offerCardImage} />
              <View style={styles.offerCardBody}>
                <View>
                  <Text style={styles.offerCardTitle} numberOfLines={1}>{offer.title}</Text>
                  <Text style={styles.offerCardSubtitle} numberOfLines={2}>{offer.subtitle}</Text>
                </View>

                <View style={styles.offerCardBottom}>
                  <View style={styles.validityBadge}>
                    <Text style={styles.validityText}>{offer.validity}</Text>
                  </View>

                  <View style={styles.codeRow}>
                    <View style={styles.codeBoxLight}>
                      <Text style={styles.codeTextLight}>{offer.code}</Text>
                    </View>
                    <TouchableOpacity style={styles.copyBtnLight} onPress={() => copyToClipboard(offer.code)}>
                      <Copy size={14} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
          {regularOffers.length === 0 && (
            <View style={styles.emptyState}>
              <Tag size={48} color={colors.gray200} />
              <Text style={styles.emptyTitle}>No offers right now</Text>
              <Text style={styles.emptySubtitle}>Check back later for exciting new deals in this category.</Text>
            </View>
          )}
        </View>

        {/* Featured Products on Offer */}
        <View style={[styles.sectionTitleRow, { marginTop: 32 }]}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
          {BEST_SELLERS.map((item, i) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInDown.delay(300 + i * 100).springify()}
              style={styles.productCard} 
            >
              <View style={styles.productImageWrap}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <TouchableOpacity style={styles.wishBtn}>
                  <Heart size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productBrand}>{item.brand}</Text>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>₹{item.price}</Text>
                  <View style={styles.ratingWrap}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  catContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.gray100,
    gap: 8,
  },
  catPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
  },
  catTextActive: {
    color: '#FFF',
  },
  featuredContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    height: 400,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
    gap: 6,
  },
  featuredBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    lineHeight: 34,
  },
  featuredSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    marginBottom: 20,
  },
  featuredCodeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  codeBoxDark: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  codeTextDark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1,
  },
  copyBtnDark: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  copyBtnTextDark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  offerCount: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  offerCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  offerCardImage: {
    width: 120,
    height: '100%',
  },
  offerCardBody: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  offerCardTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  offerCardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  offerCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  validityBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  validityText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  codeBoxLight: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
    backgroundColor: 'rgba(255, 51, 102, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  codeTextLight: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  copyBtnLight: {
    padding: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  productScroll: { paddingHorizontal: 20, gap: 16, paddingBottom: 20 },
  productCard: { width: 160, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.gray100 },
  productImageWrap: { width: '100%', height: 160, backgroundColor: colors.gray50 },
  productImage: { width: '100%', height: '100%' },
  wishBtn: { position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  productInfo: { padding: 12 },
  productBrand: { fontSize: 11, color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  productName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: '800', color: colors.primary },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.gray50, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
});
