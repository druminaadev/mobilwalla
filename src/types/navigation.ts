import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  OTPVerification: { phone: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ServicesTab: NavigatorScreenParams<ServicesStackParamList>;
  BookingsTab: NavigatorScreenParams<BookingsStackParamList>;
  ShopTab: NavigatorScreenParams<ShopStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type ServicesStackParamList = {
  ServicesCatalogue: undefined;
  ServiceDetail: { service: any };
  ServiceBooking: { salonId: string; preSelectedServiceId?: string };
};

export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  SalonList: Record<string, never>;
  SalonDetail: { id: string };
  ServiceDetail: { service: any };
  ServiceSelection: { salonId: string };
  StaffSelection: { salonId: string };
  SlotSelection: { salonId: string; staffId?: string | null };
  BookingSummary: { salonId: string; staffId?: string | null; date: string; time: string };
  Payment: { bookingData: any };
  BookingSuccess: { bookingId: string };
  Reviews: undefined;
  Gallery: undefined;
  ImageViewer: { imageUri: string };
  Team: undefined;
  ArtistProfile: { artist: any };
  Location: undefined;
};

export type BookingsStackParamList = {
  BookingList: undefined;
  BookingDetail: { id: string };
  Reschedule: { bookingId: string };
  WriteReview: { bookingId: string };
};

export type WalletStackParamList = {
  WalletHome: undefined;
  AddMoney: undefined;
  TransactionHistory: undefined;
  Referral: undefined;
};

export type ShopStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: any; id?: string };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmed: { orderId: string };
  OrderTracking: { orderId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Addresses: undefined;
  AddAddress: {
    address?: {
      id: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      type: 'home' | 'work' | 'other';
      isDefault: boolean;
    };
  } | undefined;
  Settings: undefined;
  Notifications: undefined;
  Help: undefined;
  // Wallet screens nested inside ProfileStack
  WalletHome: undefined;
  AddMoney: undefined;
  TransactionHistory: undefined;
  Referral: undefined;
};
