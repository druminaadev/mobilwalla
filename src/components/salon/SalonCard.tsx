import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, MapPin } from 'lucide-react-native';
import { Card } from '@/components/common/Card';
import { Salon } from '@/types/models';
import { colors } from '@/constants/colors';

interface Props {
  salon: Salon;
  onPress: () => void;
  horizontal?: boolean;
}

export const SalonCard: React.FC<Props> = ({ salon, onPress, horizontal = true }) => (
  <Card onPress={onPress} style={horizontal ? styles.horizontal : styles.vertical}>
    <View style={horizontal ? styles.image : styles.imageVertical}>
      <Text style={styles.emoji}>🏪</Text>
    </View>
    <View style={horizontal ? styles.info : styles.infoVertical}>
      <Text style={styles.name} numberOfLines={1}>{salon.name}</Text>
      <View style={styles.row}>
        <Star size={13} color={colors.warning} fill={colors.warning} />
        <Text style={styles.meta}>{salon.rating} ({salon.totalReviews})</Text>
        <Text style={styles.dot}>·</Text>
        <MapPin size={13} color={colors.textSecondary} />
        <Text style={styles.meta}>{salon.distance} km</Text>
      </View>
      <Text style={styles.address} numberOfLines={1}>{salon.addressLine1}, {salon.city}</Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  horizontal: { flexDirection: 'row', marginBottom: 12, padding: 12 },
  vertical: { marginBottom: 12, padding: 12 },
  image: { width: 80, height: 80, backgroundColor: colors.background, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  imageVertical: { height: 120, backgroundColor: colors.background, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  emoji: { fontSize: 32 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  infoVertical: {},
  name: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  meta: { fontSize: 12, color: colors.textSecondary },
  dot: { color: colors.textSecondary, fontSize: 12 },
  address: { fontSize: 12, color: colors.textSecondary },
});
