import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Star } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { SALONS } from '../../data/mockHomeData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';
import { WishlistHeart } from './WishlistHeart';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeNearbySalons = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Animated.View entering={FadeInUp.delay(700)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Near You 📍</Text>
        <TouchableOpacity><Text style={styles.seeAllText}>View All</Text></TouchableOpacity>
      </View>
      <View style={styles.nearbyWrap}>
        {SALONS.slice(0, 3).map((salon) => (
          <TouchableOpacity key={salon.id} style={styles.nearbyCard} onPress={() => navigation.navigate('SalonDetail', { id: salon.id })} activeOpacity={0.8}>
            <Image source={salon.image} style={styles.nearbyImg} />
            <View style={styles.nearbyInfo}>
              <View style={styles.nearbyHeader}>
                <Text style={styles.nearbyName}>{salon.name}</Text>
                <WishlistHeart salonId={salon.id} />
              </View>
              <Text style={styles.nearbyAddress} numberOfLines={1}>{salon.address}</Text>
              <View style={styles.nearbyMeta}>
                <View style={styles.nearbyRating}><Star size={12} color={colors.accent} fill={colors.accent} /><Text style={styles.nearbyRatingText}>{salon.rating}</Text></View>
                <View style={styles.nearbyChip}><Text style={styles.nearbyChipText}>{salon.distance}</Text></View>
                <View style={[styles.nearbyChip, !salon.isOpen && { backgroundColor: colors.error + '20' }]}>
                  <Text style={[styles.nearbyChipText, !salon.isOpen && { color: colors.error }]}>{salon.isOpen ? 'Open' : 'Closed'}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  seeAllText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  nearbyWrap: { paddingHorizontal: 16, gap: 12 },
  nearbyCard: { flexDirection: 'row', backgroundColor: colors.white, height: 90, borderRadius: 16, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  nearbyImg: { width: 74, height: 74, borderRadius: 12 },
  nearbyInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  nearbyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  nearbyName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  nearbyAddress: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  nearbyMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nearbyRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nearbyRatingText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  nearbyChip: { backgroundColor: colors.gray100, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  nearbyChipText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
});
