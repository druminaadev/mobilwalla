import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Service, Staff, Coupon, TimeSlot } from '../types/models';

interface BookingState {
  salonId: string | null;
  salonName: string | null;
  salonImage: string | null;
  services: Service[];
  staff: Staff | null;
  staffPriceModifier: number;
  date: string | null;
  timeSlot: TimeSlot | null;
  coupon: Coupon | null;
  specialInstructions: string;
  isWaitlist: boolean;

  // Actions
  setSalon: (id: string, name: string, image: string) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearServices: () => void;
  
  setStaff: (staff: Staff | null) => void; // null means 'Any Staff'
  setStaffPriceModifier: (modifier: number) => void;
  
  setDateTime: (date: string, timeSlot: TimeSlot) => void;
  setWaitlist: (isWaitlist: boolean) => void;
  
  applyCoupon: (coupon: Coupon | null) => void;
  setSpecialInstructions: (instructions: string) => void;
  
  resetBooking: () => void;

  // Derivations / Getters
  getSubtotal: () => number;
  getStaffPremium: () => number;
  getDiscount: () => number;
  getTaxes: () => number;
  getTotal: () => number;
  getTotalDuration: () => number;
  getLoyaltyPointsEarned: () => number;
}

const TAX_RATE = 0.18; // 18% GST

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      salonId: null,
      salonName: null,
      salonImage: null,
      services: [],
      staff: null,
      staffPriceModifier: 1.0,
      date: null,
      timeSlot: null,
      coupon: null,
      specialInstructions: '',
      isWaitlist: false,

      setSalon: (id, name, image) => set({ salonId: id, salonName: name, salonImage: image }),
      
      addService: (service) =>
        set((state) => {
          if (state.services.find(s => s.id === service.id)) return state;
          return { services: [...state.services, service] };
        }),

      removeService: (serviceId) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== serviceId),
        })),

      clearServices: () => set({ services: [] }),

      setStaff: (staff) => set({ staff }),
      setStaffPriceModifier: (modifier) => set({ staffPriceModifier: modifier }),

      setDateTime: (date, timeSlot) => set({ date, timeSlot }),
      setWaitlist: (isWaitlist) => set({ isWaitlist }),

      applyCoupon: (coupon) => set({ coupon }),

      setSpecialInstructions: (specialInstructions) => set({ specialInstructions }),

      resetBooking: () =>
        set({
          salonId: null,
          salonName: null,
          salonImage: null,
          services: [],
          staff: null,
          staffPriceModifier: 1.0,
          date: null,
          timeSlot: null,
          coupon: null,
          specialInstructions: '',
          isWaitlist: false,
        }),

      getSubtotal: () => {
        const { services } = get();
        return services.reduce((sum, service) => sum + service.price, 0);
      },

      getStaffPremium: () => {
        const subtotal = get().getSubtotal();
        const modifier = get().staffPriceModifier;
        return subtotal * (modifier - 1.0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        
        if (!coupon) return 0;
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) return 0;

        let discount = 0;
        if (coupon.discountType === 'flat') {
          discount = coupon.discountValue;
        } else if (coupon.discountType === 'percent') {
          discount = (subtotal * coupon.discountValue) / 100;
        }

        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }

        return Math.min(discount, subtotal);
      },

      getTaxes: () => {
        const subtotal = get().getSubtotal();
        const premium = get().getStaffPremium();
        const discount = get().getDiscount();
        const beforeTax = subtotal + premium - discount;
        return Math.max(0, beforeTax * TAX_RATE);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const premium = get().getStaffPremium();
        const discount = get().getDiscount();
        const taxes = get().getTaxes();
        
        return Math.max(0, subtotal + premium - discount + taxes);
      },

      getTotalDuration: () => {
        const { services } = get();
        return services.reduce((sum, service) => sum + service.duration, 0);
      },

      getLoyaltyPointsEarned: () => {
        // Example logic: 10% of total amount is returned as points
        const total = get().getTotal();
        return Math.floor(total * 0.1);
      }
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
