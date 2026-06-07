import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Star } from 'lucide-react-native';
import { BookingsStackParamList } from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { DEMO_BOOKINGS, DEMO_SALONS } from '@/data/demo';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<BookingsStackParamList, 'WriteReview'>;

const ASPECTS = ['Cleanliness', 'Staff', 'Value', 'Ambiance'];

export default function WriteReviewScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const booking = DEMO_BOOKINGS.find((b) => b.id === bookingId) ?? DEMO_BOOKINGS[2];
  const salon = DEMO_SALONS.find((s) => s.id === booking.salonId) ?? DEMO_SALONS[0];

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [aspectRatings, setAspectRatings] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const setAspect = (aspect: string, value: number) =>
    setAspectRatings((prev) => ({ ...prev, [aspect]: value }));

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating required', 'Please give an overall rating.');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(() => r(null), 800));
    setSubmitting(false);
    Alert.alert('Thank you! 🎉', 'Your review has been submitted.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Write a Review" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Salon Info */}
        <View style={styles.salonCard}>
          <Text style={styles.salonEmoji}>🏪</Text>
          <View>
            <Text style={styles.salonName}>{salon.name}</Text>
            <Text style={styles.serviceNames}>{booking.serviceNames.join(', ')}</Text>
            <Text style={styles.bookingDate}>
              {new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Overall Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Rating</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <React.Fragment key={i}>
                <View onTouchEnd={() => setRating(i)}>
                  <Star
                    size={42}
                    color={colors.warning}
                    fill={i <= rating ? colors.warning : 'none'}
                  />
                </View>
              </React.Fragment>
            ))}
          </View>
          <Text style={styles.ratingLabel}>
            {rating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </Text>
        </View>

        {/* Aspect Ratings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate by Aspect</Text>
          {ASPECTS.map((aspect) => (
            <View key={aspect} style={styles.aspectRow}>
              <Text style={styles.aspectLabel}>{aspect}</Text>
              <View style={styles.aspectStars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <React.Fragment key={i}>
                    <View onTouchEnd={() => setAspect(aspect, i)}>
                      <Star
                        size={22}
                        color={colors.warning}
                        fill={i <= (aspectRatings[aspect] ?? 0) ? colors.warning : 'none'}
                      />
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Comment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Review</Text>
          <TextInput
            style={styles.input}
            placeholder="Share details about your experience, the staff, ambiance..."
            placeholderTextColor={colors.textTertiary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{comment.length}/500</Text>
        </View>

        <Button
          title="Submit Review"
          onPress={handleSubmit}
          loading={submitting}
          disabled={rating === 0}
          fullWidth
        />

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { padding: 16, gap: 8 },
  salonCard: { flexDirection: 'row', gap: 14, padding: 16, backgroundColor: colors.background, borderRadius: 14, alignItems: 'center', marginBottom: 8 },
  salonEmoji: { fontSize: 36 },
  salonName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  serviceNames: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  bookingDate: { fontSize: 12, color: colors.textTertiary },
  section: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 14 },
  stars: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 8 },
  ratingLabel: { textAlign: 'center', fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  aspectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  aspectLabel: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  aspectStars: { flexDirection: 'row', gap: 4 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, fontSize: 15, color: colors.textPrimary, minHeight: 120 },
  charCount: { fontSize: 12, color: colors.textTertiary, textAlign: 'right', marginTop: 6 },
});
