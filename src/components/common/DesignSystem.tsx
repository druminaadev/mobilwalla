import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Share2, Search } from "lucide-react-native";
import { DS } from "@/constants/ds";

// ── AppBar ────────────────────────────────────────────────────────────────────

interface AppBarProps {
  title: string;
  onBack?: () => void;
  rightIcon?: "share" | "search";
  onRightPress?: () => void;
}

export const AppBar = memo<AppBarProps>(
  ({ title, onBack, rightIcon, onRightPress }) => {
    const insets = useSafeAreaInsets();
    return (
      <View style={[bar.wrap, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={bar.iconBtn}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={20} color={DS.textPrimary} />
        </TouchableOpacity>

        <Text style={bar.title} numberOfLines={1}>
          {title}
        </Text>

        {rightIcon ? (
          <TouchableOpacity
            style={bar.iconBtn}
            onPress={onRightPress}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            {rightIcon === "share" ? (
              <Share2 size={18} color={DS.textPrimary} />
            ) : (
              <Search size={18} color={DS.textPrimary} />
            )}
          </TouchableOpacity>
        ) : (
          <View style={bar.iconBtn} />
        )}
      </View>
    );
  },
);
AppBar.displayName = "AppBar";

const bar = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: DS.pad,
    paddingBottom: 12,
    backgroundColor: DS.surface,
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: DS.h1,
    fontWeight: "600",
    color: DS.textPrimary,
  },
});

// ── TabBar ────────────────────────────────────────────────────────────────────

interface TabItem {
  label: string;
}
interface TabBarProps {
  tabs: TabItem[];
  activeIndex: number;
  onChange: (i: number) => void;
}

export const TabBar = memo<TabBarProps>(({ tabs, activeIndex, onChange }) => (
  <View style={tab.wrap}>
    {tabs.map((t, i) => {
      const active = i === activeIndex;
      return (
        <TouchableOpacity
          key={t.label}
          style={tab.item}
          onPress={() => onChange(i)}
          activeOpacity={0.8}
        >
          <Text style={[tab.text, active && tab.textActive]}>{t.label}</Text>
          {active && <View style={tab.indicator} />}
        </TouchableOpacity>
      );
    })}
    {/* Bottom border sits behind active indicator */}
    <View style={tab.bottomBorder} />
  </View>
));
TabBar.displayName = "TabBar";

const tab = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: DS.surface,
    position: "relative",
  },
  item: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingBottom: 10,
  },
  text: { fontSize: DS.body, fontWeight: "400", color: DS.textSecondary },
  textActive: { fontWeight: "700", color: DS.primary },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    borderRadius: 3,
    backgroundColor: DS.primary,
  },
  bottomBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: DS.border,
  },
});

// ── DashedDivider ─────────────────────────────────────────────────────────────

export const DashedDivider = memo(() => (
  <View style={dash.wrap}>
    {Array.from({ length: 40 }).map((_, i) => (
      <View key={i} style={dash.seg} />
    ))}
  </View>
));
DashedDivider.displayName = "DashedDivider";

const dash = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    overflow: "hidden",
    marginVertical: 14,
    paddingHorizontal: DS.pad,
  },
  seg: { width: 6, height: 1, backgroundColor: DS.dashColor, marginRight: 4 },
});

// ── TicketCutouts ─────────────────────────────────────────────────────────────
// Overlaid left + right semicircle notches — place inside a `position: relative` parent

interface TicketCutoutProps {
  bgColor?: string;
}

export const TicketCutouts = memo<TicketCutoutProps>(({ bgColor = DS.bg }) => (
  <>
    <View style={[cut.circle, cut.left, { backgroundColor: bgColor }]} />
    <View style={[cut.circle, cut.right, { backgroundColor: bgColor }]} />
  </>
));
TicketCutouts.displayName = "TicketCutouts";

const NOTCH = 20;
const cut = StyleSheet.create({
  circle: {
    position: "absolute",
    width: NOTCH,
    height: NOTCH,
    borderRadius: NOTCH / 2,
    zIndex: 10,
  },
  left: { left: -(NOTCH / 2) },
  right: { right: -(NOTCH / 2) },
});
