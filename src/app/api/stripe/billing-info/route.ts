import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    // Get payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    let defaultPaymentMethod = null;
    if (paymentMethods.data.length > 0) {
      const pm = paymentMethods.data[0];
      defaultPaymentMethod = {
        id: pm.id,
        brand: pm.card?.brand || "unknown",
        last4: pm.card?.last4 || "0000",
        expMonth: pm.card?.exp_month,
        expYear: pm.card?.exp_year,
      };
    }

    // Get active subscription
    let currentSubscription = null;
    let nextBillingDate = null;
    
    if (stripeMetadata.subscriptionId && stripeMetadata.subscriptionActive) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          stripeMetadata.subscriptionId
        );
        
        currentSubscription = {
          id: subscription.id,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        };

        // Calculate next billing date
        if (subscription.status === "active") {
          nextBillingDate = new Date(subscription.current_period_end * 1000);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
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
        hasActiveSubscription: stripeMetadata.subscriptionActive || false,
        currentPlan: currentSubscription,
        paymentMethod: defaultPaymentMethod,
        nextBillingDate,
        invoices: formattedInvoices,
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
        },
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
