import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';

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
      <LinearGradient colors={['#3A4037', '#FF5C8A']} style={styles.gradient} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.logoText}>HAIR AHMEDABAD</Text>
        <Text style={styles.taglineText}>Premium Salon Experience</Text>
        <View style={styles.divider} />
        <Text style={styles.locationText}>Ahmedabad, Gujarat</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1B2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FF5C8A',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 16,
  },
  taglineText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#FF5C8A',
    marginVertical: 24,
    opacity: 0.5,
  },
  locationText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
