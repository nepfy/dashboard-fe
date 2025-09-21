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

    // Get user's Stripe metadata from Clerk
    const stripeMetadata = user.unsafeMetadata?.stripe as {
      customerId?: string;
    };

    if (!stripeMetadata?.customerId) {
      return NextResponse.json(
        { success: false, error: "No Stripe customer found" },
        { status: 400 }
      );
    }

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeMetadata.customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/configuracoes`,
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
