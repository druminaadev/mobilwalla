import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { ArrowLeft, MapPin, CreditCard, Wallet, Landmark, ChevronDown, CheckCircle2 } from 'lucide-react-native';
import { ShopStackParamList } from '../../types/navigation';
import { colors } from '../../constants/colors';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Checkout'>;

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / GPay', icon: Wallet },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'net', label: 'Net Banking', icon: Landmark },
];

export default function CheckoutScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  
  const [activeSection, setActiveSection] = useState<'address' | 'payment'>('address');
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const handlePlaceOrder = () => {
    navigation.navigate('OrderConfirmed', { orderId: 'SL-20240614-001' });
  };

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 120), padding: 16 }}>
        
        {/* 1. DELIVERY ADDRESS */}
        <Animated.View layout={Layout.springify()} style={[styles.section, activeSection === 'address' && styles.sectionActive]}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            activeOpacity={0.8}
            onPress={() => setActiveSection('address')}
          >
            <View style={styles.sectionTitleRow}>
              <View style={[styles.stepCircle, activeSection === 'address' && styles.stepCircleActive]}>
                <Text style={[styles.stepNum, activeSection === 'address' && styles.stepNumActive]}>1</Text>
              </View>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            {activeSection !== 'address' && <CheckCircle2 size={20} color="#10B981" />}
          </TouchableOpacity>

          {activeSection === 'address' && (
            <Animated.View entering={FadeInUp} style={styles.sectionBody}>
              <View style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <View style={styles.addressTypeWrap}>
                    <MapPin size={14} color="#FF5C8A" />
                    <Text style={styles.addressType}>Home</Text>
                  </View>
                  <TouchableOpacity><Text style={styles.editText}>Edit</Text></TouchableOpacity>
                </View>
                <Text style={styles.addressName}>Dipak Patil</Text>
                <Text style={styles.addressText}>A-101, Navrangpura Society, CG Road</Text>
                <Text style={styles.addressText}>Ahmedabad, Gujarat 380009</Text>
                <Text style={styles.addressPhone}>+91 98765 43210</Text>
              </View>

              <TouchableOpacity style={styles.continueBtn} onPress={() => setActiveSection('payment')}>
                <Text style={styles.continueBtnText}>Deliver Here</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        {/* 2. PAYMENT METHOD */}
        <Animated.View layout={Layout.springify()} style={[styles.section, activeSection === 'payment' && styles.sectionActive]}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            activeOpacity={0.8}
            onPress={() => setActiveSection('payment')}
          >
            <View style={styles.sectionTitleRow}>
              <View style={[styles.stepCircle, activeSection === 'payment' && styles.stepCircleActive]}>
                <Text style={[styles.stepNum, activeSection === 'payment' && styles.stepNumActive]}>2</Text>
              </View>
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            {activeSection !== 'payment' && <ChevronDown size={20} color={colors.textTertiary} />}
          </TouchableOpacity>

          {activeSection === 'payment' && (
            <Animated.View entering={FadeInUp} style={styles.sectionBody}>
              <View style={styles.paymentMethods}>
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPayment === method.id;
                  return (
                    <TouchableOpacity 
                      key={method.id} 
                      style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
                      onPress={() => setSelectedPayment(method.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.paymentIconWrap}>
                        <Icon size={20} color={isSelected ? '#FF5C8A' : colors.textSecondary} />
                      </View>
                      <Text style={[styles.paymentLabel, isSelected && styles.paymentLabelSelected]}>{method.label}</Text>
                      <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          )}
        </Animated.View>

      </ScrollView>

      {/* STICKY FOOTER */}
      {activeSection === 'payment' && (
        <Animated.View entering={FadeInUp} style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.footerInner}>
            <View style={styles.footerTotalWrap}>
              <Text style={styles.footerTotalLabel}>Amount to Pay</Text>
              <Text style={styles.footerTotalVal}>₹2,146</Text>
            </View>
            <TouchableOpacity style={styles.placeOrderBtn} activeOpacity={0.8} onPress={handlePlaceOrder}>
              <Text style={styles.placeOrderBtnText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray50, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },

  section: { backgroundColor: '#fff', borderRadius: 24, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.gray100 },
  sectionActive: { borderColor: '#FF5C8A', shadowColor: '#FF5C8A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center' },
  stepCircleActive: { backgroundColor: '#FF5C8A' },
  stepNum: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  stepNumActive: { color: '#fff' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },

  sectionBody: { paddingHorizontal: 20, paddingBottom: 20 },
  
  // Address
  addressCard: { backgroundColor: '#FFF0F5', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#FFE4EE' },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addressTypeWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  addressType: { fontSize: 12, fontWeight: '700', color: '#FF5C8A' },
  editText: { fontSize: 13, fontWeight: '600', color: '#FF5C8A' },
  addressName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  addressText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  addressPhone: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginTop: 8 },
  continueBtn: { backgroundColor: '#FF5C8A', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  continueBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Payment
  paymentMethods: { gap: 12 },
  paymentCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: colors.gray50, borderWidth: 1.5, borderColor: 'transparent' },
  paymentCardSelected: { backgroundColor: '#FFF0F5', borderColor: '#FF5C8A' },
  paymentIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  paymentLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  paymentLabelSelected: { color: '#FF5C8A', fontWeight: '700' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.gray300, justifyContent: 'center', alignItems: 'center' },
  radioOuterSelected: { borderColor: '#FF5C8A' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5C8A' },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.gray100, paddingTop: 16, paddingHorizontal: 24 },
  footerInner: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  footerTotalWrap: { flex: 1 },
  footerTotalLabel: { fontSize: 12, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  footerTotalVal: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  placeOrderBtn: { flex: 1.5, backgroundColor: '#FF5C8A', paddingVertical: 18, borderRadius: 20, alignItems: 'center', shadowColor: '#FF5C8A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  placeOrderBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
