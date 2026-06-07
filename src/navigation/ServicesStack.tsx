import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServicesStackParamList } from '@/types/navigation';
import ServicesScreen from '@/screens/services/ServicesScreen';
import ServiceDetailScreen from '@/screens/services/ServiceDetailScreen';
import ServiceSelectionScreen from '@/screens/booking/ServiceSelectionScreen';

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export default function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServicesCatalogue" component={ServicesScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <Stack.Screen name="ServiceBooking"    component={ServiceSelectionScreen} />
    </Stack.Navigator>
  );
}
