import { clerkClient } from "@clerk/nextjs/server";
import { Stripe } from "stripe";
import { db } from "#/lib/db";
import { subscriptionsTable } from "#/lib/db/schema";
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
   * Sync subscription data from Stripe to both Clerk and local database
   */
  static async syncSubscriptionToClerkAndDB(
    userId: string,
    subscription: SubscriptionData,
    subscriptionType?: string
  ) {
    try {
      // 1. Update Clerk metadata
      await this.updateClerkSubscriptionMetadata(
        userId,
        subscription,
        subscriptionType
      );

      // 2. Update local database
      await this.upsertSubscriptionInDB(userId, subscription, subscriptionType);

      console.log(
        `Successfully synced subscription ${subscription.id} for user ${userId}`
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
  static async syncUserToStripe(userId: string) {
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);

      // Get user's primary email
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      );
      if (!primaryEmail) {
        throw new Error("No primary email found for user");
      }

      // Check if user has existing Stripe customer
      const existingSubscription = await db
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.userId, userId))
        .limit(1);

      if (existingSubscription.length > 0) {
        const stripeCustomerId = existingSubscription[0].stripeCustomerId;
        if (stripeCustomerId) {
          // Update existing Stripe customer
          await stripe.customers.update(stripeCustomerId, {
            email: primaryEmail.emailAddress,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            metadata: {
              clerkUserId: userId,
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
            clerkUserId: userId,
            ...user.unsafeMetadata,
          },
        });

        // Store customer ID in local database for future reference
        await db.insert(subscriptionsTable).values({
          userId,
          stripeSubscriptionId: "pending", // Will be updated when subscription is created
          stripeCustomerId: customer.id,
          status: "pending",
          subscriptionType: "monthly",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log(`Successfully synced user ${userId} to Stripe`);
    } catch (error) {
      console.error("Error syncing user to Stripe:", error);
      throw error;
    }
  }

  /**
   * Get user's subscription data from both Clerk and local database
   */
  static async getUserSubscriptionData(userId: string) {
    try {
      // Get from Clerk
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const clerkStripeData = user.unsafeMetadata?.stripe;

      // Get from local database
      const dbSubscription = await db
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.userId, userId))
        .limit(1);

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
  static async cancelSubscription(userId: string, subscriptionId: string) {
    try {
      // Cancel in Stripe
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      // Get updated subscription data
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Sync the cancellation to both systems
      await this.syncSubscriptionToClerkAndDB(
        userId,
        subscription as unknown as SubscriptionData
      );

      console.log(
        `Successfully canceled subscription ${subscriptionId} for user ${userId}`
      );
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }

  /**
   * Reactivate subscription and sync to both systems
   */
  static async reactivateSubscription(userId: string, subscriptionId: string) {
    try {
      // Reactivate in Stripe
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      // Get updated subscription data
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Sync the reactivation to both systems
      await this.syncSubscriptionToClerkAndDB(
        userId,
        subscription as unknown as SubscriptionData
      );

      console.log(
        `Successfully reactivated subscription ${subscriptionId} for user ${userId}`
      );
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      throw error;
    }
  }
}
