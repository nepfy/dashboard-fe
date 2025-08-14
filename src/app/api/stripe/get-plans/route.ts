import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      expand: ["data.product"],
      active: true,
      type: "recurring",
    });

    const plans = prices.data.map((price) => ({
      id: price.id,
      title: (price.product as Stripe.Product).name,
      description: (price.product as Stripe.Product).description,
      price: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval,
      features: (price.product as Stripe.Product).marketing_features,
      credits: (price.product as Stripe.Product).metadata.credits,
      buttonTitle: (price.product as Stripe.Product).metadata.buttonTitle,
    }));

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching Stripe plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe plans" },
      { status: 500 }
    );
  }
}
