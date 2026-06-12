import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  OTPVerification: { phone: string; mode: 'login' | 'signup' };
  AuthSuccess: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ServicesTab: NavigatorScreenParams<ServicesStackParamList>;
  OffersTab: NavigatorScreenParams<{ OffersList: undefined; SalonList: Record<string, never>; ServiceSelection: { salonId: string }; StaffSelection: { salonId: string }; SlotSelection: { salonId: string; staffId?: string | null }; BookingSummary: { salonId: string; staffId?: string | null; date: string; time: string }; Payment: { bookingData: Record<string, string> }; BookingSuccess: { bookingId: string } }>;
  BookingsTab: NavigatorScreenParams<BookingsStackParamList>;
  ShopTab: NavigatorScreenParams<ShopStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type ServicesStackParamList = {
  ServicesCatalogue: undefined;
  ServiceDetail: { service: any };
  ServiceBooking: { salonId: string; preSelectedServiceId?: string };
  StaffSelection: { salonId: string };
  SlotSelection: { salonId: string; staffId?: string | null };
  BookingSummary: { salonId: string; staffId?: string | null; date: string; time: string };
  Payment: { bookingData: any };
  BookingSuccess: { bookingId: string };
};

export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  SalonList: Record<string, never>;
  SalonDetail: { id: string };
  ServiceDetail: { service: any };
  ServiceSelection: { salonId: string; isEditing?: boolean; preSelectedServiceId?: string };
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
  Offers: undefined;
  SpecialForYou: undefined;
  Wishlist: undefined;
  MembershipPlans: undefined;
  MembershipCheckout: { planId: string };
};

export type BookingsStackParamList = {
  MyBookings: undefined;
  BookingList: undefined;
  BookingDetail: { id: string };
  Reschedule: { bookingId: string };
  WriteReview: { bookingId: string };
  EReceipt: { bookingId: string };
};

export type ShopStackParamList = {
  ShopHome: undefined;
  ProductList: { categoryId?: string; title: string };
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
  AddAddress: { addressId?: string };
  Settings: undefined;
  Notifications: undefined;
  Help: undefined;
  Chatbot: undefined;
  WalletHome: undefined;
  AddMoney: undefined;
  TransactionHistory: undefined;
  Referral: undefined;
  MyCoupon: undefined;
  MembershipPlans: undefined;
  MembershipCheckout: { planId: string };
};
