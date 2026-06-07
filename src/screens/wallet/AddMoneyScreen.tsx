import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { CreditCard, QrCode, Building2, Wallet } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { DEMO_WALLET } from '@/data/demo';
import { colors } from '@/constants/colors';

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const METHODS = [
  { id: 'upi', label: 'UPI', sub: 'PhonePe, GPay, Paytm', icon: QrCode },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks', icon: Building2 },
  { id: 'wallet', label: 'Wallet Balance', sub: `Available: ₹${DEMO_WALLET.balance}`, icon: Wallet },
];

export default function AddMoneyScreen({ navigation }: any) {
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const val = parseInt(amount, 10);
    if (!val || val < 10) { Alert.alert('Invalid amount', 'Minimum amount is ₹10'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(() => r(null), 1000));
    setLoading(false);
    Alert.alert('Money Added! 🎉', `₹${val} has been added to your wallet.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Add Money" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance */}
        <View style={styles.balanceBanner}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>₹{DEMO_WALLET.balance.toLocaleString('en-IN')}</Text>
        </View>

        {/* Amount Input */}
        <Text style={styles.sectionTitle}>Enter Amount</Text>
        <View style={styles.amountInputWrap}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/\D/g, ''))}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickGrid}>
          {QUICK_AMOUNTS.map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.quickChip, amount === String(a) && styles.quickChipActive]}
              onPress={() => setAmount(String(a))}
            >
              <Text style={[styles.quickText, amount === String(a) && styles.quickTextActive]}>₹{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodCard, method === m.id && styles.methodCardActive]}
            onPress={() => setMethod(m.id)}
          >
            <View style={styles.methodIcon}>
              <m.icon size={22} color={method === m.id ? colors.primary : colors.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodSub}>{m.sub}</Text>
            </View>
            <View style={[styles.radio, method === m.id && styles.radioActive]}>
              {method === m.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        <Button
          title={`Add ₹${amount || '0'} to Wallet`}
          onPress={handleAdd}
          loading={loading}
          disabled={!amount || parseInt(amount) < 10}
          fullWidth
          style={styles.btn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { padding: 16, gap: 4 },
  balanceBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: colors.primaryLight, borderRadius: 12, marginBottom: 16 },
  balanceLabel: { fontSize: 13, color: colors.textSecondary },
  balanceValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginVertical: 12 },
  amountInputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: colors.primary, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 },
  rupee: { fontSize: 28, fontWeight: '700', color: colors.primary, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '700', color: colors.textPrimary },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  quickChip: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: colors.background, borderRadius: 20, borderWidth: 2, borderColor: 'transparent' },
  quickChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  quickText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  quickTextActive: { color: colors.primary },
  methodCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: colors.background, borderRadius: 12, marginBottom: 8, borderWidth: 2, borderColor: 'transparent' },
  methodCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  methodIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  methodLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  methodSub: { fontSize: 12, color: colors.textSecondary },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  btn: { marginTop: 16 },
});
