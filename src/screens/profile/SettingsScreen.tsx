import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Bell, Moon, Globe, Shield, FileText, Info, Trash2, ChevronRight } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

export default function SettingsScreen({ navigation }: any) {
  const logout = useAuthStore((s) => s.logout);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);

  const handleDeleteAccount = () =>
    Alert.alert('Delete Account', 'This will permanently delete your account and all data. This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => logout() },
    ]);

  const Row = ({ icon: Icon, label, value, onPress, toggle, toggleValue, onToggle, color, isLast }: any) => (
    <TouchableOpacity style={[styles.row, isLast && styles.rowLast]} onPress={onPress} disabled={!!toggle || !onPress}>
      {Icon && <View style={[styles.rowIcon, color && { backgroundColor: `${color}15` }]}><Icon size={18} color={color ?? colors.primary} /></View>}
      <Text style={[styles.rowLabel, color && { color }]}>{label}</Text>
      {toggle ? <Switch value={toggleValue} onValueChange={onToggle} trackColor={{ true: colors.primary }} /> : value ? <Text style={styles.rowValue}>{value}</Text> : onPress ? <ChevronRight size={16} color={colors.textSecondary} /> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <Row icon={Bell} color="#FF3B30" label="Push Notifications" toggle toggleValue={pushNotif} onToggle={setPushNotif} />
            <Row icon={Bell} color="#007AFF" label="Email Notifications" toggle toggleValue={emailNotif} onToggle={setEmailNotif} isLast />
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <Row icon={Moon} color="#5856D6" label="Dark Mode" toggle toggleValue={darkMode} onToggle={setDarkMode} />
            <Row icon={Globe} color="#34C759" label="Language" value="English" onPress={() => { }} isLast />
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.card}>
            <Row icon={Shield} color="#34C759" label="Biometric Login" toggle toggleValue={biometric} onToggle={setBiometric} />
            <Row icon={Shield} color="#FF9500" label="Change PIN" onPress={() => Alert.alert('Coming Soon', 'Change PIN feature coming soon.')} isLast />
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & About</Text>
          <View style={styles.card}>
            <Row icon={FileText} color="#8E8E93" label="Privacy Policy" onPress={() => { }} />
            <Row icon={FileText} color="#8E8E93" label="Terms of Service" onPress={() => { }} />
            <Row icon={Info} color="#007AFF" label="App Version" value="v1.0.0" isLast />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
            <Trash2 size={18} color={colors.error} />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  section: { margin: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 16, marginBottom: 8 },
  card: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowLast: { borderBottomWidth: 0 },
  rowIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: '500', color: colors.textPrimary },
  rowValue: { fontSize: 15, color: colors.textSecondary, fontWeight: '500' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, backgroundColor: '#FFEBEB', borderRadius: 16, margin: 16, marginTop: 8, shadowColor: colors.error, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  deleteText: { fontSize: 15, fontWeight: '700', color: colors.error },
});
