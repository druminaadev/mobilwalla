import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Plus, MapPin, Home, Briefcase, Trash2, Check } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { colors } from '@/constants/colors';

const INITIAL_ADDRESSES = [
  { id: '1', type: 'home', label: 'Home', line1: 'B-204, Shyamal Residency', line2: 'Shyamal Cross Road, Satellite', city: 'Ahmedabad', pincode: '380015', isDefault: true },
  { id: '2', type: 'work', label: 'Work', line1: '7th Floor, GIFT Tower', line2: 'GIFT City, Gandhinagar', city: 'Gandhinagar', pincode: '382355', isDefault: false },
];

const ICON: Record<string, any> = { home: Home, work: Briefcase, other: MapPin };

export default function AddressesScreen({ navigation }: any) {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  const setDefault = (id: string) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));

  const remove = (id: string) =>
    Alert.alert('Remove Address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setAddresses((prev) => prev.filter((a) => a.id !== id)) },
    ]);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Saved Addresses"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MapPin size={48} color={colors.border} />
            <Text style={styles.emptyText}>No saved addresses</Text>
            <Button title="Add Address" onPress={() => navigation.navigate('AddAddress')} />
          </View>
        }
        renderItem={({ item }) => {
          const Icon = ICON[item.type] ?? MapPin;
          return (
            <View style={[styles.card, item.isDefault && styles.cardDefault]}>
              <View style={styles.iconWrap}>
                <Icon size={20} color={item.isDefault ? 'white' : colors.primary} />
              </View>
              <View style={styles.info}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{item.label}</Text>
                  {item.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultText}>Default</Text></View>}
                </View>
                <Text style={styles.address}>{item.line1}</Text>
                <Text style={styles.address}>{item.line2}</Text>
                <Text style={styles.address}>{item.city} – {item.pincode}</Text>
                {!item.isDefault && (
                  <TouchableOpacity onPress={() => setDefault(item.id)}>
                    <Text style={styles.setDefault}>Set as default</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={() => remove(item.id)} style={styles.deleteBtn}>
                <Trash2 size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  list: { padding: 16 },
  card: { flexDirection: 'row', padding: 16, backgroundColor: colors.background, borderRadius: 14, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  cardDefault: { borderColor: colors.primary },
  iconWrap: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  label: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  defaultBadge: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: colors.primaryLight, borderRadius: 10 },
  defaultText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  address: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  setDefault: { fontSize: 13, fontWeight: '600', color: colors.primary, marginTop: 6 },
  deleteBtn: { padding: 4 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: colors.textSecondary },
});
