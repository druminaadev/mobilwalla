import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { SALONS } from '../../data/mockHomeData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';
import { WishlistHeart } from './WishlistHeart';

const { width } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeFeaturedSalons = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Salons</Text>
        <TouchableOpacity><Text style={styles.seeAllText}>View All →</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={width - 64} decelerationRate="fast" contentContainerStyle={styles.featuredScroll}>
        {SALONS.filter(s => s.isFeatured).map((salon) => (
          <TouchableOpacity key={salon.id} style={styles.featuredCard} onPress={() => navigation.navigate('SalonDetail', { id: salon.id })} activeOpacity={0.9}>
            <Image source={salon.image} style={styles.featuredImg} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.featuredOverlay} />
            
            <View style={styles.featuredTopRow}>
              <View style={styles.featuredTag}><Text style={styles.featuredTagText}>{salon.tags[0]}</Text></View>
              <WishlistHeart salonId={salon.id} />
            </View>

            <View style={styles.featuredBottom}>
              <Text style={styles.featuredName}>{salon.name}</Text>
              <View style={styles.featuredInfoRow}>
                <Star size={14} color={colors.accent} fill={colors.accent} />
                <Text style={styles.featuredRating}>{salon.rating} ({salon.reviewCount})</Text>
                <Text style={styles.featuredDot}>•</Text>
                <Text style={styles.featuredText}>{salon.distance}</Text>
                <Text style={styles.featuredDot}>•</Text>
                <Text style={styles.featuredText}>{salon.priceRange}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  seeAllText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  featuredScroll: { paddingHorizontal: 16, gap: 16 },
  featuredCard: { width: width - 80, height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: colors.gray100, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  featuredImg: { width: '100%', height: '100%' },
  featuredOverlay: { position: 'absolute', inset: 0, top: '40%' } as any,
  featuredTopRow: { position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  featuredTag: { backgroundColor: colors.white, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  featuredTagText: { fontSize: 11, fontWeight: '700', color: colors.textPrimary },
  featuredBottom: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  featuredName: { fontSize: 18, fontWeight: '800', color: colors.white, marginBottom: 6 },
  featuredInfoRow: { flexDirection: 'row', alignItems: 'center' },
  featuredRating: { fontSize: 13, fontWeight: '600', color: colors.white, marginLeft: 4 },
  featuredDot: { color: colors.textTertiary, marginHorizontal: 6 },
  featuredText: { fontSize: 13, color: colors.white },
});
