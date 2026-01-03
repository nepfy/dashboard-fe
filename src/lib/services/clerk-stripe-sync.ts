import { clerkClient } from "@clerk/nextjs/server";
import { Stripe } from "stripe";
import { db } from "#/lib/db";
import { subscriptionsTable } from "#/lib/db/schema";
import { personUserTable } from "#/lib/db/schema/users";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export interface SubscriptionData {
  id: string;
  status: string;
  customer: string;
  metadata: Record<string, unknown>;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  trial_start?: number;
  trial_end?: number;
}

export class ClerkStripeSyncService {
  /**
   * Get database user UUID from Clerk user ID
   * Public method to allow webhooks to check if user exists in database
   */
  static async getDatabaseUserId(clerkUserId: string): Promise<string | null> {
    // Log database connection info for debugging
    const dbUrl = process.env.DATABASE_URL;
    const dbHost = dbUrl ? new URL(dbUrl).hostname : "unknown";
    console.log(
      `[DB Debug] Looking for user ${clerkUserId} in database at ${dbHost}`
    );

    const user = await db
      .select({ id: personUserTable.id })
      .from(personUserTable)
      .where(eq(personUserTable.clerkUserId, clerkUserId))
      .limit(1);

    if (user[0]?.id) {
      console.log(
        `[DB Debug] Found user ${clerkUserId} in database at ${dbHost}`
      );
    } else {
      console.log(
        `[DB Debug] User ${clerkUserId} NOT found in database at ${dbHost}`
      );
    }

    return user[0]?.id || null;
  }

  /**
   * Ensure user exists in database, creating if necessary
   * This is useful when Stripe webhooks arrive before Clerk webhooks
   */
  static async ensureUserExistsInDB(clerkUserId: string): Promise<string> {
    // Check if user exists
    const existingDbUserId = await this.getDatabaseUserId(clerkUserId);

    if (existingDbUserId) {
      return existingDbUserId;
    }

    // User doesn't exist, try to create from Clerk data
    console.log(
      `User ${clerkUserId} not found in database, attempting to create from Clerk...`
    );

    try {
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(clerkUserId);

      // Get primary email
      const primaryEmail = clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      );

      if (!primaryEmail) {
        throw new Error(`No primary email found for Clerk user ${clerkUserId}`);
      }

      // Create user in database
      const [newUser] = await db
        .insert(personUserTable)
        .values({
          clerkUserId: clerkUserId,
          email: primaryEmail.emailAddress,
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
        })
        .returning({ id: personUserTable.id });

      if (!newUser?.id) {
        throw new Error(
          `Failed to create user in database for Clerk ID ${clerkUserId}`
        );
      }

      console.log(
        `Created user ${clerkUserId} in database with ID ${newUser.id}`
      );
      return newUser.id;
    } catch (error) {
      console.error(`Error ensuring user exists in database:`, error);
      throw new Error(
        `User not found in database for Clerk ID: ${clerkUserId}. ` +
          `Attempted to create from Clerk but failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Sync subscription data from Stripe to both Clerk and local database
   */
  static async syncSubscriptionToClerkAndDB(
    clerkUserId: string,
    subscription: SubscriptionData,
    subscriptionType?: string
  ) {
    try {
      // Converter Clerk ID para Database UUID, criando usuário se necessário
      const dbUserId = await this.ensureUserExistsInDB(clerkUserId);

      // 1. Update Clerk metadata (usar clerkUserId)
      await this.updateClerkSubscriptionMetadata(
        clerkUserId,
        subscription,
        subscriptionType
      );

      // 2. Update local database (usar dbUserId)
      await this.upsertSubscriptionInDB(
        dbUserId,
        subscription,
        subscriptionType
      );

      console.log(
        `Successfully synced subscription ${subscription.id} for Clerk user ${clerkUserId} (DB user ${dbUserId})`
      );
    } catch (error) {
      console.error("Error syncing subscription:", error);
      throw error;
    }
  }

  /**
   * Update subscription metadata in Clerk
   */
  private static async updateClerkSubscriptionMetadata(
    userId: string,
    subscription: SubscriptionData,
    subscriptionType?: string
  ) {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    const stripeMetadata = {
      ...(typeof user.unsafeMetadata === "object" &&
      user.unsafeMetadata !== null &&
      "stripe" in user.unsafeMetadata
        ? (user.unsafeMetadata as { stripe?: object }).stripe
        : {}),
      subscriptionId: subscription.id,
      subscriptionType:
        (subscriptionType as string) ||
        (subscription.metadata?.subscription_type as string) ||
        "monthly",
      subscriptionActive: subscription.status === "active",
      subscriptionDate: new Date().toISOString(),
      customerId: subscription.customer,
      status: subscription.status,
      currentPeriodStart: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      currentPeriodEnd: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    };

    await clerk.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        ...user.unsafeMetadata,
        stripe: stripeMetadata,
      },
    });
  }

  /**
   * Upsert subscription data in local database
   */
  private static async upsertSubscriptionInDB(
    userId: string,
    subscription: SubscriptionData,
    subscriptionType?: string
  ) {
    const subscriptionData = {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer,
      status: subscription.status,
      subscriptionType:
        (subscriptionType as string) ||
        (subscription.metadata?.subscription_type as string) ||
        "monthly",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      metadata: JSON.stringify(subscription.metadata),
      updatedAt: new Date(),
    };

    // Check if subscription exists
    const existingSubscription = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.stripeSubscriptionId, subscription.id))
      .limit(1);

    if (existingSubscription.length > 0) {
      // Update existing subscription
      await db
        .update(subscriptionsTable)
        .set(subscriptionData)
        .where(eq(subscriptionsTable.stripeSubscriptionId, subscription.id));
    } else {
      // Insert new subscription
      await db.insert(subscriptionsTable).values({
        ...subscriptionData,
        createdAt: new Date(),
      });
    }
  }

  /**
   * Sync user data from Clerk to Stripe (when user profile is updated)
   */
  static async syncUserToStripe(clerkUserId: string) {
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(clerkUserId);

      // Get user's primary email
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      );
      if (!primaryEmail) {
        throw new Error("No primary email found for user");
      }

      // Convert Clerk ID to Database UUID
      const dbUserId = await this.getDatabaseUserId(clerkUserId);
      if (!dbUserId) {
        throw new Error(
          `User not found in database for Clerk ID: ${clerkUserId}`
        );
      }

      // Check if user has existing Stripe customer
      const existingSubscription = await db
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.userId, dbUserId))
        .limit(1);

      if (existingSubscription.length > 0) {
        const stripeCustomerId = existingSubscription[0].stripeCustomerId;
        if (stripeCustomerId) {
          // Update existing Stripe customer
          await stripe.customers.update(stripeCustomerId, {
            email: primaryEmail.emailAddress,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            metadata: {
              clerkUserId: clerkUserId,
              ...user.unsafeMetadata,
            },
          });
        }
      } else {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email: primaryEmail.emailAddress,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          metadata: {
            clerkUserId: clerkUserId,
            ...user.unsafeMetadata,
          },
        });

        // Store customer ID in local database for future reference
        await db.insert(subscriptionsTable).values({
          userId: dbUserId,
          stripeSubscriptionId: "pending", // Will be updated when subscription is created
          stripeCustomerId: customer.id,
          status: "pending",
          subscriptionType: "monthly",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log(
        `Successfully synced Clerk user ${clerkUserId} (DB user ${dbUserId}) to Stripe`
      );
    } catch (error) {
      console.error("Error syncing user to Stripe:", error);
      throw error;
    }
  }

  /**
   * Get user's subscription data from both Clerk and local database
   */
  static async getUserSubscriptionData(clerkUserId: string) {
    try {
      // Get from Clerk
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(clerkUserId);
      const clerkStripeData = user.unsafeMetadata?.stripe;

      // Convert Clerk ID to Database UUID
      const dbUserId = await this.getDatabaseUserId(clerkUserId);

      // Get from local database
      const dbSubscription = dbUserId
        ? await db
            .select()
            .from(subscriptionsTable)
            .where(eq(subscriptionsTable.userId, dbUserId))
            .limit(1)
        : [];

      return {
        clerk: clerkStripeData,
        database: dbSubscription[0] || null,
        user: {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      console.error("Error getting user subscription data:", error);
      throw error;
    }
  }

  /**
   * Cancel subscription and sync to both systems
   */
  static async cancelSubscription(clerkUserId: string, subscriptionId: string) {
    try {
      // Cancel in Stripe
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      // Get updated subscription data
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Convert to SubscriptionData
      // These properties exist at runtime but are not in the Stripe TypeScript types
      const sub = subscription as unknown as Stripe.Subscription & {
        current_period_start: number;
        current_period_end: number;
      };

      const subscriptionData: SubscriptionData = {
        id: subscription.id,
        status: subscription.status,
        customer:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id,
        metadata: subscription.metadata || {},
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at || undefined,
        trial_start: subscription.trial_start || undefined,
        trial_end: subscription.trial_end || undefined,
      };

      // Sync the cancellation to both systems
      await this.syncSubscriptionToClerkAndDB(
        clerkUserId,
        subscriptionData,
        subscription.metadata?.subscription_type
      );

      console.log(
        `Successfully canceled subscription ${subscriptionId} for Clerk user ${clerkUserId}`
      );
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }

  /**
   * Reactivate subscription and sync to both systems
   */
  static async reactivateSubscription(
    clerkUserId: string,
    subscriptionId: string
  ) {
    try {
      // Reactivate in Stripe
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      // Get updated subscription data
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Convert to SubscriptionData
      // These properties exist at runtime but are not in the Stripe TypeScript types
      const sub = subscription as unknown as Stripe.Subscription & {
        current_period_start: number;
        current_period_end: number;
      };

      const subscriptionData: SubscriptionData = {
        id: subscription.id,
        status: subscription.status,
        customer:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id,
        metadata: subscription.metadata || {},
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at || undefined,
        trial_start: subscription.trial_start || undefined,
        trial_end: subscription.trial_end || undefined,
      };

      // Sync the reactivation to both systems
      await this.syncSubscriptionToClerkAndDB(
        clerkUserId,
        subscriptionData,
        subscription.metadata?.subscription_type
      );

      console.log(
        `Successfully reactivated subscription ${subscriptionId} for Clerk user ${clerkUserId}`
      );
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      throw error;
    }
  }
}
