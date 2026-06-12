import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { SERVICES } from '../../data/mockHomeData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeServiceCategories = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.serviceScroll}>
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <Animated.View key={s.id} entering={ZoomIn.delay(300 + (i * 60)).springify()}>
              <TouchableOpacity style={styles.serviceItem} onPress={() => navigation.navigate('SalonList', {})}>
                <View style={[styles.serviceCircle, { backgroundColor: s.bg }]}>
                  <Icon size={28} color={s.color} />
                </View>
                <Text style={styles.serviceName}>{s.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 16, marginTop: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { fontSize: 13, fontWeight: '600', color: colors.textTertiary },
  serviceScroll: { paddingHorizontal: 16, gap: 16 },
  serviceItem: { alignItems: 'center', width: 72 },
  serviceCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: colors.gray100 },
  serviceName: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },
});
