import { NextResponse } from "next/server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      expand: ["data.product"],
      active: true,
      type: "recurring",
    });

    const plans = prices.data.map((price) => {
      const product = price.product as Stripe.Product;

      return {
        id: price.id,
        title: product.name || "Plano",
        description: product.description || "",
        price: price.unit_amount || 0,
        currency: price.currency || "brl",
        interval: price.recurring?.interval || "month",
        features: product.marketing_features || [],
        credits: product.metadata?.credits || "0",
        buttonTitle: product.metadata?.buttonTitle || "Assinar",
      };
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching Stripe plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe plans" },
      { status: 500 }
    );
  }
}
