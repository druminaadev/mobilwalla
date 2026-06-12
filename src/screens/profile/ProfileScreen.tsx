import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { 
  User, 
  MapPin, 
  Settings, 
  Bell, 
  HelpCircle, 
  LogOut, 
  Wallet, 
  Camera, 
  Heart,
  ChevronRight,
  ShieldCheck,
  Crown
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';

import { ProfileStackParamList } from '../../types/navigation';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { DEMO_WALLET } from '../../data/demo';
import { SkeletonLoader } from '../../components/home/SkeletonLoader';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mock Data
  const userName = user?.name || "Jane Doe";
  const userPhone = user?.phone || "+91 98765 43210";
  const avatarUrl = user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    // In a real app, upload this image
  };

  const handleLogout = () => {
    logout();
  };

  const MenuItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    color, 
    onPress, 
    delay = 0,
    rightElement
  }: any) => (
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <Icon size={22} color={color} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            {rightElement ? rightElement : <ChevronRight size={20} color={colors.textTertiary} />}
        </TouchableOpacity>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <SkeletonLoader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero Area */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <LinearGradient
                colors={[colors.primary, '#0A3245']}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <View style={[styles.headerContent, { paddingTop: insets.top + 20 }]}>
                <View style={styles.avatarWrapper}>
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage} activeOpacity={0.8}>
                        <Camera size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userPhone}>{userPhone}</Text>
            </View>
        </Animated.View>

        {/* VIP Membership Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.cardContainer}>
            <LinearGradient
                colors={['#1A1A1A', '#333333']}
                style={styles.vipCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.vipHeader}>
                    <View>
                        <Text style={styles.vipTitle}>Gold Member</Text>
                        <Text style={styles.vipSubtitle}>Hair Ahmedabad Exclusive</Text>
                    </View>
                    <Crown size={28} color="#FFD700" />
                </View>

                <View style={styles.vipFooter}>
                    <View>
                        <Text style={styles.vipLabel}>Wallet Balance</Text>
                        <Text style={styles.vipValue}>₹{DEMO_WALLET.balance}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.vipLabel}>Loyalty Points</Text>
                        <Text style={styles.vipValue}>{DEMO_WALLET.loyaltyPoints} pt</Text>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
            <Text style={styles.sectionHeader}>Account Settings</Text>
            <MenuItem 
                icon={User} 
                color={colors.primary} 
                title="Edit Profile" 
                subtitle="Update your personal details"
                onPress={() => navigation.navigate('EditProfile')}
                delay={200}
            />
            <MenuItem 
                icon={Crown} 
                color="#F9D423" 
                title="Memberships" 
                subtitle="View and upgrade VIP plans"
                onPress={() => navigation.navigate('MembershipPlans')}
                delay={225}
            />
            <MenuItem 
                icon={Wallet} 
                color={colors.success} 
                title="My Wallet" 
                subtitle="Balance & Payment Methods"
                onPress={() => navigation.navigate('WalletHome')}
                delay={250}
            />
            <MenuItem 
                icon={MapPin} 
                color="#2196F3" 
                title="Saved Addresses" 
                subtitle="Manage home & work addresses"
                onPress={() => navigation.navigate('Addresses')}
                delay={300}
            />
            <MenuItem 
                icon={Heart} 
                color="#E91E63" 
                title="Favorites" 
                subtitle="Your liked salons & styles"
                onPress={() => (navigation as any).navigate('Main', { screen: 'HomeTab', params: { screen: 'Wishlist' } })}
                delay={350}
            />
        </View>

        <View style={styles.menuSection}>
            <Text style={styles.sectionHeader}>App Preferences</Text>
            <MenuItem 
                icon={Bell} 
                color="#FF9800" 
                title="Notifications" 
                subtitle="Manage alerts and promos"
                onPress={() => navigation.navigate('Notifications')}
                delay={400}
            />
            <MenuItem 
                icon={Settings} 
                color={colors.textSecondary} 
                title="Settings" 
                subtitle="Language, Theme, Privacy"
                onPress={() => navigation.navigate('Settings')}
                delay={450}
            />
        </View>

        <View style={styles.menuSection}>
            <Text style={styles.sectionHeader}>Support & More</Text>
            <MenuItem 
                icon={ShieldCheck} 
                color={colors.info} 
                title="Privacy Policy" 
                onPress={() => {}}
                delay={500}
            />
            <MenuItem 
                icon={HelpCircle} 
                color={colors.accent} 
                title="Help Center" 
                subtitle="FAQ & Customer Support"
                onPress={() => navigation.navigate('Help')}
                delay={550}
            />
            <MenuItem 
                icon={LogOut} 
                color={colors.error} 
                title="Log Out" 
                onPress={handleLogout}
                delay={600}
                rightElement={<View />}
            />
        </View>

        <Text style={styles.versionText}>Hair Ahmedabad v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    paddingBottom: 40,
    marginBottom: 10,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    ...typography.h3,
    color: '#FFF',
    marginBottom: 4,
  },
  userPhone: {
    ...typography.body2,
    color: 'rgba(255,255,255,0.8)',
  },
  cardContainer: {
    marginTop: -50,
    paddingHorizontal: 20,
    marginBottom: 24,
    zIndex: 10,
  },
  vipCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  vipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  vipTitle: {
    ...typography.h3,
    color: '#FFD700',
    marginBottom: 4,
  },
  vipSubtitle: {
    ...typography.caption,
    color: '#A0A0A0',
    letterSpacing: 1,
  },
  vipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  vipLabel: {
    ...typography.caption,
    color: '#A0A0A0',
    marginBottom: 4,
  },
  vipValue: {
    ...typography.h3,
    color: '#FFF',
  },
  menuSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    ...typography.subtitle2,
    color: colors.textTertiary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  versionText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 20,
  },
});
