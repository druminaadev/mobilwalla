import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletStackParamList } from '@/types/navigation';

import WalletHomeScreen from '@/screens/wallet/WalletHomeScreen';
import AddMoneyScreen from '@/screens/wallet/AddMoneyScreen';
import TransactionHistoryScreen from '@/screens/wallet/TransactionHistoryScreen';
import ReferralScreen from '@/screens/wallet/ReferralScreen';

const Stack = createNativeStackNavigator<WalletStackParamList>();

export default function WalletStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WalletHome" component={WalletHomeScreen} />
      <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      <Stack.Screen name="Referral" component={ReferralScreen} />
    </Stack.Navigator>
  );
}
