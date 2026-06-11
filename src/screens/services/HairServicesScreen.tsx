import React, { useState, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import { DS } from "@/constants/ds";
import { AppBar, TabBar } from "@/components/common/DesignSystem";

interface Service {
  id: string;
  title: string;
  duration: string;
  price: string;
}

const MENS: Service[] = [
  {
    id: "1",
    title: "Classic & Clean Cuts",
    duration: "30 minutes",
    price: "$60.00",
  },
  {
    id: "2",
    title: "Modern & Trendy Styles",
    duration: "45 minutes",
    price: "$75.00",
  },
  {
    id: "3",
    title: "Textured & Stylish",
    duration: "25 minutes",
    price: "$45.00",
  },
  {
    id: "4",
    title: "Medium-Length Styles",
    duration: "30 minutes",
    price: "$50.00",
  },
  {
    id: "5",
    title: "Long Hair Styles",
    duration: "20 minutes",
    price: "$30.00",
  },
  {
    id: "6",
    title: "Curly Hair Cuts",
    duration: "30 minutes",
    price: "$60.00",
  },
];

const WOMENS: Service[] = [
  {
    id: "w1",
    title: "Blowout & Styling",
    duration: "45 minutes",
    price: "$80.00",
  },
  { id: "w2", title: "Trim & Shape", duration: "30 minutes", price: "$55.00" },
  {
    id: "w3",
    title: "Layers & Texture",
    duration: "50 minutes",
    price: "$90.00",
  },
  {
    id: "w4",
    title: "Balayage Highlights",
    duration: "90 minutes",
    price: "$150.00",
  },
  {
    id: "w5",
    title: "Keratin Treatment",
    duration: "120 minutes",
    price: "$200.00",
  },
];

const TABS = [{ label: "Men's Haircut" }, { label: "Women's Haircut" }];

const RadioCard = memo<{
  item: Service;
  selected: boolean;
  onPress: () => void;
}>(({ item, selected, onPress }) => (
  <TouchableOpacity
    style={[s.card, selected && s.cardSelected]}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
  >
    <View style={s.left}>
      <Text style={s.title}>{item.title}</Text>
      <Text style={s.duration}>{item.duration}</Text>
    </View>
    <View style={s.right}>
      <Text style={s.price}>{item.price}</Text>
      <View style={[s.indicator, selected && s.indicatorOn]}>
        {selected && <Check size={14} color="#fff" strokeWidth={3} />}
      </View>
    </View>
  </TouchableOpacity>
));
RadioCard.displayName = "RadioCard";

export default function HairServicesScreen({ navigation }: any) {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedId, setSelectedId] = useState("1");
  const data = tabIndex === 0 ? MENS : WOMENS;

  return (
    <SafeAreaView style={s.safe}>
      <AppBar title="Hair Services" onBack={() => navigation?.goBack()} />
      <TabBar
        tabs={TABS}
        activeIndex={tabIndex}
        onChange={(i) => {
          setTabIndex(i);
          setSelectedId(i === 0 ? "1" : "w1");
        }}
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RadioCard
            item={item}
            selected={selectedId === item.id}
            onPress={() => setSelectedId(item.id)}
          />
        )}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={s.bottomWrap} pointerEvents="box-none">
        <LinearGradient
          colors={["rgba(248,249,250,0)", "#F8F9FA"]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <TouchableOpacity
          style={s.bookBtn}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Book Appointment"
        >
          <Text style={s.bookText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.bg },
  list: { padding: DS.pad, gap: 12, paddingBottom: 110 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DS.surface,
    borderRadius: DS.radius,
    borderWidth: 1,
    borderColor: DS.border,
    padding: 16,
  },
  cardSelected: { borderColor: DS.primary, borderWidth: 1.5 },

  left: { flex: 1 },
  title: {
    fontSize: DS.body,
    fontWeight: "500",
    color: DS.textPrimary,
    marginBottom: 4,
  },
  duration: { fontSize: DS.caption, color: DS.textSecondary },

  right: { alignItems: "flex-end", gap: 10 },
  price: { fontSize: DS.price, fontWeight: "700", color: DS.textPrimary },

  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: DS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorOn: { backgroundColor: DS.primary, borderColor: DS.primary },

  bottomWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: DS.pad,
    paddingBottom: 32,
    paddingTop: 48,
  },
  bookBtn: {
    backgroundColor: DS.primary,
    borderRadius: 50,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: DS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bookText: {
    fontSize: DS.h2,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
