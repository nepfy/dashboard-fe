"use client";

import { useEffect } from "react";
import Link from "next/link";
import CloseIcon from "#/components/icons/CloseIcon";
import { useNotifications } from "#/hooks/useNotifications";
import {
  trackNotificationCenterOpened,
  trackNotificationClicked,
  trackNotificationsMarkedAllRead,
  trackNotificationDeleted,
} from "#/lib/analytics/track";

// Helper to get notification icon based on type
function getNotificationIcon(type: string) {
  const icons: Record<string, string> = {
    proposal_viewed: "👁️",
    proposal_accepted: "✅",
    proposal_rejected: "❌",
    proposal_feedback: "💬",
    proposal_expired: "⏰",
    proposal_expiring_soon: "⏳",
    project_status_changed: "📝",
    payment_received: "💰",
    subscription_updated: "📦",
    system_announcement: "📢",
  };
  return icons[type] || "🔔";
}

// Format date to relative time
function formatRelativeTime(date: Date | null): string {
  if (!date) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return "Agora mesmo";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min atrás`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h atrás`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d atrás`;
  }

  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default function Notifications({
  isNotificationOpen,
  setIsNotificationOpenAction,
}: {
  isNotificationOpen: boolean;
  setIsNotificationOpenAction: (isOpen: boolean) => void;
}) {
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    if (isNotificationOpen) {
      trackNotificationCenterOpened({
        unread_count: notifications.filter((n) => !n.isRead).length,
      });
    }
  }, [isNotificationOpen, notifications]);

  const handleNotificationClick = async (
    notificationId: string,
    actionUrl: string | null,
    isRead: boolean,
    notificationType: string
  ) => {
    if (!isRead) {
      await markAsRead(notificationId);
      trackNotificationClicked({
        notification_id: notificationId,
        notification_type: notificationType,
      });
    }

    if (actionUrl) {
      setIsNotificationOpenAction(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    await markAllAsRead();
    trackNotificationsMarkedAllRead({
      count: unreadCount,
    });
  };

  const handleDelete = async (
    e: React.MouseEvent,
    notificationId: string,
    notificationType: string
  ) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
    trackNotificationDeleted({
      notification_id: notificationId,
      notification_type: notificationType,
    });
  };

  if (!isNotificationOpen) return null;

  return (
    <div className="bg-filter absolute top-0 left-0 z-40 w-full h-full">
      <div className="absolute sm:right-7 sm:top-2 sm:mt-2 bg-white sm:shadow-lg sm:rounded-xs z-10 sm:w-[397px] h-full sm:h-auto max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <p className="text-lg font-normal text-gray-900">Notificações</p>
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary-light-400 hover:text-primary-light-500 font-medium"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div
            className="button-inner h-[44px] w-[44px] p-4 rounded-xs border border-white-neutral-light-300 flex items-center justify-center cursor-pointer hover:bg-white-neutral-light-200"
            onClick={() => setIsNotificationOpenAction(false)}
          >
            <CloseIcon width="16" height="16" />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light-400"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-sm text-gray-500">
                Você não tem notificações
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => {
                const NotificationWrapper = notification.actionUrl
                  ? Link
                  : "div";
                const wrapperProps = notification.actionUrl
                  ? { href: notification.actionUrl }
                  : {};

                return (
                  <NotificationWrapper
                    key={notification.id}
                    {...wrapperProps}
                    className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.actionUrl,
                        notification.isRead,
                        notification.type
                      )
                    }
                  >
                    {/* Icon */}
                    <div className="h-10 w-10 bg-primary-light-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className={`text-sm font-medium ${
                            notification.isRead
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>

                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) =>
                        handleDelete(e, notification.id, notification.type)
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                      aria-label="Excluir notificação"
                    >
                      <CloseIcon width="12" height="12" />
                    </button>
                  </NotificationWrapper>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
