import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Animated, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Heart, MapPin, Clock, Phone, Star, Share2, Info, Navigation } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeStackParamList } from '@/types/navigation';
import { Button } from '@/components/common/Button';
import { DEMO_SALONS, DEMO_SERVICES, DEMO_STAFF, DEMO_REVIEWS, SALON_AMENITIES, SALON_HOURS } from '@/data/demo';
import { colors } from '@/constants/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'SalonDetail'>;
const { width } = Dimensions.get('window');

const HERO_HEIGHT = 320;

export default function SalonDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'staff' | 'reviews'>('services');
  const scrollY = useRef(new Animated.Value(0)).current;

  const salon = DEMO_SALONS.find((s) => s.id === id) ?? DEMO_SALONS[0];
  const services = DEMO_SERVICES[id] ?? DEMO_SERVICES.default;
  const staff = DEMO_STAFF[id] ?? DEMO_STAFF.default;
  const reviews = DEMO_REVIEWS.filter((r) => r.salonId === id).concat(DEMO_REVIEWS).slice(0, 3);
  const amenities = SALON_AMENITIES[id] ?? SALON_AMENITIES.default;

  const serviceCategories = [...new Set(services.map((s) => s.categoryId))];

  // Helper for placeholder images
  const heroImage = 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=80';

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT - 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* ── Animated Sticky Header ── */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <Text style={styles.stickyHeaderTitle} numberOfLines={1}>{salon.name}</Text>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Hero Image Section ── */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: heroImage }} style={styles.heroImage} />
          <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient} />
          
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButtonBlur}>
              <ArrowLeft size={20} color="#FFF" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={styles.iconButtonBlur}>
                <Share2 size={18} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.iconButtonBlur}>
                <Heart size={20} color={isFavorite ? colors.error : '#FFF'} fill={isFavorite ? colors.error : 'none'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Floating Info Card ── */}
        <View style={styles.contentContainer}>
          <View style={styles.floatingInfoCard}>
            <View style={styles.titleRow}>
              <Text style={styles.salonName}>{salon.name}</Text>
              <View style={styles.ratingBadge}>
                <Star size={14} color="#FFF" fill="#FFF" />
                <Text style={styles.ratingText}>{salon.rating}</Text>
              </View>
            </View>
            <Text style={styles.reviewCountText}>{salon.totalReviews} verified reviews</Text>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoIconWrapper}><MapPin size={18} color={colors.primary} /></View>
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>{salon.city}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoIconWrapper}><Clock size={18} color={colors.primary} /></View>
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoLabel}>Open until</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>9:00 PM</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Tabs ── */}
          <View style={styles.tabsContainer}>
            {(['services', 'staff', 'reviews'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Services Tab ── */}
          {activeTab === 'services' && (
            <View style={styles.tabContent}>
              {serviceCategories.map((cat) => (
                <View key={cat} style={styles.categoryBlock}>
                  <Text style={styles.categoryTitle}>{cat.toUpperCase()}</Text>
                  {services.filter((s) => s.categoryId === cat).map((service, index) => (
                    <View key={service.id} style={[styles.serviceItem, index === services.length - 1 && { borderBottomWidth: 0 }]}>
                      <View style={{ flex: 1, paddingRight: 16 }}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceMeta} numberOfLines={2}>{service.description}</Text>
                        <View style={styles.serviceDurationRow}>
                          <Clock size={12} color={colors.textTertiary} />
                          <Text style={styles.serviceDurationText}>{service.duration} min</Text>
                        </View>
                      </View>
                      <View style={styles.serviceRight}>
                        <Text style={styles.servicePrice}>₹{service.price}</Text>
                        {/* Static visual plus button for UX; actual selection happens in flow */}
                        <View style={styles.serviceAddBtn}>
                          <Text style={styles.serviceAddBtnText}>Add</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* ── Staff Tab ── */}
          {activeTab === 'staff' && (
            <View style={styles.tabContent}>
              {staff.map((member) => (
                <View key={member.id} style={styles.staffCard}>
                  <Image
                    source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=100` }}
                    style={[styles.staffAvatar, !member.isAvailable && { opacity: 0.5 }]}
                  />
                  <View style={{ flex: 1 }}>
                    <View style={styles.staffHeaderRow}>
                      <Text style={styles.staffName}>{member.name}</Text>
                      {!member.isAvailable && (
                        <View style={styles.unavailableBadge}>
                          <Text style={styles.unavailableText}>Offline</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.staffSpec}>{member.specialization}</Text>
                    <View style={styles.staffMetaRow}>
                      <Star size={12} color={colors.warning} fill={colors.warning} />
                      <Text style={styles.staffMetaText}>{member.rating} • {member.totalBookings} bookings</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ── Reviews Tab ── */}
          {activeTab === 'reviews' && (
            <View style={styles.tabContent}>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name ?? 'U')}&background=random&color=fff` }}
                      style={styles.reviewAvatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewerName}>{review.user?.name ?? 'Customer'}</Text>
                      <Text style={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                    <View style={styles.reviewStars}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} color={i < review.rating ? colors.warning : colors.gray200} fill={i < review.rating ? colors.warning : colors.gray200} />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}

          {/* ── About & Amenities Section ── */}
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About {salon.name}</Text>
            <Text style={styles.aboutText}>{salon.description}</Text>
            
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {amenities.map((a) => (
                <View key={a} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{a}</Text>
                </View>
              ))}
            </View>

            {/* Quick Access Buttons */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Explore More</Text>
            <View style={styles.quickAccessGrid}>
              <TouchableOpacity onPress={() => navigation.navigate('Gallery')} style={styles.quickAccessBtn}>
                <Text style={styles.quickAccessIcon}>📸</Text>
                <Text style={styles.quickAccessText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Reviews')} style={styles.quickAccessBtn}>
                <Text style={styles.quickAccessIcon}>⭐</Text>
                <Text style={styles.quickAccessText}>All Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Team')} style={styles.quickAccessBtn}>
                <Text style={styles.quickAccessIcon}>👥</Text>
                <Text style={styles.quickAccessText}>Our Team</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Location')} style={styles.quickAccessBtn}>
                <Text style={styles.quickAccessIcon}>📍</Text>
                <Text style={styles.quickAccessText}>Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Floating Book Footer ── */}
      <View style={styles.floatingFooter}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Select Services</Text>
          <Text style={styles.footerSub}>To view total price</Text>
        </View>
        <TouchableOpacity
          style={styles.bookActionBtn}
          onPress={() => navigation.navigate('ServiceSelection', { salonId: id })}
        >
          <Text style={styles.bookActionText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Sticky Header
  stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: Platform.OS === 'ios' ? 100 : 80, backgroundColor: colors.white, zIndex: 10, justifyContent: 'flex-end', paddingBottom: 16, paddingHorizontal: 60, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
  stickyHeaderTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },

  // Hero Image
  heroContainer: { width, height: HERO_HEIGHT, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', width: '100%', height: '100%' },
  headerButtons: { position: 'absolute', top: Platform.OS === 'ios' ? 56 : 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  iconButtonBlur: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },

  // Content Area
  contentContainer: { marginTop: -40, borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: colors.background },
  
  // Floating Info Card
  floatingInfoCard: { marginHorizontal: 20, marginTop: -40, backgroundColor: colors.white, borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  salonName: { flex: 1, fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5, marginRight: 10 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.warning, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  ratingText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  reviewCountText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500', marginBottom: 16 },
  divider: { height: 1, backgroundColor: colors.gray100, marginBottom: 16 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  infoItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIconWrapper: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  infoTextWrapper: { flex: 1 },
  infoLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  infoValue: { fontSize: 14, color: colors.textPrimary, fontWeight: '700' },

  // Tabs
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, marginTop: 24, backgroundColor: colors.white, borderRadius: 16, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.white, fontWeight: '700' },

  // Tab Content
  tabContent: { marginTop: 24, paddingHorizontal: 20 },
  categoryBlock: { marginBottom: 24 },
  categoryTitle: { fontSize: 13, fontWeight: '800', color: colors.textSecondary, marginBottom: 12, letterSpacing: 1 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  serviceName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  serviceMeta: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 6 },
  serviceDurationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  serviceDurationText: { fontSize: 12, color: colors.textTertiary, fontWeight: '500' },
  serviceRight: { alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  servicePrice: { fontSize: 16, fontWeight: '800', color: colors.primary },
  serviceAddBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: colors.primary },
  serviceAddBtnText: { color: colors.primary, fontSize: 13, fontWeight: '700' },

  // Staff Tab
  staffCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.white, borderRadius: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  staffAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16 },
  staffHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  staffName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  unavailableBadge: { backgroundColor: colors.errorLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  unavailableText: { fontSize: 10, color: colors.error, fontWeight: '700', textTransform: 'uppercase' },
  staffSpec: { fontSize: 14, color: colors.textSecondary, marginBottom: 6 },
  staffMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  staffMetaText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },

  // Reviews Tab
  reviewCard: { padding: 20, backgroundColor: colors.white, borderRadius: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  reviewAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  reviewerName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  reviewDate: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },

  // About Section
  aboutSection: { padding: 20, marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  aboutText: { fontSize: 14, color: colors.textSecondary, lineHeight: 24 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amenityChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.gray200 },
  amenityText: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },

  // Quick Access
  quickAccessGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  quickAccessBtn: { width: '48%', padding: 16, backgroundColor: colors.white, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.gray200 },
  quickAccessIcon: { fontSize: 32, marginBottom: 8 },
  quickAccessText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },

  // Floating Footer
  floatingFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 16 },
  footerInfo: { flex: 1 },
  footerLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  footerSub: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  bookActionBtn: { backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16 },
  bookActionText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
