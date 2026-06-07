import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PAYMENT_METHODS = ['UPI / GPay', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery'];

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState('UPI / GPay');
  const [showSummary, setShowSummary] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <Text style={styles.addressType}>● Home</Text>
            <Text style={styles.addressText}>123 Main St, Navrangpura</Text>
            <Text style={styles.addressText}>Ahmedabad, Gujarat 380009</Text>
          </View>
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add New Address</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map(method => (
            <Pressable
              key={method}
              onPress={() => setSelectedPayment(method)}
              style={styles.paymentOption}
            >
              <View style={styles.radio}>
                {selectedPayment === method && <View style={styles.radioActive} />}
              </View>
              <Text style={styles.paymentText}>{method}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => setShowSummary(!showSummary)} style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <ChevronDown size={20} color="#1A1B2E" style={{ transform: [{ rotate: showSummary ? '180deg' : '0deg' }] }} />
          </View>
          {showSummary && (
            <View style={styles.summaryDetails}>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Subtotal:</Text>
                <Text style={styles.value}>₹2,297</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Delivery:</Text>
                <Text style={styles.value}>₹49</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Discount:</Text>
                <Text style={[styles.value, styles.discount]}>-₹200</Text>
              </View>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₹2,146</Text>
          </View>
        </Pressable>
      </ScrollView>

      <Pressable onPress={() => navigation.navigate('OrderConfirmed' as never)} style={styles.placeOrderButton}>
        <LinearGradient colors={['#FF5C8A', '#FF8BA7']} style={styles.gradient}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  section: { backgroundColor: '#fff', padding: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1B2E', marginBottom: 16 },
  addressCard: { padding: 16, backgroundColor: '#F7F8FC', borderRadius: 12, borderWidth: 2, borderColor: '#FF5C8A', marginBottom: 12 },
  addressType: { fontSize: 16, fontWeight: '600', color: '#1A1B2E', marginBottom: 8 },
  addressText: { fontSize: 14, color: '#64748B', marginBottom: 4 },
  addButton: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  addButtonText: { fontSize: 14, fontWeight: '600', color: '#FF5C8A' },
  paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  radioActive: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5C8A' },
  paymentText: { fontSize: 15, color: '#1A1B2E' },
  summaryCard: { backgroundColor: '#fff', padding: 20, marginBottom: 12 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: '#1A1B2E' },
  summaryDetails: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 15, color: '#64748B' },
  value: { fontSize: 15, fontWeight: '600', color: '#1A1B2E' },
  discount: { color: '#10B981' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#1A1B2E' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#FF5C8A' },
  placeOrderButton: { margin: 16, marginBottom: 32 },
  gradient: { padding: 16, borderRadius: 12, alignItems: 'center' },
  placeOrderText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
