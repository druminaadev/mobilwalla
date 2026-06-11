import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Phone, Mail, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

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
    else navigation.navigate('Chatbot');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Help & Support" onBack={() => navigation.goBack()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Contact Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactGrid}>
            
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <TouchableOpacity style={styles.contactCard} onPress={() => contact('call')} activeOpacity={0.8}>
                <View style={[styles.contactIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                  <Phone size={24} color={colors.success} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Call Us</Text>
                  <Text style={styles.contactValue}>+91 98765 43210</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(150).springify()}>
              <TouchableOpacity style={styles.contactCard} onPress={() => contact('email')} activeOpacity={0.8}>
                <View style={[styles.contactIcon, { backgroundColor: colors.primaryLight }]}>
                  <Mail size={24} color={colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>support@hairahmedabad.com</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <TouchableOpacity style={styles.contactCard} onPress={() => contact('chat')} activeOpacity={0.8}>
                <View style={[styles.contactIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <MessageCircle size={24} color={colors.warning} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Live Chat</Text>
                  <Text style={styles.contactValue}>Available 9AM–9PM</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQS.map((faq, i) => (
            <Animated.View key={i} layout={Layout.springify()} entering={FadeInDown.delay(300 + i * 50).springify()}>
              <TouchableOpacity style={styles.faqCard} onPress={() => toggle(i)} activeOpacity={0.8}>
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQ, expanded === i && { color: colors.primary }]}>{faq.q}</Text>
                  <View style={[styles.faqChevron, expanded === i && styles.faqChevronActive]}>
                    {expanded === i ? <ChevronUp size={18} color={colors.white} /> : <ChevronDown size={18} color={colors.textSecondary} />}
                  </View>
                </View>
                {expanded === i && (
                  <Animated.Text entering={FadeInDown.duration(300)} style={styles.faqA}>
                    {faq.a}
                  </Animated.Text>
                )}
              </TouchableOpacity>
            </Animated.View>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  section: {
    padding: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  contactGrid: {
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  contactValue: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  faqCard: {
    padding: 18,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQ: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  faqChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqChevronActive: {
    backgroundColor: colors.primary,
  },
  faqA: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 12,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
