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
  date: string | null;
  timeSlot: TimeSlot | null;
  coupon: Coupon | null;
  specialInstructions: string;

  // Actions
  setSalon: (id: string, name: string, image: string) => void;
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  setStaff: (staff: Staff | null) => void;
  setDateTime: (date: string, timeSlot: TimeSlot) => void;
  applyCoupon: (coupon: Coupon | null) => void;
  setSpecialInstructions: (instructions: string) => void;
  resetBooking: () => void;

  // Derivations / Getters
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getTotalDuration: () => number;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      salonId: null,
      salonName: null,
      salonImage: null,
      services: [],
      staff: null,
      date: null,
      timeSlot: null,
      coupon: null,
      specialInstructions: '',

      setSalon: (id, name, image) => set({ salonId: id, salonName: name, salonImage: image }),
      
      addService: (service) =>
        set((state) => {
          // Avoid duplicates
          if (state.services.find(s => s.id === service.id)) return state;
          return { services: [...state.services, service] };
        }),

      removeService: (serviceId) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== serviceId),
        })),

      setStaff: (staff) => set({ staff }),

      setDateTime: (date, timeSlot) => set({ date, timeSlot }),

      applyCoupon: (coupon) => set({ coupon }),

      setSpecialInstructions: (specialInstructions) => set({ specialInstructions }),

      resetBooking: () =>
        set({
          salonId: null,
          salonName: null,
          salonImage: null,
          services: [],
          staff: null,
          date: null,
          timeSlot: null,
          coupon: null,
          specialInstructions: '',
        }),

      getSubtotal: () => {
        const { services } = get();
        return services.reduce((sum, service) => sum + service.price, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        
        if (!coupon) return 0;
        
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          return 0; // Does not meet minimum order value
        }

        let discount = 0;
        if (coupon.discountType === 'flat') {
          discount = coupon.discountValue;
        } else if (coupon.discountType === 'percent') {
          discount = (subtotal * coupon.discountValue) / 100;
        }

        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }

        return Math.min(discount, subtotal); // Discount cannot exceed subtotal
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        // Add additional charges like taxes or premium staff charge if needed here
        let premiumCharge = 0;
        const staff = get().staff;
        if (staff?.premiumCharge) {
           premiumCharge = staff.premiumCharge;
        }
        return Math.max(0, subtotal - discount + premiumCharge);
      },

      getTotalDuration: () => {
        const { services } = get();
        return services.reduce((sum, service) => sum + service.duration, 0);
      },
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Optional: partialize state to only save what's necessary if we don't want to save everything
    }
  )
);
