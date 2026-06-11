import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, Platform, StatusBar, TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { ShoppingBag, Search, Sparkles, ChevronRight, Heart, Star } from 'lucide-react-native';
import { ShopStackParamList } from '../../types/navigation';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'ShopHome'>;

const CATEGORIES = [
  { id: 'hair', name: 'Hair Care', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=200&q=80' },
  { id: 'skin', name: 'Skin Care', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80' },
  { id: 'makeup', name: 'Makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=200&q=80' },
  { id: 'body', name: 'Body Care', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=200&q=80' },
  { id: 'fragrance', name: 'Perfume', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=200&q=80' },
];

const BEST_SELLERS = [
  { id: '1', name: 'Keratin Repair Serum', brand: 'L\'Oréal Paris', price: 899, rating: 4.8, image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=400&q=80' },
  { id: '7', name: 'Hyaluronic Serum', brand: 'The Ordinary', price: 2199, rating: 4.9, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80' },
  { id: '2', name: 'Vitamin C Cream', brand: 'Neutrogena', price: 1299, rating: 4.5, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80' },
];

export default function ShopHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const renderSectionHeader = (title: string, onSeeAll?: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Salon Boutique</Text>
            <Text style={styles.subGreeting}>Discover premium products</Text>
          </View>
          <TouchableOpacity 
            style={styles.cartBtn} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Cart')}
          >
            <ShoppingBag size={22} color={colors.textPrimary} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchWrap}>
          <Search size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search brands, products..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) }}>
        
        {/* HERO BANNER */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.heroWrap}>
          <LinearGradient colors={['#FF5C8A', '#FF3366']} style={styles.heroBanner}>
            <View style={styles.heroContent}>
              <View style={styles.heroTag}>
                <Sparkles size={12} color="#FF5C8A" />
                <Text style={styles.heroTagText}>SUMMER SALE</Text>
              </View>
              <Text style={styles.heroTitle}>Up to 40% Off</Text>
              <Text style={styles.heroSub}>On premium skincare brands</Text>
              <TouchableOpacity style={styles.heroCta}>
                <Text style={styles.heroCtaText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=400&q=80' }} 
              style={styles.heroImage} 
            />
          </LinearGradient>
        </Animated.View>

        {/* CATEGORIES */}
        <Animated.View entering={FadeInUp.delay(200)}>
          {renderSectionHeader('Shop by Category')}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity key={cat.id} style={styles.catItem} activeOpacity={0.8}>
                <View style={styles.catImageWrap}>
                  <Image source={{ uri: cat.image }} style={styles.catImage} />
                </View>
                <Text style={styles.catName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* BEST SELLERS (Horizontal) */}
        <Animated.View entering={FadeInUp.delay(300)}>
          {renderSectionHeader('Best Sellers', () => {})}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
            {BEST_SELLERS.map((item, i) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.productCard} 
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              >
                <View style={styles.productImageWrap}>
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <TouchableOpacity style={styles.wishBtn}>
                    <Heart size={16} color={colors.textTertiary} />
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
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* PROMO POSTER */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.posterWrap}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80' }} 
            style={styles.posterImage} 
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.posterOverlay}>
            <Text style={styles.posterTitle}>Discover Organic Makeup</Text>
            <Text style={styles.posterSub}>Clean beauty for healthy skin</Text>
          </LinearGradient>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },

  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subGreeting: { fontSize: 14, color: colors.textSecondary, fontWeight: '500', marginTop: 2 },
  cartBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gray50, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  cartBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#FF5C8A', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  cartBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },

  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.gray50, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 16, marginTop: 28, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { fontSize: 13, fontWeight: '600', color: colors.textTertiary },

  heroWrap: { paddingHorizontal: 16, marginTop: 8 },
  heroBanner: { borderRadius: 24, padding: 24, flexDirection: 'row', overflow: 'hidden' },
  heroContent: { flex: 1, zIndex: 2 },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginBottom: 12 },
  heroTagText: { fontSize: 10, fontWeight: '800', color: '#FF5C8A', letterSpacing: 1 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500', marginBottom: 20 },
  heroCta: { alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 16 },
  heroCtaText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  heroImage: { position: 'absolute', right: -30, bottom: -20, width: 160, height: 160, borderRadius: 80, opacity: 0.9 },

  catScroll: { paddingHorizontal: 16, gap: 16 },
  catItem: { alignItems: 'center', width: 72 },
  catImageWrap: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', marginBottom: 8, borderWidth: 1, borderColor: colors.gray100 },
  catImage: { width: '100%', height: '100%' },
  catName: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },

  productScroll: { paddingHorizontal: 16, gap: 16 },
  productCard: { width: width * 0.42, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.gray100 },
  productImageWrap: { width: '100%', height: 160, backgroundColor: colors.gray50 },
  productImage: { width: '100%', height: '100%' },
  wishBtn: { position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  productInfo: { padding: 12 },
  productBrand: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  productName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#FF5C8A' },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.gray50, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },

  posterWrap: { marginHorizontal: 16, marginTop: 32, height: 200, borderRadius: 24, overflow: 'hidden' },
  posterImage: { width: '100%', height: '100%' },
  posterOverlay: { position: 'absolute', inset: 0, justifyContent: 'flex-end', padding: 24 } as any,
  posterTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  posterSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
});
