import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Platform
} from "react-native";
import { Download, Share2, Printer } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";
import { AppBar, DashedDivider, TicketCutouts } from "../../components/common/DesignSystem";
import { BookingsStackParamList } from "../../types/navigation";
import { Booking } from "../../types/models";
import { DEMO_SALONS, DEMO_SERVICES, DEMO_STAFF } from "../../data/demo";

type Props = NativeStackScreenProps<BookingsStackParamList, 'EReceipt'>;

const MetaRow = memo(({ label, value }: { label: string; value: string }) => (
  <View style={styles.metaRow}>
    <Text style={styles.metaLabel}>{label}</Text>
    <Text style={styles.metaValue}>{value}</Text>
  </View>
));
MetaRow.displayName = "MetaRow";

const LineItem = memo(({ service, price }: { service: string; price: number }) => (
  <View style={styles.lineItem}>
    <Text style={styles.lineService} numberOfLines={2}>{service}</Text>
    <Text style={styles.linePrice}>₹{price.toFixed(2)}</Text>
  </View>
));
LineItem.displayName = "LineItem";

export default function EReceiptScreen({ navigation, route }: Props) {
  const bookingId = route.params?.bookingId || "BK44231";
  
  // Dummy data
  const booking: Booking = {
      id: bookingId,
      salonId: DEMO_SALONS[0].id,
      salonName: DEMO_SALONS[0].name,
      salonImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
      services: [DEMO_SERVICES.s1[0], DEMO_SERVICES.s1[1]],
      staff: DEMO_STAFF.s1[0],
      date: new Date().toISOString(),
      time: '14:00',
      status: 'completed',
      totalAmount: 2300,
      paymentStatus: 'SUCCESS',
      paymentMethod: 'upi',
      createdAt: new Date().toISOString(),
  };

  const salon = DEMO_SALONS.find(s => s.id === booking.salonId) || DEMO_SALONS[0];
  const subtotal = booking.services.reduce((acc, curr) => acc + (curr.discountedPrice || curr.price), 0);
  const gst = Math.round(subtotal * 0.18);
  const totalPaid = subtotal + gst;

  const handleAction = (action: string) => {
    Alert.alert(`${action} E-Receipt`, 'This functionality will be implemented soon.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar
        title="E-Receipt"
        onBack={() => navigation?.goBack()}
        rightIcon="share"
        onRightPress={() => handleAction('Share')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.receiptContainer}>
            
            {/* Receipt Header */}
            <View style={styles.receiptHeader}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>{salon.name.charAt(0)}</Text>
                </View>
                <Text style={styles.salonName}>{salon.name}</Text>
                <Text style={styles.salonAddress}>{salon.addressLine1}</Text>
                <Text style={styles.receiptTitle}>TAX INVOICE</Text>
            </View>

            {/* Meta Data */}
            <View style={styles.metaSection}>
                <MetaRow label="Booking ID" value={booking.id} />
                <MetaRow label="Date" value={new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
                <MetaRow label="Time" value={booking.time} />
                <MetaRow label="Payment Method" value={booking.paymentMethod?.toUpperCase() || 'CARD'} />
            </View>

            <View style={styles.dividerWrap}>
                <DashedDivider />
                <TicketCutouts bgColor={colors.background} />
            </View>

            {/* Line Items */}
            <View style={styles.itemsSection}>
                <Text style={styles.sectionTitle}>SERVICES</Text>
                {booking.services.map((svc, idx) => (
                    <LineItem key={idx} service={svc.name} price={svc.discountedPrice || svc.price} />
                ))}
            </View>

            <View style={styles.dividerWrap}>
                <DashedDivider />
                <TicketCutouts bgColor={colors.background} />
            </View>

            {/* Summary */}
            <View style={styles.summarySection}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Taxes (18% GST)</Text>
                    <Text style={styles.summaryValue}>₹{gst.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Paid</Text>
                    <Text style={styles.totalValue}>₹{totalPaid.toFixed(2)}</Text>
                </View>
            </View>

            {/* Barcode / Footer */}
            <View style={styles.barcodeSection}>
                {/* A mock barcode made of vertical lines */}
                <View style={styles.barcodeMock}>
                    {Array.from({ length: 45 }).map((_, i) => (
                        <View key={i} style={[styles.barLine, { width: i % 2 === 0 ? 2 : i % 3 === 0 ? 4 : 1, marginRight: i % 4 === 0 ? 4 : 2 }]} />
                    ))}
                </View>
                <Text style={styles.barcodeText}>{booking.id}</Text>
                <Text style={styles.thankYouText}>Thank you for choosing us!</Text>
            </View>

        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('Download')} activeOpacity={0.7}>
                <Download size={20} color={colors.primary} />
                <Text style={styles.actionText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('Print')} activeOpacity={0.7}>
                <Printer size={20} color={colors.primary} />
                <Text style={styles.actionText}>Print</Text>
            </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  receiptContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    paddingTop: 32,
    paddingBottom: 24,
  },
  receiptHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    ...typography.h2,
    color: '#FFF',
  },
  salonName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  salonAddress: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  receiptTitle: {
    ...typography.subtitle2,
    color: colors.textTertiary,
    letterSpacing: 2,
  },
  metaSection: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  metaValue: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  dividerWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  itemsSection: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 16,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  lineService: {
    ...typography.body1,
    color: colors.textPrimary,
    flex: 1,
    paddingRight: 16,
  },
  linePrice: {
    ...typography.subtitle1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.textPrimary,
  },
  summarySection: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.subtitle2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.textPrimary,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  totalLabel: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.h3,
    color: colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  barcodeSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
  },
  barcodeMock: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  barLine: {
    height: '100%',
    backgroundColor: colors.textPrimary,
  },
  barcodeText: {
    ...typography.caption,
    color: colors.textTertiary,
    letterSpacing: 3,
    marginBottom: 24,
  },
  thankYouText: {
    ...typography.subtitle2,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 8,
  },
  actionText: {
    ...typography.subtitle1,
    color: colors.primary,
  },
});
