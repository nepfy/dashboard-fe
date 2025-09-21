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

    // Get user's Stripe metadata from Clerk
    const stripeMetadata = user.unsafeMetadata?.stripe as {
      customerId?: string;
      subscriptionId?: string;
      subscriptionActive?: boolean;
    };

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
    
    if (stripeMetadata.subscriptionId && stripeMetadata.subscriptionActive) {
      try {
        currentSubscription = await stripe.subscriptions.retrieve(
          stripeMetadata.subscriptionId,
          { expand: ["default_payment_method"] }
        ) as unknown as StripeSubscriptionData;

        // Calculate next billing date
        if (currentSubscription.status === "active") {
          nextBillingDate = new Date(currentSubscription.current_period_end * 1000);
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
      amountPaid: invoice.amount_paid,
      amountDue: invoice.amount_due,
      currency: invoice.currency,
      created: new Date(invoice.created * 1000),
      paidAt: invoice.status_transitions?.paid_at 
        ? new Date(invoice.status_transitions.paid_at * 1000) 
        : null,
      pdfUrl: invoice.invoice_pdf,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
    }));

    return NextResponse.json({
      success: true,
      data: {
        hasActiveSubscription: currentSubscription?.status === "active" || false,
        currentPlan: currentSubscription ? {
          id: currentSubscription.id,
          status: currentSubscription.status,
          currentPeriodStart: currentSubscription.current_period_start,
          currentPeriodEnd: currentSubscription.current_period_end,
          cancelAtPeriodEnd: currentSubscription.cancel_at_period_end,
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
