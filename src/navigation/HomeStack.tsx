import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/types/navigation";

import HomeScreen from "@/screens/home/HomeScreen";
import SearchScreen from "@/screens/home/SearchScreen";
import SalonListScreen from "@/screens/home/SalonListScreen";
import SalonDetailScreen from "@/screens/home/SalonDetailScreen";
import ServiceSelectionScreen from "@/screens/booking/ServiceSelectionScreen";
import StaffSelectionScreen from "@/screens/booking/StaffSelectionScreen";
import SlotSelectionScreen from "@/screens/booking/SlotSelectionScreen";
import BookingSummaryScreen from "@/screens/booking/BookingSummaryScreen";
import PaymentScreen from "@/screens/booking/PaymentScreen";
import BookingSuccessScreen from "@/screens/booking/BookingSuccessScreen";
import ServiceDetailScreen from "@/screens/services/ServiceDetailScreen";
import ReviewsScreen from "@/screens/reviews/ReviewsScreen";
import GalleryScreen from "@/screens/gallery/GalleryScreen";
import ImageViewerScreen from "@/screens/gallery/ImageViewerScreen";
import TeamScreen from "@/screens/team/TeamScreen";
import ArtistProfileScreen from "@/screens/team/ArtistProfileScreen";
import LocationScreen from "@/screens/location/LocationScreen";
import OffersScreen from "@/screens/home/OffersScreen";
import SpecialForYouScreen from "@/screens/home/SpecialForYouScreen";
import WishlistScreen from "@/screens/home/WishlistScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="SalonList" component={SalonListScreen} />
      <Stack.Screen name="SalonDetail" component={SalonDetailScreen} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
      <Stack.Screen
        name="ServiceSelection"
        component={ServiceSelectionScreen}
      />
      <Stack.Screen name="StaffSelection" component={StaffSelectionScreen} />
      <Stack.Screen name="SlotSelection" component={SlotSelectionScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="ImageViewer" component={ImageViewerScreen} />
      <Stack.Screen name="Team" component={TeamScreen} />
      <Stack.Screen name="ArtistProfile" component={ArtistProfileScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="SpecialForYou" component={SpecialForYouScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
    </Stack.Navigator>
  );
}
