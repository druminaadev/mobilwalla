import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { OFFERS } from '../../data/mockHomeData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeSpecialOffers = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Hot Deals 🔥</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Offers')}><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersScroll}>
        {OFFERS.map((offer) => (
          <TouchableOpacity key={offer.id} style={styles.offerCard} onPress={() => navigation.navigate('SpecialForYou')} activeOpacity={0.9}>
            <Image source={offer.image} style={styles.offerImg} />
            <View style={styles.offerInfo}>
              <Text style={[styles.offerDiscount, { color: offer.color }]}>{offer.discount}</Text>
              <Text style={styles.offerTitle} numberOfLines={1}>{offer.title}</Text>
              <View style={styles.offerCodeWrap}>
                <Text style={styles.offerCode}>{offer.code}</Text>
              </View>
              <Text style={[styles.offerValid, offer.validUntil < 3 && { color: colors.error }]}>
                Valid: {offer.validUntil} days left
              </Text>
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
  offersScroll: { paddingHorizontal: 16, gap: 16 },
  offerCard: { width: 260, height: 100, flexDirection: 'row', backgroundColor: colors.white, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  offerImg: { width: 100, height: 100 },
  offerInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  offerDiscount: { fontSize: 24, fontWeight: '800', marginBottom: 2 },
  offerTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  offerCodeWrap: { alignSelf: 'flex-start', backgroundColor: colors.gray100, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 4 },
  offerCode: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 11, color: colors.textSecondary, fontWeight: '700' },
  offerValid: { fontSize: 11, color: colors.textTertiary },
});
