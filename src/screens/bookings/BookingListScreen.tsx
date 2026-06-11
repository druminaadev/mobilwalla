import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Calendar, Clock, Plus, ChevronRight, MapPin, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookingsStackParamList } from '../../types/navigation';
import { DEMO_BOOKINGS } from '../../data/demo';
import { BookingStatus } from '../../types/models';
import { colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<BookingsStackParamList, 'BookingList'>;

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

const STATUS_CONFIG: Record<string, { color: string, bg: string, label: string }> = {
  'confirmed': { color: '#3B82F6', bg: '#DBEAFE', label: 'Confirmed' },
  'pending': { color: '#F59E0B', bg: '#FEF3C7', label: 'Pending' },
  'completed': { color: '#10B981', bg: '#D1FAE5', label: 'Completed' },
  'cancelled': { color: '#EF4444', bg: '#FEE2E2', label: 'Cancelled' },
  'in_progress': { color: '#8B5CF6', bg: '#EDE9FE', label: 'Checked In' },
  'rescheduled': { color: '#64748B', bg: '#F1F5F9', label: 'No Show' },
};

export default function BookingListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const rootNav = useNavigation<any>();
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handleFabPressIn  = () => Animated.spring(pressAnim, { toValue: 0.95, useNativeDriver: true }).start();
  const handleFabPressOut = () => Animated.spring(pressAnim, { toValue: 1,    useNativeDriver: true }).start();
  const handleNewBooking  = () => rootNav.navigate('HomeTab');

  const bookings = DEMO_BOOKINGS.filter((b) => {
    if (activeTab === 'Upcoming') return ['confirmed', 'pending', 'in_progress'].includes(b.status);
    if (activeTab === 'Completed') return b.status === 'completed';
    return b.status === 'cancelled' || b.status === 'rescheduled';
  });

  const renderBooking = ({ item }: { item: typeof DEMO_BOOKINGS[0] }) => {
    const statusConfig = STATUS_CONFIG[item.status] ?? STATUS_CONFIG['confirmed'];
    
    return (
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => navigation.navigate('BookingDetail', { id: item.id })} 
        style={styles.bookingCard}
      >
        <View style={styles.cardHeader}>
          <View style={styles.salonInfo}>
            <Text style={styles.salonName} numberOfLines={1}>{item.salonName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
            </View>
          </View>
          <Text style={styles.amount}>₹{item.totalAmount}</Text>
        </View>

        <Text style={styles.services} numberOfLines={2}>{item.serviceNames.join(' • ')}</Text>

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Calendar size={14} color={colors.textTertiary} />
              <Text style={styles.metaText}>
                {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.textTertiary} />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>
          </View>
          
          <View style={styles.actionBtn}>
            <Text style={styles.actionText}>{activeTab === 'Completed' ? 'Review' : 'Details'}</Text>
            <ChevronRight size={14} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* ── Tabs ── */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── List ── */}
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Calendar size={48} color={colors.gray200} />
            <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} bookings</Text>
            <Text style={styles.emptySub}>When you book a service, it will appear here.</Text>
          </View>
        }
      />

      {/* ── Floating Action Button ── */}
      <Animated.View style={[styles.fabWrap, { transform: [{ scale: pressAnim }] }]}>
        <TouchableOpacity
          onPress={handleNewBooking}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          activeOpacity={0.9}
        >
          <LinearGradient colors={['#FF5C8A', '#FF3366']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.fab}>
            <Sparkles size={20} color="#fff" />
            <Text style={styles.fabText}>Book Service</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  
  // Header
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  
  // Tabs
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: colors.white, padding: 4, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.white, fontWeight: '700' },
  
  // List
  list: { paddingHorizontal: 20, paddingBottom: 120 },
  
  // Card
  bookingCard: { backgroundColor: colors.white, borderRadius: 20, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: colors.gray100 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  salonInfo: { flex: 1, alignItems: 'flex-start' },
  salonName: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  amount: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  
  services: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  
  cardDivider: { height: 1, backgroundColor: colors.gray100, marginBottom: 12 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.gray300 },
  
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.primaryLight, borderRadius: 12 },
  actionText: { fontSize: 13, fontWeight: '700', color: colors.primary },

  // Empty State
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 16 },
  emptySub: { fontSize: 14, color: colors.textSecondary, marginTop: 4, textAlign: 'center', paddingHorizontal: 40 },

  // FAB
  fabWrap: { position: 'absolute', bottom: 30, alignSelf: 'center', shadowColor: '#FF5C8A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  fab: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 16, borderRadius: 32 },
  fabText: { fontSize: 16, fontWeight: '700', color: colors.white },
});
