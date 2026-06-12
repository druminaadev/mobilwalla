import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WishlistSalon, WishlistService, WishlistProduct } from '../types/models';

interface WishlistState {
  salons: WishlistSalon[];
  services: WishlistService[];
  products: WishlistProduct[];

  // Actions
  toggleSalon: (salon: WishlistSalon) => void;
  toggleService: (service: WishlistService) => void;
  toggleProduct: (product: WishlistProduct) => void;
  isSalonLiked: (salonId: string) => boolean;
  isServiceLiked: (serviceId: string) => boolean;
  isProductLiked: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      salons: [],
      services: [],
      products: [],

      toggleSalon: (salon) =>
        set((state) => {
          const exists = state.salons.some((s) => s.id === salon.id);
          if (exists) {
            return { salons: state.salons.filter((s) => s.id !== salon.id) };
          }
          return { salons: [...state.salons, salon] };
        }),

      toggleService: (service) =>
        set((state) => {
          const exists = state.services.some((s) => s.id === service.id);
          if (exists) {
            return { services: state.services.filter((s) => s.id !== service.id) };
          }
          return { services: [...state.services, service] };
        }),

      toggleProduct: (product) =>
        set((state) => {
          const exists = state.products.some((p) => p.id === product.id);
          if (exists) {
            return { products: state.products.filter((p) => p.id !== product.id) };
          }
          return { products: [...state.products, product] };
        }),

      isSalonLiked: (salonId) => {
        return get().salons.some((s) => s.id === salonId);
      },

      isServiceLiked: (serviceId) => {
        return get().services.some((s) => s.id === serviceId);
      },

      isProductLiked: (productId) => {
        return get().products.some((p) => p.id === productId);
      },

      clearWishlist: () => set({ salons: [], services: [], products: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
