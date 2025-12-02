"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Trash2, X } from "lucide-react";
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

interface Adjustment {
  id: string;
  type: string;
  description: string;
  created_at: Date;
}

// Helper to get notification icon path based on type
function getNotificationIconPath(type: string): string {
  const iconMap: Record<string, string> = {
    proposal_viewed: "/images/notification-icons/visualized.png",
    proposal_accepted: "/images/notification-icons/accepted.png",
    proposal_rejected: "/images/notification-icons/adjustment-required.png",
    proposal_feedback: "/images/notification-icons/adjustment-required.png",
    proposal_expired: "/images/notification-icons/adjustment-required.png",
    proposal_expiring_soon:
      "/images/notification-icons/adjustment-required.png",
    project_status_changed:
      "/images/notification-icons/adjustment-required.png",
    payment_received: "/images/notification-icons/accepted.png",
    subscription_updated: "/images/notification-icons/accepted.png",
    system_announcement: "/images/notification-icons/visualized.png",
    metrics_dropping: "/images/notification-icons/adjustment-required.png",
  };
  return iconMap[type] || "/images/notification-icons/visualized.png";
}

// Format date to relative time
function formatRelativeTime(date: Date | null): string {
  if (!date) return "";

  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - notificationDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) return "Agora mesmo";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `há ${minutes} min`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  }

  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (
    notificationDate.getDate() === yesterday.getDate() &&
    notificationDate.getMonth() === yesterday.getMonth() &&
    notificationDate.getFullYear() === yesterday.getFullYear()
  ) {
    return `Ontem, ${notificationDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `há ${days} dia${days > 1 ? "s" : ""}`;
  }

  return notificationDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

// Sort notifications: unread first (newest to oldest), then read (newest to oldest)
function sortNotifications(
  notifications: NotificationWithProject[]
): NotificationWithProject[] {
  return [...notifications].sort((a, b) => {
    // First, separate by read status
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1; // Unread first
    }

    // Then sort by date (newest first) within each group
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
}

export default function Notifications({
  isNotificationOpen,
  setIsNotificationOpenAction,
  notificationsHook,
}: {
  isNotificationOpen: boolean;
  setIsNotificationOpenAction: (isOpen: boolean) => void;
  notificationsHook?: ReturnType<typeof useNotifications>;
}) {
  const defaultHook = useNotifications();
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = notificationsHook || defaultHook;

  const [selectedNotification, setSelectedNotification] =
    useState<NotificationWithProject | null>(null);
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);

  // Sort notifications
  const sortedNotifications = sortNotifications(notifications);

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
      // Open modal immediately with empty adjustments
      setShowFeedbackModal(true);

      // Fetch adjustments in parallel (non-blocking)
      const metadata = notification.metadata as { projectId?: string } | null;
      const projectId = metadata?.projectId;

      if (projectId) {
        try {
          const response = await fetch(
            `/api/projects/${projectId}/adjustments`
          );
          const data = await response.json();

          if (data.success && data.adjustments) {
            setAdjustments(data.adjustments);
          }
        } catch (error) {
          console.error("Error fetching adjustments:", error);
          setAdjustments([]);
        }
      }
    } else if (notification.actionUrl) {
      // For other types with action URL, navigate directly
      setIsNotificationOpenAction(false);
    }
  };

  const handleCloseModal = () => {
    setShowAcceptedModal(false);
    setShowFeedbackModal(false);
    setSelectedNotification(null);
    setAdjustments([]);
  };

  const handleMarkAllAsRead = async () => {
    if (isMarkingAllAsRead) return;

    setIsMarkingAllAsRead(true);
    try {
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      await markAllAsRead();
      trackNotificationsMarkedAllRead({
        count: unreadCount,
      });
    } finally {
      setIsMarkingAllAsRead(false);
    }
  };

  const handleClearAll = async () => {
    if (isClearingAll) return;

    setIsClearingAll(true);
    try {
      // Delete all notifications
      await Promise.all(notifications.map((n) => deleteNotification(n.id)));
    } finally {
      setIsClearingAll(false);
    }
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
    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm">
      <div className="absolute inset-x-0 top-0 z-10 mx-auto flex h-screen max-w-md flex-col bg-white sm:inset-x-auto sm:top-2 sm:right-7 sm:mx-0 sm:mt-2 sm:h-auto sm:max-h-[calc(100vh-32px)] sm:w-[397px] sm:rounded-xl sm:shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-normal text-gray-900">Notificações</h2>
            <button
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 transition-colors hover:bg-gray-100"
              onClick={() => setIsNotificationOpenAction(false)}
              aria-label="Fechar"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Action Bar */}
          {notifications.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                onClick={handleMarkAllAsRead}
                disabled={
                  isMarkingAllAsRead || !notifications.some((n) => !n.isRead)
                }
                className="cursor-pointer text-gray-900 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isMarkingAllAsRead ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Marcando...
                  </span>
                ) : (
                  "Marcar todas como lidas"
                )}
              </button>

              <button
                onClick={handleClearAll}
                disabled={isClearingAll}
                className="cursor-pointer text-gray-900 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isClearingAll ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Limpando...
                  </span>
                ) : (
                  "Limpar tudo"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : sortedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-2 text-4xl">🔔</div>
              <p className="text-sm text-gray-500">Você não tem notificações</p>
            </div>
          ) : (
            <div>
              {sortedNotifications.map((notification) => {
                const hasModal = [
                  "proposal_accepted",
                  "proposal_feedback",
                ].includes(notification.type);

                const iconPath = getNotificationIconPath(notification.type);

                const commonProps = {
                  key: notification.id,
                  className: `flex items-start gap-3 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer relative group border-b border-gray-100 last:border-b-0`,
                  onClick: () => handleNotificationClick(notification),
                };

                const content = (
                  <>
                    {/* Icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
                      <Image
                        src={iconPath}
                        alt={notification.type}
                        width={48}
                        height={48}
                        className="rounded-xl"
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="text-base font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-xs whitespace-nowrap text-gray-400">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-500">
                        {notification.message}
                      </p>
                    </div>

                    {/* Delete button - only visible on hover */}
                    <button
                      onClick={(e) =>
                        handleDelete(e, notification.id, notification.type)
                      }
                      className="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gray-100 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-200"
                      aria-label="Excluir notificação"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600" />
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
            notification={selectedNotification as NotificationWithProject}
          />
          <ProposalFeedbackModal
            isOpen={showFeedbackModal}
            onClose={handleCloseModal}
            notification={selectedNotification as NotificationWithProject}
            adjustments={adjustments}
          />
        </>
      )}
    </div>
  );
}
