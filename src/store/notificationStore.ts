import { create } from 'zustand';
import { Notification } from '../types/models';
import { DEMO_NOTIFICATIONS } from '../data/demo';

interface NotificationState {
  notifications: Notification[];
  unreadCount: () => number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: DEMO_NOTIFICATIONS,

  unreadCount: () => get().notifications.filter((n) => !n.isRead).length,

  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
    })),

  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: true })) })),

  deleteNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  clearAll: () => set({ notifications: [] }),

  addNotification: (n) =>
    set((s) => ({
      notifications: [
        {
          ...n,
          id: `n${Date.now()}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...s.notifications,
      ],
    })),
}));
