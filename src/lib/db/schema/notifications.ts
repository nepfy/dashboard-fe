import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";
import { personUserTable } from "#/lib/db/schema/users";
import { projectsTable } from "#/lib/db/schema/projects";

/**
 * Notification types supported by the system
 */
export type NotificationType =
  | "proposal_viewed" // Cliente visualizou a proposta
  | "proposal_accepted" // Cliente aceitou a proposta
  | "proposal_rejected" // Cliente rejeitou a proposta
  | "proposal_feedback" // Cliente deixou feedback
  | "proposal_expired" // Proposta expirou
  | "proposal_expiring_soon" // Proposta expirando em breve
  | "project_status_changed" // Status do projeto mudou
  | "payment_received" // Pagamento recebido
  | "subscription_updated" // Assinatura atualizada
  | "system_announcement"; // Anúncio do sistema

/**
 * Notification metadata structure
 */
export interface NotificationMetadata {
  projectId?: string;
  projectName?: string;
  clientName?: string;
  oldStatus?: string;
  newStatus?: string;
  feedbackText?: string;
  amount?: number;
  [key: string]: unknown;
}

/**
 * Notifications table
 * Stores all notifications for users
 */
export const notificationsTable = pgTable("notifications", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  
  // User reference
  userId: uuid("user_id")
    .notNull()
    .references(() => personUserTable.id, { onDelete: "cascade" }),
  
  // Optional project reference
  projectId: uuid("project_id").references(() => projectsTable.id, {
    onDelete: "cascade",
  }),
  
  // Notification content
  type: varchar({ length: 50 }).notNull().$type<NotificationType>(),
  title: varchar({ length: 255 }).notNull(),
  message: text().notNull(),
  
  // Metadata for additional context (JSON)
  metadata: jsonb().$type<NotificationMetadata>(),
  
  // Status
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at", { mode: "date" }),
  
  // Email notification
  emailSent: boolean("email_sent").notNull().default(false),
  emailSentAt: timestamp("email_sent_at", { mode: "date" }),
  
  // Action link (optional)
  actionUrl: varchar("action_url", { length: 500 }),
  
  ...timestamps,
});

/**
 * Notification preferences table
 * Controls which notifications the user wants to receive
 */
export const notificationPreferencesTable = pgTable(
  "notification_preferences",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => personUserTable.id, { onDelete: "cascade" }),
    
    // Email preferences
    emailEnabled: boolean("email_enabled").notNull().default(true),
    emailProposalViewed: boolean("email_proposal_viewed")
      .notNull()
      .default(true),
    emailProposalAccepted: boolean("email_proposal_accepted")
      .notNull()
      .default(true),
    emailProposalFeedback: boolean("email_proposal_feedback")
      .notNull()
      .default(true),
    emailProposalExpiring: boolean("email_proposal_expiring")
      .notNull()
      .default(true),
    emailPaymentReceived: boolean("email_payment_received")
      .notNull()
      .default(true),
    
    // In-app preferences
    inAppEnabled: boolean("in_app_enabled").notNull().default(true),
    inAppProposalViewed: boolean("in_app_proposal_viewed")
      .notNull()
      .default(true),
    inAppProposalAccepted: boolean("in_app_proposal_accepted")
      .notNull()
      .default(true),
    inAppProposalFeedback: boolean("in_app_proposal_feedback")
      .notNull()
      .default(true),
    inAppProposalExpiring: boolean("in_app_proposal_expiring")
      .notNull()
      .default(true),
    inAppPaymentReceived: boolean("in_app_payment_received")
      .notNull()
      .default(true),
    
    ...timestamps,
  }
);

// Relations
export const notificationsRelations = relations(
  notificationsTable,
  ({ one }) => ({
    user: one(personUserTable, {
      fields: [notificationsTable.userId],
      references: [personUserTable.id],
    }),
    project: one(projectsTable, {
      fields: [notificationsTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export const notificationPreferencesRelations = relations(
  notificationPreferencesTable,
  ({ one }) => ({
    user: one(personUserTable, {
      fields: [notificationPreferencesTable.userId],
      references: [personUserTable.id],
    }),
  })
);

