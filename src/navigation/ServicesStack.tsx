import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServicesScreen from "@/screens/services/ServicesScreen";
import ServiceDetailScreen from "@/screens/services/ServiceDetailScreen";
import ServiceSelectionScreen from "@/screens/booking/ServiceSelectionScreen";
import StaffSelectionScreen from "@/screens/booking/StaffSelectionScreen";
import SlotSelectionScreen from "@/screens/booking/SlotSelectionScreen";
import BookingSummaryScreen from "@/screens/booking/BookingSummaryScreen";
import PaymentScreen from "@/screens/booking/PaymentScreen";
import BookingSuccessScreen from "@/screens/booking/BookingSuccessScreen";

export type ServicesFullStackParamList = {
  ServicesCatalogue: undefined;
  ServiceDetail: { service: any };
  ServiceBooking: { salonId: string; preSelectedServiceId?: string };
  StaffSelection: { salonId: string };
  SlotSelection: { salonId: string; staffId?: string | null };
  BookingSummary: {
    salonId: string;
    staffId?: string | null;
    date: string;
    time: string;
  };
  Payment: { bookingData: any };
  BookingSuccess: { bookingId: string };
};

const Stack = createNativeStackNavigator<ServicesFullStackParamList>();

export default function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServicesCatalogue" component={ServicesScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <Stack.Screen name="ServiceBooking" component={ServiceSelectionScreen} />
      <Stack.Screen name="StaffSelection" component={StaffSelectionScreen} />
      <Stack.Screen name="SlotSelection" component={SlotSelectionScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
    </Stack.Navigator>
  );
}
