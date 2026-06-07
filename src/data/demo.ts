import {
  Salon, SalonService, Staff, Booking, WalletTransaction,
  Review, Notification, User, BookingStatus, PaymentStatus,
  UserRole, UserStatus,
} from '@/types/models';

export const DEMO_USER: User = {
  id: 'u1',
  phone: '9876543210',
  name: 'Priya Sharma',
  email: 'priya@example.com',
  gender: 'FEMALE',
  role: UserRole.CUSTOMER,
  status: UserStatus.ACTIVE,
  createdAt: '2024-01-01T00:00:00Z',
};

export const DEMO_SALONS: Salon[] = [
  {
    id: 's1',
    name: 'Hair Ahmedabad',
    slug: 'hair-ahmedabad',
    description: 'Premium unisex salon offering top-notch haircuts, spa, and beauty treatments. Experienced staff with modern equipment.',
    phone: '+91 98765 43210',
    addressLine1: '12, CG Road, Navrangpura',
    city: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 23.0300,
    longitude: 72.5700,
    rating: 4.8,
    totalReviews: 256,
    distance: 1.2,
  },
  {
    id: 's2',
    name: 'Glam Studio',
    slug: 'glam-studio',
    description: 'Luxury beauty studio specializing in bridal makeup, skin treatments and hair styling.',
    phone: '+91 91234 56789',
    addressLine1: '45, SG Highway, Bodakdev',
    city: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 23.0450,
    longitude: 72.5070,
    rating: 4.6,
    totalReviews: 189,
    distance: 2.8,
  },
  {
    id: 's3',
    name: 'Serenity Spa & Salon',
    slug: 'serenity-spa',
    description: 'Full-service spa and salon with relaxing ambiance, massages, facials, and premium hair services.',
    phone: '+91 99999 11111',
    addressLine1: '78, Prahlad Nagar, Satellite',
    city: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 23.0230,
    longitude: 72.5060,
    rating: 4.5,
    totalReviews: 142,
    distance: 3.5,
  },
  {
    id: 's4',
    name: 'The Barber Room',
    slug: 'the-barber-room',
    description: "Exclusive men's grooming studio. Classic shaves, beard trims, and modern haircuts.",
    phone: '+91 98989 98989',
    addressLine1: '5, Paldi, Ellis Bridge',
    city: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 23.0180,
    longitude: 72.5750,
    rating: 4.7,
    totalReviews: 310,
    distance: 4.1,
  },
  {
    id: 's5',
    name: 'Nail Artistry',
    slug: 'nail-artistry',
    description: 'Specialized nail studio offering gel extensions, nail art, manicures and pedicures.',
    phone: '+91 77777 22222',
    addressLine1: '22, Vastrapur Lake Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 23.0530,
    longitude: 72.5270,
    rating: 4.9,
    totalReviews: 98,
    distance: 5.0,
  },
];

export const DEMO_SERVICES: Record<string, SalonService[]> = {
  s1: [
    { id: 'sv1', salonId: 's1', categoryId: 'hair', name: 'Haircut', description: 'Precision cut by senior stylist', price: 500, duration: 45, isActive: true },
    { id: 'sv2', salonId: 's1', categoryId: 'hair', name: 'Hair Coloring', description: 'Global or highlights with premium color', price: 2000, duration: 120, isActive: true },
    { id: 'sv3', salonId: 's1', categoryId: 'hair', name: 'Beard Trim', description: 'Shape & trim with hot towel finish', price: 200, duration: 20, isActive: true },
    { id: 'sv4', salonId: 's1', categoryId: 'hair', name: 'Hair Spa', description: 'Deep conditioning treatment', price: 900, duration: 60, isActive: true },
    { id: 'sv5', salonId: 's1', categoryId: 'skin', name: 'Facial', description: 'Deep cleansing brightening facial', price: 800, duration: 60, isActive: true },
    { id: 'sv6', salonId: 's1', categoryId: 'body', name: 'Full Body Massage', description: 'Swedish relaxation massage', price: 1500, duration: 90, isActive: true },
    { id: 'sv7', salonId: 's1', categoryId: 'body', name: 'Waxing (Full)', description: 'Full body Rica waxing', price: 1200, duration: 75, isActive: true },
    { id: 'sv8', salonId: 's1', categoryId: 'nails', name: 'Manicure', description: 'Classic manicure with polish', price: 400, duration: 45, isActive: true },
    { id: 'sv9', salonId: 's1', categoryId: 'nails', name: 'Pedicure', description: 'Relaxing pedicure with scrub', price: 500, duration: 45, isActive: true },
  ],
  default: [
    { id: 'sv1', salonId: '', categoryId: 'hair', name: 'Haircut', description: 'Precision cut', price: 500, duration: 45, isActive: true },
    { id: 'sv2', salonId: '', categoryId: 'hair', name: 'Hair Coloring', description: 'Full color', price: 2000, duration: 120, isActive: true },
    { id: 'sv3', salonId: '', categoryId: 'hair', name: 'Beard Trim', description: 'Shape & trim', price: 200, duration: 20, isActive: true },
    { id: 'sv4', salonId: '', categoryId: 'skin', name: 'Facial', description: 'Deep cleansing', price: 800, duration: 60, isActive: true },
    { id: 'sv5', salonId: '', categoryId: 'body', name: 'Spa', description: 'Relaxation spa', price: 1500, duration: 90, isActive: true },
    { id: 'sv6', salonId: '', categoryId: 'body', name: 'Massage', description: 'Full body massage', price: 1200, duration: 60, isActive: true },
    { id: 'sv7', salonId: '', categoryId: 'nails', name: 'Manicure', description: 'Classic manicure', price: 400, duration: 45, isActive: true },
    { id: 'sv8', salonId: '', categoryId: 'nails', name: 'Pedicure', description: 'Relaxing pedicure', price: 500, duration: 45, isActive: true },
  ],
};

export const DEMO_STAFF: Record<string, Staff[]> = {
  s1: [
    { id: 'st1', salonId: 's1', name: 'Rahul Mehta',  bio: 'Senior stylist with 8 years of experience', specialization: 'Hair Coloring & Cuts', rating: 4.9, totalBookings: 520, isAvailable: true,  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { id: 'st2', salonId: 's1', name: 'Anjali Patel', bio: 'Skin & beauty specialist',                  specialization: 'Facials & Skin Care',  rating: 4.8, totalBookings: 390, isAvailable: true,  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { id: 'st3', salonId: 's1', name: 'Vikram Singh', bio: "Men's grooming expert",                    specialization: 'Haircut & Beard',      rating: 4.7, totalBookings: 280, isAvailable: false, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
    { id: 'st4', salonId: 's1', name: 'Neha Joshi',   bio: 'Nail art & body care',                      specialization: 'Nails & Waxing',       rating: 4.6, totalBookings: 210, isAvailable: true,  avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
  ],
  default: [
    { id: 'st1', salonId: '', name: 'Rahul Mehta',  bio: 'Senior stylist', specialization: 'Hair',    rating: 4.9, totalBookings: 520, isAvailable: true,  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { id: 'st2', salonId: '', name: 'Anjali Patel', bio: 'Skin specialist', specialization: 'Facials', rating: 4.8, totalBookings: 390, isAvailable: true,  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { id: 'st3', salonId: '', name: 'Neha Joshi',   bio: 'Nail expert',     specialization: 'Nails',   rating: 4.7, totalBookings: 210, isAvailable: true,  avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
  ],
};

export const DEMO_REVIEWS: Review[] = [
  {
    id: 'r1', bookingId: 'b3', userId: 'u2', salonId: 's1', rating: 5,
    comment: 'Amazing experience! Rahul did an incredible job with my hair. The salon is super clean and staff is very professional.',
    photos: [], createdAt: '2024-01-10T10:00:00Z',
    user: { name: 'Shreya Desai', avatarUrl: undefined },
  },
  {
    id: 'r2', bookingId: 'b4', userId: 'u3', salonId: 's1', rating: 4,
    comment: 'Great facial treatment. My skin feels so fresh. Will definitely come back.',
    photos: [], createdAt: '2024-01-08T14:00:00Z',
    user: { name: 'Meera Shah', avatarUrl: undefined },
  },
  {
    id: 'r3', bookingId: 'b5', userId: 'u4', salonId: 's1', rating: 5,
    comment: 'Best beard trim in Ahmedabad. Very skilled staff and cozy ambiance.',
    photos: [], createdAt: '2024-01-05T11:00:00Z',
    user: { name: 'Arjun Patel', avatarUrl: undefined },
  },
];

export const DEMO_BOOKINGS: (Booking & { salonName: string; serviceNames: string[] })[] = [
  {
    id: 'b1', userId: 'u1', salonId: 's1', staffId: 'st1',
    bookingDate: '2024-02-15', startTime: '10:00', endTime: '10:45',
    status: BookingStatus.CONFIRMED, totalAmount: 500, discountAmount: 0, finalAmount: 590,
    paymentStatus: PaymentStatus.SUCCESS,
    salonName: 'Hair Ahmedabad', serviceNames: ['Haircut'],
    salon: DEMO_SALONS[0],
  },
  {
    id: 'b2', userId: 'u1', salonId: 's2', staffId: 'st2',
    bookingDate: '2024-02-18', startTime: '14:00', endTime: '15:30',
    status: BookingStatus.PENDING_PAYMENT, totalAmount: 1200, discountAmount: 0, finalAmount: 1416,
    paymentStatus: PaymentStatus.PENDING,
    salonName: 'Glam Studio', serviceNames: ['Full Body Massage'],
    salon: DEMO_SALONS[1],
  },
  {
    id: 'b3', userId: 'u1', salonId: 's1', staffId: 'st2',
    bookingDate: '2024-01-10', startTime: '11:00', endTime: '12:00',
    status: BookingStatus.COMPLETED, totalAmount: 1200, discountAmount: 120, finalAmount: 1286,
    paymentStatus: PaymentStatus.SUCCESS,
    salonName: 'Hair Ahmedabad', serviceNames: ['Facial', 'Manicure'],
    salon: DEMO_SALONS[0],
  },
  {
    id: 'b4', userId: 'u1', salonId: 's1',
    bookingDate: '2024-01-05', startTime: '15:00', endTime: '17:00',
    status: BookingStatus.COMPLETED, totalAmount: 2000, discountAmount: 0, finalAmount: 2360,
    paymentStatus: PaymentStatus.SUCCESS,
    salonName: 'Hair Ahmedabad', serviceNames: ['Hair Coloring'],
    salon: DEMO_SALONS[0],
  },
  {
    id: 'b5', userId: 'u1', salonId: 's3',
    bookingDate: '2024-01-08', startTime: '16:00', endTime: '17:30',
    status: BookingStatus.CANCELLED, totalAmount: 1500, discountAmount: 0, finalAmount: 1770,
    paymentStatus: PaymentStatus.REFUNDED,
    salonName: 'Serenity Spa & Salon', serviceNames: ['Spa'],
    salon: DEMO_SALONS[2],
  },
];

export const DEMO_TRANSACTIONS: WalletTransaction[] = [
  { id: 't1', type: 'CREDIT', amount: 500, description: 'Added via UPI', createdAt: '2024-01-12T09:00:00Z' },
  { id: 't2', type: 'DEBIT', amount: 1286, description: 'Booking #B003 - Hair Ahmedabad', createdAt: '2024-01-10T11:00:00Z' },
  { id: 't3', type: 'CREDIT', amount: 1770, description: 'Refund for Booking #B005', createdAt: '2024-01-09T10:00:00Z' },
  { id: 't4', type: 'CREDIT', amount: 100, description: 'Referral bonus - Ankit referred', createdAt: '2024-01-07T15:00:00Z' },
  { id: 't5', type: 'DEBIT', amount: 2360, description: 'Booking #B004 - Hair Ahmedabad', createdAt: '2024-01-05T15:00:00Z' },
  { id: 't6', type: 'CREDIT', amount: 1000, description: 'Added via Net Banking', createdAt: '2024-01-01T12:00:00Z' },
];

export const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 'n1',  type: 'booking',  title: 'Booking Confirmed ✅',       body: 'Your Haircut appointment at Hair Ahmedabad on Feb 15 at 10:00 AM is confirmed. See you soon!',              isRead: false, createdAt: '2024-01-13T09:00:00Z', data: { bookingId: 'b1' } },
  { id: 'n2',  type: 'offer',    title: '20% Off This Weekend! 🎉',   body: 'Use code WEEKEND20 for 20% off on all services this Saturday & Sunday. Limited slots available.',         isRead: false, createdAt: '2024-01-12T10:00:00Z' },
  { id: 'n3',  type: 'reminder', title: 'Appointment Tomorrow ⏰',    body: 'Reminder: You have a Full Body Massage at Glam Studio tomorrow at 2:00 PM. Get ready!',                   isRead: false, createdAt: '2024-01-11T08:00:00Z', data: { bookingId: 'b2' } },
  { id: 'n4',  type: 'wallet',   title: 'Refund Credited 💰',         body: '₹1,770 has been refunded to your wallet for cancelled booking at Serenity Spa. Available instantly.',      isRead: false, createdAt: '2024-01-09T10:00:00Z' },
  { id: 'n5',  type: 'loyalty',  title: '50 Points Earned! ⭐',       body: 'You earned 50 loyalty points for your visit to Hair Ahmedabad. Total balance: 250 points (≈ ₹25).',         isRead: true,  createdAt: '2024-01-08T16:00:00Z' },
  { id: 'n6',  type: 'offer',    title: 'New Salon Near You 📍',      body: 'Nail Artistry just opened 5 km away! Get 15% off on your first visit. Book now before slots fill up.',    isRead: true,  createdAt: '2024-01-07T11:00:00Z', data: { salonId: 's5' } },
  { id: 'n7',  type: 'booking',  title: 'Review Your Visit ✍️',      body: 'How was your Facial & Manicure at Hair Ahmedabad? Share your experience and earn 20 bonus points.',         isRead: true,  createdAt: '2024-01-06T14:00:00Z', data: { bookingId: 'b3' } },
  { id: 'n8',  type: 'wallet',   title: 'Money Added 🎉',             body: '₹500 has been successfully added to your wallet via UPI. Current balance: ₹984.',                         isRead: true,  createdAt: '2024-01-05T09:00:00Z' },
  { id: 'n9',  type: 'offer',    title: 'Flash Sale: Spa at ₹999 🔥', body: 'Serenity Spa is offering Full Body Spa for just ₹999 today only (regular ₹1,500). Book in next 2 hours!', isRead: true,  createdAt: '2024-01-04T12:00:00Z', data: { salonId: 's3' } },
  { id: 'n10', type: 'loyalty',  title: 'Referral Bonus Credited 🎁', body: 'Ankit used your referral code! ₹100 has been credited to your wallet. Keep sharing and keep earning.',      isRead: true,  createdAt: '2024-01-03T15:00:00Z' },
];

export const DEMO_WALLET = { balance: 984, loyaltyPoints: 250 };

export const SALON_AMENITIES: Record<string, string[]> = {
  s1: ['Wi-Fi', 'AC', 'Parking', 'Card Payment', 'UPI'],
  s2: ['Wi-Fi', 'AC', 'Bridal Package', 'Card Payment'],
  s3: ['Wi-Fi', 'AC', 'Parking', 'Steam Room', 'Card Payment'],
  s4: ['AC', 'Parking', 'Card Payment', 'UPI'],
  s5: ['Wi-Fi', 'AC', 'Card Payment', 'UPI'],
  default: ['Wi-Fi', 'AC', 'Card Payment'],
};

export const SALON_HOURS = '9:00 AM – 9:00 PM';
