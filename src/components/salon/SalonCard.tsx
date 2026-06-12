import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, MapPin, Heart } from 'lucide-react-native';
import { Card } from '../common/Card';
import { Salon } from '../../types/models';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { useWishlistStore } from '../../store/wishlistStore';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface Props {
  salon: Salon;
  onPress: () => void;
  horizontal?: boolean;
}

export const SalonCard: React.FC<Props> = ({ salon, onPress, horizontal = true }) => {
  const { toggleSalon, isSalonLiked } = useWishlistStore();
  const liked = isSalonLiked(salon.id);

  const handleToggleLike = () => {
    toggleSalon({
      id: salon.id,
      name: salon.name,
      address: salon.addressLine1,
      rating: salon.rating,
      reviewCount: salon.totalReviews,
      image: salon.coverImageUrl || salon.logoUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
    });
  };

  return (
    <Card onPress={onPress} style={horizontal ? styles.horizontal : styles.vertical}>
      <View style={horizontal ? styles.imageContainer : styles.imageVerticalContainer}>
        {salon.coverImageUrl || salon.logoUrl ? (
          <Image source={{ uri: salon.coverImageUrl || salon.logoUrl }} style={styles.image} />
        ) : (
          <View style={styles.emojiContainer}><Text style={styles.emoji}>🏪</Text></View>
        )}
        <TouchableOpacity style={styles.heartBtn} onPress={handleToggleLike} activeOpacity={0.8}>
           <Heart size={16} color={liked ? colors.error : colors.textPrimary} fill={liked ? colors.error : 'transparent'} />
        </TouchableOpacity>
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
};

const styles = StyleSheet.create({
  horizontal: { flexDirection: 'row', marginBottom: 12, padding: 12 },
  vertical: { marginBottom: 12, padding: 12 },
  imageContainer: { width: 80, height: 80, borderRadius: 12, overflow: 'hidden' },
  imageVerticalContainer: { height: 140, borderRadius: 12, overflow: 'hidden', marginBottom: 10 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  emojiContainer: { width: '100%', height: '100%', backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 32 },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  infoVertical: { paddingHorizontal: 4 },
  name: { ...typography.subtitle1, color: colors.textPrimary, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  meta: { ...typography.caption, color: colors.textSecondary },
  dot: { color: colors.textSecondary, fontSize: 12 },
  address: { ...typography.caption, color: colors.textSecondary },
});
