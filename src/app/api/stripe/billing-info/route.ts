import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface StripeSubscriptionData {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  default_payment_method?: Stripe.PaymentMethod | string;
}

export async function GET() {
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
      subscriptionId?: string;
      subscriptionActive?: boolean;
      subscriptionType?: string;
    } | null = null;
    let parsedMetadata: Record<string, unknown> | null = null;

    const rawStripeData = user.unsafeMetadata?.stripe;
    if (rawStripeData) {
      if (typeof rawStripeData === "object" && rawStripeData !== null) {
        parsedMetadata = rawStripeData as Record<string, unknown>;
        stripeMetadata = rawStripeData as {
          customerId?: string;
          subscriptionId?: string;
          subscriptionActive?: boolean;
          subscriptionType?: string;
        };
      } else if (typeof rawStripeData === "string") {
        try {
          parsedMetadata = JSON.parse(rawStripeData) as Record<string, unknown>;
          stripeMetadata = parsedMetadata as {
            customerId?: string;
            subscriptionId?: string;
            subscriptionActive?: boolean;
            subscriptionType?: string;
          };
        } catch (error) {
          console.error("Error parsing stripe metadata:", error);
        }
      }
    }

    if (!stripeMetadata?.customerId) {
      // User doesn't have a Stripe customer ID, return free plan info
      return NextResponse.json({
        success: true,
        data: {
          hasActiveSubscription: false,
          currentPlan: null,
          paymentMethod: null,
          nextBillingDate: null,
          invoices: [],
        },
      });
    }

    const customerId = stripeMetadata.customerId;

    // Fetch customer details from Stripe
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      return NextResponse.json({
        success: true,
        data: {
          hasActiveSubscription: false,
          currentPlan: null,
          paymentMethod: null,
          nextBillingDate: null,
          invoices: [],
        },
      });
    }


    // Get active subscription
    let currentSubscription: StripeSubscriptionData | null = null;
    let nextBillingDate: Date | null = null;
    let currentPriceId: string | null = null;
    
    if (stripeMetadata.subscriptionId && stripeMetadata.subscriptionActive) {
      try {
        // Fetch subscription with all needed data in one call
        const subscription = await stripe.subscriptions.retrieve(
          stripeMetadata.subscriptionId,
          { expand: ["default_payment_method", "items.data.price"] }
        );

        // These properties exist at runtime but are not in the Stripe TypeScript types
        // Cast through unknown to access runtime properties not in type definitions
        const sub = subscription as unknown as Stripe.Subscription & {
          current_period_start: number;
          current_period_end: number;
        };

        // Convert to StripeSubscriptionData format
        currentSubscription = {
          id: subscription.id,
          status: subscription.status,
          current_period_start: sub.current_period_start,
          current_period_end: sub.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
          default_payment_method: subscription.default_payment_method,
        } as StripeSubscriptionData;

        // Calculate next billing date
        if (currentSubscription.status === "active") {
          nextBillingDate = new Date(currentSubscription.current_period_end * 1000);
        }

        // Get current price ID from subscription items
        // Handle both expanded and non-expanded price objects
        const firstItem = subscription.items?.data?.[0];
        if (firstItem) {
          // Price can be a string (ID) or an object (expanded)
          if (typeof firstItem.price === "string") {
            currentPriceId = firstItem.price;
          } else if (firstItem.price?.id) {
            currentPriceId = firstItem.price.id;
          }
          
          if (currentPriceId) {
            console.log("✅ Found current price ID in billing-info:", currentPriceId);
          } else {
            console.log("⚠️ No price ID found in subscription items");
            console.log("First item:", JSON.stringify(firstItem, null, 2));
          }
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    }

    // Get payment method from subscription
    let paymentMethod = null;
    if (currentSubscription?.default_payment_method) {
      const pm = currentSubscription.default_payment_method as Stripe.PaymentMethod;
      paymentMethod = {
        id: pm.id,
        brand: pm.card?.brand || "unknown",
        last4: pm.card?.last4 || "0000",
        expMonth: pm.card?.exp_month || 0,
        expYear: pm.card?.exp_year || 0,
      };
    }

    // Get invoices
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 10,
    });

    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      status: invoice.status,
      amountPaid: invoice.amount_paid / 100, // Convert from cents to currency units
      amountDue: invoice.amount_due / 100, // Convert from cents to currency units
      currency: invoice.currency,
      created: new Date(invoice.created * 1000),
      paidAt: invoice.status_transitions?.paid_at 
        ? new Date(invoice.status_transitions.paid_at * 1000) 
        : null,
      pdfUrl: invoice.invoice_pdf,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
    }));

    // Get subscription type from metadata or subscription
    let subscriptionType = "monthly";
    if (parsedMetadata?.subscriptionType) {
      subscriptionType = String(parsedMetadata.subscriptionType);
    } else if (stripeMetadata?.subscriptionType) {
      subscriptionType = stripeMetadata.subscriptionType;
    }
    
    // Also check subscription metadata from Stripe
    if (currentSubscription) {
      const subMetadata = (currentSubscription as unknown as { metadata?: { subscription_type?: string } })?.metadata;
      if (subMetadata?.subscription_type) {
        subscriptionType = subMetadata.subscription_type;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        hasActiveSubscription: currentSubscription?.status === "active" || false,
        currentPlan: currentSubscription ? {
          id: currentSubscription.id,
          status: currentSubscription.status,
          subscriptionType: subscriptionType,
          currentPeriodStart: currentSubscription.current_period_start,
          currentPeriodEnd: currentSubscription.current_period_end,
          cancelAtPeriodEnd: currentSubscription.cancel_at_period_end,
          priceId: currentPriceId,
        } : null,
        paymentMethod,
        nextBillingDate,
        invoices: formattedInvoices,
      },
    });
  } catch (error) {
    console.error("Error fetching billing info:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch billing information" },
      { status: 500 }
    );
  }
}
