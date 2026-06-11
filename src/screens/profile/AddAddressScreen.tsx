import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Switch, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Home, Briefcase, MapPin } from 'lucide-react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { ProfileStackParamList } from '../../types/navigation';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AddAddress'>;

const TYPES = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'work' as const, label: 'Work', icon: Briefcase },
  { id: 'other' as const, label: 'Other', icon: MapPin },
];

export default function AddAddressScreen({ navigation, route }: Props) {
  const existing = route.params?.address;
  const isEdit = !!existing;

  const [type, setType] = useState<'home' | 'work' | 'other'>(existing?.type ?? 'home');
  const [line1, setLine1] = useState(existing?.line1 ?? '');
  const [line2, setLine2] = useState(existing?.line2 ?? '');
  const [city, setCity] = useState(existing?.city ?? '');
  const [state, setState] = useState(existing?.state ?? 'Gujarat');
  const [pincode, setPincode] = useState(existing?.pincode ?? '');
  const [isDefault, setIsDefault] = useState(existing?.isDefault ?? false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!line1.trim()) errs.line1 = 'Address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (pincode.length !== 6) errs.pincode = 'Enter a valid 6-digit pincode';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise<void>((r) => setTimeout(() => r(), 800));
    setSaving(false);
    Alert.alert('Address Saved!', 'Your address has been saved successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        title={isEdit ? 'Edit Address' : 'Add Address'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Save as</Text>
        <View style={styles.typeRow}>
          {TYPES.map((t) => {
            const active = type === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.typeChip, active && styles.typeChipActive]}
                onPress={() => setType(t.id)}
              >
                <t.icon size={18} color={active ? colors.primary : colors.textSecondary} />
                <Text style={[styles.typeText, active && styles.typeTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Input
          label="Address Line 1 *"
          value={line1}
          onChangeText={(v) => { setLine1(v); setErrors((e) => ({ ...e, line1: '' })); }}
          placeholder="Building, Flat, Street"
          error={errors.line1}
        />
        <Input
          label="Address Line 2"
          value={line2}
          onChangeText={setLine2}
          placeholder="Area, Landmark (optional)"
        />
        <Input
          label="Pincode *"
          value={pincode}
          onChangeText={(v) => {
            const val = v.replace(/\D/g, '').slice(0, 6);
            setPincode(val);
            setErrors((e) => ({ ...e, pincode: '' }));
          }}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="6-digit pincode"
          error={errors.pincode}
        />
        <Input
          label="City *"
          value={city}
          onChangeText={(v) => { setCity(v); setErrors((e) => ({ ...e, city: '' })); }}
          placeholder="e.g. Ahmedabad"
          error={errors.city}
        />
        <Input
          label="State"
          value={state}
          onChangeText={setState}
          placeholder="e.g. Gujarat"
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Set as Default Address</Text>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor="white"
          />
        </View>

        <Button
          title="Save Address"
          onPress={handleSave}
          loading={saving}
          fullWidth
          style={styles.btn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 40 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 13, backgroundColor: 'white', borderRadius: 16,
    borderWidth: 1.5, borderColor: colors.border,
  },
  typeChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  typeText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  typeTextActive: { color: colors.primary },
  switchRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'white', padding: 16, borderRadius: 14, marginTop: 4, marginBottom: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  switchLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  btn: { paddingVertical: 16, borderRadius: 16 },
});
