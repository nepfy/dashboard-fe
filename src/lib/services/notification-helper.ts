/**
 * Notification Helper
 * Helper functions to create notifications for specific events
 */

import { NotificationService } from "./notification-service";
import { EmailService } from "./email-service";
import type { NotificationType } from "#/lib/db/schema/notifications";
import { db } from "#/lib/db";
import { personUserTable } from "#/lib/db/schema/users";
import { eq } from "drizzle-orm";

export class NotificationHelper {
  /**
   * Helper to send email for notification
   */
  private static async sendEmailForNotification(
    userId: string,
    notification: Awaited<ReturnType<typeof NotificationService.create>>
  ) {
    try {
      // Get user email
      const [user] = await db
        .select()
        .from(personUserTable)
        .where(eq(personUserTable.id, userId))
        .limit(1);

      if (!user?.email) {
        console.warn(`No email found for user ${userId}`);
        return;
      }

      // Send email notification
      await EmailService.sendNotificationEmail({
        to: user.email,
        notification,
        userName: user.firstName || undefined,
      });
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  }

  /**
   * Create notification when a proposal is viewed
   */
  static async notifyProposalViewed(
    userId: string,
    projectId: string,
    projectName: string,
    clientName: string
  ) {
    const shouldShow = await NotificationService.shouldShowInApp(
      userId,
      "proposal_viewed"
    );

    if (!shouldShow) {
      return null;
    }

    const notification = await NotificationService.create({
      userId,
      type: "proposal_viewed",
      title: "Proposta visualizada",
      message: `${clientName} visualizou sua proposta "${projectName}". Fique atento para possíveis retornos!`,
      projectId,
      metadata: {
        projectId,
        projectName,
        clientName,
      },
      actionUrl: `/dashboard/propostas/${projectId}`,
    });

    // Send email asynchronously
    this.sendEmailForNotification(userId, notification);

    return {
      notification,
      trackingData: {
        notification_id: notification.id,
        notification_type: notification.type,
        user_id: userId,
        via_email: true,
      },
    };
  }

  /**
   * Create notification when a proposal is accepted
   */
  static async notifyProposalAccepted(
    userId: string,
    projectId: string,
    projectName: string,
    clientName: string
  ) {
    const shouldShow = await NotificationService.shouldShowInApp(
      userId,
      "proposal_accepted"
    );

    if (!shouldShow) {
      return null;
    }

    const notification = await NotificationService.create({
      userId,
      type: "proposal_accepted",
      title: "🎉 Proposta aceita!",
      message: `Parabéns! ${clientName} aceitou sua proposta "${projectName}". Entre em contato para os próximos passos.`,
      projectId,
      metadata: {
        projectId,
        projectName,
        clientName,
      },
      actionUrl: `/dashboard/propostas/${projectId}`,
    });

    // Send email asynchronously
    this.sendEmailForNotification(userId, notification);

    return {
      notification,
      trackingData: {
        notification_id: notification.id,
        notification_type: notification.type,
        user_id: userId,
        via_email: true,
      },
    };
  }

  /**
   * Create notification when a proposal is rejected
   */
  static async notifyProposalRejected(
    userId: string,
    projectId: string,
    projectName: string,
    clientName: string
  ) {
    return await NotificationService.create({
      userId,
      type: "proposal_rejected",
      title: "Proposta rejeitada",
      message: `${clientName} rejeitou a proposta "${projectName}". Considere fazer ajustes e reenviar.`,
      projectId,
      metadata: {
        projectId,
        projectName,
        clientName,
      },
      actionUrl: `/dashboard/propostas/${projectId}`,
    });
  }

  /**
   * Create notification when an adjustment is requested
   */
  static async notifyAdjustmentRequested(
    userId: string,
    projectId: string,
    projectName: string,
    clientName: string,
    adjustmentType: string,
    description: string
  ) {
    const shouldShow = await NotificationService.shouldShowInApp(
      userId,
      "proposal_feedback"
    );

    if (!shouldShow) {
      return null;
    }

    const adjustmentTypeLabels: Record<string, string> = {
      change_values_or_plans: "alteração de valores ou planos",
      change_scope: "alteração de escopo",
      change_timeline: "alteração de prazo",
      other: "outro tipo de ajuste",
    };

    const adjustmentLabel = adjustmentTypeLabels[adjustmentType] || "ajuste";

    const notification = await NotificationService.create({
      userId,
      type: "proposal_feedback",
      title: "🔧 Ajuste solicitado na proposta",
      message: `${clientName} solicitou ${adjustmentLabel} na proposta "${projectName}". Verifique os detalhes e responda!`,
      projectId,
      metadata: {
        projectId,
        projectName,
        clientName,
        adjustmentType,
        description,
      },
      actionUrl: `/dashboard/propostas/${projectId}`,
    });

    // Send email asynchronously
    this.sendEmailForNotification(userId, notification);

    return {
      notification,
      trackingData: {
        notification_id: notification.id,
        notification_type: notification.type,
        user_id: userId,
        via_email: true,
      },
    };
  }

  /**
   * Create notification when feedback is received on a proposal
   */
  static async notifyProposalFeedback(
    userId: string,
    projectId: string,
    projectName: string,
    clientName: string,
    feedbackText?: string
  ) {
    const shouldShow = await NotificationService.shouldShowInApp(
      userId,
      "proposal_feedback"
    );

    if (!shouldShow) {
      return null;
    }

    return await NotificationService.create({
      userId,
      type: "proposal_feedback",
      title: "Novo feedback recebido",
      message: `${clientName} deixou um feedback na proposta "${projectName}".`,
      projectId,
      metadata: {
        projectId,
        projectName,
        clientName,
        feedbackText,
      },
      actionUrl: `/dashboard/propostas/${projectId}`,
    });
  }

  /**
   * Create notification when a proposal expires
   */
  static async notifyProposalExpired(
    userId: string,
    projectId: string,
    projectName: string,
    clientName: string
  ) {
    return await NotificationService.create({
      userId,
      type: "proposal_expired",
      title: "Proposta expirada",
      message: `A proposta "${projectName}" para ${clientName} expirou. Considere renovar a validade.`,
      projectId,
      metadata: {
        projectId,
        projectName,
        clientName,
      },
      actionUrl: `/dashboard/propostas/${projectId}`,
    });
  }

  /**
   * Create notification when a proposal is expiring soon (24-48h before)
   */
  static async notifyProposalExpiringSoon(
    userId: string,
    projectId: string,
    projectName: string,
    clientName: string,
    hoursLeft: number
  ) {
    const shouldShow = await NotificationService.shouldShowInApp(
      userId,
      "proposal_expiring_soon"
    );

    if (!shouldShow) {
      return null;
    }

    return await NotificationService.create({
      userId,
      type: "proposal_expiring_soon",
      title: "Proposta expirando em breve",
      message: `A proposta "${projectName}" para ${clientName} expira em ${hoursLeft} horas. Entre em contato com o cliente!`,
      projectId,
      metadata: {
        projectId,
        projectName,
        clientName,
        hoursLeft,
      },
      actionUrl: `/dashboard/propostas/${projectId}`,
    });
  }

  /**
   * Create notification when project status changes
   */
  static async notifyProjectStatusChanged(
    userId: string,
    projectId: string,
    projectName: string,
    oldStatus: string,
    newStatus: string
  ) {
    const statusMessages: Record<string, string> = {
      approved: "foi aprovada",
      negotiation: "está em negociação",
      rejected: "foi rejeitada",
      active: "está ativa",
      expired: "expirou",
      archived: "foi arquivada",
      draft: "está em rascunho",
    };

    const message =
      statusMessages[newStatus] || `mudou de status para ${newStatus}`;

    return await NotificationService.create({
      userId,
      type: "project_status_changed",
      title: "Status do projeto atualizado",
      message: `O projeto "${projectName}" ${message}.`,
      projectId,
      metadata: {
        projectId,
        projectName,
        oldStatus,
        newStatus,
      },
      actionUrl: `/dashboard/propostas/${projectId}`,
    });
  }

  /**
   * Create notification when payment is received
   */
  static async notifyPaymentReceived(
    userId: string,
    amount: number,
    currency = "BRL",
    projectId?: string,
    projectName?: string
  ) {
    const shouldShow = await NotificationService.shouldShowInApp(
      userId,
      "payment_received"
    );

    if (!shouldShow) {
      return null;
    }

    const formattedAmount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(amount);

    const message = projectId
      ? `Pagamento de ${formattedAmount} recebido para o projeto "${projectName}".`
      : `Pagamento de ${formattedAmount} recebido.`;

    return await NotificationService.create({
      userId,
      type: "payment_received",
      title: "💰 Pagamento recebido",
      message,
      projectId,
      metadata: {
        amount,
        currency,
        projectId,
        projectName,
      },
      actionUrl: projectId ? `/dashboard/propostas/${projectId}` : undefined,
    });
  }

  /**
   * Create notification for subscription updates
   */
  static async notifySubscriptionUpdated(
    userId: string,
    planName: string,
    action: "upgraded" | "downgraded" | "cancelled" | "renewed"
  ) {
    const actionMessages = {
      upgraded: "foi atualizado",
      downgraded: "foi alterado",
      cancelled: "foi cancelado",
      renewed: "foi renovado",
    };

    return await NotificationService.create({
      userId,
      type: "subscription_updated",
      title: "Assinatura atualizada",
      message: `Seu plano ${planName} ${actionMessages[action]}.`,
      metadata: {
        planName,
        action,
      },
      actionUrl: "/dashboard/planos",
    });
  }

  /**
   * Create system announcement notification
   */
  static async notifySystemAnnouncement(
    userId: string,
    title: string,
    message: string,
    actionUrl?: string
  ) {
    return await NotificationService.create({
      userId,
      type: "system_announcement",
      title,
      message,
      metadata: {},
      actionUrl,
    });
  }

  /**
   * Batch create notifications for multiple users
   */
  static async notifyMultipleUsers(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      projectId?: string;
      metadata?: Record<string, unknown>;
      actionUrl?: string;
    }
  ) {
    const notifications = await Promise.allSettled(
      userIds.map((userId) =>
        NotificationService.create({
          userId,
          type,
          title,
          message,
          projectId: options?.projectId,
          metadata: options?.metadata,
          actionUrl: options?.actionUrl,
        })
      )
    );

    const successful = notifications.filter((n) => n.status === "fulfilled");
    const failed = notifications.filter((n) => n.status === "rejected");

    return {
      successful: successful.length,
      failed: failed.length,
      total: userIds.length,
    };
  }
}

