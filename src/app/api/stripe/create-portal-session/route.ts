import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's Stripe metadata from Clerk (handle both object and JSON string)
    let stripeMetadata: {
      customerId?: string;
    } | null = null;

    const rawStripeData = user.unsafeMetadata?.stripe;
    if (rawStripeData) {
      if (typeof rawStripeData === "object" && rawStripeData !== null) {
        stripeMetadata = rawStripeData as { customerId?: string };
      } else if (typeof rawStripeData === "string") {
        try {
          stripeMetadata = JSON.parse(rawStripeData) as { customerId?: string };
        } catch (error) {
          console.error("Error parsing stripe metadata:", error);
        }
      }
    }

    if (!stripeMetadata?.customerId) {
      return NextResponse.json(
        { success: false, error: "No Stripe customer found" },
        { status: 400 }
      );
    }

    // Use a fallback URL if NEXT_PUBLIC_APP_URL is not defined
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL ||
      "http://localhost:3000";
    const returnUrl = baseUrl.startsWith("http")
      ? `${baseUrl}/dashboard/configuracoes`
      : `https://${baseUrl}/dashboard/configuracoes`;

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeMetadata.customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({
      success: true,
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
