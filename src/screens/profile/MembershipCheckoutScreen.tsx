import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileStackParamList } from '../../types/navigation';
import { DashedDivider } from '../../components/common/DesignSystem';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { DEMO_MEMBERSHIPS } from '../../data/demo';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MembershipCheckout'>;

const { width } = Dimensions.get('window');

export default function MembershipCheckoutScreen({ navigation, route }: Props) {
  const { planId } = route.params;
  const plan = DEMO_MEMBERSHIPS.find(p => p.id === planId) || DEMO_MEMBERSHIPS[0];
  const insets = useSafeAreaInsets();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card'>('upi');

  const gst = Math.round(plan.price * 0.18);
  const total = plan.price + gst;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful!',
        `Your ${plan.name} is now active. Enjoy your VIP benefits!`,
        [
          { 
            text: 'Awesome', 
            onPress: () => {
              navigation.navigate('Profile');
            }
          }
        ]
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        
        {/* Creative Image Header */}
        <Animated.View entering={FadeInUp.duration(600)}>
            <ImageBackground 
                source={{ uri: plan.imageUrl }} 
                style={styles.headerImage}
                imageStyle={styles.headerImageStyle}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)', 'rgba(248,250,252,1)']}
                    locations={[0, 0.4, 1]}
                    style={styles.headerGradient}
                />
                <TouchableOpacity 
                    style={[styles.backBtn, { top: insets.top + 16 }]} 
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>{plan.name}</Text>
                    <Text style={styles.headerSubtitle}>{plan.durationMonths} Months Validity</Text>
                </View>
            </ImageBackground>
        </Animated.View>

        <View style={styles.contentWrap}>
            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.summaryCard}>
            <View style={styles.summaryBody}>
                <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Membership Fee</Text>
                <Text style={styles.priceValue}>₹{plan.price}</Text>
                </View>
                <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Taxes (18% GST)</Text>
                <Text style={styles.priceValue}>₹{gst}</Text>
                </View>
                
                <View style={styles.dividerWrap}>
                <DashedDivider />
                </View>
                
                <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={[styles.totalValue, { color: plan.colorEnd }]}>₹{total}</Text>
                </View>
            </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)}>
                <Text style={styles.sectionTitle}>Payment Method</Text>

                <TouchableOpacity 
                style={[styles.paymentMethodCard, selectedPayment === 'upi' && styles.paymentMethodActive]}
                activeOpacity={0.7}
                onPress={() => setSelectedPayment('upi')}
                >
                <View style={styles.paymentMethodLeft}>
                    <CheckCircle2 size={24} color={selectedPayment === 'upi' ? plan.colorEnd : colors.gray300} />
                    <Text style={styles.paymentMethodText}>UPI (GPay, PhonePe, Paytm)</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity 
                style={[styles.paymentMethodCard, selectedPayment === 'card' && styles.paymentMethodActive]}
                activeOpacity={0.7}
                onPress={() => setSelectedPayment('card')}
                >
                <View style={styles.paymentMethodLeft}>
                    <CheckCircle2 size={24} color={selectedPayment === 'card' ? plan.colorEnd : colors.gray300} />
                    <Text style={styles.paymentMethodText}>Credit / Debit Card</Text>
                </View>
                <CreditCard size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <View style={styles.secureNote}>
                <ShieldCheck size={16} color={colors.success} />
                <Text style={styles.secureNoteText}>Payments are 100% secure and encrypted.</Text>
                </View>
            </Animated.View>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity 
          style={styles.payBtn}
          activeOpacity={0.9}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <LinearGradient
              colors={[plan.colorStart, plan.colorEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.payBtnGradient}
          >
            {isProcessing ? (
                <ActivityIndicator color="#FFF" />
            ) : (
                <Text style={styles.payBtnText}>Pay ₹{total}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerImage: {
    width: width,
    height: 320,
    justifyContent: 'flex-end',
  },
  headerImageStyle: {
    resizeMode: 'cover',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerContent: {
    padding: 24,
    paddingBottom: 32,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...typography.subtitle1,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  contentWrap: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  summaryBody: {
    padding: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceLabel: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  priceValue: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  dividerWrap: {
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  totalLabel: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  sectionTitle: {
    ...typography.subtitle2,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodActive: {
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#FFF',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethodText: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  secureNoteText: {
    ...typography.caption,
    color: colors.success,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'rgba(248,250,252,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  payBtn: {
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  payBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    ...typography.h4,
    color: '#FFF',
    letterSpacing: 0.5,
  },
});
