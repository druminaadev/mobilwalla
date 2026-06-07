import { create } from 'zustand';
import { User } from '@/types/models';
import { storage } from '@/services/storage';
import { DEMO_USER } from '@/data/demo';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  deviceId: string | null;
  setUser: (user: User | null) => void;
  setDeviceId: (id: string) => void;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  deviceId: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setDeviceId: (id) => {
    set({ deviceId: id });
    storage.setItem('DEVICE_ID', id);
  },

  // Demo login: any phone + OTP "123456" works
  login: async (phone, otp) => {
    await new Promise((r) => setTimeout(() => r(null), 800));
    if (otp !== '123456') throw new Error('Invalid OTP. Use 123456 for demo.');
    const user = { ...DEMO_USER, phone };
    storage.setObject('USER_DATA', user);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    storage.removeItem('USER_DATA');
    storage.removeItem('access_token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const userData = await storage.getObject<User>('USER_DATA');
      if (userData) {
        set({ user: userData, isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ isAuthenticated: false, isLoading: false });
      return false;
    } catch {
      set({ isAuthenticated: false, isLoading: false });
      return false;
    }
  },
}));
