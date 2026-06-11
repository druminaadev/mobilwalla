import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { STYLISTS } from '../../data/mockHomeData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeTopStylists = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Animated.View entering={FadeInUp.delay(800)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Stylists</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Team')}><Text style={styles.seeAllText}>Meet All →</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stylistScroll}>
        {STYLISTS.map((st) => (
          <TouchableOpacity key={st.id} style={styles.stylistCard} onPress={() => navigation.navigate('Team')} activeOpacity={0.8}>
            <View style={styles.stylistAvatarWrap}>
              <LinearGradient colors={['#F3F4F6', '#E5E7EB']} style={styles.stylistAvatar}>
                <Text style={styles.stylistInitials}>{st.name.charAt(0)}</Text>
              </LinearGradient>
              {st.isAvailable && <View style={styles.onlineDot} />}
            </View>
            <Text style={styles.stylistName} numberOfLines={1}>{st.name}</Text>
            <Text style={styles.stylistSpec}>{st.specialty}</Text>
            <View style={styles.stylistRating}><Star size={10} color={colors.accent} fill={colors.accent} /><Text style={styles.stylistRatingText}>{st.rating}</Text></View>
            <View style={styles.stylistBookBtn}><Text style={styles.stylistBookText}>Book</Text></View>
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
  stylistScroll: { paddingHorizontal: 16, gap: 16 },
  stylistCard: { width: 120, alignItems: 'center', backgroundColor: colors.white, padding: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  stylistAvatarWrap: { position: 'relative', marginBottom: 12 },
  stylistAvatar: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  stylistInitials: { fontSize: 24, fontWeight: '700', color: colors.textTertiary },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.white },
  stylistName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  stylistSpec: { fontSize: 11, color: colors.primary, fontWeight: '600', marginBottom: 6 },
  stylistRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  stylistRatingText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  stylistBookBtn: { width: '100%', paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: colors.primary, alignItems: 'center' },
  stylistBookText: { fontSize: 12, fontWeight: '700', color: colors.primary },
});
