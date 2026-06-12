import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { TRENDING_SERVICES } from '../../data/mockHomeData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeTrendingServices = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Animated.View entering={FadeInUp.delay(900)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Now ✨</Text>
      </View>
      <View style={styles.gridWrap}>
        {TRENDING_SERVICES.map((ts) => (
          <TouchableOpacity key={ts.id} style={styles.gridCard} onPress={() => navigation.navigate('ServiceSelection', { salonId: 's1' })} activeOpacity={0.9}>
            <Image source={ts.image} style={styles.gridImg} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gridOverlay}>
              <Text style={styles.gridName} numberOfLines={1}>{ts.name}</Text>
              <Text style={styles.gridPrice}>Starts at {ts.price}</Text>
              <View style={styles.gridBookPill}><Text style={styles.gridBookPillText}>Book</Text></View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 16, marginTop: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3 },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 16 },
  gridCard: { width: (width - 48) / 2, height: 150, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.gray100 },
  gridImg: { width: '100%', height: '100%' },
  gridOverlay: { position: 'absolute', inset: 0, justifyContent: 'flex-end', padding: 12 } as any,
  gridName: { fontSize: 13, fontWeight: '700', color: colors.white, marginBottom: 2 },
  gridPrice: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  gridBookPill: { alignSelf: 'flex-end', backgroundColor: colors.white, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  gridBookPillText: { fontSize: 11, fontWeight: '700', color: colors.primary },
});
