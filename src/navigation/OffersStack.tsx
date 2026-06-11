import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OffersScreen from '../screens/home/OffersScreen';
import SpecialForYouScreen from '../screens/home/SpecialForYouScreen';
import ServiceSelectionScreen from '../screens/booking/ServiceSelectionScreen';
import StaffSelectionScreen from '../screens/booking/StaffSelectionScreen';
import SlotSelectionScreen from '../screens/booking/SlotSelectionScreen';
import BookingSummaryScreen from '../screens/booking/BookingSummaryScreen';
import PaymentScreen from '../screens/booking/PaymentScreen';
import BookingSuccessScreen from '../screens/booking/BookingSuccessScreen';
import SalonListScreen from '../screens/home/SalonListScreen';

export type OffersStackParamList = {
  OffersList: undefined;
  SpecialForYou: undefined;
  SalonList: Record<string, never>;
  ServiceSelection: { salonId: string };
  StaffSelection: { salonId: string };
  SlotSelection: { salonId: string; staffId?: string | null };
  BookingSummary: { salonId: string; staffId?: string | null; date: string; time: string };
  Payment: { bookingData: any };
  BookingSuccess: { bookingId: string };
};

const Stack = createNativeStackNavigator<OffersStackParamList>();

export default function OffersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OffersList" component={OffersScreen} />
      <Stack.Screen name="SpecialForYou" component={SpecialForYouScreen} />
      <Stack.Screen name="SalonList" component={SalonListScreen} />
      <Stack.Screen name="ServiceSelection" component={ServiceSelectionScreen} />
      <Stack.Screen name="StaffSelection" component={StaffSelectionScreen} />
      <Stack.Screen name="SlotSelection" component={SlotSelectionScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
    </Stack.Navigator>
  );
}
