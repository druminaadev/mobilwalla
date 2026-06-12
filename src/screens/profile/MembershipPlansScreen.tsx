import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown, FadeIn } from 'react-native-reanimated';
import { Check, Star, ArrowRight, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileStackParamList } from '../../types/navigation';
import { typography } from '../../constants/typography';
import { DEMO_MEMBERSHIPS } from '../../data/demo';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MembershipPlans'>;

const { width, height } = Dimensions.get('window');
const AUTO_SLIDE_INTERVAL = 3500; // 3.5 seconds

export default function MembershipPlansScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSelectPlan = (planId: string) => {
    navigation.navigate('MembershipCheckout', { planId });
  };

  // Auto Slider Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % DEMO_MEMBERSHIPS.length;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      {/* Absolute Close Button */}
      <TouchableOpacity
        style={[styles.closeBtn, { top: insets.top + 16 }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <View style={styles.closeBtnInner}>
          <X size={24} color="#FFF" />
        </View>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={width}
        bounces={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {DEMO_MEMBERSHIPS.map((plan, index) => {
          const isPopular = plan.isPopular;

          return (
            <View key={plan.id} style={styles.pageContainer}>
              <ImageBackground
                source={{ uri: plan.imageUrl }}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
                  style={styles.gradientOverlay}
                />

                <View style={[styles.contentContainer, { paddingBottom: insets.bottom + 40 }]}>
                  <Animated.View entering={FadeInDown.delay(200).springify()}>
                    {isPopular && (
                      <View style={styles.badgeWrap}>
                        <Star size={12} color="#FFF" fill="#FFF" />
                        <Text style={styles.badgeText}>MOST POPULAR</Text>
                      </View>
                    )}
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planTagline}>{plan.tagline}</Text>

                    <View style={styles.priceWrap}>
                      <Text style={styles.priceSymbol}>₹</Text>
                      <Text style={styles.priceAmount}>{plan.price}</Text>
                      <Text style={styles.priceDuration}> / {plan.durationMonths} months</Text>
                    </View>
                  </Animated.View>

                  <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.glassCard}>
                    <Text style={styles.benefitsTitle}>Exclusive Benefits</Text>
                    <View style={styles.benefitsList}>
                      {plan.benefits.map((benefit, bIdx) => (
                        <View key={bIdx} style={styles.benefitItem}>
                          <View style={[styles.checkCircle, { backgroundColor: plan.colorStart }]}>
                            <Check size={12} color="#FFF" />
                          </View>
                          <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </Animated.View>

                  <Animated.View entering={FadeIn.delay(400)} style={styles.footerWrap}>
                    <TouchableOpacity
                      style={styles.ctaButton}
                      activeOpacity={0.9}
                      onPress={() => handleSelectPlan(plan.id)}
                    >
                      <LinearGradient
                        colors={[plan.colorStart, plan.colorEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.ctaGradient}
                      >
                        <Text style={styles.ctaText}>Get {plan.name}</Text>
                        <ArrowRight size={20} color="#FFF" />
                      </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.paginationDots}>
                      {DEMO_MEMBERSHIPS.map((_, dotIdx) => (
                        <View
                          key={dotIdx}
                          style={[
                            styles.dot,
                            index === dotIdx ? { backgroundColor: plan.colorEnd, width: 24 } : {}
                          ]}
                        />
                      ))}
                    </View>
                  </Animated.View>

                </View>
              </ImageBackground>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeBtn: {
    position: 'absolute',
    left: 20,
    zIndex: 100,
  },
  closeBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
    }),
  },
  pageContainer: {
    width: width,
    height: height,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1.5,
  },
  planName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -1,
    marginBottom: 8,
    lineHeight: 52,
  },
  planTagline: {
    ...typography.h4,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '400',
    marginBottom: 24,
  },
  priceWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 32,
  },
  priceSymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 4,
  },
  priceAmount: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFF',
  },
  priceDuration: {
    ...typography.subtitle1,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
  },
  glassCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 32,
  },
  benefitsTitle: {
    ...typography.subtitle2,
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    ...typography.body1,
    color: 'rgba(255,255,255,0.95)',
    flex: 1,
  },
  footerWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 24,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  paginationOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  paginationDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
