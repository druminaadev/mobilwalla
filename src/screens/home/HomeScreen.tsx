import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, Platform, StatusBar, TextInput, RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, ZoomIn, useSharedValue, useAnimatedStyle, interpolate, Extrapolation, useAnimatedRef } from 'react-native-reanimated';
import { Search, MapPin, Bell, ChevronRight, Heart, Star, Sparkles, User, Scissors, Droplet, Crown, Activity } from 'lucide-react-native';
import { HomeStackParamList, MainTabParamList } from '../../types/navigation';
import { colors } from '../../constants/colors';
import { SALONS, BANNERS, OFFERS, STYLISTS, SERVICES, TRENDING_SERVICES } from '../../data/mockHomeData';
import { SkeletonLoader } from '../../components/home/SkeletonLoader';

const { width } = Dimensions.get('window');

type NavigationProp = any; // Cast as any for deep nested cross-tab routing without complex generic chaining

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = useCallback((event: any) => {
    scrollOffset.value = event.nativeEvent.contentOffset.y;
  }, [scrollOffset]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollOffset.value, [0, 80], [1, 0.95], Extrapolation.CLAMP);
    const elevation = interpolate(scrollOffset.value, [0, 80], [0, 8], Extrapolation.CLAMP);
    return {
      opacity,
      elevation,
      shadowOpacity: interpolate(scrollOffset.value, [0, 80], [0, 0.1], Extrapolation.CLAMP),
    };
  });

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

  if (isLoading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <SkeletonLoader />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      
      {/* STICKY HEADER */}
      <Animated.View style={[styles.header, { paddingTop: insets.top + 10 }, headerStyle]}>
        <View style={styles.headerTop}>
          <View style={styles.userInfoWrap}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }} style={styles.userAvatar} />
            <View>
              <Text style={styles.greeting}>Good Morning, Bella</Text>
              <TouchableOpacity style={styles.locationWrap} onPress={() => navigation.navigate('Location')}>
                <MapPin size={12} color={colors.primary} />
                <Text style={styles.locationText}>Bandra West, Mumbai</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Wishlist')}>
              <Heart size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('ProfileTab', { screen: 'Notifications' })}>
              <Bell size={20} color={colors.textPrimary} />
              <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH BAR */}
        <TouchableOpacity 
          style={styles.searchWrap} 
          activeOpacity={0.9} 
          onPress={() => navigation.navigate('Search')}
        >
          <Search size={20} color={colors.textTertiary} />
          <Text style={styles.searchTextPlaceholder}>Search salons, services, stylists...</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 100) }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        
        {/* HERO BANNER */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.heroWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={width - 32} decelerationRate="fast">
            {BANNERS.map((banner, index) => (
              <LinearGradient key={banner.id} colors={index % 2 === 0 ? ['#FF5C8A', '#FF3366'] : ['#2D3142', '#4F5D75']} style={styles.heroBanner}>
                <View style={styles.heroContent}>
                  <View style={styles.heroTag}>
                    <Sparkles size={12} color={index % 2 === 0 ? '#FF5C8A' : '#2D3142'} />
                    <Text style={[styles.heroTagText, { color: index % 2 === 0 ? '#FF5C8A' : '#2D3142' }]}>{banner.tag}</Text>
                  </View>
                  <Text style={styles.heroTitle}>{banner.title}</Text>
                  <Text style={styles.heroSub}>{banner.sub}</Text>
                  <TouchableOpacity style={styles.heroCta} onPress={() => navigation.navigate('SpecialForYou')}>
                    <Text style={styles.heroCtaText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
                <Image source={banner.image} style={styles.heroImage} />
              </LinearGradient>
            ))}
          </ScrollView>
        </Animated.View>

        {/* CATEGORIES */}
        <Animated.View entering={FadeInUp.delay(200)}>
          {renderSectionHeader('Categories', () => navigation.navigate('SalonList', {}))}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {SERVICES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity 
                  key={cat.id} 
                  style={styles.catItem} 
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('SalonList', {})}
                >
                  <View style={[styles.catIconWrap, { backgroundColor: cat.bg }]}>
                    <Icon size={24} color={cat.color} strokeWidth={2} />
                  </View>
                  <Text style={styles.catName}>{cat.name}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </Animated.View>

        {/* TOP SALONS */}
        <Animated.View entering={FadeInUp.delay(300)}>
          {renderSectionHeader('Top Salons Near You', () => navigation.navigate('SalonList', {}))}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
            {SALONS.map((salon) => (
              <TouchableOpacity 
                key={salon.id} 
                style={styles.salonCard} 
                activeOpacity={0.9}
                onPress={() => navigation.navigate('SalonDetail', { id: salon.id })}
              >
                <View style={styles.productImageWrap}>
                  <Image source={salon.image} style={styles.productImage} />
                  <View style={styles.salonDistanceBadge}>
                    <MapPin size={10} color="#fff" />
                    <Text style={styles.salonDistanceText}>{salon.distance}</Text>
                  </View>
                  <TouchableOpacity style={styles.wishBtn}>
                    <Heart size={16} color={colors.textTertiary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{salon.name}</Text>
                  <Text style={styles.productBrand} numberOfLines={1}>{salon.address}</Text>
                  <View style={styles.priceRow}>
                    <View style={styles.ratingWrap}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingText}>{salon.rating} <Text style={{color: colors.textTertiary, fontWeight: '500'}}>({salon.reviewCount})</Text></Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* SPECIAL OFFERS */}
        <Animated.View entering={FadeInUp.delay(400)}>
          {renderSectionHeader('Special Offers', () => navigation.navigate('Offers'))}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
            {OFFERS.map((offer) => (
              <TouchableOpacity 
                key={offer.id} 
                style={[styles.offerCard, { backgroundColor: offer.color + '15', borderColor: offer.color + '30' }]} 
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Offers')}
              >
                <View style={styles.offerContent}>
                  <Text style={[styles.offerTitle, { color: offer.color }]}>{offer.title}</Text>
                  <Text style={styles.offerDiscount}>{offer.discount}</Text>
                  <Text style={styles.offerCode}>Code: {offer.code}</Text>
                </View>
                <Image source={offer.image} style={styles.offerImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* TOP STYLISTS */}
        <Animated.View entering={FadeInUp.delay(500)}>
          {renderSectionHeader('Expert Stylists', () => navigation.navigate('Team'))}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {STYLISTS.map((stylist, index) => (
              <TouchableOpacity 
                key={stylist.id} 
                style={styles.stylistCard} 
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ArtistProfile', { artist: stylist as any })}
              >
                <Image source={{ uri: `https://i.pravatar.cc/150?img=${index + 10}` }} style={styles.stylistAvatar} />
                <Text style={styles.stylistName} numberOfLines={1}>{stylist.name}</Text>
                <Text style={styles.stylistSpec} numberOfLines={1}>{stylist.specialty}</Text>
                <View style={styles.stylistRatingRow}>
                  <Star size={10} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.stylistRating}>{stylist.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* TRENDING SERVICES */}
        <Animated.View entering={FadeInUp.delay(600)}>
          {renderSectionHeader('Trending Services', () => navigation.navigate('SalonList', {}))}
          <View style={styles.trendingGrid}>
            {TRENDING_SERVICES.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.trendingCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ServiceDetail', { service: service as any })}
              >
                <Image source={service.image} style={styles.trendingImage} />
                <View style={styles.trendingInfo}>
                  <Text style={styles.trendingName} numberOfLines={1}>{service.name}</Text>
                  <Text style={styles.trendingPrice}>{service.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  header: { 
    paddingHorizontal: 16, 
    paddingBottom: 16,
    backgroundColor: '#F8FAFC',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  userInfoWrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gray100 },
  greeting: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3, marginBottom: 2 },
  locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  
  headerActions: { flexDirection: 'row', gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#FF5C8A', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' },
  badgeText: { fontSize: 8, fontWeight: '800', color: '#fff' },

  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  searchTextPlaceholder: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.textTertiary },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 16, marginTop: 28, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { fontSize: 13, fontWeight: '600', color: colors.textTertiary },

  heroWrap: { marginTop: 8 },
  heroBanner: { width: width - 32, marginHorizontal: 16, borderRadius: 24, padding: 24, flexDirection: 'row', overflow: 'hidden' },
  heroContent: { flex: 1, zIndex: 2 },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginBottom: 12 },
  heroTagText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500', marginBottom: 20 },
  heroCta: { alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 16 },
  heroCtaText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  heroImage: { position: 'absolute', right: -40, bottom: -20, width: 180, height: 180, borderRadius: 90, opacity: 0.95 },

  catScroll: { paddingHorizontal: 16, gap: 20 },
  catItem: { alignItems: 'center', width: 64 },
  catIconWrap: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  catName: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },

  productScroll: { paddingHorizontal: 16, gap: 16 },
  salonCard: { width: width * 0.65, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  productImageWrap: { width: '100%', height: 140, backgroundColor: colors.gray50 },
  productImage: { width: '100%', height: '100%' },
  salonDistanceBadge: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  salonDistanceText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  wishBtn: { position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  productInfo: { padding: 14 },
  productBrand: { fontSize: 12, color: colors.textTertiary, fontWeight: '500', marginBottom: 8 },
  productName: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  ratingText: { fontSize: 11, fontWeight: '800', color: '#D97706' },

  offerCard: { width: width * 0.7, height: 110, borderRadius: 20, borderWidth: 1, padding: 16, flexDirection: 'row', overflow: 'hidden' },
  offerContent: { flex: 1, justifyContent: 'center', zIndex: 2 },
  offerTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  offerDiscount: { fontSize: 24, fontWeight: '900', color: colors.textPrimary, marginBottom: 8 },
  offerCode: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  offerImage: { position: 'absolute', right: -20, bottom: -20, width: 120, height: 120, opacity: 0.6, borderRadius: 60 },

  stylistCard: { width: 100, backgroundColor: '#fff', borderRadius: 16, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  stylistAvatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 10 },
  stylistName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 2, textAlign: 'center' },
  stylistSpec: { fontSize: 10, fontWeight: '500', color: colors.textTertiary, marginBottom: 6, textAlign: 'center' },
  stylistRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  stylistRating: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },

  trendingGrid: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  trendingCard: { width: (width - 48) / 2, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  trendingImage: { width: '100%', height: 120, backgroundColor: colors.gray50 },
  trendingInfo: { padding: 12 },
  trendingName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  trendingPrice: { fontSize: 14, fontWeight: '800', color: '#FF5C8A' },
});
