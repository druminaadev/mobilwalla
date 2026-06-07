import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, MapPin, Settings, Bell, HelpCircle, LogOut, Wallet } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { ProfileCard, StatsCard, MenuButton } from '@/components/profile';
import { DEMO_WALLET, DEMO_BOOKINGS } from '@/data/demo';
import { BookingStatus } from '@/types/models';
import { designTokens } from '@/theme/tokens';

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const unreadNotifs = useNotificationStore((s) => s.unreadCount());

  const totalBookings = DEMO_BOOKINGS.filter((b) => b.status === BookingStatus.COMPLETED).length;
  const { balance, loyaltyPoints } = DEMO_WALLET;

  const menuItems = [
    { icon: User, label: 'Edit Profile', screen: 'EditProfile', badge: 0 },
    { icon: MapPin, label: 'Manage Addresses', screen: 'Addresses', badge: 0 },
    { icon: Wallet, label: 'My Wallet', screen: 'WalletHome', badge: 0 },
    { icon: Bell, label: 'Notifications', screen: 'Notifications', badge: unreadNotifs },
    { icon: Settings, label: 'Settings', screen: 'Settings', badge: 0 },
    { icon: HelpCircle, label: 'Help & Support', screen: 'Help', badge: 0 },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <View style={[styles.headerGradient, { paddingTop: insets.top + 4 }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <ProfileCard
          name={user?.name ?? 'Guest User'}
          phone={user?.phone ?? '9876543210'}
          email={user?.email}
          onEditPhoto={() => navigation.navigate('EditProfile')}
        />

        {/* Stats */}
        <StatsCard bookings={totalBookings} points={loyaltyPoints} wallet={balance} />

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {menuItems.map((item, index) => (
            <MenuButton
              key={index}
              icon={item.icon}
              label={item.label}
              onPress={() => navigation.navigate(item.screen)}
              badge={item.badge}
            />
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <MenuButton icon={LogOut} label="Logout" onPress={logout} isLogout />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <View style={styles.brandRow}>
            <View style={styles.goldDot} />
            <Text style={styles.brand}>Hair Ahmedabad</Text>
          </View>
          <Text style={styles.location}>Ahmedabad, Gujarat, India</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingBottom: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  header: {
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    marginLeft: 4,
  },
  logoutSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  version: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  goldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  brand: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  location: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
