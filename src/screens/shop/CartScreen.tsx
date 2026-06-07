import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Trash2, Minus, Plus, Tag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CART_ITEMS = [
  { id: '1', name: 'Keratin Hair Serum', price: 899, quantity: 1, image: 'https://via.placeholder.com/80' },
  { id: '2', name: 'Anti-Aging Face Cream', price: 499, quantity: 2, image: 'https://via.placeholder.com/80' },
];

export default function CartScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState(CART_ITEMS);

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 49;
  const discount = 200;
  const total = subtotal + delivery - discount;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>My Cart</Text>
        </View>

        {items.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              <View style={styles.quantityRow}>
                <Pressable onPress={() => updateQuantity(item.id, -1)} style={styles.quantityButton}>
                  <Minus size={16} color="#1A1B2E" />
                </Pressable>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Pressable onPress={() => updateQuantity(item.id, 1)} style={styles.quantityButton}>
                  <Plus size={16} color="#1A1B2E" />
                </Pressable>
                <Pressable onPress={() => removeItem(item.id)} style={styles.deleteButton}>
                  <Trash2 size={20} color="#EF4444" />
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        <Pressable style={styles.couponButton}>
          <Tag size={20} color="#FF5C8A" />
          <Text style={styles.couponText}>Apply Coupon Code</Text>
        </Pressable>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery:</Text>
            <Text style={styles.summaryValue}>₹{delivery}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount:</Text>
            <Text style={[styles.summaryValue, styles.discount]}>-₹{discount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      <Pressable onPress={() => navigation.navigate('Checkout' as never)} style={styles.checkoutButton}>
        <LinearGradient colors={['#FF5C8A', '#FF8BA7']} style={styles.gradient}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  header: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1B2E' },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', margin: 16, marginBottom: 0, borderRadius: 12, padding: 12, elevation: 2 },
  itemImage: { width: 80, height: 80, borderRadius: 8 },
  itemDetails: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#1A1B2E', marginBottom: 6 },
  itemPrice: { fontSize: 18, fontWeight: '800', color: '#FF5C8A', marginBottom: 10 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quantityButton: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  quantity: { fontSize: 16, fontWeight: '600', color: '#1A1B2E', minWidth: 20, textAlign: 'center' },
  deleteButton: { marginLeft: 'auto' },
  couponButton: { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#FF5C8A', borderStyle: 'dashed' },
  couponText: { fontSize: 16, fontWeight: '600', color: '#FF5C8A' },
  summary: { margin: 16, padding: 16, backgroundColor: '#fff', borderRadius: 12 },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: '#1A1B2E', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 15, color: '#64748B' },
  summaryValue: { fontSize: 15, fontWeight: '600', color: '#1A1B2E' },
  discount: { color: '#10B981' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#1A1B2E' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#FF5C8A' },
  checkoutButton: { margin: 16, marginBottom: 32 },
  gradient: { padding: 16, borderRadius: 12, alignItems: 'center' },
  checkoutText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
