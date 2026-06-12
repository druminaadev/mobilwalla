import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';

export const HomeGreeting = () => {
  const { user } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning ☀️";
    if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
    if (hour >= 17 && hour < 21) return "Good Evening 🌅";
    return "Good Night 🌙";
  };

  return (
    <Animated.View entering={FadeInUp.delay(100)} style={styles.greetingWrap}>
      <Text style={styles.greetingTitle}>{getGreeting()}</Text>
      <Text style={styles.greetingSub}>{user?.name ? `${user.name}, ready` : 'Ready'} for your next salon visit?</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  greetingWrap: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 },
  greetingTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  greetingSub: { fontSize: 14, color: colors.textSecondary, fontWeight: '500', marginTop: 2 },
});
