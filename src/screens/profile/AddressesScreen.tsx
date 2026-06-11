import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Plus, MapPin, Home, Briefcase, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';

import { Button } from '../../components/common/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

const INITIAL_ADDRESSES = [
  { id: '1', type: 'home', label: 'Home', line1: 'B-204, Shyamal Residency', line2: 'Shyamal Cross Road, Satellite', city: 'Ahmedabad', pincode: '380015', isDefault: true },
  { id: '2', type: 'work', label: 'Work', line1: '7th Floor, GIFT Tower', line2: 'GIFT City, Gandhinagar', city: 'Gandhinagar', pincode: '382355', isDefault: false },
];

const ICON: Record<string, any> = { home: Home, work: Briefcase, other: MapPin };

type Props = NativeStackScreenProps<ProfileStackParamList, 'Addresses'>;

export default function AddressesScreen({ navigation }: Props) {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  const setDefault = (id: string) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));

  const remove = (id: string) =>
    Alert.alert('Remove Address', 'Are you sure you want to remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setAddresses((prev) => prev.filter((a) => a.id !== id)) },
    ]);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Saved Addresses"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddAddress')}>
            <Plus size={22} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Animated.View entering={FadeInDown.springify()} style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <MapPin size={48} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptySub}>Add an address to make checkout faster.</Text>
            <View style={{ marginTop: 24, width: '100%' }}>
              <Button title="Add New Address" onPress={() => navigation.navigate('AddAddress')} fullWidth />
            </View>
          </Animated.View>
        }
        renderItem={({ item, index }) => {
          const Icon = ICON[item.type] ?? MapPin;
          return (
            <Animated.View entering={FadeInDown.delay(index * 100).springify()} style={[styles.card, item.isDefault && styles.cardDefault]}>
              <View style={[styles.iconWrap, item.isDefault && styles.iconWrapDefault]}>
                <Icon size={20} color={item.isDefault ? colors.white : colors.primary} />
              </View>
              
              <View style={styles.info}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{item.label}</Text>
                  {item.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.address}>{item.line1}</Text>
                <Text style={styles.address}>{item.line2}</Text>
                <Text style={styles.address}>{item.city} – {item.pincode}</Text>
                
                {!item.isDefault && (
                  <TouchableOpacity onPress={() => setDefault(item.id)} style={styles.setDefaultRow}>
                    <Text style={styles.setDefault}>Set as default</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <TouchableOpacity onPress={() => remove(item.id)} style={styles.deleteBtn}>
                <Trash2 size={20} color={colors.error} />
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDefault: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(15, 70, 92, 0.02)',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapDefault: {
    backgroundColor: colors.primary,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  label: {
    ...typography.subtitle1,
    color: colors.textPrimary,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  defaultText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  address: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  setDefaultRow: {
    marginTop: 10,
  },
  setDefault: {
    ...typography.subtitle2,
    color: colors.primary,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySub: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
