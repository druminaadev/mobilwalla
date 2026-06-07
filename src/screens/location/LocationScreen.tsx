import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Phone, Mail, Clock, MapPin } from 'lucide-react-native';

const BRANCHES = [
  { id: '1', name: 'Main Branch', address: '123 Main Street, Navrangpura, Ahmedabad, Gujarat' },
  { id: '2', name: 'Satellite Branch', address: '456 Satellite Road, Ahmedabad, Gujarat' },
  { id: '3', name: 'Bopal Branch', address: '789 Bopal, Ahmedabad, Gujarat' },
];

export default function LocationScreen() {
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);

  const handleCall = () => {
    Linking.openURL('tel:+919876543210');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:hello@salonname.com');
  };

  const handleDirections = () => {
    Linking.openURL('https://maps.google.com/?q=23.0225,72.5714');
  };

  return (
    <View style={styles.container}>
      <View style={styles.branchSelector}>
        <Text style={styles.label}>Branch:</Text>
        <Pressable style={styles.dropdown}>
          <Text style={styles.dropdownText}>{selectedBranch.name}</Text>
        </Pressable>
      </View>

      <View style={styles.mapPlaceholder}>
        <MapPin size={48} color="#FF5C8A" />
        <Text style={styles.mapText}>Map View</Text>
        <Text style={styles.mapSubtext}>Integration with Google Maps</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.salonName}>💈 Hair Ahmedabad</Text>
        
        <View style={styles.infoRow}>
          <MapPin size={20} color="#64748B" />
          <Text style={styles.infoText}>{selectedBranch.address}</Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={20} color="#64748B" />
          <View>
            <Text style={styles.infoText}>Mon–Sat: 9AM – 8PM</Text>
            <Text style={styles.infoText}>Sunday: 10AM – 6PM</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Phone size={20} color="#64748B" />
          <Text style={styles.infoText}>+91 98765-43210</Text>
        </View>

        <View style={styles.infoRow}>
          <Mail size={20} color="#64748B" />
          <Text style={styles.infoText}>hello@salonname.com</Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={handleCall} style={styles.actionButton}>
            <Phone size={20} color="#fff" />
            <Text style={styles.actionText}>Call Now</Text>
          </Pressable>
          <Pressable onPress={handleDirections} style={styles.actionButton}>
            <MapPin size={20} color="#fff" />
            <Text style={styles.actionText}>Get Directions</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },
  branchSelector: { backgroundColor: '#fff', padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { fontSize: 16, fontWeight: '600', color: '#1A1B2E' },
  dropdown: { flex: 1, padding: 12, backgroundColor: '#F7F8FC', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  dropdownText: { fontSize: 15, color: '#1A1B2E' },
  mapPlaceholder: { height: 250, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', margin: 16, borderRadius: 12 },
  mapText: { fontSize: 18, fontWeight: '700', color: '#64748B', marginTop: 12 },
  mapSubtext: { fontSize: 14, color: '#64748B', marginTop: 4 },
  details: { backgroundColor: '#fff', padding: 20, margin: 16, borderRadius: 12 },
  salonName: { fontSize: 22, fontWeight: '800', color: '#1A1B2E', marginBottom: 20 },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'flex-start' },
  infoText: { fontSize: 15, color: '#1A1B2E', lineHeight: 22, flex: 1 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, backgroundColor: '#FF5C8A', borderRadius: 12 },
  actionText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
