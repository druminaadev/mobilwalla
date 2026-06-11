import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { AuthButton } from '../../components/auth/AuthButton';
import { A } from '../../constants/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'AuthSuccess'>;

export default function AuthSuccessScreen({ navigation }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce-in checkmark
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto redirect after 2s
    const id = setTimeout(() => navigation.replace('Login'), 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Animated.View style={[styles.circle, { opacity, transform: [{ scale }] }]}>
          <Text style={styles.check}>✓</Text>
        </Animated.View>

        <Animated.View style={{ opacity }}>
          <Text style={styles.title}>Account Created{'\n'}Successfully!</Text>
          <Text style={styles.sub}>Welcome to the family. Redirecting you to login…</Text>
        </Animated.View>
      </View>

      <View style={styles.btnWrap}>
        <AuthButton title="Go to Sign In" onPress={() => navigation.replace('Login')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: A.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: A.hPad,
    gap: 32,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: A.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: A.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  check: { fontSize: 52, color: '#0F172A', fontWeight: '700' },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: A.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
  },
  sub: {
    fontSize: A.bodySize,
    color: A.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  btnWrap: { paddingHorizontal: A.hPad, paddingBottom: 40 },
});
