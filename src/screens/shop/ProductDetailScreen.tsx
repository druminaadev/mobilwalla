import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, Platform, StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';
import { ArrowLeft, Heart, Star, ShoppingBag, Plus, Minus, Info, ShieldCheck, Truck } from 'lucide-react-native';
import { ShopStackParamList } from '../../types/navigation';
import { colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'ProductDetail'>;
type RoutePropType = RouteProp<ShopStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const insets = useSafeAreaInsets();
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fallback data if none passed
  const product = route.params?.product ?? {
    id: '1', name: 'Keratin Repair Serum', brand: 'L\'Oréal Paris',
    price: 899, originalPrice: 1199, rating: 4.8, reviews: 342,
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80',
    description: 'Transform your hair with our advanced keratin formula. Clinically proven to repair damage, reduce frizz, and add mirror-like shine in just one use.',
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* FULL SCREEN IMAGE */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.mainImage} />
        <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent']} style={styles.imageTopGradient} />
        
        {/* Header over image */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setIsWishlisted(!isWishlisted)}>
              <Heart size={22} color={isWishlisted ? '#FF5C8A' : '#fff'} fill={isWishlisted ? '#FF5C8A' : 'transparent'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
              <ShoppingBag size={22} color="#fff" />
              <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>2</Text></View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* BOTTOM SHEET INFO */}
      <Animated.View entering={SlideInDown.duration(500).springify()} style={styles.sheetContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Handle bar */}
          <View style={styles.sheetHandleWrap}>
            <View style={styles.sheetHandle} />
          </View>

          {/* Title & Brand */}
          <View style={styles.titleSection}>
            <Text style={styles.brandText}>{product.brand}</Text>
            <Text style={styles.productName}>{product.name}</Text>
            
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} color={i <= 4 ? "#F59E0B" : colors.gray200} fill={i <= 4 ? "#F59E0B" : colors.gray200} />
                ))}
              </View>
              <Text style={styles.ratingText}>{product.rating} ({product.reviews} reviews)</Text>
            </View>
          </View>

          {/* Price & Qty */}
          <View style={styles.priceSection}>
            <View>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{product.price}</Text>
                {product.originalPrice && <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>}
                {discount > 0 && (
                  <View style={styles.discountPill}>
                    <Text style={styles.discountText}>{discount}% OFF</Text>
                  </View>
                )}
              </View>
              <Text style={styles.taxText}>Inclusive of all taxes</Text>
            </View>

            <View style={styles.qtyControl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
                <Minus size={16} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
                <Plus size={16} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Trust Badges */}
          <View style={styles.trustSection}>
            <View style={styles.trustItem}>
              <ShieldCheck size={24} color="#10B981" />
              <Text style={styles.trustText}>100% Genuine</Text>
            </View>
            <View style={styles.trustItem}>
              <Truck size={24} color="#FF5C8A" />
              <Text style={styles.trustText}>Free Delivery</Text>
            </View>
            <View style={styles.trustItem}>
              <Info size={24} color="#6366F1" />
              <Text style={styles.trustText}>Easy Returns</Text>
            </View>
          </View>

        </ScrollView>
      </Animated.View>

      {/* STICKY FOOTER */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.footerInner}>
          <View style={styles.footerTotalWrap}>
            <Text style={styles.footerTotalLabel}>Total Price</Text>
            <Text style={styles.footerTotalVal}>₹{product.price * qty}</Text>
          </View>
          <TouchableOpacity style={styles.addCartBtn} activeOpacity={0.8} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.addCartBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },

  imageContainer: { width: '100%', height: height * 0.55, position: 'absolute', top: 0 },
  mainImage: { width: '100%', height: '100%' },
  imageTopGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 } as any,

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' } as any,
  headerRight: { flexDirection: 'row', gap: 12 },
  cartBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#FF5C8A', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(0,0,0,0.2)' },
  cartBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },

  sheetContainer: { flex: 1, marginTop: height * 0.45, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  sheetHandleWrap: { alignItems: 'center', paddingVertical: 16 },
  sheetHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.gray200 },

  titleSection: { paddingHorizontal: 24, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  brandText: { fontSize: 13, fontWeight: '700', color: '#FF5C8A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  productName: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5, marginBottom: 10, lineHeight: 32 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stars: { flexDirection: 'row', gap: 2 },
  ratingText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },

  priceSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  price: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  originalPrice: { fontSize: 16, color: colors.textTertiary, textDecorationLine: 'line-through', fontWeight: '500' },
  discountPill: { backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  discountText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  taxText: { fontSize: 12, color: colors.textTertiary },
  
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray50, borderRadius: 16, padding: 4 },
  qtyBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  qtyText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, width: 36, textAlign: 'center' },

  descSection: { paddingHorizontal: 24, paddingVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 24 },

  trustSection: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 24, backgroundColor: colors.gray50, marginHorizontal: 24, borderRadius: 20, marginBottom: 20 },
  trustItem: { alignItems: 'center', gap: 8 },
  trustText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.gray100, paddingTop: 16, paddingHorizontal: 24 },
  footerInner: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  footerTotalWrap: { flex: 1 },
  footerTotalLabel: { fontSize: 12, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  footerTotalVal: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  addCartBtn: { flex: 2, backgroundColor: '#FF5C8A', paddingVertical: 18, borderRadius: 20, alignItems: 'center', shadowColor: '#FF5C8A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  addCartBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
