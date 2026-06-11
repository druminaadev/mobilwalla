import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated as RNAnimated, Dimensions, Platform, StatusBar, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import {
  ArrowLeft, Package, CheckCircle, Truck, MapPin,
  Clock, Phone, MessageCircle, Copy, RotateCcw, ChevronRight,
  Store, Home as HomeIcon,
} from 'lucide-react-native';
import { ShopStackParamList } from '../../types/navigation';
import { colors } from '../../constants/colors';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'OrderTracking'>;
type RoutePropType = RouteProp<ShopStackParamList, 'OrderTracking'>;

const { width } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = 'done' | 'active' | 'pending';

type TrackStep = {
  id: string;
  label: string;
  subLabel: string;
  time: string;
  icon: React.ComponentType<any>;
  status: StepStatus;
};

type OrderItem = {
  id: string;
  name: string;
  brand: string;
  qty: number;
  price: number;
  image: string;
};

// ─── Demo Data ────────────────────────────────────────────────────────────────

const ORDER_ITEMS: OrderItem[] = [
  {
    id: '1', name: 'Keratin Repair Serum', brand: 'L\'Oréal Paris',
    qty: 1, price: 899,
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2', name: 'Vitamin C Glow Cream', brand: 'Neutrogena',
    qty: 2, price: 1299,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=200&q=80',
  },
];

const STEPS: TrackStep[] = [
  {
    id: 's1', label: 'Order Placed', subLabel: 'Your order has been confirmed',
    time: 'Today, 10:32 AM', icon: CheckCircle, status: 'done',
  },
  {
    id: 's2', label: 'Packed', subLabel: 'Packed & ready for pickup',
    time: 'Today, 12:15 PM', icon: Package, status: 'done',
  },
  {
    id: 's3', label: 'Shipped', subLabel: 'Out for delivery — Rajesh (Driver)',
    time: 'Today, 2:40 PM', icon: Truck, status: 'active',
  },
  {
    id: 's4', label: 'Out for Delivery', subLabel: 'Arriving at your address soon',
    time: 'Expected 5:00 PM', icon: MapPin, status: 'pending',
  },
  {
    id: 's5', label: 'Delivered', subLabel: 'Package handed over',
    time: '', icon: HomeIcon, status: 'pending',
  },
];

const STEP_COLORS: Record<StepStatus, { dot: string; line: string; icon: string; bg: string }> = {
  done:    { dot: '#10B981', line: '#10B981', icon: '#fff',      bg: '#10B981' },
  active:  { dot: '#FF5C8A', line: '#E2E8F0', icon: '#fff',     bg: '#FF5C8A' },
  pending: { dot: '#E2E8F0', line: '#E2E8F0', icon: '#94A3B8',  bg: '#F1F5F9' },
};

// ─── Animated Step ────────────────────────────────────────────────────────────

function TrackStepRow({ step, isLast, delay }: { step: TrackStep; isLast: boolean; delay: number }) {
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  const c = STEP_COLORS[step.status];
  const Icon = step.icon;

  useEffect(() => {
    if (step.status === 'active') {
      const pulse = RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, { toValue: 1.25, duration: 700, useNativeDriver: true }),
          RNAnimated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, []);

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(400)} style={styles.stepRow}>
      {/* Timeline column */}
      <View style={styles.stepTimeline}>
        {step.status === 'active' && (
          <RNAnimated.View style={[styles.stepPulseRing, { transform: [{ scale: pulseAnim }], borderColor: c.dot }]} />
        )}
        <View style={[styles.stepDot, { backgroundColor: c.bg }]}>
          <Icon size={14} color={c.icon} strokeWidth={2.5} />
        </View>
        {!isLast && <View style={[styles.stepLine, { backgroundColor: c.line }]} />}
      </View>

      {/* Content */}
      <View style={styles.stepContent}>
        <View style={styles.stepLabelRow}>
          <Text style={[styles.stepLabel, step.status === 'active' && styles.stepLabelActive, step.status === 'pending' && styles.stepLabelPending]}>
            {step.label}
          </Text>
          {step.status === 'active' && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        <Text style={[styles.stepSub, step.status === 'pending' && styles.stepSubPending]}>{step.subLabel}</Text>
        {step.time !== '' && <Text style={[styles.stepTime, step.status === 'pending' && styles.stepTimePending]}>{step.time}</Text>}
      </View>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function OrderTrackingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const insets = useSafeAreaInsets();

  const orderId = route.params?.orderId ?? 'SL-20240614-001';
  const [copied, setCopied] = useState(false);

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = 49;
  const total = subtotal + delivery;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeStep = STEPS.find((s) => s.status === 'active');

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}

      {/* ── Header ── */}
      <LinearGradient
        colors={['#FF5C8A', '#FF3366']}
        style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 20) }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Track Order</Text>
            <TouchableOpacity style={styles.orderIdRow} onPress={handleCopy}>
              <Text style={styles.headerOrderId}>#{orderId}</Text>
              <Copy size={13} color="rgba(255,255,255,0.8)" />
              {copied && <Text style={styles.copiedText}>Copied!</Text>}
            </TouchableOpacity>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* ETA card */}
        <Animated.View entering={ZoomIn.duration(400)} style={styles.etaCard}>
          <View style={styles.etaLeft}>
            <Text style={styles.etaLabel}>Estimated Delivery</Text>
            <Text style={styles.etaTime}>Today by 5:00 PM</Text>
            <View style={styles.etaStatus}>
              <View style={styles.etaStatusDot} />
              <Text style={styles.etaStatusText}>{activeStep?.label ?? 'Processing'}</Text>
            </View>
          </View>
          <View style={styles.etaRight}>
            <Truck size={44} color="#FF5C8A" />
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 40) }}>

        {/* ── Map placeholder ── */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.mapWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80' }}
            style={styles.mapImage}
            blurRadius={1}
          />
          <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.45)']} style={styles.mapOverlay} />
          {/* Driver pin */}
          <View style={styles.driverPin}>
            <View style={styles.driverPinInner}>
              <Truck size={18} color="#FF5C8A" />
            </View>
            <View style={styles.driverPinTail} />
          </View>
          {/* Destination pin */}
          <View style={styles.destPin}>
            <View style={styles.destPinInner}>
              <HomeIcon size={15} color="#fff" />
            </View>
          </View>
          {/* Live chip */}
          <View style={styles.mapLiveChip}>
            <View style={styles.mapLiveDot} />
            <Text style={styles.mapLiveText}>Live Tracking</Text>
          </View>
        </Animated.View>

        {/* ── Delivery partner ── */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.card}>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>R</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Rajesh Kumar</Text>
              <Text style={styles.driverRole}>Delivery Partner · ⭐ 4.8</Text>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.driverActionBtn}>
                <Phone size={18} color="#FF5C8A" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.driverActionBtn}>
                <MessageCircle size={18} color="#FF5C8A" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* ── Timeline ── */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.card}>
          <Text style={styles.cardTitle}>Order Journey</Text>
          <View style={styles.timeline}>
            {STEPS.map((step, i) => (
              <TrackStepRow key={step.id} step={step} isLast={i === STEPS.length - 1} delay={300 + (i * 100)} />
            ))}
          </View>
        </Animated.View>

        {/* ── Order Items ── */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.card}>
          <Text style={styles.cardTitle}>Order Items ({ORDER_ITEMS.length})</Text>
          {ORDER_ITEMS.map((item, i) => (
            <View key={item.id} style={[styles.itemRow, i < ORDER_ITEMS.length - 1 && styles.itemRowBorder]}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty: {item.qty}</Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
            </View>
          ))}
        </Animated.View>
        
        {/* ── Help Actions ── */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.card}>
          <Text style={styles.cardTitle}>Need Help?</Text>
          {[
            { icon: RotateCcw,       label: 'Request a Return',    sub: 'Raise a return request',         color: '#F59E0B' },
            { icon: MessageCircle,   label: 'Chat with Support',   sub: 'Get help from our team',         color: '#FF5C8A' },
            { icon: Phone,           label: 'Call Support',        sub: '+91 98765 43210',                color: '#10B981' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity key={action.label} style={styles.helpRow} activeOpacity={0.8}>
                <View style={[styles.helpIconWrap, { backgroundColor: action.color + '18' }]}>
                  <Icon size={18} color={action.color} />
                </View>
                <View style={styles.helpInfo}>
                  <Text style={styles.helpLabel}>{action.label}</Text>
                  <Text style={styles.helpSub}>{action.sub}</Text>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </Animated.View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F8FC' },

  // Header gradient
  headerGradient: { paddingHorizontal: 16, paddingBottom: 0 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  headerOrderId: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  orderIdRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  copiedText: { fontSize: 11, color: '#fff', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },

  // ETA card
  etaCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: -24,
    marginHorizontal: 0,
    shadowColor: '#FF5C8A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 6,
    zIndex: 10
  },
  etaLeft: {},
  etaLabel: { fontSize: 12, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  etaTime: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  etaStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  etaStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF5C8A' },
  etaStatusText: { fontSize: 13, fontWeight: '600', color: '#FF5C8A' },
  etaRight: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center' },

  // Map
  mapWrap: { height: 200, position: 'relative', marginTop: 40, marginHorizontal: 16, borderRadius: 24, overflow: 'hidden' },
  mapImage: { width: '100%', height: '100%' },
  mapOverlay: { position: 'absolute', inset: 0 } as any,
  driverPin: { position: 'absolute', top: '40%', left: '45%', alignItems: 'center' },
  driverPinInner: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  driverPinTail: { width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#fff' },
  destPin: { position: 'absolute', top: '25%', right: '25%' },
  destPinInner: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FF5C8A', justifyContent: 'center', alignItems: 'center', shadowColor: '#FF5C8A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  mapLiveChip: { position: 'absolute', bottom: 14, right: 14, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  mapLiveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' },
  mapLiveText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // Card
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, marginBottom: 16, letterSpacing: -0.3 },

  // Driver
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  driverAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FF5C8A', justifyContent: 'center', alignItems: 'center' },
  driverAvatarText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 3 },
  driverRole: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  driverActions: { flexDirection: 'row', gap: 10 },
  driverActionBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.gray100, justifyContent: 'center', alignItems: 'center' },

  // Timeline
  timeline: { paddingTop: 4 },
  stepRow: { flexDirection: 'row', gap: 16 },
  stepTimeline: { alignItems: 'center', width: 36, position: 'relative' },
  stepPulseRing: { position: 'absolute', top: -4, width: 44, height: 44, borderRadius: 22, borderWidth: 2, opacity: 0.3 },
  stepDot: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  stepLine: { width: 2, flex: 1, minHeight: 24, marginVertical: 4 },
  stepContent: { flex: 1, paddingBottom: 24 },
  stepLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  stepLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  stepLabelActive: { color: '#FF5C8A' },
  stepLabelPending: { color: colors.textTertiary, fontWeight: '600' },
  stepSub: { fontSize: 13, color: colors.textSecondary, fontWeight: '500', marginBottom: 3 },
  stepSubPending: { color: colors.textTertiary },
  stepTime: { fontSize: 12, color: colors.textTertiary, fontWeight: '500' },
  stepTimePending: { color: colors.gray300 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF0F5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF5C8A' },
  liveText: { fontSize: 10, fontWeight: '800', color: '#FF5C8A', letterSpacing: 0.5 },

  // Items
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  itemImage: { width: 64, height: 64, borderRadius: 12 },
  itemInfo: { flex: 1 },
  itemBrand: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 2 },
  itemName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, lineHeight: 18, marginBottom: 3 },
  itemQty: { fontSize: 12, color: colors.textSecondary },
  itemPrice: { fontSize: 15, fontWeight: '800', color: '#FF5C8A' },

  // Help
  helpRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  helpIconWrap: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  helpInfo: { flex: 1 },
  helpLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  helpSub: { fontSize: 12, color: colors.textSecondary },
});
