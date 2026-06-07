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

export enum BookingStatus {
  DRAFT = 'DRAFT',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Address {
  id: string;
  label?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
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

export interface SalonService {
  id: string;
  salonId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface Staff {
  id: string;
  salonId: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  specialization?: string;
  rating: number;
  totalBookings: number;
  isAvailable: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  salonId: string;
  staffId?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  salon?: Salon;
  staff?: Staff;
  services?: BookingService[];
}

export interface BookingService {
  id: string;
  serviceId: string;
  service?: SalonService;
  price: number;
  duration: number;
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
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}
