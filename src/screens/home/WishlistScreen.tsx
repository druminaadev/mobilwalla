import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Star, Heart, Clock, Scissors } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

import { HomeStackParamList } from '../../types/navigation';
import { useWishlistStore } from '../../store/wishlistStore';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

type Props = NativeStackScreenProps<HomeStackParamList, 'Wishlist'>;

const TABS = ['Salons', 'Services', 'Products'];

export default function WishlistScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [tabIndex, setTabIndex] = useState(0);
  
  const { salons, services, products, toggleSalon, toggleService, toggleProduct } = useWishlistStore();

  const renderSalon = ({ item, index }: any) => {
    return (
      <Animated.View layout={Layout.springify()} entering={FadeInDown.delay(index * 50)} style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <TouchableOpacity 
             style={styles.heartBtn} 
             onPress={() => toggleSalon(item)}
             activeOpacity={0.8}
          >
             <Heart size={18} color={colors.error} fill={colors.error} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
          <View style={styles.cardRow}>
            <View style={styles.ratingBadge}>
              <Star size={12} color={colors.warning} fill={colors.warning} />
              <Text style={styles.cardMeta}>{item.rating}</Text>
            </View>
            <Text style={styles.cardSub} numberOfLines={1}> • {item.address}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderService = ({ item, index }: any) => {
    return (
      <Animated.View layout={Layout.springify()} entering={FadeInDown.delay(index * 50)} style={styles.cardRowStyle}>
         <View style={styles.svcIconWrap}>
            <Scissors size={20} color={colors.primary} />
         </View>
         <View style={styles.svcInfo}>
            <Text style={styles.svcName}>{item.name}</Text>
            <View style={styles.svcMetaRow}>
                <Clock size={14} color={colors.textTertiary} />
                <Text style={styles.svcMetaText}>{item.duration} min</Text>
            </View>
         </View>
         <View style={styles.svcRight}>
            <Text style={styles.svcPrice}>₹{item.price}</Text>
            <TouchableOpacity 
               style={styles.svcHeartBtn}
               onPress={() => toggleService(item)}
            >
               <Heart size={20} color={colors.error} fill={colors.error} />
            </TouchableOpacity>
         </View>
      </Animated.View>
    );
  };

  const renderProduct = ({ item, index }: any) => {
    return (
      <Animated.View layout={Layout.springify()} entering={FadeInDown.delay(index * 50)} style={styles.cardRowStyle}>
         <Image source={{ uri: item.image }} style={styles.productThumb} />
         <View style={styles.svcInfo}>
            <Text style={styles.cardSub} numberOfLines={1}>{item.brand}</Text>
            <Text style={styles.svcName}>{item.name}</Text>
         </View>
         <View style={styles.svcRight}>
            <Text style={styles.svcPrice}>₹{item.price}</Text>
            <TouchableOpacity 
               style={styles.svcHeartBtn}
               onPress={() => toggleProduct(item)}
            >
               <Heart size={20} color={colors.error} fill={colors.error} />
            </TouchableOpacity>
         </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          {TABS.map((t, i) => {
            const isActive = tabIndex === i;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setTabIndex(i)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {t} {i === 0 ? `(${salons.length})` : i === 1 ? `(${services.length})` : `(${products.length})`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Content */}
      {tabIndex === 0 ? (
        <FlatList
          data={salons}
          keyExtractor={(item) => item.id}
          renderItem={renderSalon}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View entering={FadeInDown} style={styles.emptyContainer}>
              <Heart size={64} color={colors.gray200} />
              <Text style={styles.emptyTitle}>No saved salons</Text>
              <Text style={styles.emptySub}>Tap the heart icon on any salon to save it here.</Text>
            </Animated.View>
          }
        />
      ) : tabIndex === 1 ? (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderService}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View entering={FadeInDown} style={styles.emptyContainer}>
              <Heart size={64} color={colors.gray200} />
              <Text style={styles.emptyTitle}>No saved services</Text>
              <Text style={styles.emptySub}>Save your favorite services for quick booking.</Text>
            </Animated.View>
          }
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View entering={FadeInDown} style={styles.emptyContainer}>
              <Heart size={64} color={colors.gray200} />
              <Text style={styles.emptyTitle}>No saved products</Text>
              <Text style={styles.emptySub}>Save your favorite products for quick checkout.</Text>
            </Animated.View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  tabsContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardInfo: {
    padding: 16,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  cardMeta: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '700',
  },
  cardSub: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  cardRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  svcIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  svcInfo: {
    flex: 1,
    marginLeft: 16,
  },
  svcName: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  svcMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  svcMetaText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  svcRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  svcPrice: {
    ...typography.subtitle1,
    color: colors.primary,
  },
  svcHeartBtn: {
    marginTop: 12,
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
