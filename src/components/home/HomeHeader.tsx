import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { MapPin, ChevronDown, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

interface HomeHeaderProps {
  topInset: number;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ topInset }) => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();

  return (
    <Animated.View entering={SlideInDown.duration(600)} style={[styles.header, { paddingTop: Math.max(topInset, 16) }]}>
      <View style={styles.headerLeft}>
        <MapPin size={18} color={colors.primary} />
        <Text style={styles.locationText}>Mumbai, Maharashtra</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Location')}>
          <ChevronDown size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconBtn}>
          <Bell size={22} color={colors.textPrimary} />
          <View style={styles.badgeDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarWrap} onPress={() => navigation.navigate('ProfileTab' as any)}>
          <LinearGradient colors={['#FF5C8A', '#FF9A9E']} style={styles.avatarBg}>
            <Text style={styles.avatarInitials}>{user?.name?.charAt(0) || 'U'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  badgeDot: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error, borderWidth: 1, borderColor: colors.white },
  avatarWrap: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' },
  avatarBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
