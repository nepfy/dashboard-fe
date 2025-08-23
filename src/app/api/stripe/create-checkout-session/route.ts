import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const APP_URL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `http://localhost:3000`;

export async function POST(req: Request) {
  try {
    const { priceId, userId, billingCycle = "monthly" } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Verify user authentication
    const { userId: authUserId } = await auth();
    if (!authUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure the requesting user matches the authenticated user
    if (userId && userId !== authUserId) {
      return NextResponse.json({ error: "User ID mismatch" }, { status: 403 });
    }

    console.log(
      "Creating Stripe checkout session for price:",
      priceId,
      "User:",
      authUserId,
      "Billing:",
      billingCycle
    );

    // Create checkout session with enhanced metadata
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: authUserId,
        billingCycle: billingCycle,
        source: "pricing_page",
      },
      subscription_data: {
        metadata: {
          user_id: authUserId,
          billing_cycle: billingCycle,
          source: "pricing_page",
        },
      },
      success_url: `${APP_URL}/planos/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/planos/cancel`,
      customer_email: undefined, // Let Stripe create customer automatically
      allow_promotion_codes: true,
      billing_address_collection: "required",
      tax_id_collection: {
        enabled: true,
      },
    });

    console.log("Checkout session created:", session.id);

    return NextResponse.json({
      sessionId: session.id,
      session,
      success: true,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
