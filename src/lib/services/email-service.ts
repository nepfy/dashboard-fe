/**
 * Email Service
 * Handles sending notification emails
 * Uses Resend for email delivery
 */

import type { NotificationWithProject } from "./notification-service";
import { NotificationService } from "./notification-service";
import { trackNotificationEmailSent } from "#/lib/analytics/track";

interface SendNotificationEmailParams {
  to: string;
  notification: NotificationWithProject;
  userName?: string;
}

/**
 * Email templates for different notification types
 */
const getEmailTemplate = (
  notification: NotificationWithProject,
  userName?: string
): { subject: string; html: string; text: string } => {
  const greeting = userName ? `Olá, ${userName}!` : "Olá!";

  // Base template
  const baseHtml = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${notification.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; border-bottom: 1px solid #e5e7eb;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1f2937;">Nepfy</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
                Você está recebendo este email porque está inscrito para receber notificações da Nepfy.<br>
                <a href="https://nepfy.com/dashboard/configuracoes" style="color: #4f46e5; text-decoration: none;">Gerenciar preferências de notificações</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const content = `
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #1f2937;">${greeting}</p>
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1f2937;">${notification.title}</h2>
    <p style="margin: 0 0 24px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">${notification.message}</p>
    ${
      notification.actionUrl
        ? `
    <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
      <tr>
        <td style="border-radius: 6px; background-color: #4f46e5;">
          <a href="https://nepfy.com${notification.actionUrl}" 
             style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 16px;">
            Ver detalhes
          </a>
        </td>
      </tr>
    </table>
    `
        : ""
    }
    <p style="margin: 0; font-size: 14px; color: #6b7280;">
      Acesse o <a href="https://nepfy.com/dashboard" style="color: #4f46e5; text-decoration: none;">painel de controle</a> para ver todas as suas notificações.
    </p>
  `;

  const textContent = `
${greeting}

${notification.title}

${notification.message}

${notification.actionUrl ? `Ver detalhes: https://nepfy.com${notification.actionUrl}` : ""}

Acesse o painel de controle para ver todas as suas notificações: https://nepfy.com/dashboard

---
Você está recebendo este email porque está inscrito para receber notificações da Nepfy.
Gerenciar preferências: https://nepfy.com/dashboard/configuracoes
  `;

  return {
    subject: `Nepfy: ${notification.title}`,
    html: baseHtml(content),
    text: textContent.trim(),
  };
};

/**
 * Email Service Class
 */
export class EmailService {
  /**
   * Send notification email using Resend
   */
  static async sendNotificationEmail({
    to,
    notification,
    userName,
  }: SendNotificationEmailParams): Promise<boolean> {
    try {
      // Check if Resend API key is configured
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        console.warn(
          "RESEND_API_KEY not configured. Email notifications disabled."
        );
        return false;
      }

      // Check if user wants to receive this type of email
      const shouldSend = await NotificationService.shouldSendEmail(
        notification.userId,
        notification.type
      );

      if (!shouldSend) {
        console.log(
          `User ${notification.userId} opted out of ${notification.type} emails`
        );
        return false;
      }

      const { subject, html, text } = getEmailTemplate(notification, userName);

      // Send email using Resend
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Nepfy <notificacoes@nepfy.com>",
          to: [to],
          subject,
          html,
          text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend API error: ${error}`);
      }

      const result = await response.json();

      // Mark email as sent in database
      await NotificationService.markEmailSent(notification.id);

      // Track email sent
      trackNotificationEmailSent({
        notification_id: notification.id,
        notification_type: notification.type,
        user_id: notification.userId,
        email_address: to,
      });

      console.log(`Email sent successfully: ${result.id}`);
      return true;
    } catch (error) {
      console.error("Error sending notification email:", error);
      return false;
    }
  }

  /**
   * Send notification email with retry logic
   */
  static async sendNotificationEmailWithRetry(
    params: SendNotificationEmailParams,
    maxRetries = 3
  ): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const success = await this.sendNotificationEmail(params);
        if (success) {
          return true;
        }
      } catch (error) {
        console.error(`Email send attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          console.error("Max retries reached. Email not sent.");
          return false;
        }
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
    return false;
  }

  /**
   * Send batch notification emails
   */
  static async sendBatchNotificationEmails(
    emails: SendNotificationEmailParams[]
  ): Promise<{ successful: number; failed: number }> {
    const results = await Promise.allSettled(
      emails.map((params) => this.sendNotificationEmail(params))
    );

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value === true
    ).length;
    const failed = results.length - successful;

    return { successful, failed };
  }
}

