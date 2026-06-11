import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2 } from 'lucide-react-native';
import { colors } from '../../constants/colors';

export const HomeWhyChooseUs = () => {
  return (
    <Animated.View entering={FadeInUp.delay(600)} style={styles.whyUsWrap}>
      <LinearGradient colors={['#FFF0F5', '#FFE4EE']} style={styles.whyUsGradient}>
        <View style={styles.whyUsItem}><CheckCircle2 size={20} color={colors.primary} /><Text style={styles.whyUsText}>Verified Salons</Text></View>
        <View style={styles.whyUsItem}><CheckCircle2 size={20} color={colors.primary} /><Text style={styles.whyUsText}>Best Prices</Text></View>
        <View style={styles.whyUsItem}><CheckCircle2 size={20} color={colors.primary} /><Text style={styles.whyUsText}>Easy Booking</Text></View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  whyUsWrap: { marginHorizontal: 16, marginBottom: 32, borderRadius: 16, overflow: 'hidden' },
  whyUsGradient: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 20 },
  whyUsItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  whyUsText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
});
