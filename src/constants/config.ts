declare const process: {
  env: {
    API_URL?: string;
    EXPO_PUBLIC_API_URL?: string;
  };
};

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  DEVICE_ID: 'device_id',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const DEBOUNCE_DELAY = 500;

export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_SECONDS: 600,
  RESEND_DELAY_SECONDS: 60,
} as const;

export const BOOKING_CONFIG = {
  SLOT_LOCK_DURATION: 300,
  MIN_BOOKING_HOURS_AHEAD: 2,
  MAX_BOOKING_DAYS_AHEAD: 30,
} as const;

export const IMAGE_CONFIG = {
  MAX_SIZE_MB: 5,
  QUALITY: 0.8,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;
