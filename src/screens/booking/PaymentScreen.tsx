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
import { HomeStackParamList } from '@/types/navigation';
import { DEMO_WALLET } from '@/data/demo';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Payment'>;

const PINK = '#FF5C8A';

const METHODS = [
  {
    id: 'upi',
    label: 'UPI / GPay',
    sub: 'PhonePe · GPay · Paytm · BHIM',
    icon: QrCode,
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    sub: 'Visa · Mastercard · RuPay',
    icon: CreditCard,
    color: '#3B82F6',
    bg: '#DBEAFE',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    sub: `Balance: ₹${DEMO_WALLET.balance}`,
    icon: Wallet,
    color: PINK,
    bg: '#FFF0F5',
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    sub: 'All major banks supported',
    icon: Building2,
    color: '#8B5CF6',
    bg: '#EDE9FE',
  },
];

export default function PaymentScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { bookingData } = route.params;
  const [selected,    setSelected]    = useState<string>('upi');
  const [processing,  setProcessing]  = useState(false);

  const walletInsufficient = selected === 'wallet' && DEMO_WALLET.balance < bookingData.total;

  const handlePay = async () => {
    if (walletInsufficient) {
      Alert.alert('Insufficient Balance', 'Your wallet balance is low. Please choose another payment method.');
      return;
    }
    setProcessing(true);
    try {
      await new Promise<void>((r) => setTimeout(() => r(), 2000));
      navigation.navigate('BookingSuccess', { bookingId: `BK${Date.now().toString().slice(-6)}` });
    } catch {
      Alert.alert('Payment Failed', 'Something went wrong. Please try again.');
    } finally {
      setProcessing(false);
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
        <LinearGradient colors={[PINK, '#FF3366']} style={styles.amountCard}>
          <View style={styles.amountCardCircle1} />
          <View style={styles.amountCardCircle2} />
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>₹{bookingData.total}</Text>
          <Text style={styles.amountSub}>
            {(bookingData.services?.length ?? 0)} service{(bookingData.services?.length ?? 0) !== 1 ? 's' : ''}
          </Text>
        </LinearGradient>

        {/* Payment methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        {METHODS.map((m) => {
          const Icon      = m.icon;
          const isActive  = selected === m.id;
          const isWalletLow = m.id === 'wallet' && DEMO_WALLET.balance < bookingData.total;

          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.methodCard, isActive && styles.methodCardActive]}
              onPress={() => setSelected(m.id)}
              activeOpacity={0.88}
            >
              <View style={[styles.methodIconWrap, { backgroundColor: isActive ? m.color : m.bg }]}>
                <Icon size={20} color={isActive ? '#fff' : m.color} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodLabel, isActive && { color: PINK }]}>{m.label}</Text>
                <Text style={[styles.methodSub, isWalletLow && { color: '#EF4444' }]}>{m.sub}</Text>
                {isWalletLow && (
                  <Text style={styles.walletLowText}>⚠ Insufficient balance</Text>
                )}
              </View>
              <View style={[styles.radio, isActive && styles.radioDone]}>
                {isActive && <Check size={12} color="#fff" strokeWidth={3} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Secure note */}
        <View style={styles.secureRow}>
          <ShieldCheck size={16} color="#10B981" />
          <Text style={styles.secureText}>
            256-bit SSL encrypted · Powered by Razorpay
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          onPress={handlePay}
          disabled={processing || walletInsufficient}
          activeOpacity={0.9}
          style={{ opacity: walletInsufficient ? 0.5 : 1 }}
        >
          <LinearGradient colors={[PINK, '#FF3366']} style={styles.payBtn}>
            {processing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.payBtnText}>Pay ₹{bookingData.total}</Text>
                <ChevronRight size={18} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F8FC' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '800', color: colors.textPrimary },

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
  amountLabel: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 6 },
  amountValue: { fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  amountSub:   { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  sectionTitle: {
    fontSize: 15, fontWeight: '800', color: colors.textPrimary,
    marginHorizontal: 16, marginTop: 24, marginBottom: 12,
  },

  methodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 18, padding: 14, borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  methodCardActive: { borderColor: PINK, backgroundColor: '#FFF5F8' },
  methodIconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  methodSub:   { fontSize: 12, color: colors.textSecondary },
  walletLowText: { fontSize: 11, color: '#EF4444', fontWeight: '600', marginTop: 2 },
  radio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center',
  },
  radioDone: { backgroundColor: PINK, borderColor: PINK },

  secureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 16,
    padding: 12, backgroundColor: '#ECFDF5', borderRadius: 12,
  },
  secureText: { flex: 1, fontSize: 12, color: '#10B981', fontWeight: '600' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10,
  },
  payBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
    paddingVertical: 15, borderRadius: 16,
  },
  payBtnText: { fontSize: 17, fontWeight: '800', color: '#fff' },
});
