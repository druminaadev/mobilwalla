import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Clipboard,
} from "react-native";
import { DS } from "@/constants/ds";
import { AppBar } from "@/components/common/DesignSystem";

interface Coupon {
  id: string;
  code: string;
  condition: string;
  offer: string;
}

const COUPONS: Coupon[] = [
  {
    id: "1",
    code: "WELCOME50",
    condition: "Unlock this offer by adding $400 more",
    offer: "Get 50% OFF",
  },
  {
    id: "2",
    code: "CASHBACK20",
    condition: "Just $200 more to go",
    offer: "Up to $20.00 cashback",
  },
  {
    id: "3",
    code: "FEST2STYLE",
    condition: "Unlock this offer by adding $200 more",
    offer: "Get 25% OFF for Combo",
  },
  {
    id: "4",
    code: "FEST2DEAL",
    condition: "Unlock this offer by adding $300 more",
    offer: "Get 10% OFF",
  },
];

const NOTCH_SIZE = 24;

const CouponCard = memo<{ item: Coupon }>(({ item }) => {
  const handleCopy = () => {
    Clipboard.setString(item.code);
    Alert.alert("Copied!", `${item.code} copied to clipboard.`);
  };

  return (
    <View style={p.card}>
      {/* Top section */}
      <View style={p.top}>
        <Text style={p.code}>{item.code}</Text>
        <Text style={p.condition}>{item.condition}</Text>
        <View style={p.offerRow}>
          <Text style={p.star}>✦</Text>
          <Text style={p.offer}>{item.offer}</Text>
        </View>
      </View>

      {/* Notch divider row */}
      <View style={p.notchRow}>
        <View style={p.notchLeft} />
        <View style={p.dashes}>
          {Array.from({ length: 32 }).map((_, i) => (
            <View key={i} style={p.dash} />
          ))}
        </View>
        <View style={p.notchRight} />
      </View>

      {/* Bottom section */}
      <TouchableOpacity
        style={p.bottom}
        onPress={handleCopy}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Copy coupon code ${item.code}`}
      >
        <Text style={p.copyText}>COPY CODE</Text>
      </TouchableOpacity>
    </View>
  );
});
CouponCard.displayName = "CouponCard";

export default function MyCouponScreen({ navigation }: any) {
  return (
    <SafeAreaView style={p.safe}>
      <AppBar title="My Coupon" onBack={() => navigation?.goBack()} />
      <FlatList
        data={COUPONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CouponCard item={item} />}
        contentContainerStyle={p.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={p.pageHeader}>Coupons for you</Text>}
      />
    </SafeAreaView>
  );
}

const p = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.bg },
  list: { padding: DS.pad, paddingBottom: 40 },
  pageHeader: {
    fontSize: DS.h2,
    fontWeight: "600",
    color: DS.textPrimary,
    marginBottom: 16,
  },

  card: {
    backgroundColor: DS.surface,
    borderRadius: DS.radiusLg,
    borderWidth: 1,
    borderColor: DS.border,
    marginBottom: 16,
    overflow: "hidden",
  },

  top: { padding: DS.pad, gap: 6 },
  code: {
    fontSize: DS.h2,
    fontWeight: "700",
    color: DS.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  condition: { fontSize: DS.caption, color: DS.textSecondary, lineHeight: 18 },
  offerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  star: { fontSize: 18, color: "#F97316" },
  offer: { fontSize: DS.body, fontWeight: "700", color: DS.textPrimary },

  // Notch row: full-width strip with punch cutouts on each side
  notchRow: {
    flexDirection: "row",
    alignItems: "center",
    height: NOTCH_SIZE,
    // Extend slightly past card edges so semicircles overlap the border
    marginHorizontal: -1,
  },
  notchLeft: {
    width: NOTCH_SIZE,
    height: NOTCH_SIZE,
    borderRadius: NOTCH_SIZE / 2,
    backgroundColor: DS.bg,
    borderWidth: 1,
    borderColor: DS.border,
    marginLeft: -(NOTCH_SIZE / 2),
    zIndex: 2,
  },
  notchRight: {
    width: NOTCH_SIZE,
    height: NOTCH_SIZE,
    borderRadius: NOTCH_SIZE / 2,
    backgroundColor: DS.bg,
    borderWidth: 1,
    borderColor: DS.border,
    marginRight: -(NOTCH_SIZE / 2),
    zIndex: 2,
  },
  dashes: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 8,
  },
  dash: {
    width: 5,
    height: 1.5,
    backgroundColor: DS.dashColor,
    marginRight: 5,
  },

  bottom: {
    backgroundColor: DS.bg,
    paddingVertical: 14,
    alignItems: "center",
  },
  copyText: {
    fontSize: DS.body,
    fontWeight: "700",
    color: DS.primary,
    letterSpacing: 3,
  },
});
