import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Dimensions, Animated, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Scissors, Wind, Brush } from 'lucide-react-native';
import { OB } from '../../constants/onboarding';

const { width, height } = Dimensions.get('window');

interface Props { onNext: () => void; onSignIn: () => void; }

export default function Onboarding1({ onNext, onSignIn }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Background pattern */}
      <View style={styles.bgPattern} pointerEvents="none">
        <Scissors size={64} color={OB.teal} style={[styles.pi, { top: 60,  left: 20,  transform: [{ rotate: '-30deg' }] }]} opacity={0.05} />
        <Wind     size={56} color={OB.teal} style={[styles.pi, { top: 110, right: 24 }]}                                      opacity={0.05} />
        <Brush    size={52} color={OB.teal} style={[styles.pi, { top: 230, left: 10,  transform: [{ rotate: '20deg'  }] }]} opacity={0.05} />
        <Scissors size={48} color={OB.gold} style={[styles.pi, { bottom: 260, right: 12, transform: [{ rotate: '45deg' }] }]}  opacity={0.05} />
        <Wind     size={60} color={OB.gold} style={[styles.pi, { bottom: 200, left: 16 }]}                                    opacity={0.05} />
      </View>

      {/* Hero + floating service cards */}
      <View style={styles.heroSection}>
        <Animated.View style={[styles.cardsCol, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.sCard}><Image source={require('../../../assets/onboarding/service1.png')} style={styles.sImg} /></View>
          <View style={styles.sCard}><Image source={require('../../../assets/onboarding/service2.png')} style={styles.sImg} /></View>
          <View style={styles.sCard}><Image source={require('../../../assets/onboarding/service3.png')} style={styles.sImg} /></View>
        </Animated.View>
        <Animated.Image
          source={require('../../../assets/onboarding/stylist.png')}
          style={[styles.heroImg, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.heading}>
          <Text style={styles.gold}>Beauty Salon</Text>
          <Text style={styles.dark}>{' & Barber\nBooking Made Easy'}</Text>
        </Text>

        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        </Text>

        <TouchableOpacity style={styles.ctaBtn} onPress={onNext} activeOpacity={0.88}>
          <Text style={styles.ctaText}>Let's Get Started</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onSignIn} activeOpacity={0.8}>
            <Text style={styles.signIn}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: OB.bg },
  bgPattern:   { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  pi:          { position: 'absolute' },

  heroSection: {
    flex: 1, flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 16, paddingBottom: 8, zIndex: 1,
  },

  cardsCol: { gap: 10, marginRight: -10, zIndex: 2, paddingBottom: 24 },
  sCard: {
    width: 80, height: 80, borderRadius: 20, overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 20, elevation: 5,
  },
  sImg: { width: '100%', height: '100%' },

  heroImg: { width: width * 0.72, height: height * 0.42, borderRadius: 24, alignSelf: 'flex-end' },

  content: { paddingHorizontal: 28, paddingBottom: 12, alignItems: 'center', zIndex: 1 },

  heading: { fontSize: 34, fontWeight: '700', lineHeight: 42, textAlign: 'center', marginBottom: 14 },
  gold:    { color: OB.gold },
  dark:    { color: OB.textPrimary },

  description: {
    fontSize: 16, color: OB.textMuted, textAlign: 'center',
    lineHeight: 24, width: '85%', marginBottom: 28,
  },

  ctaBtn: {
    width: '85%', height: 60, borderRadius: 30,
    backgroundColor: OB.teal, justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    shadowColor: OB.teal, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30, shadowRadius: 16, elevation: 8,
  },
  ctaText: { fontSize: 18, fontWeight: '600', color: '#fff' },

  footerRow: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 15, color: OB.textMuted },
  signIn:     { fontSize: 15, fontWeight: '600', color: OB.gold, textDecorationLine: 'underline' },
});
