import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Scissors,
  Zap
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HomeStackParamList } from "../../types/navigation";
import { useBookingStore } from "../../store/bookingStore";
import { DEMO_SALONS } from "../../data/demo";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";

type Props = NativeStackScreenProps<HomeStackParamList, "BookingSuccess">;

export default function BookingSuccessScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { bookingId } = route.params;
  const {
    salonId,
    services,
    date,
    timeSlot,
    staff,
    getTotal,
    getTotalDuration,
    resetBooking,
  } = useBookingStore();
  const salon = DEMO_SALONS.find((s) => s.id === salonId) ?? DEMO_SALONS[0];

  const scaleAnim = useRef(new Animated.Value(0));
  const fadeAnim = useRef(new Animated.Value(0));
  const slideAnim = useRef(new Animated.Value(30));

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim.current, {
        toValue: 1,
        tension: 55,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim.current, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim.current, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleAnim, fadeAnim, slideAnim]);

  const totalDuration = getTotalDuration();
  const finalAmount = getTotal();

  const handleViewBookings = () => {
    resetBooking();
    navigation.getParent()?.navigate("BookingsTab", { screen: "MyBookings" });
  };

  const handleHome = () => {
    resetBooking();
    navigation.navigate("Home");
  };

  const DETAILS = [
    {
      icon: MapPin,
      bg: colors.primaryLight,
      color: colors.primary,
      label: "Salon",
      val: salon.name,
      sub: `${salon.addressLine1}, ${salon.city}`,
    },
    {
      icon: Calendar,
      bg: colors.accentLight,
      color: colors.accentDark,
      label: "Date",
      val: date
        ? new Date(date).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
        : "—",
      sub: "",
    },
    {
      icon: Clock,
      bg: colors.warningLight,
      color: colors.warning,
      label: "Time",
      val: timeSlot?.time ?? "—",
      sub: `${totalDuration} min session`,
    },
    {
      icon: staff ? User : Zap,
      bg: colors.successLight,
      color: colors.success,
      label: "Stylist",
      val: staff?.name ?? "Any Available Expert",
      sub: staff?.specializations?.[0] ?? "",
    },
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24 }]}
      >
        {/* Animated check */}
        <View style={styles.heroSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim.current }] }}>
            <View style={styles.checkOuter}>
              <View style={styles.checkInner}>
                <CheckCircle size={52} color={colors.success} strokeWidth={1.5} />
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.heroText,
              { opacity: fadeAnim.current, transform: [{ translateY: slideAnim.current }] },
            ]}
          >
            <Text style={styles.heroTitle}>Booking Confirmed! 🎉</Text>
            <Text style={styles.heroSub}>
              Your appointment has been successfully booked
            </Text>

            {/* Booking ID */}
            <View style={styles.bookingIdChip}>
              <Scissors size={13} color={colors.primary} />
              <Text style={styles.bookingIdText}>
                ID: #{bookingId.toUpperCase()}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Details card */}
        <Animated.View
          style={[
            styles.detailsCard,
            { opacity: fadeAnim.current, transform: [{ translateY: slideAnim.current }] },
          ]}
        >
          {DETAILS.map((d, i) => {
            const Icon = d.icon;
            if (!d.val) return null;
            return (
              <View
                key={d.label}
                style={[
                  styles.detailRow,
                  i < DETAILS.length - 1 && styles.detailRowBorder,
                ]}
              >
                <View style={[styles.detailIcon, { backgroundColor: d.bg }]}>
                  <Icon size={17} color={d.color} />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>{d.label}</Text>
                  <Text style={styles.detailVal}>{d.val}</Text>
                  {!!d.sub && <Text style={styles.detailSub}>{d.sub}</Text>}
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Services + Amount */}
        <Animated.View style={[styles.summaryCard, { opacity: fadeAnim.current }]}>
          <Text style={styles.summaryTitle}>Services Booked</Text>
          {services.map((svc) => (
            <View key={svc.id} style={styles.svcRow}>
              <View style={styles.svcDot} />
              <Text style={styles.svcName}>{svc.name}</Text>
              <Text style={styles.svcPrice}>₹{svc.discountedPrice || svc.price}</Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalVal}>₹{finalAmount}</Text>
          </View>
        </Animated.View>

        {/* Info chips */}
        <Animated.View style={[styles.infoBox, { opacity: fadeAnim.current }]}>
          {[
            "📱 Confirmation sent to your phone",
            "🔔 Reminder 1 hour before your appointment",
            "❌ Cancel up to 2 hours before for full refund",
          ].map((msg) => (
            <Text key={msg} style={styles.infoText}>
              {msg}
            </Text>
          ))}
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity onPress={handleViewBookings} activeOpacity={0.9}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>View My Bookings</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleHome}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 16, paddingBottom: 20 },

  heroSection: { alignItems: "center", marginBottom: 28 },
  checkOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.successLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },
  checkInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  heroText: { alignItems: "center" },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  heroSub: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  bookingIdChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  bookingIdText: { ...typography.subtitle2, color: colors.primary },

  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  detailInfo: { flex: 1 },
  detailLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  detailVal: { ...typography.subtitle1, color: colors.textPrimary },
  detailSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },

  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  svcRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  svcDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 10,
  },
  svcName: {
    flex: 1,
    ...typography.subtitle2,
    color: colors.textSecondary,
  },
  svcPrice: { ...typography.subtitle1, color: colors.textPrimary },
  summaryDivider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { ...typography.subtitle1, color: colors.textPrimary },
  totalVal: { ...typography.h2, color: colors.primary },

  infoBox: {
    backgroundColor: colors.successLight,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  infoText: { ...typography.caption, color: colors.textPrimary, lineHeight: 20 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
    gap: 10,
  },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnText: { ...typography.button, color: "#fff" },
  secondaryBtn: {
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: colors.gray100,
  },
  secondaryBtnText: {
    ...typography.button,
    color: colors.textSecondary,
  },
});
