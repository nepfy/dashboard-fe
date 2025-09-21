import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    console.log("Creating portal session...");
    const user = await currentUser();

    if (!user) {
      console.log("No user found");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("User found:", user.id);

    // Get user's Stripe metadata from Clerk
    const stripeMetadata = user.unsafeMetadata?.stripe as {
      customerId?: string;
    };

    console.log("Stripe metadata:", stripeMetadata);

    if (!stripeMetadata?.customerId) {
      console.log("No Stripe customer ID found");
      return NextResponse.json(
        { success: false, error: "No Stripe customer found" },
        { status: 400 }
      );
    }

    console.log("Customer ID:", stripeMetadata.customerId);
    
    // Use a fallback URL if NEXT_PUBLIC_APP_URL is not defined
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const returnUrl = baseUrl.startsWith('http') 
      ? `${baseUrl}/dashboard/configuracoes`
      : `https://${baseUrl}/dashboard/configuracoes`;
    
    console.log("Return URL:", returnUrl);

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeMetadata.customerId,
      return_url: returnUrl,
    });

    console.log("Portal session created:", portalSession.id);

    return NextResponse.json({
      success: true,
      url: portalSession.url,
    });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create portal session",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
