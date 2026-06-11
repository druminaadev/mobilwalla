import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { BANNERS } from '../../data/mockHomeData';

const { width } = Dimensions.get('window');

const PaginationDot = ({ index, bannerIndex }: { index: number, bannerIndex: any }) => {
  const dotStyle = useAnimatedStyle(() => {
    const isActive = Math.round(bannerIndex.value) === index;
    return {
      width: withTiming(isActive ? 20 : 6, { duration: 300 }),
      backgroundColor: withTiming(isActive ? colors.primary : colors.gray300, { duration: 300 })
    };
  });
  return <Animated.View style={[styles.dot, dotStyle]} />;
};

export const HomeHeroBanner = () => {
  const bannerIndex = useSharedValue(0);

  return (
    <Animated.View entering={FadeInUp.delay(200)} style={styles.heroSection}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          bannerIndex.value = e.nativeEvent.contentOffset.x / (width - 32);
        }}
        scrollEventThrottle={16}
      >
        {BANNERS.map((banner) => (
          <View key={banner.id} style={styles.bannerContainer}>
            <Image source={banner.image} style={styles.bannerImg} />
            <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']} style={styles.bannerOverlay}>
              <View style={styles.bannerContent}>
                <View style={styles.bannerTag}><Text style={styles.bannerTagText}>{banner.tag}</Text></View>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSub}>{banner.sub}</Text>
                <TouchableOpacity style={styles.bookNowBtn}>
                  <Text style={styles.bookNowText}>Book Now</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.discountBadge}>
                <LinearGradient colors={['#FF5C8A', '#FF3366']} style={styles.discountBadgeBg}>
                  <Text style={styles.discountBadgeText}>{banner.discount}</Text>
                </LinearGradient>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotsRow}>
        {BANNERS.map((_, i) => (
          <PaginationDot key={i} index={i} bannerIndex={bannerIndex} />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  heroSection: { marginBottom: 24 },
  bannerContainer: { width: width - 32, height: 190, marginHorizontal: 16, borderRadius: 20, overflow: 'hidden' },
  bannerImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerOverlay: { position: 'absolute', inset: 0, padding: 20, flexDirection: 'row' } as any,
  bannerContent: { flex: 1, justifyContent: 'center' },
  bannerTag: { alignSelf: 'flex-start', backgroundColor: colors.white, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  bannerTagText: { fontSize: 10, fontWeight: '800', color: colors.primary, letterSpacing: 0.5 },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: colors.white, lineHeight: 28, marginBottom: 4 },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  bookNowBtn: { alignSelf: 'flex-start', backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  bookNowText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  discountBadge: { justifyContent: 'center', alignItems: 'center', width: 64 },
  discountBadgeBg: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  discountBadgeText: { color: colors.white, fontWeight: '800', fontSize: 16, textAlign: 'center' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { height: 6, borderRadius: 3 },
});
