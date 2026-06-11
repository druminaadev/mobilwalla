import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Secure token storage (using AsyncStorage for now) ──────────────────────────

export const secureStorage = {
  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem('ACCESS_TOKEN', token);
  },
  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem('ACCESS_TOKEN');
  },
  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem('REFRESH_TOKEN', token);
  },
  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem('REFRESH_TOKEN');
  },
  async clearTokens(): Promise<void> {
    await AsyncStorage.removeItem('ACCESS_TOKEN');
    await AsyncStorage.removeItem('REFRESH_TOKEN');
  },
};

// ── Non-sensitive storage (AsyncStorage) ────────────────────────────────────

class StorageService {
  setItem(key: string, value: string): void {
    AsyncStorage.setItem(key, value);
  }

  async getItemAsync(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  setObject(key: string, value: unknown): void {
    AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async getObject<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  removeItem(key: string): void {
    AsyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }
}

export const storage = new StorageService();
