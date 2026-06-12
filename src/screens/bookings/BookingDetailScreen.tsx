import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Dimensions, StatusBar, Linking, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar, Clock, MapPin, Navigation, User, QrCode, Scissors, Download } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { BookingsStackParamList } from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { DEMO_SALONS, DEMO_STAFF, DEMO_SERVICES } from '@/data/demo';
import { Booking, BookingStatus } from '@/types/models';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type Props = NativeStackScreenProps<BookingsStackParamList, 'BookingDetail'>;

const { width } = Dimensions.get('window');

const STATUS_COLOR: Record<string, string> = {
  'confirmed': colors.primary,
  'pending': colors.warning,
  'completed': colors.success,
  'cancelled': colors.error,
  'rescheduled': colors.info,
};

export default function BookingDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  
  // Try to mock a booking. In reality, we would fetch it from an API using the id.
  const booking: Booking = {
      id: id || 'BKG-84920X',
      salonId: DEMO_SALONS[0].id,
      salonName: DEMO_SALONS[0].name,
      salonImage: DEMO_SALONS[0].coverImageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
      services: [DEMO_SERVICES.s1[0], DEMO_SERVICES.s1[1]],
      staff: DEMO_STAFF.s1[0],
      date: new Date().toISOString(),
      time: '14:00',
      status: 'confirmed',
      totalAmount: 2300,
      paymentStatus: 'SUCCESS',
      paymentMethod: 'upi',
      createdAt: new Date().toISOString()
  };

  const salon = DEMO_SALONS.find((s) => s.id === booking.salonId) ?? DEMO_SALONS[0];
  const staff = booking.staff;

  const isUpcoming = ['confirmed', 'pending', 'rescheduled'].includes(booking.status);
  const statusColor = STATUS_COLOR[booking.status] ?? colors.textSecondary;

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel your appointment? This action cannot be undone.', [
      { text: 'No, Keep it', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Header Actions - Moved outside ScrollView for reliable touch events */}
      <View style={[styles.headerActions, { top: insets.top + 10, zIndex: 100 }]}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.navigate('MyBookings')}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Pass</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Section */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.heroContainer}>
          <Image source={{ uri: booking.salonImage }} style={styles.heroImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroOverlay}
          />
          
          {/* Salon Info Overlay */}
          <View style={styles.heroBottomContent}>
            <Text style={styles.heroSalonName}>{booking.salonName}</Text>
            <View style={styles.heroLocationRow}>
              <MapPin size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroLocationText}>{salon.addressLine1}, {salon.city}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.contentWrapper}>
          {/* Glassmorphic Pass Card */}
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.passCard}>
            <View style={styles.passHeader}>
              <View>
                <Text style={styles.passLabel}>BOOKING ID</Text>
                <Text style={styles.passId}>#{booking.id.toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>{booking.status.toUpperCase()}</Text>
              </View>
            </View>
            
            {/* QR Code Mock */}
            <View style={styles.qrContainer}>
              <QrCode size={80} color={colors.textPrimary} strokeWidth={1} />
              <Text style={styles.scanText}>Show this at the reception</Text>
            </View>
            
            {/* Dashed Separator */}
            <View style={styles.passSeparatorContainer}>
              <View style={styles.passCutoutLeft} />
              <View style={styles.passDashedLine} />
              <View style={styles.passCutoutRight} />
            </View>

            {/* Appointment Details Grid */}
            <View style={styles.passDetailsGrid}>
              <View style={styles.passDetailCol}>
                <Text style={styles.passDetailLabel}>Date</Text>
                <View style={styles.passDetailValRow}>
                  <Calendar size={16} color={colors.primary} />
                  <Text style={styles.passDetailValue}>
                    {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
              </View>
              <View style={styles.passDetailCol}>
                <Text style={styles.passDetailLabel}>Time</Text>
                <View style={styles.passDetailValRow}>
                  <Clock size={16} color={colors.primary} />
                  <Text style={styles.passDetailValue}>{booking.time}</Text>
                </View>
              </View>
              <View style={[styles.passDetailCol, { borderRightWidth: 0 }]}>
                <Text style={styles.passDetailLabel}>Stylist</Text>
                <View style={styles.passDetailValRow}>
                  <User size={16} color={colors.primary} />
                  <Text style={styles.passDetailValue} numberOfLines={1}>{staff?.name ?? "Any"}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Invoice Section */}
          <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <View style={styles.invoiceCard}>
              <View style={styles.invoiceHeader}>
                <Text style={styles.invoiceHeaderTitle}>Services</Text>
                <Text style={styles.invoiceHeaderTitle}>Price</Text>
              </View>
              
              {booking.services.map((svc, i) => (
                <View key={i} style={styles.invoiceRow}>
                  <View style={styles.invoiceItemLeft}>
                    <Scissors size={14} color={colors.textSecondary} />
                    <View>
                      <Text style={styles.invoiceItemName}>{svc.name}</Text>
                      <Text style={styles.invoiceItemDesc}>{svc.duration} mins</Text>
                    </View>
                  </View>
                  <Text style={styles.invoiceItemPrice}>₹{svc.discountedPrice || svc.price}</Text>
                </View>
              ))}

              <View style={styles.invoiceDashedDivider} />

              <View style={styles.invoiceSummaryRow}>
                <Text style={styles.invoiceSummaryLabel}>Subtotal</Text>
                <Text style={styles.invoiceSummaryValue}>₹{booking.services.reduce((acc, curr) => acc + (curr.discountedPrice || curr.price), 0)}</Text>
              </View>
              <View style={styles.invoiceSummaryRow}>
                <Text style={styles.invoiceSummaryLabel}>Taxes & Fees</Text>
                <Text style={styles.invoiceSummaryValue}>₹{Math.round(booking.services.reduce((acc, curr) => acc + (curr.discountedPrice || curr.price), 0) * 0.18)}</Text>
              </View>

              <View style={styles.invoiceSolidDivider} />

              <View style={styles.invoiceTotalRow}>
                <Text style={styles.invoiceTotalLabel}>Total Paid</Text>
                <Text style={styles.invoiceTotalValue}>₹{booking.totalAmount}</Text>
              </View>
              <View style={styles.paymentMethodRow}>
                <Text style={styles.paymentMethodText}>Paid via {booking.paymentMethod?.toUpperCase()}</Text>
                <Text style={styles.paymentStatusText}>✓ SUCCESS</Text>
              </View>

              <View style={styles.invoiceDashedDivider} />

              <TouchableOpacity 
                style={styles.downloadInvoiceBtn}
                onPress={() => {
                  Alert.alert(
                    'Download Started', 
                    'Your invoice is downloading...', 
                    [{ text: 'OK', onPress: () => setTimeout(() => Alert.alert('Success', 'Invoice downloaded successfully to your device!'), 800) }]
                  );
                }}
              >
                <Download size={18} color={colors.primary} />
                <Text style={styles.downloadInvoiceText}>Download Invoice</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Salon Location Actions */}
          <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.section}>
             <Button 
                title="Get Directions" 
                variant="outline" 
                icon={<Navigation size={18} color={colors.primary} />} 
                style={styles.actionButtonOutline} 
                onPress={() => {
                  const address = encodeURIComponent(`${salon.name}, ${salon.addressLine1}, ${salon.city}`);
                  const url = Platform.select({
                    ios: `maps:0,0?q=${address}`,
                    android: `geo:0,0?q=${address}`,
                  });
                  if (url) {
                    Linking.openURL(url).catch(() => {
                      Alert.alert('Error', 'Unable to open maps application.');
                    });
                  }
                }}
             />
          </Animated.View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      {isUpcoming && (
        <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
          <Button 
            title="Cancel" 
            onPress={handleCancel} 
            variant="outline" 
            style={[styles.footerBtn, { borderColor: colors.error, backgroundColor: '#FFF0F0' }]}
            textStyle={{ color: colors.error }}
          />
          <Button 
            title="Reschedule" 
            onPress={() => navigation.navigate('Reschedule', { bookingId: id })} 
            style={styles.footerBtn} 
          />
        </View>
      )}

      {booking.status === 'completed' && (
        <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
          <Button 
            title="Write a Review" 
            onPress={() => navigation.navigate('WriteReview', { bookingId: id })} 
            fullWidth 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    ...typography.h4,
    color: '#FFF',
    letterSpacing: 0.5,
  },
  heroBottomContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  heroSalonName: {
    ...typography.h3,
    color: '#FFF',
    marginBottom: 6,
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroLocationText: {
    ...typography.body2,
    color: 'rgba(255,255,255,0.9)',
  },
  contentWrapper: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
  },
  passCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingTop: 20,
    marginTop: -60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 24,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  passLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  passId: {
    ...typography.h4,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  scanText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 12,
  },
  passSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  passCutoutLeft: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gray50,
    position: 'absolute',
    left: -15,
    zIndex: 2,
  },
  passCutoutRight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gray50,
    position: 'absolute',
    right: -15,
    zIndex: 2,
  },
  passDashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderStyle: 'dashed',
    marginHorizontal: 15,
  },
  passDetailsGrid: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFA',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  passDetailCol: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.gray200,
    paddingHorizontal: 5,
  },
  passDetailLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: 8,
  },
  passDetailValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  passDetailValue: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  invoiceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  invoiceHeaderTitle: {
    ...typography.subtitle2,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  invoiceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  invoiceItemName: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  invoiceItemDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  invoiceItemPrice: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  invoiceDashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  invoiceSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  invoiceSummaryLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  invoiceSummaryValue: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  invoiceSolidDivider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 16,
  },
  invoiceTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  invoiceTotalLabel: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  invoiceTotalValue: {
    ...typography.h2,
    color: colors.primary,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  paymentStatusText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '700',
  },
  downloadInvoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  downloadInvoiceText: {
    ...typography.subtitle2,
    color: colors.primary,
  },
  actionButtonOutline: {
    backgroundColor: '#FFF',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    backgroundColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  footerBtn: {
    flex: 1,
  },
});
