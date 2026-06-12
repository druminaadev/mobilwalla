import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Package, MapPin, ShoppingBag, ArrowLeft } from 'lucide-react-native';
import { ShopStackParamList } from '../../types/navigation';
import { colors } from '../../constants/colors';
import ReAnimated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'OrderConfirmed'>;
type RoutePropType = RouteProp<ShopStackParamList, 'OrderConfirmed'>;

export default function OrderConfirmedScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const insets = useSafeAreaInsets();

  const orderId = route.params?.orderId ?? 'SL-20240614-001';

  const SUMMARY = [
    { label: 'Order ID',            value: `#${orderId}` },
    { label: 'Payment',             value: 'UPI · ₹2,146'  },
    { label: 'Estimated Delivery',  value: 'Today by 5:00 PM' },
    { label: 'Deliver to',          value: 'Home — Navrangpura, Ahmedabad' },
  ];

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}

      {/* ── Top Section ── */}
      <LinearGradient colors={['#F8FAFC', '#F7F8FC']} style={[styles.topSection, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('ProductList' as never)}>
             <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ReAnimated.View entering={ZoomIn.duration(500)} style={styles.checkCircleOuter}>
          <View style={styles.checkCircleInner}>
            <CheckCircle size={56} color="#10B981" strokeWidth={2} />
          </View>
        </ReAnimated.View>

        <ReAnimated.View entering={FadeInUp.delay(300)} style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Order Confirmed! 🎉</Text>
          <Text style={styles.subtitle}>Your order has been placed successfully</Text>
        </ReAnimated.View>
      </LinearGradient>

      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {/* Summary card */}
        <ReAnimated.View entering={FadeInUp.delay(400)} style={styles.summaryCard}>
          {SUMMARY.map((row, i) => (
            <View key={row.label} style={[styles.summaryRow, i < SUMMARY.length - 1 && styles.summaryRowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>{row.value}</Text>
            </View>
          ))}
        </ReAnimated.View>

        {/* Status steps preview */}
        <ReAnimated.View entering={FadeInUp.delay(500)} style={styles.stepsRow}>
          {[
            { icon: CheckCircle, label: 'Confirmed', done: true  },
            { icon: Package,     label: 'Packed',    done: false },
            { icon: MapPin,      label: 'On the way', done: false },
          ].map((s, i, arr) => {
            const Icon = s.icon;
            return (
              <React.Fragment key={s.label}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepIcon, s.done && styles.stepIconDone]}>
                    <Icon size={18} color={s.done ? '#fff' : colors.textTertiary} />
                  </View>
                  <Text style={[styles.stepLabel, s.done && styles.stepLabelDone]}>{s.label}</Text>
                </View>
                {i < arr.length - 1 && (
                  <View style={[styles.stepConnector, s.done && styles.stepConnectorDone]} />
                )}
              </React.Fragment>
            );
          })}
        </ReAnimated.View>

        <View style={styles.actionsSpacer} />

        {/* Actions */}
        <ReAnimated.View entering={FadeInUp.delay(600)}>
          <TouchableOpacity
            style={styles.trackBtn}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('OrderTracking', { orderId })}
          >
            <LinearGradient colors={['#FF5C8A', '#FF3366']} style={styles.trackBtnGradient}>
              <MapPin size={18} color="#fff" />
              <Text style={styles.trackBtnText}>Track Your Order</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shopBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ShopHome')}
          >
            <ShoppingBag size={18} color="#FF5C8A" />
            <Text style={styles.shopBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </ReAnimated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F8FC' },

  topSection: { alignItems: 'center', paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4, zIndex: 10 },
  headerBar: { width: '100%', paddingHorizontal: 16, alignItems: 'flex-start', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.gray50 },
  checkCircleOuter: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  checkCircleInner: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
  },
  title:    { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginBottom: 6, letterSpacing: -0.4 },
  subtitle: { fontSize: 15, color: colors.textSecondary, fontWeight: '500', textAlign: 'center' },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },

  summaryCard: {
    backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  summaryLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  summaryValue: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, maxWidth: '60%', textAlign: 'right' },

  stepsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  stepIconDone: { backgroundColor: '#10B981' },
  stepLabel: { fontSize: 12, fontWeight: '600', color: colors.textTertiary, textAlign: 'center' },
  stepLabelDone: { color: '#10B981', fontWeight: '700' },
  stepConnector: { height: 2, flex: 0.4, backgroundColor: colors.gray200, marginBottom: 24 },
  stepConnectorDone: { backgroundColor: '#10B981' },

  actionsSpacer: { flex: 1 },

  trackBtn: { borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  trackBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  trackBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  shopBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 20,
    borderWidth: 2, borderColor: '#FF5C8A', backgroundColor: '#fff',
  },
  shopBtnText: { fontSize: 16, fontWeight: '700', color: '#FF5C8A' },
});
