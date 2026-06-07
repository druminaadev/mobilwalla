import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from './src/store/authStore';
import { getDeviceId } from './src/utils/device';
import RootNavigator from './src/navigation';

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const setDeviceId = useAuthStore((state) => state.setDeviceId);

  useEffect(() => {
    const init = async () => {
      const deviceId = await getDeviceId();
      setDeviceId(deviceId);
      console.log('Device ID:', deviceId);
      await checkAuth();
    };
    init();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
