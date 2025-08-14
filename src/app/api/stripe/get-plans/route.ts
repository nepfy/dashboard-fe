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
      name: (price.product as Stripe.Product).name,
      description: (price.product as Stripe.Product).description,
      unitAmount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval,
      marketing_list: (price.product as Stripe.Product).metadata.marketing_list,
      credits: (price.product as Stripe.Product).metadata.credits,
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
