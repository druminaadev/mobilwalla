import {
  Salon, Service, Staff, Booking, WalletTransaction,
  Review, Notification, User, UserRole, UserStatus,
} from '../types/models';

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

export const DEMO_SERVICES: Record<string, Service[]> = {
  s1: [
    { id: 'sv1', category: 'hair', name: 'Haircut', description: 'Precision cut by senior stylist', price: 500, duration: 45, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv2', category: 'hair', name: 'Hair Coloring', description: 'Global or highlights with premium color', price: 2000, duration: 120, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv3', category: 'hair', name: 'Beard Trim', description: 'Shape & trim with hot towel finish', price: 200, duration: 20, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv4', category: 'hair', name: 'Hair Spa', description: 'Deep conditioning treatment', price: 900, duration: 60, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv5', category: 'skin', name: 'Facial', description: 'Deep cleansing brightening facial', price: 800, duration: 60, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv6', category: 'body', name: 'Full Body Massage', description: 'Swedish relaxation massage', price: 1500, duration: 90, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv7', category: 'body', name: 'Waxing (Full)', description: 'Full body Rica waxing', price: 1200, duration: 75, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv8', category: 'nails', name: 'Manicure', description: 'Classic manicure with polish', price: 400, duration: 45, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv9', category: 'nails', name: 'Pedicure', description: 'Relaxing pedicure with scrub', price: 500, duration: 45, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=200&q=80' },
  ],
  default: [
    { id: 'sv1', category: 'hair', name: 'Haircut', description: 'Precision cut', price: 500, duration: 45, image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv2', category: 'hair', name: 'Hair Coloring', description: 'Full color', price: 2000, duration: 120, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv3', category: 'hair', name: 'Beard Trim', description: 'Shape & trim', price: 200, duration: 20, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv4', category: 'skin', name: 'Facial', description: 'Deep cleansing', price: 800, duration: 60, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv5', category: 'body', name: 'Spa', description: 'Relaxation spa', price: 1500, duration: 90, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv6', category: 'body', name: 'Massage', description: 'Full body massage', price: 1200, duration: 60, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv7', category: 'nails', name: 'Manicure', description: 'Classic manicure', price: 400, duration: 45, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=200&q=80' },
    { id: 'sv8', category: 'nails', name: 'Pedicure', description: 'Relaxing pedicure', price: 500, duration: 45, image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=200&q=80' },
  ],
};

export const DEMO_STAFF: Record<string, Staff[]> = {
  s1: [
    { id: 'st1', name: 'Rahul Mehta', designation: 'Senior stylist', specializations: ['Hair Coloring & Cuts'], rating: 4.9, reviewCount: 520, experience: 8, isAvailable: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { id: 'st2', name: 'Anjali Patel', designation: 'Skin & beauty specialist', specializations: ['Facials & Skin Care'], rating: 4.8, reviewCount: 390, experience: 5, isAvailable: true, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { id: 'st3', name: 'Vikram Singh', designation: "Men's grooming expert", specializations: ['Haircut & Beard'], rating: 4.7, reviewCount: 280, experience: 4, isAvailable: false, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
    { id: 'st4', name: 'Neha Joshi', designation: 'Nail art & body care', specializations: ['Nails & Waxing'], rating: 4.6, reviewCount: 210, experience: 3, isAvailable: true, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
  ],
  default: [
    { id: 'st1', name: 'Rahul Mehta', designation: 'Senior stylist', specializations: ['Hair'], rating: 4.9, reviewCount: 520, experience: 8, isAvailable: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { id: 'st2', name: 'Anjali Patel', designation: 'Skin specialist', specializations: ['Facials'], rating: 4.8, reviewCount: 390, experience: 5, isAvailable: true, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { id: 'st3', name: 'Neha Joshi', designation: 'Nail expert', specializations: ['Nails'], rating: 4.7, reviewCount: 210, experience: 3, isAvailable: true, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
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
    id: 'b1', salonId: 's1', salonName: 'Hair Ahmedabad', salonImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
    services: [DEMO_SERVICES.s1[0]], staff: DEMO_STAFF.s1[0], date: '2024-02-15', time: '10:00',
    status: 'confirmed', totalAmount: 590, paymentStatus: 'SUCCESS', paymentMethod: 'upi', createdAt: '2024-01-01T00:00:00Z',
    serviceNames: ['Haircut'],
  },
  {
    id: 'b2', salonId: 's2', salonName: 'Glam Studio', salonImage: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80',
    services: [DEMO_SERVICES.default[5]], staff: DEMO_STAFF.default[1], date: '2024-02-18', time: '14:00',
    status: 'pending', totalAmount: 1416, paymentStatus: 'PENDING', paymentMethod: 'card', createdAt: '2024-01-02T00:00:00Z',
    serviceNames: ['Full Body Massage'],
  },
  {
    id: 'b3', salonId: 's1', salonName: 'Hair Ahmedabad', salonImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
    services: [DEMO_SERVICES.s1[4], DEMO_SERVICES.s1[7]], staff: DEMO_STAFF.s1[1], date: '2024-01-10', time: '11:00',
    status: 'completed', totalAmount: 1286, paymentStatus: 'SUCCESS', paymentMethod: 'card', createdAt: '2024-01-03T00:00:00Z',
    serviceNames: ['Facial', 'Manicure'], discountAmount: 120,
  },
  {
    id: 'b4', salonId: 's1', salonName: 'Hair Ahmedabad', salonImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
    services: [DEMO_SERVICES.s1[1]], staff: DEMO_STAFF.s1[0], date: '2024-01-05', time: '15:00',
    status: 'completed', totalAmount: 2360, paymentStatus: 'SUCCESS', paymentMethod: 'upi', createdAt: '2024-01-04T00:00:00Z',
    serviceNames: ['Hair Coloring'],
  },
  {
    id: 'b5', salonId: 's3', salonName: 'Serenity Spa & Salon', salonImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80',
    services: [DEMO_SERVICES.default[4]], staff: DEMO_STAFF.default[0], date: '2024-01-08', time: '16:00',
    status: 'cancelled', totalAmount: 1770, paymentStatus: 'REFUNDED', paymentMethod: 'netbanking', createdAt: '2024-01-05T00:00:00Z',
    serviceNames: ['Spa'],
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
