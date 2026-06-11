import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Team'>;

const ARTISTS = [
  { id: '1', name: 'Anjali Sharma', role: 'Senior Stylist', rating: 4.9, clients: 430, image: 'https://via.placeholder.com/300', specialties: ['Bridal', 'Color', 'Cut'] },
  { id: '2', name: 'Rahul Verma', role: 'Hair Specialist', rating: 4.8, clients: 380, image: 'https://via.placeholder.com/300', specialties: ['Cut', 'Beard', 'Styling'] },
  { id: '3', name: 'Priya Patel', role: 'Makeup Artist', rating: 4.7, clients: 290, image: 'https://via.placeholder.com/300', specialties: ['Bridal', 'Party', 'Glam'] },
];

export default function TeamScreen() {
  const navigation = useNavigation<NavigationProp>();

  const renderArtist = ({ item }: { item: typeof ARTISTS[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>⭐ {item.rating}</Text>
          <Text style={styles.stat}>💇 {item.clients} clients</Text>
        </View>
        <View style={styles.specialties}>
          {item.specialties.map(spec => (
            <View key={spec} style={styles.tag}>
              <Text style={styles.tagText}>#{spec}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.bio}>Passionate about creating stunning transformations</Text>
        <Pressable onPress={() => navigation.navigate('ArtistProfile', { artist: item })}>
          <LinearGradient colors={['#FF5C8A', '#FF5C8A']} style={styles.bookButton}>
            <Text style={styles.bookText}>Book with {item.name.split(' ')[0]} →</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Artists</Text>
      </View>
      <FlatList
        data={ARTISTS}
        renderItem={renderArtist}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.pagination}>
        {ARTISTS.map((_, i) => (
          <View key={i} style={[styles.dot, i === 0 && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  header: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1B2E' },
  card: { width, padding: 20 },
  image: { width: '100%', height: 320, borderRadius: 16, marginBottom: 16 },
  content: { backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 2 },
  name: { fontSize: 24, fontWeight: '800', color: '#1A1B2E', marginBottom: 4 },
  role: { fontSize: 16, color: '#64748B', marginBottom: 12 },
  stats: { flexDirection: 'row', gap: 20, marginBottom: 12 },
  stat: { fontSize: 14, fontWeight: '600', color: '#1A1B2E' },
  specialties: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F8FAFC', borderRadius: 20 },
  tagText: { fontSize: 12, fontWeight: '600', color: '#FF5C8A' },
  bio: { fontSize: 14, color: '#64748B', marginBottom: 16, lineHeight: 20 },
  bookButton: { padding: 14, borderRadius: 12, alignItems: 'center' },
  bookText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E2E8F0' },
  activeDot: { backgroundColor: '#FF5C8A', width: 24 },
});
