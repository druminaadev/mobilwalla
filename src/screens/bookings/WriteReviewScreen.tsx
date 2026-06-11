import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Star, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingsStackParamList } from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { DEMO_SALONS, DEMO_SERVICES, DEMO_STAFF } from '@/data/demo';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Booking } from '@/types/models';

type Props = NativeStackScreenProps<BookingsStackParamList, 'WriteReview'>;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function WriteReviewScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const insets = useSafeAreaInsets();

  // Dummy mock booking to avoid dependencies breaking
  const booking: Booking = {
    id: bookingId,
    salonId: DEMO_SALONS[0].id,
    salonName: DEMO_SALONS[0].name,
    salonImage: DEMO_SALONS[0].coverImageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
    services: [DEMO_SERVICES.s1[0]],
    staff: DEMO_STAFF.s1[0],
    date: new Date().toISOString(),
    time: '14:00',
    status: 'completed',
    totalAmount: 1200,
    paymentStatus: 'SUCCESS',
    paymentMethod: 'upi',
    createdAt: new Date().toISOString(),
  };

  const salon = DEMO_SALONS.find((s) => s.id === booking.salonId) ?? DEMO_SALONS[0];

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const starScale = useSharedValue(1);

  const handleStarPress = (selectedRating: number) => {
    starScale.value = withSpring(1.2, {}, () => {
        starScale.value = withSpring(1);
    });
    setRating(selectedRating);
  };

  const animatedStarStyle = useAnimatedStyle(() => ({
      transform: [{ scale: starScale.value }]
  }));

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please provide a star rating before submitting.');
      return;
    }
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(() => r(null), 1000));
    setSubmitting(false);
    
    Alert.alert('Review Submitted! 🎉', 'Thank you for sharing your experience.', [
      { text: 'Done', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        
        {/* Hero Context */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.heroCard}>
            <Image source={{ uri: booking.salonImage }} style={styles.heroImage} />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
                <Text style={styles.heroSalonName}>{salon.name}</Text>
                <Text style={styles.heroService}>{booking.services.map(s => s.name).join(', ')}</Text>
                {booking.staff && (
                    <View style={styles.heroStylistRow}>
                        <Image source={{ uri: booking.staff.photo }} style={styles.stylistAvatar} />
                        <Text style={styles.stylistName}>Stylist: {booking.staff.name}</Text>
                    </View>
                )}
            </View>
        </Animated.View>

        {/* Rating Section */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>How was your experience?</Text>
            <Text style={styles.ratingSubtitle}>Your feedback helps us improve our services.</Text>
            
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <AnimatedTouchableOpacity 
                        key={i} 
                        onPress={() => handleStarPress(i)} 
                        activeOpacity={0.7}
                        style={[styles.starBtn, i <= rating && animatedStarStyle]}
                    >
                        <Star
                            size={48}
                            color={i <= rating ? '#FFD700' : colors.gray200}
                            fill={i <= rating ? '#FFD700' : 'none'}
                        />
                    </AnimatedTouchableOpacity>
                ))}
            </View>
            <Text style={styles.ratingLabel}>
                {rating === 0 ? 'Tap to rate' : ['', 'Terrible 😞', 'Poor 😕', 'Okay 😐', 'Good 🙂', 'Excellent 🤩'][rating]}
            </Text>
        </Animated.View>

        {/* Text Input Section */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.inputSection}>
            <Text style={styles.inputLabel}>Care to share more? (Optional)</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Tell us what you liked or what could be better..."
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    numberOfLines={6}
                    value={comment}
                    onChangeText={setComment}
                    maxLength={500}
                    textAlignVertical="top"
                />
            </View>
            <Text style={styles.charCount}>{comment.length}/500</Text>
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
        <Button 
            title="Submit Review" 
            onPress={handleSubmit} 
            fullWidth 
            loading={submitting} 
            disabled={rating === 0}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  heroCard: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroSalonName: {
    ...typography.h3,
    color: '#FFF',
    marginBottom: 4,
  },
  heroService: {
    ...typography.subtitle2,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  heroStylistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stylistAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  stylistName: {
    ...typography.caption,
    color: '#FFF',
    fontWeight: '600',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ratingTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  starBtn: {
    padding: 4,
  },
  ratingLabel: {
    ...typography.subtitle1,
    color: colors.primary,
    fontWeight: '700',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    ...typography.body1,
    color: colors.textPrimary,
    minHeight: 120,
  },
  charCount: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
});
