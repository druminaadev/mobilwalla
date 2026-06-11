import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Dimensions, Animated, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OB } from '../../constants/onboarding';
import { NavigationButtons } from '../../components/onboarding/NavigationButtons';
import BottomCard from '../../components/onboarding/BottomCard';

const { width, height } = Dimensions.get('window');

interface Props { onNext: () => void; onPrev: () => void; onSkip: () => void; }

export default function Onboarding3({ onNext, onPrev, onSkip }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={OB.bg} />

      <View style={styles.topRow}>
        <TouchableOpacity onPress={onSkip} activeOpacity={0.8} style={styles.skipWrap}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.mockupWrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Image
          source={require('../../../assets/onboarding/home-preview.png')}
          style={styles.mockupImg}
          resizeMode="contain"
        />
      </Animated.View>

      <BottomCard>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.heading}>
            <Text style={styles.gold}>Seamless</Text>
            <Text style={styles.dark}>{' Salon\nBooking Experience'}</Text>
          </Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          </Text>
          <NavigationButtons
            onPrevious={onPrev}
            onNext={onNext}
            showPrevious
            total={3}
            activeIndex={0}
          />
        </Animated.View>
      </BottomCard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: OB.bg },
  topRow:     { paddingHorizontal: 28, paddingTop: 8, alignItems: 'flex-end' },
  skipWrap:   { paddingVertical: 6, paddingHorizontal: 4 },
  skip:       { fontSize: 16, fontWeight: '600', color: OB.gold },
  mockupWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  mockupImg:  { width: width * 0.82, height: height * 0.46 },
  heading:    { fontSize: 34, fontWeight: '700', lineHeight: 42, textAlign: 'center', marginBottom: 14 },
  gold:       { color: OB.gold },
  dark:       { color: OB.textPrimary },
  description:{ fontSize: 16, color: OB.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: 32, alignSelf: 'center', width: '90%' },
});
