import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { success: false, error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Get user's Stripe metadata from Clerk (handle both object and JSON string)
    let stripeMetadata: {
      customerId?: string;
      subscriptionId?: string;
      subscriptionActive?: boolean;
    } | null = null;

    const rawStripeData = user.unsafeMetadata?.stripe;
    if (rawStripeData) {
      if (typeof rawStripeData === "object" && rawStripeData !== null) {
        stripeMetadata = rawStripeData as {
          customerId?: string;
          subscriptionId?: string;
          subscriptionActive?: boolean;
        };
      } else if (typeof rawStripeData === "string") {
        try {
          stripeMetadata = JSON.parse(rawStripeData) as {
            customerId?: string;
            subscriptionId?: string;
            subscriptionActive?: boolean;
          };
        } catch (error) {
          console.error("Error parsing stripe metadata:", error);
        }
      }
    }

    if (!stripeMetadata?.subscriptionId) {
      return NextResponse.json(
        { success: false, error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(
      stripeMetadata.subscriptionId,
      { expand: ["items.data.price.product"] }
    );

    if (subscription.status !== "active" && subscription.status !== "trialing") {
      return NextResponse.json(
        { success: false, error: "Subscription is not active" },
        { status: 400 }
      );
    }

    // Get the current price/item
    const currentItem = subscription.items.data[0];
    if (!currentItem) {
      return NextResponse.json(
        { success: false, error: "No subscription items found" },
        { status: 400 }
      );
    }

    // Check if it's the same price
    if (currentItem.price.id === priceId) {
      return NextResponse.json(
        { success: false, error: "You are already on this plan" },
        { status: 400 }
      );
    }

    // Update subscription with new price
    // Use proration to calculate the difference
    const updatedSubscription = await stripe.subscriptions.update(
      stripeMetadata.subscriptionId,
      {
        items: [
          {
            id: currentItem.id,
            price: priceId,
          },
        ],
        proration_behavior: "always_invoice", // Create invoice for proration
        metadata: {
          ...subscription.metadata,
          subscription_type: subscription.items.data[0]?.price.recurring?.interval === "year" ? "yearly" : "monthly",
        },
      }
    );

    // Determine subscription type from the new price
    const newPrice = await stripe.prices.retrieve(priceId);
    const subscriptionType = newPrice.recurring?.interval === "year" ? "yearly" : "monthly";

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        subscriptionType,
      },
    });
  } catch (error) {
    console.error("Error changing plan:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to change plan",
      },
      { status: 500 }
    );
  }
}

