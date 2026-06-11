import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Animated, Alert, Dimensions,
} from 'react-native';
import {
  ArrowLeft, Bell, Tag, Calendar, Wallet, Star,
  Trash2, CheckCheck, BellOff, Clock,
} from 'lucide-react-native';
import { useNotificationStore } from '../../store/notificationStore';
import { Notification } from '../../types/models';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

// ─── Config ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  booking:  { icon: Calendar, color: colors.primary,   bg: '#EEF2FF', label: 'Booking'  },
  offer:    { icon: Tag,      color: colors.accent,  bg: '#FCE7F3', label: 'Offers'   },
  reminder: { icon: Clock,    color: colors.warning,    bg: '#FEF3C7', label: 'Reminder' },
  wallet:   { icon: Wallet,   color: colors.success,    bg: '#D1FAE5', label: 'Wallet'   },
  loyalty:  { icon: Star,     color: '#F59E0B',         bg: '#FEF9C3', label: 'Loyalty'  },
};

const FILTER_TABS = ['All', 'Unread', 'Booking', 'Offers', 'Wallet'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hrs  < 24)  return `${hrs}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function groupByDate(notifications: Notification[]): { title: string; data: Notification[] }[] {
  const today    = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const groups: Record<string, Notification[]> = {};

  notifications.forEach((n) => {
    const d = new Date(n.createdAt); d.setHours(0,0,0,0);
    let key: string;
    if (d.getTime() === today.getTime())     key = 'Today';
    else if (d.getTime() === yesterday.getTime()) key = 'Yesterday';
    else key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  });

  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

// ─── Swipeable Row ────────────────────────────────────────────────────────────

function NotifRow({
  item,
  onPress,
  onDelete,
}: {
  item: Notification;
  onPress: () => void;
  onDelete: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.reminder;
  const Icon = cfg.icon;

  const swipeLeft = () => {
    Animated.spring(translateX, { toValue: -80, useNativeDriver: true, tension: 80 }).start();
  };
  const resetSwipe = () => {
    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
  };

  return (
    <View style={row.wrap}>
      {/* Delete reveal */}
      <View style={row.deleteReveal}>
        <TouchableOpacity style={row.deleteBtn} onPress={onDelete}>
          <Trash2 size={20} color="white" />
          <Text style={row.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={{ transform: [{ translateX }] }}>
        <TouchableOpacity
          style={[row.item, !item.isRead && row.itemUnread]}
          onPress={onPress}
          onLongPress={swipeLeft}
          onBlur={resetSwipe}
          activeOpacity={0.85}
        >
          {/* Unread indicator */}
          {!item.isRead && <View style={row.unreadBar} />}

          <View style={[row.iconWrap, { backgroundColor: cfg.bg }]}>
            <Icon size={20} color={cfg.color} />
          </View>

          <View style={row.content}>
            <View style={row.topRow}>
              <Text style={[row.title, !item.isRead && row.titleUnread]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={row.time}>{timeAgo(item.createdAt)}</Text>
            </View>
            <Text style={row.body} numberOfLines={2}>{item.body}</Text>

            <View style={row.bottomRow}>
              <View style={[row.typeBadge, { backgroundColor: cfg.bg }]}>
                <Text style={[row.typeBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
              {!item.isRead && <View style={row.unreadDot} />}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function NotificationsScreen({ navigation }: any) {
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
    // Deep-link navigation based on type
    if ((item.type === 'booking' || item.type === 'reminder') && item.data?.bookingId) {
      navigation.navigate('BookingsTab', { screen: 'BookingDetail', params: { id: item.data.bookingId } });
    }
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Remove all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearAll },
    ]);
  };

  // Render flat list data — section headers + items interleaved
  const flatData: ({ type: 'header'; title: string } | { type: 'item'; item: Notification })[] = [];
  groups.forEach((g) => {
    flatData.push({ type: 'header', title: g.title });
    g.data.forEach((item) => flatData.push({ type: 'item', item }));
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {uCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{uCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={markAllRead}
          disabled={uCount === 0}
          style={[styles.markAllBtn, uCount === 0 && { opacity: 0.3 }]}
        >
          <CheckCheck size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
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

      {/* Summary bar */}
      {uCount > 0 && (
        <View style={styles.summaryBar}>
          <Bell size={14} color={colors.primary} />
          <Text style={styles.summaryText}>{uCount} unread notification{uCount > 1 ? 's' : ''}</Text>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      {flatData.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <BellOff size={48} color={colors.gray300} />
          </View>
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptyBody}>
            {activeFilter === 'All'
              ? "You're all caught up! New notifications will appear here."
              : `No ${activeFilter.toLowerCase()} notifications yet.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(item, i) => (item.type === 'header' ? `h-${item.title}` : `n-${item.item.id}`)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return <Text style={styles.sectionHeader}>{item.title}</Text>;
            }
            return (
              <NotifRow
                item={item.item}
                onPress={() => handlePress(item.item)}
                onDelete={() => deleteNotification(item.item.id)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            notifications.length > 0 ? (
              <TouchableOpacity style={styles.clearAllBtn} onPress={handleClearAll}>
                <Trash2 size={15} color={colors.error} />
                <Text style={styles.clearAllText}>Clear all notifications</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const row = StyleSheet.create({
  wrap: { position: 'relative' },
  deleteReveal: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, backgroundColor: colors.error, justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { alignItems: 'center', gap: 4 },
  deleteBtnText: { fontSize: 11, fontWeight: '700', color: 'white' },
  item: { flexDirection: 'row', padding: 14, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 },
  itemUnread: { backgroundColor: '#F8F9FF' },
  unreadBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.primary, borderRadius: 2 },
  iconWrap: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  title: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, flex: 1, marginRight: 8 },
  titleUnread: { fontWeight: '700' },
  time: { fontSize: 11, color: colors.textTertiary, flexShrink: 0 },
  body: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 58, paddingBottom: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  headerMid: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  countBadge: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: colors.primary, borderRadius: 10 },
  countBadgeText: { fontSize: 12, fontWeight: '700', color: 'white' },
  markAllBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  filterWrap: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: colors.border },
  filterList: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  filterTab: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.background, borderRadius: 20, borderWidth: 1.5, borderColor: 'transparent' },
  filterTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterTabTextActive: { color: 'white' },
  filterBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.error, justifyContent: 'center', alignItems: 'center' },
  filterBadgeText: { fontSize: 10, fontWeight: '700', color: 'white' },
  summaryBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.primaryLight },
  summaryText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.primary },
  markAllText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  sectionHeader: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  listContent: { paddingBottom: 32 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptyBody: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  clearAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, margin: 16, padding: 14, backgroundColor: colors.errorLight, borderRadius: 12 },
  clearAllText: { fontSize: 14, fontWeight: '600', color: colors.error },
});
