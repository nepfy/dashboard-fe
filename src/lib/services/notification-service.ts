/**
 * Notification Service
 * Handles creation, retrieval, and management of notifications
 */

import { db } from "#/lib/db";
import {
  notificationsTable,
  notificationPreferencesTable,
  type NotificationType,
  type NotificationMetadata,
} from "#/lib/db/schema/notifications";
import { eq, and, sql, desc } from "drizzle-orm";

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  projectId?: string;
  metadata?: NotificationMetadata;
  actionUrl?: string;
}

export interface NotificationWithProject {
  id: string;
  userId: string;
  projectId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  metadata: NotificationMetadata | null;
  isRead: boolean;
  readAt: Date | null;
  emailSent: boolean;
  emailSentAt: Date | null;
  actionUrl: string | null;
  created_at: Date;
  updated_at: Date | null;
  deleted_at?: Date | null;
}

export class NotificationService {
  /**
   * Create a new notification
   */
  static async create(
    params: CreateNotificationParams
  ): Promise<NotificationWithProject> {
    const [notification] = await db
      .insert(notificationsTable)
      .values({
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        projectId: params.projectId || null,
        metadata: params.metadata || null,
        actionUrl: params.actionUrl || null,
        isRead: false,
        emailSent: false,
      })
      .returning();

    return notification as NotificationWithProject;
  }

  /**
   * Get all notifications for a user
   */
  static async getByUserId(
    userId: string,
    limit = 50
  ): Promise<NotificationWithProject[]> {
    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, userId))
      .orderBy(desc(notificationsTable.created_at))
      .limit(limit);

    return notifications as NotificationWithProject[];
  }

  /**
   * Get unread notifications count for a user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(notificationsTable)
      .where(
        and(
          eq(notificationsTable.userId, userId),
          eq(notificationsTable.isRead, false)
        )
      );

    return result[0]?.count || 0;
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    await db
      .update(notificationsTable)
      .set({
        isRead: true,
        readAt: new Date(),
        updated_at: new Date(),
      })
      .where(eq(notificationsTable.id, notificationId));
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string): Promise<void> {
    await db
      .update(notificationsTable)
      .set({
        isRead: true,
        readAt: new Date(),
        updated_at: new Date(),
      })
      .where(
        and(
          eq(notificationsTable.userId, userId),
          eq(notificationsTable.isRead, false)
        )
      );
  }

  /**
   * Delete a notification
   */
  static async delete(notificationId: string): Promise<void> {
    await db
      .delete(notificationsTable)
      .where(eq(notificationsTable.id, notificationId));
  }

  /**
   * Mark notification email as sent
   */
  static async markEmailSent(notificationId: string): Promise<void> {
    await db
      .update(notificationsTable)
      .set({
        emailSent: true,
        emailSentAt: new Date(),
        updated_at: new Date(),
      })
      .where(eq(notificationsTable.id, notificationId));
  }

  /**
   * Get notification preferences for a user
   */
  static async getPreferences(userId: string) {
    const [preferences] = await db
      .select()
      .from(notificationPreferencesTable)
      .where(eq(notificationPreferencesTable.userId, userId));

    // If no preferences exist, create default ones
    if (!preferences) {
      const [newPreferences] = await db
        .insert(notificationPreferencesTable)
        .values({
          userId,
          emailEnabled: true,
          inAppEnabled: true,
        })
        .returning();

      return newPreferences;
    }

    return preferences;
  }

  /**
   * Update notification preferences
   */
  static async updatePreferences(
    userId: string,
    preferences: Partial<
      Omit<
        typeof notificationPreferencesTable.$inferInsert,
        "id" | "userId" | "created_at" | "updated_at"
      >
    >
  ) {
    const [updated] = await db
      .update(notificationPreferencesTable)
      .set({
        ...preferences,
        updated_at: new Date(),
      })
      .where(eq(notificationPreferencesTable.userId, userId))
      .returning();

    return updated;
  }

  /**
   * Check if user should receive email for notification type
   */
  static async shouldSendEmail(
    userId: string,
    type: NotificationType
  ): Promise<boolean> {
    const preferences = await this.getPreferences(userId);

    if (!preferences.emailEnabled) {
      return false;
    }

    // Map notification type to preference field
    const emailPreferenceMap: Record<string, keyof typeof preferences> = {
      proposal_viewed: "emailProposalViewed",
      proposal_accepted: "emailProposalAccepted",
      proposal_feedback: "emailProposalFeedback",
      proposal_expiring_soon: "emailProposalExpiring",
      payment_received: "emailPaymentReceived",
    };

    const preferenceKey = emailPreferenceMap[type];
    if (!preferenceKey) {
      return false; // Default to not sending for unmapped types
    }

    return Boolean(preferences[preferenceKey]);
  }

  /**
   * Check if user should receive in-app notification for type
   */
  static async shouldShowInApp(
    userId: string,
    type: NotificationType
  ): Promise<boolean> {
    const preferences = await this.getPreferences(userId);

    if (!preferences.inAppEnabled) {
      return false;
    }

    // Map notification type to preference field
    const inAppPreferenceMap: Record<string, keyof typeof preferences> = {
      proposal_viewed: "inAppProposalViewed",
      proposal_accepted: "inAppProposalAccepted",
      proposal_feedback: "inAppProposalFeedback",
      proposal_expiring_soon: "inAppProposalExpiring",
      payment_received: "inAppPaymentReceived",
    };

    const preferenceKey = inAppPreferenceMap[type];
    if (!preferenceKey) {
      return true; // Default to showing for unmapped types
    }

    return Boolean(preferences[preferenceKey]);
  }
}
