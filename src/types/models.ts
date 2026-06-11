export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SALON_OWNER = 'SALON_OWNER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash';

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  bio?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export interface AppNotification {
  id: string;
  type: 'booking' | 'promo' | 'system';
  title: string;
  subtitle: string;
  timestamp: Date;
  isRead: boolean;
  deepLink?: string;
}

export interface Salon {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  rating: number;
  totalReviews: number;
  logoUrl?: string;
  coverImageUrl?: string;
  distance?: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  discountedPrice?: number;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
  tags?: string[];
}

export interface Staff {
  id: string;
  name: string;
  designation: string;
  photo: string;
  rating: number;
  reviewCount: number;
  experience: number;
  specializations: string[];
  isAvailable: boolean;
  nextAvailable?: string;
  premiumCharge?: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  isPast: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'flat' | 'percent';
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
}

export interface Booking {
  id: string;
  salonId: string;
  salonName: string;
  salonImage: string;
  services: Service[];
  staff: Staff | null;
  date: string;
  time: string;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  createdAt: string;
  specialInstructions?: string;
  couponCode?: string;
  discountAmount?: number;
  cancellationReason?: string;
}

export interface Wallet {
  balance: number;
  loyaltyPoints: number;
}

export interface WalletTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT' | 'REFUND';
  amount: number;
  description: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  salonId: string;
  rating: number;
  comment?: string;
  photos: string[];
  createdAt: string;
  user?: Pick<User, 'name' | 'avatarUrl'>;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface WishlistSalon {
  id: string;
  name: string;
  image: string;
  rating: number;
  address: string;
  reviewCount: number;
}

export interface WishlistService {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  image: string;
}
