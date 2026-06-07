import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { Search } from 'lucide-react-native';

const IMAGES = [
  { id: '1', uri: 'https://via.placeholder.com/150', category: 'hair' },
  { id: '2', uri: 'https://via.placeholder.com/150', category: 'skin' },
  { id: '3', uri: 'https://via.placeholder.com/150', category: 'bride' },
  { id: '4', uri: 'https://via.placeholder.com/150', category: 'hair' },
  { id: '5', uri: 'https://via.placeholder.com/150', category: 'skin' },
  { id: '6', uri: 'https://via.placeholder.com/150', category: 'hair' },
  { id: '7', uri: 'https://via.placeholder.com/150', category: 'bride' },
  { id: '8', uri: 'https://via.placeholder.com/150', category: 'hair' },
];

const FILTERS = ['All', 'Hair', 'Skin', 'Bride'];

export default function GalleryScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredImages = selectedFilter === 'All' 
    ? IMAGES 
    : IMAGES.filter(img => img.category === selectedFilter.toLowerCase());

  const renderImage = ({ item }: { item: typeof IMAGES[0] }) => (
    <Pressable style={styles.imageCard}>
      <Image source={{ uri: item.uri }} style={styles.image} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gallery</Text>
        <Search size={24} color="#1A1B2E" />
      </View>

      <View style={styles.filters}>
        {FILTERS.map(filter => (
          <Pressable
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[styles.filterPill, selectedFilter === filter && styles.activeFilter]}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>{filter}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredImages}
        renderItem={renderImage}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1B2E' },
  filters: { flexDirection: 'row', gap: 10, padding: 16, backgroundColor: '#fff', marginBottom: 12 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  activeFilter: { backgroundColor: '#FF5C8A', borderColor: '#FF5C8A' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  activeFilterText: { color: '#fff' },
  grid: { padding: 4 },
  imageCard: { flex: 1, margin: 4 },
  image: { width: '100%', aspectRatio: 1, borderRadius: 8 },
});
