/**
 * useNotifications Hook
 * Custom hook for managing notifications in the application
 */

import { useState, useEffect, useCallback } from "react";
import type { NotificationWithProject } from "#/lib/services/notification-service";

export interface UseNotificationsReturn {
  notifications: NotificationWithProject[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<
    NotificationWithProject[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Changed to false by default
  const [error, setError] = useState<string | null>(null);

  // 🚨 MANUAL OVERRIDE: Disable notifications system
  // TODO: Remove when feature flag is active
  const NOTIFICATIONS_DISABLED = true;

  const fetchNotifications = useCallback(async () => {
    if (NOTIFICATIONS_DISABLED) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/notifications");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Erro ao buscar notificações");
      }

      setNotifications(data.notifications);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao buscar notificações"
      );
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [NOTIFICATIONS_DISABLED]);

  const fetchUnreadCount = useCallback(async () => {
    if (NOTIFICATIONS_DISABLED) return;

    try {
      const response = await fetch("/api/notifications/unread-count");
      const data = await response.json();

      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, [NOTIFICATIONS_DISABLED]);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/notifications/${id}/read`, {
          method: "PATCH",
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.error || "Erro ao marcar notificação como lida"
          );
        }

        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id
              ? { ...notif, isRead: true, readAt: new Date() }
              : notif
          )
        );

        // Update unread count
        await fetchUnreadCount();
      } catch (err) {
        console.error("Error marking notification as read:", err);
        throw err;
      }
    },
    [fetchUnreadCount]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.error || "Erro ao marcar todas as notificações como lidas"
        );
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          isRead: true,
          readAt: new Date(),
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/notifications/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Erro ao excluir notificação");
        }

        // Update local state
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));

        // Update unread count
        await fetchUnreadCount();
      } catch (err) {
        console.error("Error deleting notification:", err);
        throw err;
      }
    },
    [fetchUnreadCount]
  );

  const refetch = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    if (NOTIFICATIONS_DISABLED) return;

    refetch();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch, fetchUnreadCount, NOTIFICATIONS_DISABLED]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}

