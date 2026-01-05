import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Get the correct app URL based on environment
// This ensures staging redirects go to staging, production to production
// and avoids using temporary Vercel deploy URLs
const getAppUrl = () => {
  // First priority: Use explicitly configured URL (should be set in Vercel)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = process.env.NEXT_PUBLIC_APP_URL;
    return url.startsWith("http") ? url : `https://${url}`;
  }

  // Second priority: Detect environment and use correct domain
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV;
  
  if (vercelEnv === "production") {
    return "https://app.nepfy.com";
  }
  
  if (vercelEnv === "preview" || vercelEnv === "development") {
    // For staging/preview, use staging domain
    return "https://staging-app.nepfy.com";
  }

  // Fallback: Check if VERCEL_URL is a production/staging domain (not a deploy URL)
  if (process.env.VERCEL_URL) {
    const vercelUrl = process.env.VERCEL_URL;
    // If it's already a proper domain (not a deploy URL), use it
    if (vercelUrl.includes("nepfy.com")) {
      return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
    }
  }

  // Default: localhost for development
  return "http://localhost:3000";
};

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
      success_url: `${getAppUrl()}/planos/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getAppUrl()}/planos/cancel`,
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
