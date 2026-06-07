import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Phone, Mail, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { colors } from '@/constants/colors';

const FAQS = [
  { q: 'How do I book an appointment?', a: 'Browse salons on the Home screen, select a salon, choose your services, pick a date & time, then complete the payment.' },
  { q: 'Can I cancel my booking?', a: 'Yes, you can cancel up to 2 hours before your appointment from the Bookings tab → Booking Details → Cancel.' },
  { q: 'How do refunds work?', a: 'Refunds for cancellations are credited to your wallet within 1–2 hours. Bank refunds take 5–7 business days.' },
  { q: 'How do I reschedule?', a: 'Go to Bookings → select your booking → tap Reschedule, choose a new date and time.' },
  { q: 'What is the wallet?', a: 'Your in-app wallet lets you store money for quick checkout. Add money via UPI, card or net banking.' },
  { q: 'How do loyalty points work?', a: 'Earn 1 point per ₹10 spent. 100 points = ₹10 off your next booking.' },
];

export default function HelpScreen({ navigation }: any) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (i: number) => setExpanded((prev) => (prev === i ? null : i));

  const contact = (type: string) => {
    if (type === 'call') Linking.openURL('tel:+919876543210');
    else if (type === 'email') Linking.openURL('mailto:support@hairahmedabad.com');
    else Alert.alert('Live Chat', 'Connecting you to our support team...');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Help & Support" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Contact Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactGrid}>
            <TouchableOpacity style={styles.contactCard} onPress={() => contact('call')}>
              <View style={[styles.contactIcon, { backgroundColor: '#DCFCE7' }]}>
                <Phone size={24} color={colors.success} />
              </View>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>+91 98765 43210</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard} onPress={() => contact('email')}>
              <View style={[styles.contactIcon, { backgroundColor: colors.primaryLight }]}>
                <Mail size={24} color={colors.primary} />
              </View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@salon.com</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard} onPress={() => contact('chat')}>
              <View style={[styles.contactIcon, { backgroundColor: '#FEF9C3' }]}>
                <MessageCircle size={24} color={colors.warning} />
              </View>
              <Text style={styles.contactLabel}>Live Chat</Text>
              <Text style={styles.contactValue}>Available 9AM–9PM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQS.map((faq, i) => (
            <TouchableOpacity key={i} style={styles.faqCard} onPress={() => toggle(i)} activeOpacity={0.8}>
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQ, expanded === i && { color: colors.primary }]}>{faq.q}</Text>
                {expanded === i ? <ChevronUp size={20} color={colors.primary} /> : <ChevronDown size={20} color={colors.textSecondary} />}
              </View>
              {expanded === i && <Text style={styles.faqA}>{faq.a}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hair Ahmedabad · Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  section: { padding: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 16, letterSpacing: -0.3 },
  contactGrid: { gap: 12 },
  contactCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, backgroundColor: 'white', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: colors.border },
  contactIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  contactValue: { fontSize: 14, color: colors.textSecondary, fontWeight: '500', marginTop: 2 },
  faqCard: { padding: 18, backgroundColor: 'white', borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: colors.border },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQ: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, flex: 1, marginRight: 12, lineHeight: 22 },
  faqA: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, marginTop: 12 },
  footer: { padding: 24, alignItems: 'center' },
  footerText: { fontSize: 12, color: colors.textTertiary },
});
