import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Heart, Star, ShoppingBag } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ShopStackParamList } from '../../types/navigation';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { ALL_PRODUCTS, BEST_SELLERS } from '../../data/mockShopData';
import { useWishlistStore } from '../../store/wishlistStore';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductList'>;

export default function ProductListScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { categoryId, title } = route.params;
  const { toggleProduct, isProductLiked } = useWishlistStore();

  let products = ALL_PRODUCTS;
  if (categoryId) {
    products = ALL_PRODUCTS.filter((p) => p.categoryId === categoryId);
  } else if (title === 'Best Sellers') {
    products = BEST_SELLERS;
  }

  const renderProduct = ({ item, index }: { item: typeof ALL_PRODUCTS[0], index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.cardWrapper}>
      <TouchableOpacity 
        style={styles.productCard} 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <View style={styles.productImageWrap}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <TouchableOpacity 
            style={styles.wishBtn}
            onPress={() => toggleProduct(item)}
          >
            <Heart 
              size={16} 
              color={isProductLiked(item.id) ? '#EF4444' : colors.textTertiary} 
              fill={isProductLiked(item.id) ? '#EF4444' : 'transparent'} 
            />
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
    </Animated.View>
  );

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
          <ShoppingBag size={20} color={colors.textPrimary} />
          <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>2</Text></View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 10,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray50, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  cartBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray50, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  cartBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#FF5C8A', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' },
  cartBadgeText: { fontSize: 8, fontWeight: '800', color: '#fff' },
  
  listContent: { padding: 16 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },
  cardWrapper: { width: '48%' },
  productCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.gray100 },
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
});
