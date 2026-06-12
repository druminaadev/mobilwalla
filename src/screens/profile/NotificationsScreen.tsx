import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, Dimensions, Platform, StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft, Bell, Tag, Calendar, Wallet, Star,
  Trash2, CheckCheck, BellOff, Clock, ChevronRight
} from 'lucide-react-native';
import { useNotificationStore } from '../../store/notificationStore';
import { Notification } from '../../types/models';
import { colors } from '../../constants/colors';
import Animated, { FadeInUp, Layout, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// --- Config ---
const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  booking:  { icon: Calendar, color: colors.primary,   bg: '#FFE4E6', label: 'Booking'  },
  offer:    { icon: Tag,      color: '#8B5CF6',        bg: '#EDE9FE', label: 'Offer'    },
  reminder: { icon: Clock,    color: '#F59E0B',        bg: '#FEF3C7', label: 'Reminder' },
  wallet:   { icon: Wallet,   color: '#10B981',        bg: '#D1FAE5', label: 'Wallet'   },
  loyalty:  { icon: Star,     color: '#F59E0B',        bg: '#FEF9C3', label: 'Loyalty'  },
};

const FILTER_TABS = ['All', 'Unread', 'Booking', 'Offers', 'Wallet'];

// --- Helpers ---
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins || 1}m`;
  if (hrs  < 24)  return `${hrs}h`;
  if (days < 7)   return `${days}d`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function groupByDate(notifications: Notification[]): { title: string; data: Notification[] }[] {
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const groups: Record<string, Notification[]> = {};

  notifications.forEach((n) => {
    const d = new Date(n.createdAt); d.setHours(0,0,0,0);
    let key: string;
    if (d.getTime() === today.getTime()) key = 'Today';
    else if (d.getTime() === yesterday.getTime()) key = 'Yesterday';
    else key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  });

  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

// --- Main Screen ---
export default function NotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, markRead, markAllRead, deleteNotification, clearAll } = useNotificationStore();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'All')     return true;
    if (activeFilter === 'Unread')  return !n.isRead;
    if (activeFilter === 'Booking') return n.type === 'booking' || n.type === 'reminder';
    if (activeFilter === 'Offers')  return n.type === 'offer';
    if (activeFilter === 'Wallet')  return n.type === 'wallet' || n.type === 'loyalty';
    return true;
  });

  const groups = groupByDate(filtered);
  const uCount = unreadCount();

  const handlePress = (item: Notification) => {
    markRead(item.id);
    
    // Accurate Redirection Routing
    if ((item.type === 'booking' || item.type === 'reminder') && item.data?.bookingId) {
      navigation.navigate('BookingsTab', { screen: 'BookingDetail', params: { id: item.data.bookingId } });
    } else if (item.type === 'offer') {
      navigation.navigate('OffersTab');
    } else if (item.type === 'wallet') {
      navigation.navigate('ProfileTab', { screen: 'WalletHome' });
    } else if (item.type === 'loyalty') {
      navigation.navigate('ProfileTab', { screen: 'MyCoupon' });
    }
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Are you sure you want to delete all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearAll },
    ]);
  };

  const flatData: ({ type: 'header'; title: string } | { type: 'item'; item: Notification; index: number })[] = [];
  let indexCounter = 0;
  groups.forEach((g) => {
    flatData.push({ type: 'header', title: g.title });
    g.data.forEach((item) => {
      flatData.push({ type: 'item', item, index: indexCounter });
      indexCounter++;
    });
  });

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity 
          onPress={markAllRead}
          disabled={uCount === 0}
          style={styles.headerRightBtn}
        >
          <CheckCheck size={20} color={uCount > 0 ? colors.primary : colors.gray300} />
        </TouchableOpacity>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterWrap}>
        <FlatList
          data={FILTER_TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const active = activeFilter === item;
            const unreadInTab = item === 'Unread' ? uCount : 0;
            return (
              <TouchableOpacity
                style={[styles.filterTab, active && styles.filterTabActive]}
                onPress={() => setActiveFilter(item)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>{item}</Text>
                {unreadInTab > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{unreadInTab}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* NOTIFICATION LIST */}
      {flatData.length === 0 ? (
        <Animated.View entering={FadeInUp.delay(200)} style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <BellOff size={40} color={colors.textTertiary} />
          </View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyBody}>
            {activeFilter === 'All'
              ? "When you get notifications, they'll show up here."
              : `You have no ${activeFilter.toLowerCase()} notifications.`}
          </Text>
        </Animated.View>
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(item, i) => (item.type === 'header' ? `h-${item.title}` : `n-${item.item.id}`)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom, 40) }]}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return <Text style={styles.sectionHeader}>{item.title}</Text>;
            }
            
            const nItem = item.item;
            const cfg = TYPE_CONFIG[nItem.type] ?? TYPE_CONFIG.reminder;
            const Icon = cfg.icon;

            return (
              <Animated.View entering={FadeInUp.delay(item.index * 50)} layout={Layout.springify()}>
                <TouchableOpacity
                  style={[styles.notifCard, !nItem.isRead && styles.notifCardUnread]}
                  onPress={() => handlePress(nItem)}
                  activeOpacity={0.85}
                >
                  {!nItem.isRead && <View style={styles.unreadIndicator} />}
                  
                  <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                    <Icon size={20} color={cfg.color} />
                  </View>
                  
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={[styles.cardTitle, !nItem.isRead && styles.cardTitleUnread]} numberOfLines={1}>
                        {nItem.title}
                      </Text>
                      <Text style={styles.cardTime}>{timeAgo(nItem.createdAt)}</Text>
                    </View>
                    <Text style={styles.cardBody} numberOfLines={2}>{nItem.body}</Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => deleteNotification(nItem.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Trash2 size={16} color={colors.gray300} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
          ListFooterComponent={
            notifications.length > 0 ? (
              <TouchableOpacity style={styles.clearAllBtn} onPress={handleClearAll}>
                <Text style={styles.clearAllText}>Clear All Notifications</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingBottom: 16, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray50, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  headerRightBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

  filterWrap: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.gray100, paddingBottom: 12 },
  filterList: { paddingHorizontal: 16, paddingTop: 12, gap: 10 },
  filterTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.gray50, borderRadius: 20, borderWidth: 1, borderColor: colors.gray100 },
  filterTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterTabTextActive: { color: '#fff' },
  filterBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  filterBadgeText: { fontSize: 10, fontWeight: '800', color: colors.primary },

  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  sectionHeader: { fontSize: 13, fontWeight: '800', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 24, marginBottom: 12, paddingLeft: 4 },
  
  notifCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  notifCardUnread: { backgroundColor: '#FFFAFB', borderColor: '#FF5C8A20', borderWidth: 1 },
  unreadIndicator: { position: 'absolute', top: '50%', left: 0, width: 4, height: 24, backgroundColor: colors.primary, borderTopRightRadius: 4, borderBottomRightRadius: 4, marginTop: -12 },
  
  iconWrap: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardContent: { flex: 1, marginRight: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, flex: 1, marginRight: 8 },
  cardTitleUnread: { fontWeight: '800' },
  cardTime: { fontSize: 12, fontWeight: '500', color: colors.textTertiary },
  cardBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  
  deleteBtn: { padding: 8 },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.gray50, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  emptyBody: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  clearAllBtn: { marginVertical: 24, alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 24, backgroundColor: colors.error + '15', borderRadius: 20 },
  clearAllText: { fontSize: 14, fontWeight: '700', color: colors.error },
});
