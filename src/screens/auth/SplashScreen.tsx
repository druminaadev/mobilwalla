import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { designTokens } from '@/theme/tokens';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2A1F1A', '#1A1A1A']}
        style={styles.background}
      />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.logo}>HAIR AHMEDABAD</Text>
        <Text style={styles.tagline}>Premium Salon Experience</Text>
        <View style={styles.divider} />
        <Text style={styles.location}>Ahmedabad, Gujarat</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
  },
  logo: {
    fontSize: 42,
    fontWeight: designTokens.typography.weights.bold,
    color: designTokens.colors.primary,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: designTokens.spacing.md,
  },
  tagline: {
    fontSize: 16,
    fontWeight: designTokens.typography.weights.regular,
    color: designTokens.colors.white,
    opacity: 0.8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: designTokens.colors.primary,
    marginVertical: designTokens.spacing.lg,
    opacity: 0.5,
  },
  location: {
    fontSize: 13,
    color: designTokens.colors.textSubtle,
    textAlign: 'center',
  },
});
