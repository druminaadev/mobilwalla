import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, ChevronRight, Clock, Plus, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { BookingStatus, Booking } from '@/types/models';
import { DEMO_BOOKINGS, DEMO_SALONS } from '@/data/demo';
import { SkeletonLoader } from '@/components/home/SkeletonLoader';

type Props = any; // Flexible props for nested navigation handling

type TabType = 'upcoming' | 'completed' | 'cancelled';
const TABS: { id: TabType; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function MyBookingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const rootNav = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredBookings = DEMO_BOOKINGS.filter((booking) => {
    if (activeTab === 'upcoming') {
      return booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'in_progress' || booking.status === 'rescheduled';
    }
    if (activeTab === 'completed') {
      return booking.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return booking.status === 'cancelled';
    }
    return false;
  });

  const handleBookNow = () => {
    rootNav.navigate('Main', {
      screen: 'HomeTab',
      params: {
        screen: 'ServiceSelection',
        params: { salonId: DEMO_SALONS[0].id }
      }
    });
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      case 'confirmed': return colors.primary;
      default: return colors.warning;
    }
  };

  const renderBookingCard = ({ item, index }: { item: Booking; index: number }) => {
    const isUpcoming = activeTab === 'upcoming';
    const isCompleted = activeTab === 'completed';

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).springify()}
        layout={Layout.springify()}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.salonName}>{item.salonName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Image source={{ uri: item.salonImage || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80' }} style={styles.salonImage} />
          <View style={styles.bookingDetails}>
            <Text style={styles.serviceNames} numberOfLines={1}>
              {item.services.map(s => s.name).join(', ')}
            </Text>
            <View style={styles.detailRow}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{item.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{item.time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.price}>${item.totalAmount.toFixed(2)}</Text>
          <View style={styles.actionButtons}>
            {isUpcoming && (
              <>
                <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Reschedule', { bookingId: item.id })}>
                  <Text style={styles.secondaryBtnText}>Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('BookingDetail', { id: item.id })}>
                  <Text style={styles.primaryBtnText}>View Details</Text>
                </TouchableOpacity>
              </>
            )}
            {isCompleted && (
              <>
                <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('WriteReview', { bookingId: item.id })}>
                  <Text style={styles.secondaryBtnText}>Write Review</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('EReceipt', { bookingId: item.id })}>
                  <Text style={styles.primaryBtnText}>E-Receipt</Text>
                </TouchableOpacity>
              </>
            )}
            {!isUpcoming && !isCompleted && (
              <TouchableOpacity style={styles.primaryBtn} onPress={handleBookNow}>
                <Text style={styles.primaryBtnText}>Book Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View entering={FadeInUp.springify()} style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Calendar size={40} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'upcoming'
          ? "You don't have any upcoming appointments. Treat yourself to a salon visit today!"
          : "You don't have any bookings in this section yet."}
      </Text>
      <TouchableOpacity style={styles.bookNowLargeBtn} onPress={handleBookNow} activeOpacity={0.8}>
        <Text style={styles.bookNowLargeText}>Book Now</Text>
        <ChevronRight size={20} color="#FFF" />
      </TouchableOpacity>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>
        <SkeletonLoader />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingCard}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom > 0 ? insets.bottom + 100 : 120 }]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Sticky Bottom Bar */}
      <Animated.View 
        entering={FadeInDown.springify().damping(15)}
        style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20 }]}
      >
        <TouchableOpacity
          onPress={handleBookNow}
          activeOpacity={0.9}
        >
          <LinearGradient colors={['#FF5C8A', '#FF3366']} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.bottomBarBtn}>
            <Sparkles size={20} color="#fff" />
            <Text style={styles.bottomBarText}>Book New Service</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for FAB
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  salonName: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardBody: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  salonImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  bookingDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceNames: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: 16,
  },
  price: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray100,
  },
  secondaryBtnText: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  primaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  primaryBtnText: {
    ...typography.subtitle2,
    color: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 51, 102, 0.1)', // colors.primary light
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 32,
    lineHeight: 22,
  },
  bookNowLargeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  bookNowLargeText: {
    ...typography.subtitle1,
    color: colors.white,
    marginRight: 8,
  },
  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  bottomBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  bottomBarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});
