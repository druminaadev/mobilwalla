import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, Clipboard } from 'react-native';
import { Copy, Share2, Gift, Users, IndianRupee, Check } from 'lucide-react-native';
import { ScreenHeader } from '../../components/layout/ScreenHeader';
import { DEMO_USER } from '../../data/demo';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';

const REFERRAL_CODE = 'PRIYA100';

const STEPS = [
  { icon: '📲', text: 'Share your referral code with friends' },
  { icon: '📝', text: 'Friend signs up and books their first appointment' },
  { icon: '💰', text: 'You earn ₹100 wallet credit instantly' },
];

export default function ReferralScreen({ navigation }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(REFERRAL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hey! Use my referral code ${REFERRAL_CODE} on Hair Ahmedabad app and get ₹100 off your first booking! Download: https://hairahmedabad.app`,
        title: 'Refer & Earn ₹100',
      });
    } catch {
      Alert.alert('Error', 'Could not open share sheet.');
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Refer & Earn" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <LinearGradient colors={['#FF5C8A', '#FF9F43']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.heroEmoji}>🎁</Text>
          <Text style={styles.heroTitle}>Earn ₹100 per Referral!</Text>
          <Text style={styles.heroSub}>Invite friends and earn wallet credits for every successful referral</Text>
        </LinearGradient>

        {/* Referral Code */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <View style={styles.codeWrapper}>
            <Text style={styles.code}>{REFERRAL_CODE}</Text>
          </View>
          <View style={styles.codeActions}>
            <TouchableOpacity style={styles.codeBtn} onPress={handleCopy}>
              {copied ? <Check size={18} color={colors.success} /> : <Copy size={18} color={colors.primary} />}
              <Text style={[styles.codeBtnText, copied && { color: colors.success }]}>{copied ? 'Copied!' : 'Copy'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.codeBtn, styles.shareBtn]} onPress={handleShare} activeOpacity={0.8}>
              <Share2 size={18} color="white" />
              <Text style={[styles.codeBtnText, { color: 'white' }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Users size={22} color={colors.primary} />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
          <View style={styles.statCard}>
            <IndianRupee size={22} color={colors.success} />
            <Text style={styles.statValue}>₹500</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Gift size={22} color={colors.warning} />
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          {STEPS.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
              <Text style={styles.stepEmoji}>{step.icon}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        {/* T&C */}
        <Text style={styles.tc}>
          * Credits are added after the referred user completes their first booking. Minimum booking value ₹300. Valid for new users only.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  hero: { alignItems: 'center', padding: 32, borderRadius: 24, marginBottom: 24, shadowColor: '#FF5C8A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  heroEmoji: { fontSize: 64, marginBottom: 16 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: 'white', marginBottom: 8, textAlign: 'center', letterSpacing: -0.5 },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 22, fontWeight: '500' },
  codeCard: { padding: 24, backgroundColor: 'white', borderRadius: 24, alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: colors.border },
  codeLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  codeWrapper: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed', backgroundColor: colors.primaryLight, marginBottom: 20 },
  code: { fontSize: 36, fontWeight: '800', color: colors.primary, letterSpacing: 6 },
  codeActions: { flexDirection: 'row', gap: 16 },
  codeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 14, backgroundColor: colors.background, borderRadius: 20 },
  shareBtn: { backgroundColor: colors.primary },
  codeBtnText: { fontSize: 15, fontWeight: '700', color: colors.primary },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, alignItems: 'center', gap: 6, padding: 16, backgroundColor: 'white', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: colors.border },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginTop: 4 },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 16, letterSpacing: -0.3 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16, backgroundColor: 'white', padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1, borderWidth: 1, borderColor: colors.border },
  stepNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  stepNumText: { fontSize: 14, fontWeight: '800', color: colors.primary },
  stepEmoji: { fontSize: 24 },
  stepText: { flex: 1, fontSize: 15, color: colors.textPrimary, lineHeight: 22, fontWeight: '500' },
  tc: { fontSize: 12, color: colors.textTertiary, lineHeight: 18, marginBottom: 32, textAlign: 'center', paddingHorizontal: 16 },
});
