import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Gift, Users } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { DEMO_TRANSACTIONS, DEMO_WALLET } from '@/data/demo';
import { WalletTransaction } from '@/types/models';
import { colors } from '@/constants/colors';

type FilterTab = 'All' | 'Credit' | 'Debit';

const FILTER_TABS: FilterTab[] = ['All', 'Credit', 'Debit'];

function getMonthLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function txIcon(t: WalletTransaction) {
  if (t.type === 'REFUND') return { Icon: RefreshCw, color: colors.info, bg: '#E0F2FE' };
  if (t.type === 'CREDIT') return { Icon: ArrowDownLeft, color: colors.success, bg: '#D1FAE5' };
  return { Icon: ArrowUpRight, color: colors.error, bg: '#FEE2E2' };
}

function txAmountColor(t: WalletTransaction) {
  if (t.type === 'DEBIT') return colors.error;
  return colors.success;
}

type ListItem =
  | { kind: 'header'; month: string }
  | { kind: 'tx'; tx: WalletTransaction };

export default function TransactionHistoryScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    if (activeTab === 'Credit') return DEMO_TRANSACTIONS.filter((t) => t.type === 'CREDIT' || t.type === 'REFUND');
    if (activeTab === 'Debit') return DEMO_TRANSACTIONS.filter((t) => t.type === 'DEBIT');
    return DEMO_TRANSACTIONS;
  }, [activeTab]);

  const totalCredit = DEMO_TRANSACTIONS
    .filter((t) => t.type === 'CREDIT' || t.type === 'REFUND')
    .reduce((s, t) => s + t.amount, 0);
  const totalDebit = DEMO_TRANSACTIONS
    .filter((t) => t.type === 'DEBIT')
    .reduce((s, t) => s + t.amount, 0);

  const listData = useMemo((): ListItem[] => {
    const groups: Record<string, WalletTransaction[]> = {};
    filtered.forEach((t) => {
      const key = getMonthLabel(t.createdAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    const items: ListItem[] = [];
    Object.entries(groups).forEach(([month, txs]) => {
      items.push({ kind: 'header', month });
      txs.forEach((tx) => items.push({ kind: 'tx', tx }));
    });
    return items;
  }, [filtered]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise<void>((r) => setTimeout(() => r(), 800));
    setRefreshing(false);
  }, []);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.kind === 'header') {
      return <Text style={styles.monthHeader}>{item.month}</Text>;
    }
    const { tx } = item;
    const { Icon, color, bg } = txIcon(tx);
    return (
      <View style={styles.txRow}>
        <View style={[styles.txIconWrap, { backgroundColor: bg }]}>
          <Icon size={18} color={color} />
        </View>
        <View style={styles.txInfo}>
          <Text style={styles.txTitle}>{tx.description}</Text>
          <Text style={styles.txDate}>
            {new Date(tx.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </Text>
        </View>
        <Text style={[styles.txAmount, { color: txAmountColor(tx) }]}>
          {tx.type === 'DEBIT' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
        </Text>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: ListItem, i: number) =>
    item.kind === 'header' ? `h-${item.month}` : `tx-${item.tx.id}-${i}`, []);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Transaction History" onBack={() => navigation.goBack()} />

      {/* Filter tabs */}
      <View style={styles.tabBar}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary chips */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryChip}>
          <Text style={[styles.summaryAmount, { color: colors.success }]}>
            +₹{totalCredit.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.summaryLabel}>Total Credit</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={[styles.summaryAmount, { color: colors.error }]}>
            -₹{totalDebit.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.summaryLabel}>Total Debit</Text>
        </View>
        <View style={styles.summaryChip}>
          <Text style={[styles.summaryAmount, { color: colors.primary }]}>
            ₹{DEMO_WALLET.balance.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.summaryLabel}>Balance</Text>
        </View>
      </View>

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={listData.length === 0 ? styles.emptyContainer : styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} transactions</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  tabBar: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '700' },

  summaryRow: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryChip: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  summaryAmount: { fontSize: 15, fontWeight: '800' },
  summaryLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2, fontWeight: '500' },

  monthHeader: {
    fontSize: 12, fontWeight: '700', color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.6,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },

  list: { paddingBottom: 32 },
  emptyContainer: { flex: 1 },

  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  txIconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 3 },
  txDate: { fontSize: 12, color: colors.textSecondary },
  txAmount: { fontSize: 15, fontWeight: '800' },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 15, color: colors.textSecondary },
});
