import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  MapPin,
  Shield,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { HomeStackParamList } from "../../types/navigation";
import { useBookingStore } from "../../store/bookingStore";
import { DEMO_SALONS } from "../../data/demo";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";
import { BookingProgress } from "../../components/booking/BookingProgress";
import { Coupon } from "../../types/models";

type Props = NativeStackScreenProps<HomeStackParamList, "BookingSummary">;

const VALID_COUPONS: Record<string, Coupon> = {
  SAVE10: { code: 'SAVE10', discountType: 'percent', discountValue: 10, maxDiscount: 200 },
  WEEKEND20: { code: 'WEEKEND20', discountType: 'percent', discountValue: 20, maxDiscount: 300 },
  FLAT100: { code: 'FLAT100', discountType: 'flat', discountValue: 100 },
};

const bookingFormSchema = z.object({
  couponCode: z.string().trim().optional(),
  specialInstructions: z.string().max(500, "Instructions cannot exceed 500 characters").optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookingSummaryScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { salonId, staffId, date, time } = route.params;
  const { 
    services: selectedServices, 
    staff,
    getSubtotal, 
    getDiscount, 
    getTotal, 
    getTotalDuration,
    getTaxes,
    getStaffPremium,
    coupon,
    applyCoupon,
    setSpecialInstructions,
    specialInstructions
  } = useBookingStore();

  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];

  const [couponError, setCouponError] = useState("");

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      couponCode: coupon?.code || "",
      specialInstructions: specialInstructions || "",
    },
    mode: "onChange"
  });

  const watchCouponCode = watch("couponCode");

  const subtotal = getSubtotal();
  const discountAmt = getDiscount();
  const gst = getTaxes();
  const premiumCharge = getStaffPremium();
  const total = getTotal();

  const applyCode = () => {
    const code = (watchCouponCode || "").toUpperCase();
    if (VALID_COUPONS[code]) {
      applyCoupon(VALID_COUPONS[code]);
      setCouponError("");
    } else {
      setCouponError("Invalid code. Try SAVE10, WEEKEND20 or FLAT100");
      applyCoupon(null);
    }
  };

  const removeCoupon = () => {
    applyCoupon(null);
    setValue("couponCode", "");
    setCouponError("");
  };

  const onProceed = (data: BookingFormData) => {
    setSpecialInstructions(data.specialInstructions || "");
    
    navigation.navigate("Payment", {
      bookingData: {
        salonId,
        staffId,
        date,
        time,
        services: selectedServices,
        total,
      },
    });
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Review Booking</Text>
          <Text style={styles.headerSub}>Confirm your appointment</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <BookingProgress current={4} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Salon hero */}
        <View style={styles.salonCard}>
          <Image
            source={{ uri: salon.coverImageUrl || salon.logoUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80" }}
            style={styles.salonImg}
          />
          <View style={styles.salonInfo}>
            <Text style={styles.salonName}>{salon.name}</Text>
            <View style={styles.salonAddrRow}>
              <MapPin size={12} color={colors.textTertiary} />
              <Text style={styles.salonAddr}>
                {salon.addressLine1}, {salon.city}
              </Text>
            </View>
          </View>
        </View>

        {/* Appointment details */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SlotSelection", { salonId, staffId })}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailGrid}>
            <View style={styles.detailCell}>
              <View style={[styles.detailIcon, { backgroundColor: colors.primaryLight }]}>
                <Calendar size={17} color={colors.primary} />
              </View>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailVal}>
                {new Date(date).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </View>

            <View style={styles.detailCell}>
              <View style={[styles.detailIcon, { backgroundColor: colors.accentLight }]}>
                <Clock size={17} color={colors.accentDark} />
              </View>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailVal}>{time}</Text>
              <Text style={styles.detailSub}>{getTotalDuration()} min</Text>
            </View>

            <View style={[styles.detailCellFull]}>
              <View style={[styles.detailIcon, { backgroundColor: colors.successLight }]}>
                {staff ? <User size={17} color={colors.success} /> : <Zap size={17} color={colors.success} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>Stylist</Text>
                <Text style={styles.detailVal}>
                  {staff ? staff.name : "Any Available Expert"}
                </Text>
              </View>
              {staff?.photo && (
                <Image
                  source={{ uri: staff.photo }}
                  style={styles.staffThumb}
                />
              )}
              <TouchableOpacity onPress={() => navigation.navigate("StaffSelection", { salonId })} style={{ marginLeft: 12 }}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Selected Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ServiceSelection", { salonId, isEditing: true })}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.servicesCard}>
            {selectedServices.map((svc, i) => (
              <View
                key={svc.id}
                style={[
                  styles.svcRow,
                  i < selectedServices.length - 1 && styles.svcRowBorder,
                ]}
              >
                <View style={styles.svcDot} />
                <View style={styles.svcInfo}>
                  <Text style={styles.svcName}>{svc.name}</Text>
                  <Text style={styles.svcMeta}>{svc.duration} min</Text>
                </View>
                {svc.discountedPrice ? (
                  <View style={{alignItems: 'flex-end'}}>
                     <Text style={{...typography.caption, textDecorationLine: 'line-through', color: colors.textTertiary}}>₹{svc.price}</Text>
                     <Text style={styles.svcPrice}>₹{svc.discountedPrice}</Text>
                  </View>
                ) : <Text style={styles.svcPrice}>₹{svc.price}</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Special Instructions</Text>
           <Controller
             control={control}
             name="specialInstructions"
             render={({ field: { onChange, onBlur, value } }) => (
               <TextInput
                 style={[styles.notesInput, errors.specialInstructions && styles.inputError]}
                 placeholder="E.g. I have sensitive skin, please avoid..."
                 placeholderTextColor={colors.textTertiary}
                 multiline
                 numberOfLines={3}
                 value={value}
                 onBlur={onBlur}
                 onChangeText={onChange}
               />
             )}
           />
           {errors.specialInstructions && (
             <Text style={styles.couponError}>{errors.specialInstructions.message}</Text>
           )}
        </View>

        {/* Coupon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          {coupon ? (
            <View style={styles.couponApplied}>
              <CheckCircle2 size={18} color={colors.success} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.couponAppliedTitle}>
                  {coupon.code} applied!
                </Text>
                <Text style={styles.couponAppliedSub}>
                  Saved ₹{discountAmt}
                </Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <XCircle size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.couponRow}>
                <View style={styles.couponInputWrap}>
                  <Tag size={15} color={colors.textTertiary} />
                  <Controller
                    control={control}
                    name="couponCode"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.couponInput}
                        placeholder="Enter promo code"
                        placeholderTextColor={colors.textTertiary}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={(t) => {
                          onChange(t);
                          setCouponError("");
                        }}
                        autoCapitalize="characters"
                      />
                    )}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.couponApplyBtn,
                    (!watchCouponCode || !watchCouponCode.trim()) && { opacity: 0.5 },
                  ]}
                  onPress={applyCode}
                  disabled={!watchCouponCode || !watchCouponCode.trim()}
                >
                  <Text style={styles.couponApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {!!couponError && (
                <Text style={styles.couponError}>{couponError}</Text>
              )}
              <View style={styles.couponHints}>
                {["SAVE10", "WEEKEND20", "FLAT100"].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={styles.couponHintChip}
                    onPress={() => {
                      setValue("couponCode", c);
                      setCouponError("");
                    }}
                  >
                    <Text style={styles.couponHintText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Bill */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.billCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billVal}>₹{subtotal.toFixed(2)}</Text>
            </View>
            {premiumCharge > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Stylist Premium</Text>
                <Text style={styles.billVal}>+₹{premiumCharge.toFixed(2)}</Text>
              </View>
            )}
            {discountAmt > 0 && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: colors.success }]}>
                  Discount
                </Text>
                <Text style={[styles.billVal, { color: colors.success }]}>
                  −₹{discountAmt.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes & Fees (18% GST)</Text>
              <Text style={styles.billVal}>₹{gst.toFixed(2)}</Text>
            </View>
            <View style={styles.billDivider} />
            <View style={styles.billRow}>
              <Text style={styles.billTotalLabel}>Total</Text>
              <Text style={styles.billTotalVal}>₹{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Policy */}
        <View style={styles.policyRow}>
          <Shield size={15} color={colors.textTertiary} />
          <Text style={styles.policyText}>
            Free cancellation up to 2 hours before your appointment.
          </Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Footer */}
      <View 
       
        style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}
      >
        <View style={styles.footerAmountRow}>
          <Text style={styles.footerAmountLabel}>Grand Total</Text>
          <Text style={styles.footerAmountVal}>₹{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onProceed)}
          activeOpacity={0.9}
        >
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.cta}>
            <Text style={styles.ctaText}>Proceed to Payment</Text>
            <ChevronRight size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  headerSub: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  scroll: { paddingBottom: 20 },

  salonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  salonImg: { width: 80, height: 80 },
  salonInfo: { flex: 1, padding: 14 },
  salonName: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  salonAddrRow: { flexDirection: "row", alignItems: "flex-start", gap: 4 },
  salonAddr: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 17,
  },

  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 0,
  },
  editLink: {
    ...typography.subtitle2,
    color: colors.primary,
  },

  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  detailCell: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  detailCellFull: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  detailVal: { ...typography.subtitle1, color: colors.textPrimary },
  detailSub: { ...typography.caption, color: colors.textTertiary, marginTop: 2 },
  staffThumb: { width: 44, height: 44, borderRadius: 22, marginLeft: 8 },

  servicesCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  svcRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  svcRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  svcDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  svcInfo: { flex: 1 },
  svcName: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  svcMeta: { ...typography.caption, color: colors.textTertiary },
  svcPrice: { ...typography.subtitle1, color: colors.textPrimary },

  notesInput: {
     backgroundColor: colors.white,
     borderRadius: 14,
     padding: 14,
     ...typography.body2,
     color: colors.textPrimary,
     textAlignVertical: 'top',
     borderWidth: 1.5,
     borderColor: colors.border,
  },
  inputError: { borderColor: colors.error },

  couponRow: { flexDirection: "row", gap: 10 },
  couponInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  couponInput: {
    flex: 1,
    ...typography.subtitle2,
    color: colors.textPrimary,
    paddingVertical: 13,
  },
  couponApplyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    justifyContent: "center",
    borderRadius: 14,
  },
  couponApplyText: { ...typography.button, color: "#fff" },
  couponError: {
    ...typography.caption,
    color: colors.error,
    marginTop: 6,
    fontWeight: "500",
  },
  couponHints: { flexDirection: "row", gap: 8, marginTop: 10 },
  couponHintChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  couponHintText: { fontSize: 12, fontWeight: "700", color: colors.primary },
  couponApplied: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.success,
  },
  couponAppliedTitle: { ...typography.subtitle2, color: colors.success },
  couponAppliedSub: { ...typography.caption, color: colors.success, marginTop: 2 },

  billCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  billLabel: { ...typography.body2, color: colors.textSecondary },
  billVal: { ...typography.subtitle2, color: colors.textPrimary },
  billDivider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  billTotalLabel: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  billTotalVal: { ...typography.h3, color: colors.primary },

  policyRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    backgroundColor: colors.gray100,
    borderRadius: 14,
  },
  policyText: {
    flex: 1,
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 16,
  },
  footerAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  footerAmountLabel: {
    ...typography.subtitle2,
    color: colors.textSecondary,
  },
  footerAmountVal: { ...typography.h2, color: colors.primary },
  cta: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 15,
    borderRadius: 16,
  },
  ctaText: { ...typography.button, color: "#fff" },
});
