/**
 * Email Service
 * Handles sending notification emails
 * Uses Resend for email delivery
 */

import type { NotificationWithProject } from "./notification-service";
import { NotificationService } from "./notification-service";

const APP_BASE_URL = "https://app.nepfy.com";

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
  const projectName =
    (notification.metadata?.projectName as string) || "[NOME DA PROPOSTA]";

  // Base template
  const baseHtml = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${notification.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 40px 40px 32px 40px; background-color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size: 28px; font-weight: 700; color: #1a1a1a;">
                      <span style="color: #6366f1;">.</span>nepfy
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                Conte com a gente. Estamos juntos nessa.
              </p>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">
                .Nepfy
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Unsubscribe -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td style="padding: 0 20px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
                Você está recebendo este email porque está inscrito para receber notificações da Nepfy.<br>
                <a href="${APP_BASE_URL}/dashboard/configuracoes" style="color: #6366f1; text-decoration: none;">Gerenciar preferências de notificações</a>
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

  // Custom templates based on notification type
  let content = "";
  let subject = "";
  let textContent = "";

  switch (notification.type) {
    case "proposal_viewed":
      subject = "A proposta acabou de ser aberta pelo cliente";
      content = `
        <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; line-height: 1.4;">
          ${greeting}
        </h2>
        <p style="margin: 0 0 24px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">
          A proposta <strong>${projectName}</strong> acaba de ser aberta pelo cliente. Esse é o melhor momento para acompanhar o interesse e se preparar para o próximo movimento.
        </p>
        <p style="margin: 0 0 32px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">
          No painel, você pode acompanhar todas as interações em tempo real, conferindo visualizações, ajustes solicitados, histórico e status geral. Isso te ajuda a manter o ritmo certo e não perder nenhuma oportunidade.
        </p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-radius: 8px; background-color: #1a1a1a;">
              <a href="${APP_BASE_URL}${notification.actionUrl}" 
                 style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 16px;">
                Acessar painel de propostas
              </a>
            </td>
          </tr>
        </table>
      `;
      textContent = `${greeting}\n\nA proposta ${projectName} acaba de ser aberta pelo cliente. Esse é o melhor momento para acompanhar o interesse e se preparar para o próximo movimento.\n\nNo painel, você pode acompanhar todas as interações em tempo real, conferindo visualizações, ajustes solicitados, histórico e status geral. Isso te ajuda a manter o ritmo certo e não perder nenhuma oportunidade.\n\nAcessar painel de propostas: ${APP_BASE_URL}${notification.actionUrl}\n\nConte com a gente. Estamos juntos nessa.\n.Nepfy`;
      break;

    case "proposal_feedback":
      subject = "O cliente enviou solicitações de ajuste";

      content = `
        <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; line-height: 1.4;">
          ${greeting}
        </h2>
        <p style="margin: 0 0 24px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">
          O cliente enviou solicitações de ajuste para a proposta <strong>${projectName}</strong>.
        </p>
        <p style="margin: 0 0 32px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">
          Essa é a etapa que costuma definir o fechamento, então vale revisar com cuidado e reenviar a versão atualizada o quanto antes.
        </p>
        <p style="margin: 0 0 32px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">
          No painel, você encontra todos os detalhes do pedido e pode ajustar tudo em poucos minutos e reenviar a nova versão.
        </p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-radius: 8px; background-color: #1a1a1a;">
              <a href="${APP_BASE_URL}${notification.actionUrl}" 
                 style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 16px;">
                Revisar ajustes
              </a>
            </td>
          </tr>
        </table>
      `;
      textContent = `${greeting}\n\nO cliente enviou solicitações de ajuste para a proposta ${projectName}.\n\nEssa é a etapa que costuma definir o fechamento, então vale revisar com cuidado e reenviar a versão atualizada o quanto antes.\n\nNo painel, você encontra todos os detalhes do pedido e pode ajustar tudo em poucos minutos e reenviar a nova versão.\n\nRevisar ajustes: ${APP_BASE_URL}${notification.actionUrl}\n\nConte com a gente. Estamos juntos nessa.\n.Nepfy`;
      break;

    case "proposal_accepted":
      subject = "Temos uma ótima notícia: a proposta foi aprovada pelo cliente";
      content = `
        <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; line-height: 1.4;">
          ${greeting}
        </h2>
        <p style="margin: 0 0 24px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">
          Temos uma ótima notícia: a proposta <strong>${projectName}</strong> foi aprovada pelo cliente. 🎉
        </p>
        <p style="margin: 0 0 32px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">
          A partir daqui, você já pode começar a organizar os próximos passos e seguir com o projeto de maneira mais assertiva.
        </p>
        <p style="margin: 0 0 32px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">
          No painel, você encontra o histórico completo da negociação e todas as informações importantes para continuar o processo com segurança.
        </p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-radius: 8px; background-color: #1a1a1a;">
              <a href="${APP_BASE_URL}${notification.actionUrl}" 
                 style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 16px;">
                Abrir painel
              </a>
            </td>
          </tr>
        </table>
      `;
      textContent = `${greeting}\n\nTemos uma ótima notícia: a proposta ${projectName} foi aprovada pelo cliente. 🎉\n\nA partir daqui, você já pode começar a organizar os próximos passos e seguir com o projeto de maneira mais assertiva.\n\nNo painel, você encontra o histórico completo da negociação e todas as informações importantes para continuar o processo com segurança.\n\nAbrir painel: ${APP_BASE_URL}${notification.actionUrl}\n\nConte com a gente. Estamos juntos nessa.\n.Nepfy`;
      break;

    default:
      // Default template for other notification types
      subject = `Nepfy: ${notification.title}`;
      content = `
        <p style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">${greeting}</p>
        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1a1a1a;">${notification.title}</h2>
        <p style="margin: 0 0 24px 0; font-size: 16px; color: #4b5563; line-height: 1.6;">${notification.message}</p>
        ${
          notification.actionUrl
            ? `
        <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
          <tr>
            <td style="border-radius: 8px; background-color: #1a1a1a;">
              <a href="${APP_BASE_URL}${notification.actionUrl}" 
                 style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 16px;">
                Ver detalhes
              </a>
            </td>
          </tr>
        </table>
        `
            : ""
        }
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          Acesse o <a href="${APP_BASE_URL}/dashboard" style="color: #6366f1; text-decoration: none;">painel de controle</a> para ver todas as suas notificações.
        </p>
      `;
      textContent = `${greeting}\n\n${notification.title}\n\n${notification.message}\n\n${notification.actionUrl ? `Ver detalhes: ${APP_BASE_URL}${notification.actionUrl}` : ""}\n\nAcesse o painel de controle para ver todas as suas notificações: ${APP_BASE_URL}/dashboard\n\nConte com a gente. Estamos juntos nessa.\n.Nepfy`;
  }

  return {
    subject,
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

      // Mark email as sent in database
      await NotificationService.markEmailSent(notification.id);

      console.log(
        `Email sent successfully to ${to} (notification: ${notification.id})`
      );
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
