import { create } from 'zustand';
import { User, UserRole, UserStatus } from '../types/models';
import { storage, secureStorage } from '../services/storage';
import { DEMO_USER } from '../data/demo';


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string, mode: 'login' | 'signup') => Promise<void>;
  signUp: (name: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Demo: simulates sending OTP to phone
  sendOTP: async (_phone: string) => {
    await new Promise<void>((r) => setTimeout(r, 800));
    // In production: call POST /auth/send-otp
  },

  verifyOTP: async (phone: string, otp: string, mode: 'login' | 'signup') => {
    await new Promise<void>((r) => setTimeout(r, 800));
    // Demo: OTP is always 1234
    if (otp !== '1234') throw new Error('Invalid OTP. Use 1234 for demo.');

    if (mode === 'login') {
      const user: User = { ...DEMO_USER, phone };
      storage.setObject('USER_DATA', user);
      await secureStorage.setAccessToken('demo_access_token');
      await secureStorage.setRefreshToken('demo_refresh_token');
      set({ user, isAuthenticated: true, isLoading: false });
    }
    // signup mode — OTPScreen navigates to AuthSuccess, auth happens after success
  },

  signUp: async (name: string, phone: string) => {
    await new Promise<void>((r) => setTimeout(r, 800));
    // Stores pending user; actual auth completes after OTP verify
    const user: User = {
      ...DEMO_USER,
      name,
      phone,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
    };
    storage.setObject('USER_DATA', user);
    set({ user, isAuthenticated: false, isLoading: false });
  },

  logout: async () => {
    storage.removeItem('USER_DATA');
    await secureStorage.clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = await secureStorage.getAccessToken();
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return false;
      }
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
