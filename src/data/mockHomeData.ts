import { Scissors, Droplet, Sparkles, Star, Heart, Crown, Activity } from 'lucide-react-native';

export const SALONS = [
  {
    id: 's1', name: 'Luxe Beauty Lounge', address: 'Bandra West, Mumbai', rating: 4.8, reviewCount: 342,
    distance: '1.2 km', priceRange: '₹₹₹', categories: ['Hair', 'Makeup'], isOpen: true, closingTime: '21:00',
    image: require('../../assets/images/salon.webp'), isFeatured: true, discount: '10% OFF', tags: ['Top Rated']
  },
  {
    id: 's2', name: 'Glamour Studio', address: 'Andheri East, Mumbai', rating: 4.5, reviewCount: 128,
    distance: '2.5 km', priceRange: '₹₹', categories: ['Nails', 'Spa'], isOpen: true, closingTime: '20:00',
    image: require('../../assets/images/salon-interior.webp'), isFeatured: false, tags: ['New']
  },
  {
    id: 's3', name: 'Elegance Salon', address: 'Juhu, Mumbai', rating: 4.9, reviewCount: 512,
    distance: '3.1 km', priceRange: '₹₹₹₹', categories: ['Bridal', 'Hair'], isOpen: false, closingTime: '22:00',
    image: require('../../assets/images/nail-art2.webp'), isFeatured: true, tags: ['Trending']
  },
];

export const SERVICES = [
  { id: 'srv1', name: 'Hair Cut', icon: Scissors, bg: '#FFE4E6', color: '#FF5C8A' },
  { id: 'srv2', name: 'Hair Color', icon: Droplet, bg: '#FEF3C7', color: '#F59E0B' },
  { id: 'srv3', name: 'Facial', icon: Sparkles, bg: '#EDE9FE', color: '#8B5CF6' },
  { id: 'srv4', name: 'Nail Art', icon: Star, bg: '#FCE7F3', color: '#FF5C8A' },
  { id: 'srv5', name: 'Spa', icon: Heart, bg: '#D1FAE5', color: '#10B981' },
  { id: 'srv6', name: 'Bridal', icon: Crown, bg: '#FEF9C3', color: '#C9A84C' },
  { id: 'srv7', name: 'Massage', icon: Activity, bg: '#DBEAFE', color: '#3B82F6' },
  { id: 'srv8', name: 'Makeup', icon: Sparkles, bg: '#FFE4E6', color: '#E11D48' },
];

export const OFFERS = [
  { id: 'o1', title: 'Summer Glow Up', discount: '40% OFF', code: 'SUMMER40', validUntil: 1, color: '#FF5C8A', image: require('../../assets/images/hair-color.webp'), category: 'Hair' },
  { id: 'o2', title: 'Bridal Package', discount: '20% OFF', code: 'BRIDE20', validUntil: 5, color: '#C9A84C', image: require('../../assets/images/bridal.webp'), category: 'Bridal' },
  { id: 'o3', title: 'Weekend Spa', discount: 'Flat ₹500', code: 'RELAX', validUntil: 2, color: '#10B981', image: require('../../assets/images/woman-washing-head.webp'), category: 'Spa' },
  { id: 'o4', title: 'Nail Art Combo', discount: 'Buy 1 Get 1', code: 'NAILS', validUntil: 10, color: '#8B5CF6', image: require('../../assets/images/nail-art.webp'), category: 'Nails' },
];

export const STYLISTS = [
  { id: 'st1', name: 'Sarah Khan', specialty: 'Senior Hair Stylist', rating: 4.9, experience: '8 yrs', isAvailable: true },
  { id: 'st2', name: 'Priya Sharma', specialty: 'Makeup Artist', rating: 4.8, experience: '5 yrs', isAvailable: false },
  { id: 'st3', name: 'Rahul Dev', specialty: 'Color Specialist', rating: 4.7, experience: '6 yrs', isAvailable: true },
  { id: 'st4', name: 'Anita Roy', specialty: 'Nail Technician', rating: 4.9, experience: '4 yrs', isAvailable: true },
];

export const BANNERS = [
  { id: 'b1', title: 'Luxury Hair\nTreatments', sub: 'Experience premium care', tag: 'TRENDING', discount: '30% OFF', image: require('../../assets/images/female-hair.webp') },
  { id: 'b2', title: 'Ultimate Spa\nRelaxation', sub: 'Rejuvenate your senses', tag: 'NEW', discount: '₹500 OFF', image: require('../../assets/images/woman-washing-head.webp') },
  { id: 'b3', title: 'Bridal Makeup\nMasterclass', sub: 'Book your trial today', tag: 'EXCLUSIVE', discount: '20% OFF', image: require('../../assets/images/bridal.webp') },
];

export const TRENDING_SERVICES = [
  { id: 't1', name: 'Balayage Hair Color', price: '₹3,999', image: require('../../assets/images/hair-color.webp') },
  { id: 't2', name: 'Keratin Treatment', price: '₹4,499', image: require('../../assets/images/femail-haircut.webp') },
  { id: 't3', name: 'Gel Nail Extensions', price: '₹1,499', image: require('../../assets/images/nail-art.webp') },
  { id: 't4', name: 'Deep Cleansing Facial', price: '₹1,999', image: require('../../assets/images/woman-washing-head.webp') },
];
