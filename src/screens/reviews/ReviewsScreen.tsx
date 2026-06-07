import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const REVIEWS = [
  { id: '1', name: 'Priya M.', rating: 5, service: 'Bridal Makeup', comment: 'Great experience! Highly recommended.', date: 'June 2024', avatar: 'https://via.placeholder.com/40' },
  { id: '2', name: 'Rahul K.', rating: 4, service: 'Haircut', comment: 'Good service, will come again.', date: 'May 2024', avatar: 'https://via.placeholder.com/40' },
  { id: '3', name: 'Anjali S.', rating: 5, service: 'Facial', comment: 'Amazing staff and results!', date: 'May 2024', avatar: 'https://via.placeholder.com/40' },
];

const FILTERS = ['All', '5★', '4★', '3★'];

export default function ReviewsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const ratingBars = [
    { stars: 5, percentage: 75 },
    { stars: 4, percentage: 18 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.overallSection}>
          <Text style={styles.overallRating}>4.8 / 5.0</Text>
          <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.basedOn}>Based on 1,240 reviews</Text>

          <View style={styles.barsContainer}>
            {ratingBars.map(bar => (
              <View key={bar.stars} style={styles.barRow}>
                <View style={styles.barFill} />
                <View style={[styles.barFillActive, { width: `${bar.percentage}%` }]} />
                <Text style={styles.barLabel}>{bar.stars} ★</Text>
                <Text style={styles.barPercent}>({bar.percentage}%)</Text>
              </View>
            ))}
          </View>
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

        {REVIEWS.map(review => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: review.avatar }} style={styles.avatar} />
              <View style={styles.reviewMeta}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <Text style={styles.reviewStars}>{'⭐'.repeat(review.rating)}</Text>
              </View>
            </View>
            <Text style={styles.reviewService}>Service: {review.service}</Text>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        ))}
      </ScrollView>

      <Pressable style={styles.writeButton}>
        <LinearGradient colors={['#FF5C8A', '#FF8BA7']} style={styles.gradient}>
          <Text style={styles.writeButtonText}>+ Write a Review</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  overallSection: { backgroundColor: '#fff', padding: 24, alignItems: 'center', marginBottom: 12 },
  overallRating: { fontSize: 48, fontWeight: '800', color: '#1A1B2E', marginBottom: 8 },
  stars: { fontSize: 24, marginBottom: 8 },
  basedOn: { fontSize: 14, color: '#64748B', marginBottom: 24 },
  barsContainer: { width: '100%', gap: 8 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barFill: { flex: 1, height: 8, backgroundColor: '#E2E8F0', borderRadius: 4 },
  barFillActive: { position: 'absolute', height: 8, backgroundColor: '#FF5C8A', borderRadius: 4 },
  barLabel: { fontSize: 14, fontWeight: '600', color: '#1A1B2E', width: 40 },
  barPercent: { fontSize: 12, color: '#64748B', width: 50 },
  filters: { flexDirection: 'row', gap: 10, padding: 16, backgroundColor: '#fff', marginBottom: 12 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  activeFilter: { backgroundColor: '#FF5C8A', borderColor: '#FF5C8A' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  activeFilterText: { color: '#fff' },
  reviewCard: { backgroundColor: '#fff', padding: 16, marginHorizontal: 16, marginBottom: 12, borderRadius: 12, elevation: 2 },
  reviewHeader: { flexDirection: 'row', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  reviewMeta: { marginLeft: 12, flex: 1 },
  reviewName: { fontSize: 16, fontWeight: '700', color: '#1A1B2E', marginBottom: 4 },
  reviewStars: { fontSize: 14 },
  reviewService: { fontSize: 13, color: '#64748B', marginBottom: 8 },
  reviewComment: { fontSize: 15, color: '#1A1B2E', lineHeight: 22, marginBottom: 8 },
  reviewDate: { fontSize: 12, color: '#64748B' },
  writeButton: { margin: 16, marginBottom: 32 },
  gradient: { padding: 16, borderRadius: 12, alignItems: 'center' },
  writeButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
