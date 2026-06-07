import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<HomeStackParamList, 'ArtistProfile'>;

export default function ArtistProfileScreen({ navigation, route }: Props) {
  const artist = route.params?.artist;

  if (!artist) return null;

  const portfolio = Array(6).fill('https://via.placeholder.com/150');
  const reviews = [
    { id: '1', rating: 5, comment: 'Wonderful experience!' },
    { id: '2', rating: 5, comment: 'Best haircut ever!' },
    { id: '3', rating: 4, comment: 'Great service!' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: artist.image }} style={styles.banner} />
        
        <View style={styles.profileCard}>
          <Image source={{ uri: artist.image }} style={styles.avatar} />
          <Text style={styles.name}>{artist.name}</Text>
          <Text style={styles.role}>{artist.role}</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>⭐ {artist.rating}</Text>
            <Text style={styles.stat}>💇 {artist.clients} done</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specializations</Text>
          <View style={styles.specialties}>
            {['Bridal', 'Color', 'Cut', 'Nails'].map(spec => (
              <View key={spec} style={styles.tag}>
                <Text style={styles.tagText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <View style={styles.portfolio}>
            {portfolio.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.portfolioImage} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <Text style={styles.reviewStars}>{'⭐'.repeat(review.rating)}</Text>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable style={styles.bookButton}>
        <LinearGradient colors={['#FF5C8A', '#FF8BA7']} style={styles.gradient}>
          <Text style={styles.bookText}>Book with {artist.name.split(' ')[0]}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  banner: { width: '100%', height: 200 },
  profileCard: { backgroundColor: '#fff', margin: 20, marginTop: -40, borderRadius: 16, padding: 20, alignItems: 'center', elevation: 4 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12, borderWidth: 4, borderColor: '#fff' },
  name: { fontSize: 24, fontWeight: '800', color: '#1A1B2E', marginBottom: 4 },
  role: { fontSize: 16, color: '#64748B', marginBottom: 12 },
  stats: { flexDirection: 'row', gap: 20 },
  stat: { fontSize: 14, fontWeight: '600', color: '#1A1B2E' },
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1B2E', marginBottom: 12 },
  specialties: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#FF5C8A' },
  tagText: { fontSize: 14, fontWeight: '600', color: '#FF5C8A' },
  portfolio: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  portfolioImage: { width: '31%', aspectRatio: 1, borderRadius: 8 },
  reviewCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  reviewStars: { fontSize: 16, marginBottom: 8 },
  reviewComment: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  bookButton: { margin: 20, marginBottom: 32 },
  gradient: { padding: 16, borderRadius: 12, alignItems: 'center' },
  bookText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
