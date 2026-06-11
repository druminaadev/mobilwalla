import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedRef,
  interpolate, Extrapolation
} from 'react-native-reanimated';
import { ArrowUp } from 'lucide-react-native';

import { colors } from '../../constants/colors';

// Import extracted components
import { SkeletonLoader } from '../../components/home/SkeletonLoader';
import { HomeHeader } from '../../components/home/HomeHeader';
import { HomeGreeting } from '../../components/home/HomeGreeting';
import { HomeSearchBar } from '../../components/home/HomeSearchBar';
import { HomeHeroBanner } from '../../components/home/HomeHeroBanner';
import { HomeServiceCategories } from '../../components/home/HomeServiceCategories';
import { HomeFeaturedSalons } from '../../components/home/HomeFeaturedSalons';
import { HomeSpecialOffers } from '../../components/home/HomeSpecialOffers';
import { HomeWhyChooseUs } from '../../components/home/HomeWhyChooseUs';
import { HomeNearbySalons } from '../../components/home/HomeNearbySalons';
import { HomeTopStylists } from '../../components/home/HomeTopStylists';
import { HomeTrendingServices } from '../../components/home/HomeTrendingServices';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Reanimated
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

  // Scroll to Top FAB style
  const fabStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollOffset.value, [200, 300], [0, 1], Extrapolation.CLAMP);
    const scale = opacity > 0.1 ? 1 : 0;
    return {
      opacity,
      transform: [{ scale }]
    };
  });

  const handleScrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  if (isLoading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <SkeletonLoader />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* 1. FIXED HEADER */}
      <HomeHeader topInset={insets.top} />

      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        stickyHeaderIndices={[1]}
      >
        {/* GREETING */}
        <HomeGreeting />

        {/* 2. STICKY SEARCH BAR */}
        <HomeSearchBar />

        {/* 3. HERO BANNER CAROUSEL */}
        <HomeHeroBanner />

        {/* 4. SERVICE CATEGORIES */}
        <HomeServiceCategories />

        {/* 5. FEATURED SALONS */}
        <HomeFeaturedSalons />

        {/* 6. SPECIAL OFFERS STRIP */}
        <HomeSpecialOffers />

        {/* 11. WHY CHOOSE US STRIP */}
        <HomeWhyChooseUs />

        {/* 7. NEARBY SALONS */}
        <HomeNearbySalons />

        {/* 8. FEATURED STYLISTS */}
        <HomeTopStylists />

        {/* 9. TRENDING SERVICES GRID */}
        <HomeTrendingServices />

      </Animated.ScrollView>

      {/* FAB */}
      <Animated.View style={[styles.fabWrap, fabStyle]}>
        <TouchableOpacity style={styles.fab} onPress={handleScrollToTop}>
          <ArrowUp size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  fabWrap: { position: 'absolute', bottom: 20, right: 20, zIndex: 100 },
  fab: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
});
