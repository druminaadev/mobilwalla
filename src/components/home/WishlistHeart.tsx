import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withSpring } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { useWishlistStore } from '../../store/wishlistStore';

export const WishlistHeart = ({ salonId }: { salonId: string }) => {
  const { isSalonLiked, toggleSalon } = useWishlistStore();
  const isWishlisted = isSalonLiked(salonId);
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    scale.value = withSequence(withSpring(1.4), withSpring(1));
    toggleSalon({ id: salonId, name: 'Salon', address: '', image: '', rating: 5, reviewCount: 0 } as any);
  }, [salonId, toggleSalon, scale]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <TouchableOpacity style={styles.wishlistBtn} onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={animatedStyle}>
        <Heart size={20} color={isWishlisted ? colors.error : colors.white} fill={isWishlisted ? colors.error : 'rgba(0,0,0,0.3)'} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wishlistBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' } as any,
});
