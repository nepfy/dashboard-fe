import { pgTable, uuid, varchar, timestamp, boolean, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { personUserTable } from "./users";
import { plansTable } from "./plans";

export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => personUserTable.id),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  planId: integer("plan_id").references(() => plansTable.id),
  status: varchar("status", { length: 50 }).notNull(), // active, canceled, past_due, etc.
  subscriptionType: varchar("subscription_type", { length: 50 }).default("monthly"), // monthly, yearly
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  canceledAt: timestamp("canceled_at"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  metadata: text("metadata"), // JSON string for additional Stripe metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptionsRelations = relations(subscriptionsTable, ({ one }) => ({
  user: one(personUserTable, {
    fields: [subscriptionsTable.userId],
    references: [personUserTable.id],
  }),
  plan: one(plansTable, {
    fields: [subscriptionsTable.planId],
    references: [plansTable.id],
  }),
}));
