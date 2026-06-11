import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowLeft, CreditCard, Wallet, Building2, QrCode,
  ShieldCheck, ChevronRight, Check,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, BounceIn } from 'react-native-reanimated';
import { HomeStackParamList } from '../../types/navigation';
import { DEMO_WALLET } from '../../data/demo';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { useBooking } from '../../hooks/useBooking';

type Props = NativeStackScreenProps<HomeStackParamList, 'Payment'>;

const METHODS = [
  {
    id: 'upi',
    label: 'UPI / GPay',
    sub: 'PhonePe · GPay · Paytm · BHIM',
    icon: QrCode,
    color: colors.success,
    bg: colors.successLight,
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    sub: 'Visa · Mastercard · RuPay',
    icon: CreditCard,
    color: colors.primary,
    bg: colors.primaryLight,
  },
  {
    id: 'wallet',
    label: 'Wallet',
    sub: `Balance: ₹${DEMO_WALLET.balance}`,
    icon: Wallet,
    color: colors.accent,
    bg: colors.accentLight,
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    sub: 'All major banks supported',
    icon: Building2,
    color: '#D9A355',
    bg: '#FDF3E0',
  },
];

export default function PaymentScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { bookingData } = route.params;
  const [selected, setSelected] = useState<string>('upi');
  const { submitBooking, isSubmitting } = useBooking();

  const walletInsufficient = selected === 'wallet' && DEMO_WALLET.balance < bookingData.total;

  const handlePay = async () => {
    if (walletInsufficient) {
      Alert.alert('Insufficient Balance', 'Your wallet balance is low. Please choose another payment method.');
      return;
    }
    
    // We mock the submit process
    const result = await submitBooking();
    if (result) {
      navigation.navigate('BookingSuccess', { bookingId: result.id });
    } else {
      Alert.alert('Payment Failed', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Amount card */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.amountCard}>
            <View style={styles.amountCardCircle1} />
            <View style={styles.amountCardCircle2} />
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>₹{bookingData.total}</Text>
            <Text style={styles.amountSub}>
              {(bookingData.services?.length ?? 0)} service{(bookingData.services?.length ?? 0) !== 1 ? 's' : ''}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Payment methods */}
        <Animated.View entering={FadeInDown.delay(150)}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
        </Animated.View>
        
        {METHODS.map((m, index) => {
          const Icon      = m.icon;
          const isActive  = selected === m.id;
          const isWalletLow = m.id === 'wallet' && DEMO_WALLET.balance < bookingData.total;

          return (
            <Animated.View key={m.id} entering={FadeInDown.delay(200 + index * 50)}>
              <TouchableOpacity
                style={[styles.methodCard, isActive && styles.methodCardActive]}
                onPress={() => setSelected(m.id)}
                activeOpacity={0.88}
              >
                <View style={[styles.methodIconWrap, { backgroundColor: isActive ? m.color : m.bg }]}>
                  <Icon size={20} color={isActive ? '#fff' : m.color} />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={[styles.methodLabel, isActive && { color: colors.primary }]}>{m.label}</Text>
                  <Text style={[styles.methodSub, isWalletLow && { color: colors.error }]}>{m.sub}</Text>
                  {isWalletLow && (
                    <Text style={styles.walletLowText}>⚠ Insufficient balance</Text>
                  )}
                </View>
                <View style={[styles.radio, isActive && styles.radioDone]}>
                  {isActive && <Check size={12} color="#fff" strokeWidth={3} />}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Secure note */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.secureRow}>
          <ShieldCheck size={16} color={colors.success} />
          <Text style={styles.secureText}>
            256-bit SSL encrypted · Powered by Razorpay
          </Text>
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Footer */}
      <Animated.View entering={BounceIn} style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          onPress={handlePay}
          disabled={isSubmitting || walletInsufficient}
          activeOpacity={0.9}
          style={{ opacity: walletInsufficient ? 0.5 : 1 }}
        >
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.payBtn}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.payBtnText}>Pay ₹{bookingData.total}</Text>
                <ChevronRight size={18} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray100,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center', ...typography.h4, color: colors.textPrimary },

  scroll: { paddingBottom: 20 },

  amountCard: {
    marginHorizontal: 16, marginTop: 20, borderRadius: 24,
    padding: 28, overflow: 'hidden', alignItems: 'center',
  },
  amountCardCircle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.1)', right: -40, top: -70,
  },
  amountCardCircle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)', left: 20, bottom: -40,
  },
  amountLabel: { ...typography.subtitle2, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
  amountValue: { fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  amountSub:   { ...typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  sectionTitle: {
    ...typography.h4, color: colors.textPrimary,
    marginHorizontal: 16, marginTop: 24, marginBottom: 12,
  },

  methodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 18, padding: 14, borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  methodCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  methodIconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  methodInfo: { flex: 1 },
  methodLabel: { ...typography.subtitle1, color: colors.textPrimary, marginBottom: 2 },
  methodSub:   { ...typography.caption, color: colors.textSecondary },
  walletLowText: { ...typography.caption, color: colors.error, marginTop: 2 },
  radio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center',
  },
  radioDone: { backgroundColor: colors.primary, borderColor: colors.primary },

  secureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 16,
    padding: 12, backgroundColor: colors.successLight, borderRadius: 12,
  },
  secureText: { flex: 1, ...typography.caption, color: colors.success },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10,
  },
  payBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    paddingVertical: 15, borderRadius: 16,
  },
  payBtnText: { ...typography.button, color: '#fff' },
});
