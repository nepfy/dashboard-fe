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

    const returnUrl = `${getAppUrl()}/dashboard/configuracoes`;

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
