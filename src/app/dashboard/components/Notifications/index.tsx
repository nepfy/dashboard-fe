"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CloseIcon from "#/components/icons/CloseIcon";
import { useNotifications } from "#/hooks/useNotifications";
import {
  trackNotificationCenterOpened,
  trackNotificationClicked,
  trackNotificationsMarkedAllRead,
  trackNotificationDeleted,
} from "#/lib/analytics/track";
import ProposalAcceptedModal from "../NotificationModals/ProposalAcceptedModal";
import ProposalFeedbackModal from "../NotificationModals/ProposalFeedbackModal";

type NotificationWithProject = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  metadata: Record<string, unknown> | null;
  isRead: boolean;
  emailSent: boolean;
  emailSentAt: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
};

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
  const diffInSeconds = Math.floor(
    (now.getTime() - new Date(date).getTime()) / 1000
  );

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

  const [selectedNotification, setSelectedNotification] = useState<NotificationWithProject | null>(null);
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    if (isNotificationOpen) {
      trackNotificationCenterOpened({
        unread_count: notifications.filter((n) => !n.isRead).length,
      });
    }
  }, [isNotificationOpen, notifications]);

  const handleNotificationClick = async (
    notification: NotificationWithProject
  ) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
      trackNotificationClicked({
        notification_id: notification.id,
        notification_type: notification.type,
      });
    }

    // Open specific modal based on notification type
    if (notification.type === "proposal_accepted") {
      setSelectedNotification(notification);
      setShowAcceptedModal(true);
    } else if (notification.type === "proposal_feedback") {
      setSelectedNotification(notification);
      setShowFeedbackModal(true);
    } else if (notification.actionUrl) {
      // For other types with action URL, navigate directly
      setIsNotificationOpenAction(false);
    }
  };

  const handleCloseModal = () => {
    setShowAcceptedModal(false);
    setShowFeedbackModal(false);
    setSelectedNotification(null);
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
    <div className="fixed inset-0 z-40 bg-black bg-opacity-20">
      <div className="absolute z-10 flex h-screen flex-col bg-white sm:top-2 sm:right-7 sm:mt-2 sm:h-auto sm:max-h-[calc(100vh-32px)] sm:w-[397px] sm:rounded-xs sm:shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <p className="text-lg font-normal text-gray-900">Notificações</p>
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-primary-light-400 hover:text-primary-light-500 text-xs font-medium"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div
            className="button-inner border-white-neutral-light-300 hover:bg-white-neutral-light-200 flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-xs border p-4"
            onClick={() => setIsNotificationOpenAction(false)}
          >
            <CloseIcon width="16" height="16" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="border-primary-light-400 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-2 text-4xl">🔔</div>
              <p className="text-sm text-gray-500">Você não tem notificações</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => {
                const hasModal = ["proposal_accepted", "proposal_feedback"].includes(notification.type);
                const commonProps = {
                  key: notification.id,
                  className: `flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`,
                  onClick: () => handleNotificationClick(notification),
                };

                const content = (
                  <>
                    {/* Icon */}
                    <div className="bg-primary-light-100 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-xl">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium ${
                            notification.isRead
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs whitespace-nowrap text-gray-500">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {notification.message}
                      </p>

                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <div className="absolute top-1/2 left-2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-500"></div>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) =>
                        handleDelete(e, notification.id, notification.type)
                      }
                      className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-200"
                      aria-label="Excluir notificação"
                    >
                      <CloseIcon width="12" height="12" />
                    </button>
                  </>
                );

                // If notification has a modal, use a div. If it has an actionUrl and no modal, use Link
                return hasModal || !notification.actionUrl ? (
                  <div {...commonProps}>{content}</div>
                ) : (
                  <Link {...commonProps} href={notification.actionUrl}>
                    {content}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Notification Modals */}
      {selectedNotification && (
        <>
          <ProposalAcceptedModal
            isOpen={showAcceptedModal}
            onClose={handleCloseModal}
            notification={selectedNotification}
          />
          <ProposalFeedbackModal
            isOpen={showFeedbackModal}
            onClose={handleCloseModal}
            notification={selectedNotification}
          />
        </>
      )}
    </div>
  );
}
