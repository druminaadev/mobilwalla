import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Platform, StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInUp, SlideOutRight } from 'react-native-reanimated';
import { ArrowLeft, Plus, Minus, Trash2, ArrowRight } from 'lucide-react-native';
import { ShopStackParamList } from '../../types/navigation';
import { colors } from '../../constants/colors';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Cart'>;

const INITIAL_CART = [
  { id: '1', name: 'Keratin Repair Serum', brand: 'L\'Oréal Paris', price: 899, qty: 1, image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=400&q=80' },
  { id: '2', name: 'Vitamin C Glow Cream', brand: 'Neutrogena', price: 1299, qty: 2, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80' },
];

const UPSELLS = [
  { id: 'u1', name: 'Hydrating Face Mask', price: 299, image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=200&q=80' },
  { id: 'u2', name: 'Jade Roller', price: 499, image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&w=200&q=80' },
];

export default function CartScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(INITIAL_CART);

  const updateQty = (id: string, delta: number) => {
    setItems(items.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = items.length > 0 ? 300 : 0;
  const delivery = subtotal > 1500 ? 0 : 49;
  const total = items.length > 0 ? subtotal - discount + delivery : 0;

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Bag</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 120) }}>
        
        {items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.emptyTitle}>Your bag is empty</Text>
            <Text style={styles.emptySub}>Looks like you haven't added anything yet.</Text>
            <TouchableOpacity style={styles.continueBtn} onPress={() => navigation.navigate('ShopHome')}>
              <Text style={styles.continueBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.itemsWrap}>
            {items.map((item, i) => (
              <Animated.View key={item.id} exiting={SlideOutRight} entering={FadeInUp.delay(i * 100)} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemBrand}>{item.brand}</Text>
                    <TouchableOpacity onPress={() => removeItem(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Trash2 size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.itemBottom}>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    <View style={styles.qtyControl}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                        <Minus size={14} color={colors.textPrimary} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.qty}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                        <Plus size={14} color={colors.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {/* UPSELL SECTION */}
        {items.length > 0 && (
          <Animated.View entering={FadeInUp.delay(300)} style={styles.upsellSection}>
            <Text style={styles.upsellTitle}>Frequently bought together</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.upsellScroll}>
              {UPSELLS.map(u => (
                <View key={u.id} style={styles.upsellCard}>
                  <Image source={{ uri: u.image }} style={styles.upsellImg} />
                  <View style={styles.upsellInfo}>
                    <Text style={styles.upsellName} numberOfLines={2}>{u.name}</Text>
                    <View style={styles.upsellBottom}>
                      <Text style={styles.upsellPrice}>₹{u.price}</Text>
                      <TouchableOpacity style={styles.upsellAddBtn}>
                        <Plus size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

      </ScrollView>

      {/* STICKY CHECKOUT FOOTER */}
      {items.length > 0 && (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.footerRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryVal}>₹{subtotal}</Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryVal}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={[styles.summaryVal, { color: '#10B981' }]}>- ₹{discount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.footerRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>₹{total}</Text>
          </View>

          <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#fff' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray50, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },

  emptyWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 64, marginBottom: 24 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  emptySub: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  continueBtn: { backgroundColor: '#FF5C8A', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 24 },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  itemsWrap: { padding: 16, gap: 16 },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 },
  itemImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: colors.gray50 },
  itemInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  itemBrand: { fontSize: 11, color: colors.textTertiary, fontWeight: '700', textTransform: 'uppercase' },
  itemName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  itemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: 16, fontWeight: '800', color: '#FF5C8A' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray50, borderRadius: 12, padding: 4 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  qtyText: { fontSize: 14, fontWeight: '700', width: 28, textAlign: 'center' },

  upsellSection: { marginTop: 8, paddingBottom: 24 },
  upsellTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, paddingHorizontal: 16, marginBottom: 12 },
  upsellScroll: { paddingHorizontal: 16, gap: 16 },
  upsellCard: { width: 140, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.gray100 },
  upsellImg: { width: '100%', height: 100, backgroundColor: colors.gray50 },
  upsellInfo: { padding: 10 },
  upsellName: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, height: 34 },
  upsellBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  upsellPrice: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  upsellAddBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FF5C8A', justifyContent: 'center', alignItems: 'center' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 20, borderTopLeftRadius: 32, borderTopRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 10 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  summaryVal: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.gray100, marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  totalVal: { fontSize: 20, fontWeight: '800', color: '#FF5C8A' },
  checkoutBtn: { marginTop: 20, backgroundColor: '#FF5C8A', paddingVertical: 18, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  checkoutBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
