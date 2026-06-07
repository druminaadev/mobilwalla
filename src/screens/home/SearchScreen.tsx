import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search, ArrowLeft, Star, MapPin } from 'lucide-react-native';
import { HomeStackParamList } from '@/types/navigation';
import { Card } from '@/components/common/Card';
import { DEMO_SALONS } from '@/data/demo';
import { Salon } from '@/types/models';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Search'>;

export default function SearchScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const results: Salon[] = query.length >= 1
    ? DEMO_SALONS.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.city.toLowerCase().includes(query.toLowerCase()) ||
          s.addressLine1.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const renderResult = ({ item }: { item: Salon }) => (
    <Card onPress={() => navigation.navigate('SalonDetail', { id: item.id })} style={styles.resultCard}>
      <View style={styles.salonImage}>
        <Text style={styles.imagePlaceholder}>🏪</Text>
      </View>
      <View style={styles.salonInfo}>
        <Text style={styles.salonName}>{item.name}</Text>
        <View style={styles.meta}>
          <Star size={14} color={colors.warning} fill={colors.warning} />
          <Text style={styles.metaText}>{item.rating}</Text>
          <Text style={styles.separator}>·</Text>
          <MapPin size={13} color={colors.textSecondary} />
          <Text style={styles.metaText}>{item.distance} km</Text>
        </View>
        <Text style={styles.address} numberOfLines={1}>{item.addressLine1}, {item.city}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search salons or services"
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      </View>

      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.results}
        />
      ) : query.length >= 1 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No results for "{query}"</Text>
          <Text style={styles.emptyText}>Try searching by salon name or city</Text>
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✂️</Text>
          <Text style={styles.emptyTitle}>Find your salon</Text>
          <Text style={styles.emptyText}>Search by name, service, or location</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { padding: 4 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 12, height: 44 },
  input: { flex: 1, fontSize: 15, color: colors.textPrimary },
  results: { padding: 16 },
  resultCard: { marginBottom: 12, flexDirection: 'row', padding: 12 },
  salonImage: { width: 70, height: 70, backgroundColor: colors.background, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholder: { fontSize: 28 },
  salonInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  salonName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  metaText: { fontSize: 13, color: colors.textSecondary },
  separator: { fontSize: 13, color: colors.textSecondary },
  address: { fontSize: 13, color: colors.textSecondary },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  emptyText: { fontSize: 14, color: colors.textSecondary },
});
