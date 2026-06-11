import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, ArrowUpRight, ArrowDownLeft, Gift, RefreshCw, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { DEMO_WALLET, DEMO_TRANSACTIONS } from '../../data/demo';
import { WalletTransaction } from '../../types/models';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

export default function WalletHomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { balance, loyaltyPoints } = DEMO_WALLET;
  const recentTransactions = DEMO_TRANSACTIONS.slice(0, 4);

  const txIcon = (t: WalletTransaction) => {
    if (t.type === 'CREDIT') return <ArrowDownLeft size={20} color={colors.success} />;
    if (t.type === 'REFUND') return <RefreshCw size={20} color={colors.info} />;
    return <ArrowUpRight size={20} color={colors.error} />;
  };

  const txColor = (t: WalletTransaction) => {
    if (t.type === 'CREDIT') return colors.success;
    if (t.type === 'REFUND') return colors.info;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Balance Card - Luxury Digital Membership style */}
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <LinearGradient 
             colors={[colors.primary, '#0A3245']} 
             start={{ x: 0, y: 0 }} 
             end={{ x: 1, y: 1 }} 
             style={styles.balanceCard}
          >
            {/* Card Watermark / Texture */}
            <View style={styles.cardWatermark} />
            
            <View style={styles.cardTopRow}>
               <Text style={styles.balanceLabel}>Total Balance</Text>
               <Gift size={20} color="rgba(255,255,255,0.7)" />
            </View>
            
            <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN')}</Text>
            
            <View style={styles.cardBottomRow}>
              <View>
                 <Text style={styles.cardSubLabel}>Loyalty Points</Text>
                 <Text style={styles.cardSubValue}>{loyaltyPoints}</Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMoney')} activeOpacity={0.8}>
                <Plus size={18} color={colors.primary} />
                <Text style={styles.addButtonText}>Add Money</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Animated.View entering={FadeInUp.delay(100).springify()} style={{ flex: 1 }}>
              <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('AddMoney')} activeOpacity={0.8}>
                <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLight }]}>
                  <Plus size={24} color={colors.primary} />
                </View>
                <Text style={styles.quickActionText}>Top Up</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(150).springify()} style={{ flex: 1 }}>
              <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('TransactionHistory')} activeOpacity={0.8}>
                <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                  <ArrowUpRight size={24} color={colors.success} />
                </View>
                <Text style={styles.quickActionText}>History</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(200).springify()} style={{ flex: 1 }}>
              <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Referral')} activeOpacity={0.8}>
                <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Gift size={24} color={colors.warning} />
                </View>
                <Text style={styles.quickActionText}>Rewards</Text>
              </TouchableOpacity>
            </Animated.View>
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

          <View style={styles.txCard}>
            {recentTransactions.map((tx, index) => (
              <Animated.View key={tx.id} entering={FadeInDown.delay(300 + index * 50).springify()}>
                <View style={[styles.txRow, index === recentTransactions.length - 1 && styles.txRowLast]}>
                  <View style={styles.txIconWrap}>{txIcon(tx)}</View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txDesc}>{tx.description}</Text>
                    <Text style={styles.txDate}>
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  <Text style={[styles.txAmount, { color: txColor(tx) }]}>
                    {tx.type === 'DEBIT' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  content: {
    paddingBottom: 40,
  },
  balanceCard: {
    margin: 20,
    padding: 24,
    borderRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  cardWatermark: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    ...typography.subtitle2,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -1,
    marginBottom: 32,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardSubLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  cardSubValue: {
    ...typography.h4,
    color: colors.white,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  addButtonText: {
    ...typography.subtitle2,
    color: colors.primary,
    fontWeight: '800',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  seeAll: {
    ...typography.subtitle2,
    color: colors.primary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  quickAction: {
    alignItems: 'center',
    gap: 10,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  quickActionText: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  txCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  txRowLast: {
    borderBottomWidth: 0,
  },
  txIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
  },
  txDesc: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  txDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  txAmount: {
    ...typography.h4,
  },
});
