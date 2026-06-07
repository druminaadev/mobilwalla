import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, ArrowUpRight, ArrowDownLeft, Gift, RefreshCw } from 'lucide-react-native';
import { DEMO_WALLET, DEMO_TRANSACTIONS } from '@/data/demo';
import { LinearGradient } from 'expo-linear-gradient';
import { WalletTransaction } from '@/types/models';
import { colors } from '@/constants/colors';

export default function WalletHomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { balance, loyaltyPoints } = DEMO_WALLET;
  const recentTransactions = DEMO_TRANSACTIONS.slice(0, 4);

  const txIcon = (t: WalletTransaction) => {
    if (t.type === 'CREDIT') return <ArrowDownLeft size={18} color={colors.success} />;
    if (t.type === 'REFUND') return <RefreshCw size={18} color={colors.info} />;
    return <ArrowUpRight size={18} color={colors.error} />;
  };

  const txColor = (t: WalletTransaction) => {
    if (t.type === 'CREDIT') return colors.success;
    if (t.type === 'REFUND') return colors.info;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Text style={styles.title}>Wallet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <LinearGradient colors={['#FF5C8A', '#FF9F43']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN')}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMoney')}>
            <Plus size={18} color="white" />
            <Text style={styles.addButtonText}>Add Money</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Loyalty Points */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loyalty Points</Text>
          <View style={styles.pointsCard}>
            <Gift size={28} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.points}>{loyaltyPoints} Points</Text>
              <Text style={styles.pointsNote}>≈ ₹{loyaltyPoints / 10} redeemable value</Text>
            </View>
            <TouchableOpacity style={styles.redeemButton}>
              <Text style={styles.redeemText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('AddMoney')}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLight }]}>
                <Plus size={22} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('TransactionHistory')}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.successLight }]}>
                <ArrowUpRight size={22} color={colors.success} />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Referral')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Gift size={22} color={colors.warning} />
              </View>
              <Text style={styles.quickActionText}>Refer & Earn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={styles.txIcon}>{txIcon(tx)}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txDesc}>{tx.description}</Text>
                <Text style={styles.txDate}>
                  {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
              </View>
              <Text style={[styles.txAmount, { color: txColor(tx) }]}>
                {tx.type === 'DEBIT' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  balanceCard: { margin: 20, padding: 32, borderRadius: 24, alignItems: 'center', shadowColor: '#FF5C8A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  balanceLabel: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginBottom: 8, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 },
  balanceAmount: { fontSize: 48, fontWeight: '800', color: 'white', marginBottom: 24, letterSpacing: -1 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  addButtonText: { fontSize: 16, fontWeight: '800', color: 'white' },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 12, letterSpacing: -0.3 },
  seeAll: { fontSize: 14, fontWeight: '600', color: colors.primary },
  pointsCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, backgroundColor: 'white', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: colors.border },
  points: { fontSize: 22, fontWeight: '800', color: colors.primary },
  pointsNote: { fontSize: 14, color: colors.textSecondary, marginTop: 4, fontWeight: '500' },
  redeemButton: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: colors.primary, borderRadius: 12 },
  redeemText: { fontSize: 14, fontWeight: '800', color: 'white' },
  quickActions: { flexDirection: 'row', gap: 16, paddingHorizontal: 4 },
  quickAction: { flex: 1, alignItems: 'center', gap: 8 },
  quickActionIcon: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: colors.border },
  quickActionText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, paddingHorizontal: 4 },
  txIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  txDesc: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  txDate: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  txAmount: { fontSize: 16, fontWeight: '800' },
});
