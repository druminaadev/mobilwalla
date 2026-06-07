import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Heart, Clock, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ServicesStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<ServicesStackParamList, 'ServiceDetail'>;

export default function ServiceDetailScreen({ route, navigation }: Props) {
  const service = route.params?.service;

  if (!service) return null;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.image }} style={styles.image} />
          <Pressable style={styles.favoriteButton}>
            <Heart size={24} color="#FF5C8A" />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{service.name}</Text>
          <View style={styles.meta}>
            <Text style={styles.rating}>⭐ {service.rating || '4.8'}</Text>
            <Text style={styles.reviews}>(230 reviews)</Text>
          </View>
          <View style={styles.durationRow}>
            <Clock size={16} color="#64748B" />
            <Text style={styles.duration}>Duration: {service.duration} mins</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            Experience premium {service.name.toLowerCase()} service with our expert stylists. 
            We use only the best products and techniques to ensure you leave looking and feeling amazing.
          </Text>

          <Text style={styles.sectionTitle}>What's Included</Text>
          {['Shampoo & Blow Dry', 'Head Massage (5 mins)', 'Professional Styling'].map((item, i) => (
            <View key={i} style={styles.includeItem}>
              <Check size={20} color="#10B981" />
              <Text style={styles.includeText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.price}>₹{service.price}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('ServiceBooking', { salonId: service.salonId || '1', preSelectedServiceId: service.id })}>
          <LinearGradient colors={['#FF5C8A', '#FF8BA7']} style={styles.bookButton}>
            <Text style={styles.bookText}>Book Now</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 280 },
  favoriteButton: { position: 'absolute', top: 48, right: 16, backgroundColor: '#fff', padding: 10, borderRadius: 20 },
  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: '800', color: '#1A1B2E', marginBottom: 8 },
  meta: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  rating: { fontSize: 16, fontWeight: '600', color: '#1A1B2E' },
  reviews: { fontSize: 16, color: '#64748B' },
  durationRow: { flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 20 },
  duration: { fontSize: 14, color: '#64748B' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1B2E', marginTop: 20, marginBottom: 12 },
  description: { fontSize: 15, color: '#64748B', lineHeight: 22 },
  includeItem: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 10 },
  includeText: { fontSize: 15, color: '#1A1B2E' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  priceLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  price: { fontSize: 24, fontWeight: '800', color: '#FF5C8A' },
  bookButton: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  bookText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
