import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, SlidersHorizontal, Star, MapPin } from 'lucide-react-native';
import { HomeStackParamList } from '../../types/navigation';
import { Card } from '../../components/common/Card';
import { DEMO_SALONS } from '../../data/demo';
import { Salon } from '../../types/models';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'SalonList'>;

const SORT_OPTIONS = ['Distance', 'Rating', 'Reviews'];

export default function SalonListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [sortBy, setSortBy] = useState('Distance');

  const salons = [...DEMO_SALONS].sort((a, b) => {
    if (sortBy === 'Rating') return b.rating - a.rating;
    if (sortBy === 'Reviews') return b.totalReviews - a.totalReviews;
    return (a.distance ?? 0) - (b.distance ?? 0);
  });

  const renderSalon = ({ item }: { item: Salon }) => (
    <Card onPress={() => navigation.navigate('SalonDetail', { id: item.id })} style={styles.salonCard}>
      <View style={styles.salonImage}>
        <Text style={styles.imagePlaceholder}>🏪</Text>
      </View>
      <View style={styles.salonInfo}>
        <Text style={styles.salonName}>{item.name}</Text>
        <View style={styles.meta}>
          <Star size={14} color={colors.warning} fill={colors.warning} />
          <Text style={styles.metaText}>{item.rating} · {item.totalReviews} reviews</Text>
        </View>
        <View style={styles.meta}>
          <MapPin size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{item.distance} km away</Text>
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {item.addressLine1}, {item.city}
        </Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Salons</Text>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.sortContainer}>
        {SORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.sortChip, sortBy === option && styles.sortChipActive]}
            onPress={() => setSortBy(option)}
          >
            <Text style={[styles.sortText, sortBy === option && styles.sortTextActive]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={salons}
        renderItem={renderSalon}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, flex: 1, marginLeft: 12 },
  filterButton: { padding: 8 },
  sortContainer: { flexDirection: 'row', padding: 16, gap: 8 },
  sortChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.background, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  sortChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sortText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  sortTextActive: { color: 'white' },
  list: { padding: 16 },
  salonCard: { marginBottom: 16, flexDirection: 'row', padding: 12 },
  salonImage: { width: 90, height: 90, backgroundColor: colors.background, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholder: { fontSize: 36 },
  salonInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  salonName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  metaText: { fontSize: 13, color: colors.textSecondary },
  address: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
