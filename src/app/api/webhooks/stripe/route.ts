import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { ClerkStripeSyncService } from "#/lib/services/clerk-stripe-sync";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const dynamic = "force-dynamic";

// Helper: Attach subscription to user in Clerk (unsafeMetadata) - DEPRECATED
// Use ClerkStripeSyncService.syncSubscriptionToClerkAndDB instead
async function attachSubscriptionToUser({
  userId,
  subscription,
  subscriptionType,
}: {
  userId: string;
  subscription: Stripe.Subscription;
  subscriptionType?: string;
}) {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  await clerk.users.updateUserMetadata(userId, {
    unsafeMetadata: {
      ...user.unsafeMetadata,
      stripe: {
        ...(typeof user.unsafeMetadata === "object" &&
        user.unsafeMetadata !== null &&
        "stripe" in user.unsafeMetadata
          ? (user.unsafeMetadata as { stripe?: object }).stripe
          : {}),
        subscriptionId: subscription.id,
        subscriptionType:
          subscriptionType ||
          (subscription.metadata?.subscription_type ?? "monthly"),
        subscriptionActive: subscription.status === "active",
        subscriptionDate: new Date().toISOString(),
        customerId: subscription.customer,
        status: subscription.status,
      },
    },
  });
}

async function handleSubscriptionScheduleUpdated(event: Stripe.Event) {
  try {
    const subscriptionScheduleUpdated = event.data
      .object as Stripe.SubscriptionSchedule;
    const previousAttributes = event.data.previous_attributes as {
      phases?: Array<unknown>;
    };

    if (previousAttributes && previousAttributes.phases) {
      console.log(
        `Previous subscription schedule status: ${
          previousAttributes.phases[0] || "N/A"
        }`
      );
    }

    const userId = subscriptionScheduleUpdated.metadata?.userId as string;
    if (!userId) {
      throw new Error("User ID is missing in subscription schedule metadata");
    }

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        stripe: {
          status: subscriptionScheduleUpdated.status,
        },
      },
    });

    console.log(
      `Subscription schedule updated for customer ID: ${subscriptionScheduleUpdated.customer}`
    );
  } catch (error) {
    console.error("Error updating user metadata:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "errors" in error &&
      (error as { errors?: unknown }).errors
    ) {
      console.error(
        "Clerk error details:",
        JSON.stringify((error as { errors: unknown }).errors, null, 2)
      );
    }
    throw error;
  }
}

async function handleSubscriptionEvent(event: Stripe.Event) {
  try {
    const clerk = await clerkClient();
    const subscriptionUpdated = event.data.object as Stripe.Subscription;
    const customer = await stripe.customers.retrieve(
      subscriptionUpdated.customer as string
    );

    if ("deleted" in customer && customer.deleted) {
      throw new Error("Customer was deleted");
    }

    const clerkUser = await clerk.users.getUserList({
      emailAddress: [customer.email as string],
    });

    const user = clerkUser.data[0];

    if (!user) {
      throw new Error("User not found");
    }

    // Use the new sync service for better data consistency
    await ClerkStripeSyncService.syncSubscriptionToClerkAndDB(
      user.id,
      subscriptionUpdated as any,
      subscriptionUpdated.metadata?.subscription_type
    );

    console.log(
      `Subscription updated for customer ID: ${subscriptionUpdated.customer}`
    );
  } catch (error) {
    console.error("Error handling subscription event:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "errors" in error &&
      (error as { errors?: unknown }).errors
    ) {
      console.error(
        "Clerk error details:",
        JSON.stringify((error as { errors: unknown }).errors, null, 2)
      );
    }
    throw error;
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  try {
    console.log("Starting checkout session completed handler...");

    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Session data:", {
      id: session.id,
      customer: session.customer,
      subscription: session.subscription,
      customer_email: session.customer_email,
    });

    // Try to get customer from session first
    let customerEmail = session.customer_email;
    const customerId = session.customer;

    if (!customerEmail && customerId) {
      console.log("No customer email in session, fetching from customer ID...");
      const customer = await stripe.customers.retrieve(customerId as string);

      if ("deleted" in customer) {
        throw new Error("Customer was deleted");
      }

      customerEmail = customer.email;
      console.log("Customer email from Stripe:", customerEmail);
    }

    if (!customerEmail) {
      throw new Error("No customer email found in session or customer data");
    }

    console.log("Looking up user in Clerk with email:", customerEmail);
    const clerk = await clerkClient();

    const clerkUser = await clerk.users.getUserList({
      emailAddress: [customerEmail],
    });

    console.log("Clerk user lookup result:", {
      found: clerkUser.data.length > 0,
      userId: clerkUser.data[0]?.id,
    });

    if (!clerkUser.data[0]) {
      throw new Error(`User not found in Clerk with email: ${customerEmail}`);
    }

    const user = clerkUser.data[0];
    console.log("Found user in Clerk:", user.id);

    if (!session.subscription) {
      throw new Error("No subscription ID in checkout session");
    }

    console.log("Retrieving subscription from Stripe...");
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    console.log("Subscription retrieved:", subscription.id);

    // Attach userId to subscription metadata in Stripe
    console.log("Updating subscription metadata with user ID...");
    await stripe.subscriptions.update(subscription.id, {
      metadata: {
        ...subscription.metadata,
        user_id: user.id,
      },
    });

    // Use the new sync service for better data consistency
    await ClerkStripeSyncService.syncSubscriptionToClerkAndDB(
      user.id,
      subscription as any,
      subscription.metadata?.subscription_type
    );

    console.log(
      `Checkout session completed successfully for customer ID: ${customerId}`
    );
  } catch (error) {
    console.error("Error in handleCheckoutSessionCompleted:", error);

    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Re-throw the error to be handled by the main webhook handler
    throw error;
  }
}

async function handlePaymentIntentSucceeded(event: Stripe.Event) {
  try {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const userId = paymentIntent.metadata?.user_id;
    const subscriptionId = paymentIntent.metadata?.subscription_id;
    const subscriptionType = paymentIntent.metadata?.subscription_type;
    const platform = paymentIntent.metadata?.platform;

    console.log("Payment Intent Succeeded:", {
      paymentIntentId: paymentIntent.id,
      userId,
      subscriptionId,
      subscriptionType,
      platform,
    });

    if (subscriptionId && userId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        console.log(
          "Subscription status before processing:",
          subscription.status
        );

        // If the payment is from mobile (platform === 'apple', 'google', or 'mobile'), process accordingly
        if (
          platform === "apple" ||
          platform === "google" ||
          platform === "mobile"
        ) {
          console.log(
            `Processing mobile payment for subscription: ${subscriptionId}`
          );

          // For mobile payments, the payment has already been processed through the mobile platform
          // We need to ensure the invoice is properly handled and the subscription becomes active
          if (
            subscription.status === "incomplete" ||
            subscription.status === "past_due"
          ) {
            if (
              subscription.latest_invoice &&
              typeof subscription.latest_invoice === "string"
            ) {
              try {
                const invoice = await stripe.invoices.retrieve(
                  subscription.latest_invoice
                );
                console.log(
                  "Invoice status for mobile payment:",
                  invoice.status
                );

                // Finalize draft invoice if needed
                if (invoice.status === "draft") {
                  await stripe.invoices.finalizeInvoice(
                    subscription.latest_invoice
                  );
                  console.log("Finalized draft invoice for mobile payment");

                  // Re-fetch the invoice after finalization
                  const finalizedInvoice = await stripe.invoices.retrieve(
                    subscription.latest_invoice
                  );
                  console.log(
                    "Invoice status after finalization:",
                    finalizedInvoice.status
                  );
                }

                // For mobile payments, try to pay the invoice using the payment method if available
                if (invoice.status === "open" || invoice.status === "draft") {
                  try {
                    // If we have a payment method from the payment intent, try to use it
                    if (paymentIntent.payment_method) {
                      try {
                        // First, try to attach the payment method to the customer
                        await stripe.paymentMethods.attach(
                          paymentIntent.payment_method as string,
                          {
                            customer: subscription.customer as string,
                          }
                        );
                        console.log("Attached payment method to customer");

                        // Now try to pay the invoice with the attached payment method
                        await stripe.invoices.pay(subscription.latest_invoice, {
                          payment_method:
                            paymentIntent.payment_method as string,
                        });
                        console.log(
                          "Paid invoice using payment method for mobile payment"
                        );
                      } catch (attachError) {
                        console.log(
                          "Could not attach payment method:",
                          attachError
                        );
                        // Fallback to paid_out_of_band
                        await stripe.invoices.pay(subscription.latest_invoice, {
                          paid_out_of_band: true,
                        });
                        console.log(
                          "Marked invoice as paid out of band for mobile payment (fallback)"
                        );
                      }
                    } else {
                      // Fallback to paid_out_of_band if no payment method
                      await stripe.invoices.pay(subscription.latest_invoice, {
                        paid_out_of_band: true,
                      });
                      console.log(
                        "Marked invoice as paid out of band for mobile payment"
                      );
                    }
                  } catch (payError) {
                    console.log("Could not pay invoice:", payError);
                    // Continue anyway, the subscription might still be valid
                  }
                }
              } catch (invoiceError) {
                console.log(
                  "Invoice processing error for mobile payment:",
                  invoiceError
                );
                // Continue processing even if invoice operations fail
                // The subscription might still be valid
              }
            }
          }

          // Always fetch the latest subscription state
          const finalSubscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );

          console.log("Final subscription status:", finalSubscription.status);

          // Use the new sync service for better data consistency
          await ClerkStripeSyncService.syncSubscriptionToClerkAndDB(
            userId,
            finalSubscription as any,
            subscriptionType
          );

          console.log("Mobile payment processed successfully");
        } else {
          // Web/normal card flow
          if (
            subscription.status === "incomplete" ||
            subscription.status === "past_due"
          ) {
            // Attach payment method if not already attached
            let defaultPaymentMethod: string | null = null;
            try {
              if (paymentIntent.payment_method) {
                await stripe.paymentMethods.attach(
                  paymentIntent.payment_method as string,
                  {
                    customer: subscription.customer as string,
                  }
                );
                defaultPaymentMethod = paymentIntent.payment_method as string;
              }
            } catch (attachError) {
              console.log({ attachError });

              const customer = await stripe.customers.retrieve(
                subscription.customer as string
              );
              if (
                !("deleted" in customer) &&
                customer.invoice_settings?.default_payment_method
              ) {
                defaultPaymentMethod = customer.invoice_settings
                  .default_payment_method as string;
              }
            }

            const updateData: {
              collection_method: Stripe.Subscription.CollectionMethod;
              default_payment_method?: string;
            } = {
              collection_method: "charge_automatically",
            };
            if (defaultPaymentMethod) {
              updateData.default_payment_method = defaultPaymentMethod;
            }

            const updatedSubscription = await stripe.subscriptions.update(
              subscriptionId,
              updateData
            );

            // Pay latest invoice if needed
            if (
              updatedSubscription.latest_invoice &&
              typeof updatedSubscription.latest_invoice === "string"
            ) {
              try {
                // Only pay if we have a default payment method
                if (defaultPaymentMethod) {
                  await stripe.invoices.pay(
                    updatedSubscription.latest_invoice,
                    {
                      payment_method: defaultPaymentMethod,
                    }
                  );
                } else {
                  console.log(
                    "No default payment method available, skipping invoice payment"
                  );
                }
              } catch (invoiceError) {
                console.log("Invoice payment error:", invoiceError);
                // Try to finalize draft invoice if payment fails
                try {
                  const invoice = await stripe.invoices.retrieve(
                    updatedSubscription.latest_invoice
                  );
                  if (invoice.status === "draft") {
                    await stripe.invoices.finalizeInvoice(
                      updatedSubscription.latest_invoice
                    );
                    console.log("Finalized draft invoice");
                  }
                } catch (finalizeError) {
                  console.log("Invoice finalization error:", finalizeError);
                }
              }
            }
          }

          // Always fetch the latest subscription state
          const finalSubscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );

          // Use the new sync service for better data consistency
          await ClerkStripeSyncService.syncSubscriptionToClerkAndDB(
            userId,
            finalSubscription as any,
            subscriptionType
          );

          console.log("Payment and subscription attached to user successfully");
        }
      } catch (subscriptionError) {
        console.error("Error processing subscription:", subscriptionError);
        throw new Error(
          `Failed to activate subscription ${subscriptionId}: ${subscriptionError}`
        );
      }
    }
  } catch (error) {
    console.error("Error in handlePaymentIntentSucceeded:", error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  try {
    const invoice = event.data.object as Stripe.Invoice;

    const subscriptionId =
      typeof (invoice as unknown as { subscription?: string }).subscription ===
      "string"
        ? (invoice as unknown as { subscription: string }).subscription
        : undefined;

    console.log("Invoice Payment Succeeded:", {
      invoiceId: invoice.id,
      subscriptionId: subscriptionId,
      status: invoice.status,
      amount_paid: invoice.amount_paid,
    });

    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      console.log("Subscription from invoice:", {
        subscriptionId: subscription.id,
        status: subscription.status,
        platform: subscription.metadata?.platform,
        userId: subscription.metadata?.user_id,
      });

      if (subscription.metadata?.user_id) {
        const userId = subscription.metadata.user_id;
        const subscriptionType =
          subscription.metadata.subscription_type || "monthly";

        // Use the new sync service for better data consistency
        await ClerkStripeSyncService.syncSubscriptionToClerkAndDB(
          userId,
          subscription as any,
          subscriptionType
        );

        console.log("User metadata updated for payment");
      }
    }
  } catch (error) {
    console.error("Error in handleInvoicePaymentSucceeded:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  if (req === null) {
    return NextResponse.json({ error: "Missing request" }, { status: 400 });
  }

  const stripeSignature = req.headers.get("stripe-signature");

  if (stripeSignature === null) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    console.log("Processing Stripe webhook...");

    event = stripe.webhooks.constructEvent(
      await req.text(),
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Webhook event type:", event.type);
    console.log("Webhook event ID:", event.id);

    switch (event.type) {
      case "subscription_schedule.updated":
        console.log("Handling subscription_schedule.updated...");
        await handleSubscriptionScheduleUpdated(event);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        console.log("Handling subscription event...");
        await handleSubscriptionEvent(event);
        break;
      case "checkout.session.completed":
        console.log("Handling checkout.session.completed...");
        await handleCheckoutSessionCompleted(event);
        break;
      case "payment_intent.succeeded":
        console.log("Handling payment_intent.succeeded...");
        await handlePaymentIntentSucceeded(event);
        break;
      case "invoice.payment_succeeded":
        console.log("Handling invoice.payment_succeeded...");
        await handleInvoicePaymentSucceeded(event);
        break;
      default:
        console.log("Unhandled event type:", event.type);
        break;
    }

    console.log("Webhook processed successfully");
    return NextResponse.json({ status: 200, message: "success" });
  } catch (error) {
    console.error("Webhook processing failed:", error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Return a more specific error response
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    const statusCode =
      error instanceof Error && error.message.includes("User not found")
        ? 404
        : 500;

    return NextResponse.json(
      {
        error: errorMessage,
        timestamp: new Date().toISOString(),
        eventId: "unknown",
      },
      { status: statusCode }
    );
  }
}
