import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
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
          bannerIndex.value = e.nativeEvent.contentOffset.x / width;
        }}
        scrollEventThrottle={16}
      >
        {BANNERS.map((banner, index) => (
          <View key={banner.id} style={styles.bannerContainer}>
            <LinearGradient colors={['#FF5C8A', '#FF3366']} style={styles.heroBanner}>
              <View style={styles.heroContent}>
                <View style={styles.heroTag}>
                  <Sparkles size={12} color="#FF5C8A" />
                  <Text style={styles.heroTagText}>{banner.tag}</Text>
                </View>
                <Text style={styles.heroTitle}>{banner.title}</Text>
                <Text style={styles.heroSub}>{banner.sub}</Text>
                <TouchableOpacity style={styles.heroCta}>
                  <Text style={styles.heroCtaText}>Book Now</Text>
                </TouchableOpacity>
              </View>
              <Image 
                source={banner.image} 
                style={styles.heroImage} 
              />
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
  heroSection: { marginBottom: 24, marginTop: 8 },
  bannerContainer: { width: width, paddingHorizontal: 16 },
  heroBanner: { borderRadius: 24, padding: 24, flexDirection: 'row', overflow: 'hidden' },
  heroContent: { flex: 1, zIndex: 2 },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginBottom: 12 },
  heroTagText: { fontSize: 10, fontWeight: '800', color: '#FF5C8A', letterSpacing: 1 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500', marginBottom: 20 },
  heroCta: { alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 16 },
  heroCtaText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  heroImage: { position: 'absolute', right: -30, bottom: -20, width: 160, height: 160, borderRadius: 80, opacity: 0.9 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { height: 6, borderRadius: 3 },
});
