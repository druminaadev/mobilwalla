import * as Application from 'expo-application';
import { Platform } from 'react-native';
import { storage } from '../services/storage';

const DEVICE_ID_KEY = 'DEVICE_ID';

export const getDeviceId = async (): Promise<string> => {
  const existingId = await storage.getItemAsync(DEVICE_ID_KEY);
  if (existingId) return existingId;

  let deviceId: string;

  if (Platform.OS === 'android') {
    deviceId = Application.getAndroidId() ?? `android-${Date.now()}`;
  } else if (Platform.OS === 'ios') {
    deviceId = (await Application.getIosIdForVendorAsync()) ?? `ios-${Date.now()}`;
  } else {
    deviceId = `web-${Date.now()}`;
  }

  storage.setItem(DEVICE_ID_KEY, deviceId);
  return deviceId;
};
