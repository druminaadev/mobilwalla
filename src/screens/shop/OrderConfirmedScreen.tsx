import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Package, MapPin, ShoppingBag } from 'lucide-react-native';
import { ShopStackParamList } from '@/types/navigation';
import { colors } from '@/constants/colors';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'OrderConfirmed'>;
type RoutePropType = RouteProp<ShopStackParamList, 'OrderConfirmed'>;

export default function OrderConfirmedScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const insets = useSafeAreaInsets();

  const orderId = route.params?.orderId ?? 'SL-20240614-001';

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const SUMMARY = [
    { label: 'Order ID',            value: `#${orderId}` },
    { label: 'Payment',             value: 'UPI · ₹2,497'  },
    { label: 'Estimated Delivery',  value: 'Today by 5:00 PM' },
    { label: 'Deliver to',          value: 'Home — Navrangpura, Ahmedabad' },
  ];

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}

      <LinearGradient colors={['#FFF0F5', '#F7F8FC']} style={[styles.topSection, { paddingTop: insets.top + 24 }]}>
        {/* Animated check */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={styles.checkCircleOuter}>
            <View style={styles.checkCircleInner}>
              <CheckCircle size={56} color="#10B981" strokeWidth={1.5} />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.title}>Order Confirmed! 🎉</Text>
          <Text style={styles.subtitle}>Your order has been placed successfully</Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Summary card */}
        <View style={styles.summaryCard}>
          {SUMMARY.map((row, i) => (
            <View key={row.label} style={[styles.summaryRow, i < SUMMARY.length - 1 && styles.summaryRowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Status steps preview */}
        <View style={styles.stepsRow}>
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
        </View>

        {/* Actions */}
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
          onPress={() => navigation.navigate('ProductList')}
        >
          <ShoppingBag size={18} color="#FF5C8A" />
          <Text style={styles.shopBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F8FC' },

  topSection: { alignItems: 'center', paddingBottom: 32, paddingHorizontal: 24 },
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

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  summaryCard: {
    backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  summaryLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  summaryValue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, maxWidth: '55%', textAlign: 'right' },

  stepsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 22, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  stepIconDone: { backgroundColor: '#10B981' },
  stepLabel: { fontSize: 12, fontWeight: '600', color: colors.textTertiary, textAlign: 'center' },
  stepLabelDone: { color: '#10B981', fontWeight: '700' },
  stepConnector: { height: 2, flex: 0.4, backgroundColor: colors.gray200, marginBottom: 22 },
  stepConnectorDone: { backgroundColor: '#10B981' },

  trackBtn: { borderRadius: 18, overflow: 'hidden', marginBottom: 12 },
  trackBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  trackBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  shopBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 15, borderRadius: 18,
    borderWidth: 2, borderColor: '#FF5C8A', backgroundColor: '#FFF0F5',
  },
  shopBtnText: { fontSize: 15, fontWeight: '700', color: '#FF5C8A' },
});
