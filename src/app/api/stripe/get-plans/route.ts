import { NextResponse } from "next/server";
import { Stripe } from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY environment variable is not set");
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function GET() {
  if (!stripe) {
    console.error("Stripe client not initialized: STRIPE_SECRET_KEY is missing");
    return NextResponse.json(
      {
        error: "Stripe configuration error",
        message: "Stripe API key is not configured. Please check your environment variables.",
      },
      { status: 500 }
    );
  }

  try {
    // Buscar todos os preços recorrentes (incluindo gratuitos com valor 0)
    const prices = await stripe.prices.list({
      expand: ["data.product"],
      active: true,
      type: "recurring",
    });

    const plans = prices.data.map((price) => {
      const product = price.product as Stripe.Product;

      return {
        id: price.id,
        title: product?.name || "Plano",
        description: product?.description || "",
        price: price.unit_amount || 0,
        currency: price.currency || "brl",
        interval: price.recurring?.interval || "month",
        features: product?.marketing_features || [],
        credits: product?.metadata?.credits || "0",
        buttonTitle: product?.metadata?.buttonTitle || "Assinar",
        metadata: product?.metadata || {},
      };
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching Stripe plans:", error);

    // Verificar se é erro de autenticação/chave expirada
    if (
      error instanceof Error &&
      (error.message.includes("Expired API Key") ||
        error.message.includes("api_key_expired") ||
        error.message.includes("Invalid API Key"))
    ) {
      return NextResponse.json(
        {
          error: "Stripe API key expired or invalid",
          message:
            "The Stripe API key configured in your environment variables is expired or invalid. Please update STRIPE_SECRET_KEY in your Vercel project settings.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch Stripe plans",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
