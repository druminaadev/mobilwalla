import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { A } from '../../constants/auth';

const { height } = Dimensions.get('window');
const HERO_H = height * 0.42;

interface AuthHeroLayoutProps {
  bgImage: ImageSourcePropType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthHeroLayout = memo<AuthHeroLayoutProps>(({ bgImage, title, subtitle, children }) => (
  <SafeAreaView style={styles.safe} edges={['top']}>
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Hero image with teal overlay */}
      <ImageBackground source={bgImage} style={styles.hero} resizeMode="cover">
        <View style={styles.overlay} />
        <View style={styles.heroText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </ImageBackground>

      {/* Floating card overlapping hero */}
      <ScrollView
        style={styles.cardScroll}
        contentContainerStyle={styles.cardContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
));

AuthHeroLayout.displayName = 'AuthHeroLayout';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: A.card },
  kav: { flex: 1 },
  hero: {
    height: HERO_H,
    borderBottomLeftRadius: A.heroR,
    borderBottomRightRadius: A.heroR,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: A.overlay,
  },
  heroText: { padding: 28, paddingBottom: 44 },
  title: {
    fontSize: A.headingSize,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: A.bodySize,
    color: 'rgba(255,255,255,0.90)',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardScroll: {
    flex: 1,
    marginTop: -A.cardR,
    backgroundColor: A.card,
    borderTopLeftRadius: A.cardR,
    borderTopRightRadius: A.cardR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  cardContent: {
    paddingHorizontal: A.hPad,
    paddingTop: 32,
    paddingBottom: 48,
  },
});
