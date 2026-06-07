import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookingsStackParamList } from '@/types/navigation';

import BookingListScreen from '@/screens/bookings/BookingListScreen';
import BookingDetailScreen from '@/screens/bookings/BookingDetailScreen';
import RescheduleScreen from '@/screens/bookings/RescheduleScreen';
import WriteReviewScreen from '@/screens/bookings/WriteReviewScreen';

const Stack = createNativeStackNavigator<BookingsStackParamList>();

export default function BookingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingList" component={BookingListScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="Reschedule" component={RescheduleScreen} />
      <Stack.Screen name="WriteReview" component={WriteReviewScreen} />
    </Stack.Navigator>
  );
}
