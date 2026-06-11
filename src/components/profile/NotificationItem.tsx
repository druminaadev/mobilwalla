import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Calendar, Tag, Bell } from 'lucide-react-native';
import { AppNotification } from '@/types/models';
import { colors } from '@/constants/colors';
import { spacing, borderRadius } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: AppNotification;
  onPress: (notification: AppNotification) => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const iconConfig = React.useMemo(() => {
    switch (notification.type) {
      case 'booking':
        return { Icon: Calendar, bg: colors.primary, color: colors.white };
      case 'promo':
        return { Icon: Tag, bg: colors.warning, color: colors.white };
      case 'system':
        return { Icon: Bell, bg: colors.gray300, color: colors.textSecondary };
      default:
        return { Icon: Bell, bg: colors.gray300, color: colors.textSecondary };
    }
  }, [notification.type]);

  const { Icon, bg, color } = iconConfig;

  const relativeTime = React.useMemo(() => {
    try {
      return formatDistanceToNow(notification.timestamp, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  }, [notification.timestamp]);

  return (
    <Pressable
      onPress={() => onPress(notification)}
      style={[styles.container, !notification.isRead && styles.containerUnread]}
      accessibilityLabel={`Notification: ${notification.title}`}
      accessibilityRole="button"
      accessibilityState={{ selected: !notification.isRead }}
    >
      <View style={[styles.iconCircle, { backgroundColor: bg }]}>
        <Icon size={20} color={color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {notification.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {notification.subtitle}
        </Text>
        <Text style={styles.time}>{relativeTime}</Text>
      </View>

      {!notification.isRead && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  containerUnread: {
    backgroundColor: colors.gray50,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  time: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
  },
});
