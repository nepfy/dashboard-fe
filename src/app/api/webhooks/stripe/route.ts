import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import {
  ClerkStripeSyncService,
  SubscriptionData,
} from "#/lib/services/clerk-stripe-sync";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// Types for better type safety
interface SubscriptionUpdateData {
  collection_method: "charge_automatically";
  default_payment_method?: string;
}

// Add this interface at the top with other type definitions
interface InvoiceWithSubscription extends Stripe.Invoice {
  subscription: string | Stripe.Subscription | null;
}

// Helper: Convert Stripe.Subscription to SubscriptionData
function convertStripeSubscriptionToSubscriptionData(
  subscription: Stripe.Subscription
): SubscriptionData {
  // These properties exist at runtime but are not in the Stripe TypeScript types
  // Cast through unknown to access runtime properties not in type definitions
  const sub = subscription as unknown as Stripe.Subscription & {
    current_period_start: number;
    current_period_end: number;
  };

  return {
    id: subscription.id,
    status: subscription.status,
    customer:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    metadata: subscription.metadata || {},
    current_period_start: sub.current_period_start,
    current_period_end: sub.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at || undefined,
    trial_start: subscription.trial_start || undefined,
    trial_end: subscription.trial_end || undefined,
  };
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
  } catch (error: unknown) {
    console.error("Error updating user metadata:", error);
    if (error && typeof error === "object" && "errors" in error) {
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

    // Sync subscription to both Clerk and database
    const subscriptionData =
      convertStripeSubscriptionToSubscriptionData(subscriptionUpdated);
    await ClerkStripeSyncService.syncSubscriptionToClerkAndDB(
      user.id,
      subscriptionData,
      subscriptionUpdated.metadata?.subscription_type
    );

    console.log(
      `Subscription updated for customer ID: ${subscriptionUpdated.customer}`
    );
  } catch (error: unknown) {
    console.error("Error handling subscription event:", error);
    if (error && typeof error === "object" && "errors" in error) {
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
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Checkout session completed:", {
      sessionId: session.id,
      customerId: session.customer,
      subscriptionId: session.subscription,
      metadata: session.metadata,
    });

    if (!session.subscription) {
      console.error("Checkout session has no subscription");
      return;
    }

    if (!session.customer) {
      console.error("Checkout session has no customer");
      return;
    }

    const customer = await stripe.customers.retrieve(
      session.customer as string
    );

    if ("deleted" in customer) {
      throw new Error("Customer was deleted");
    }

    const clerk = await clerkClient();
    let userId: string | null = null;

    // Tentar obter user_id do metadata da session primeiro
    if (session.metadata?.userId) {
      userId = session.metadata.userId;
      console.log(`Found userId from session metadata: ${userId}`);
    }

    // Se não encontrou no metadata, buscar pelo email do customer
    if (!userId && customer.email) {
      console.log("No userId in session metadata, searching by customer email");
      const clerkUser = await clerk.users.getUserList({
        emailAddress: [customer.email],
      });

      if (clerkUser.data.length > 0) {
        userId = clerkUser.data[0].id;
        console.log(`Found user by email: ${userId}`);
      }
    }

    if (!userId) {
      throw new Error("Could not determine user_id for checkout session");
    }

    // GARANTIR: Atualizar customer no Stripe com clerkUserId no metadata
    await stripe.customers.update(customer.id, {
      metadata: {
        ...customer.metadata,
        clerkUserId: userId,
      },
    });
    console.log(`Updated customer ${customer.id} with clerkUserId: ${userId}`);

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    console.log("Subscription retrieved:", {
      subscriptionId: subscription.id,
      status: subscription.status,
      currentMetadata: subscription.metadata,
    });

    // Attach userId to subscription metadata in Stripe (sempre atualizar)
    await stripe.subscriptions.update(subscription.id, {
      metadata: {
        ...subscription.metadata,
        user_id: userId,
        subscription_type:
          subscription.metadata?.subscription_type ||
          session.metadata?.billingCycle ||
          "monthly",
      },
    });

    console.log("Updated subscription metadata with user_id:", userId);

    // GARANTIR: Verificar se usuário existe no banco antes de sincronizar
    const dbUserId = await ClerkStripeSyncService.getDatabaseUserId(userId);
    if (!dbUserId) {
      console.warn(
        `User ${userId} not found in database. This may happen if Clerk webhook hasn't processed user.created yet.`
      );
      // Continuar mesmo assim, pois o sync pode criar o registro se necessário
    }

    // Sync subscription to both Clerk and database
    const subscriptionData =
      convertStripeSubscriptionToSubscriptionData(subscription);
    await ClerkStripeSyncService.syncSubscriptionToClerkAndDB(
      userId,
      subscriptionData,
      subscription.metadata?.subscription_type ||
        session.metadata?.billingCycle ||
        "monthly"
    );

    console.log(
      `Checkout session completed successfully. Customer: ${customer.id}, User: ${userId}, Subscription: ${subscription.id}`
    );
  } catch (error: unknown) {
    console.error("Error handling checkout session completed:", error);
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      (error as { message: string }).message ===
        "A valid resource ID is required."
    ) {
      console.error("Error: A valid resource ID is required.");
    }
    if (error && typeof error === "object" && "errors" in error) {
      console.error(
        "Clerk error details:",
        JSON.stringify((error as { errors: unknown }).errors, null, 2)
      );
    }
    throw error;
  }
}

async function handlePaymentIntentSucceeded(event: Stripe.Event) {
  try {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    let userId: string | null | undefined = paymentIntent.metadata?.user_id;
    let subscriptionId: string | null | undefined =
      paymentIntent.metadata?.subscription_id;
    const subscriptionType = paymentIntent.metadata?.subscription_type;
    const platform = paymentIntent.metadata?.platform;

    console.log("Payment Intent Succeeded:", {
      paymentIntentId: paymentIntent.id,
      customerId: paymentIntent.customer,
      userId,
      subscriptionId,
      subscriptionType,
      platform,
      metadata: paymentIntent.metadata,
    });

    // Se não tiver subscriptionId no metadata, buscar pelo customer
    if (!subscriptionId && paymentIntent.customer) {
      console.log(
        "No subscriptionId in metadata, searching customer subscriptions"
      );

      const subscriptions = await stripe.subscriptions.list({
        customer: paymentIntent.customer as string,
        status: "all",
        limit: 10,
      });

      // Pegar a subscription mais recente que está ativa, trialing ou incomplete
      subscriptionId =
        subscriptions.data.find(
          (sub) =>
            sub.status === "active" ||
            sub.status === "trialing" ||
            sub.status === "incomplete"
        )?.id ||
        subscriptions.data[0]?.id ||
        null;

      if (subscriptionId) {
        console.log(`Found subscription from customer: ${subscriptionId}`);
      }
    }

    // Se não tiver userId, buscar pelo customer email
    let customer: Stripe.Customer | Stripe.DeletedCustomer | null = null;
    if (!userId && paymentIntent.customer) {
      console.log("No userId in metadata, searching by customer email");

      customer = await stripe.customers.retrieve(
        paymentIntent.customer as string
      );

      if (!("deleted" in customer) && customer.email) {
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUserList({
          emailAddress: [customer.email],
        });

        if (clerkUser.data.length > 0) {
          userId = clerkUser.data[0].id;
          console.log(`Found user by customer email: ${userId}`);
        }
      }
    }

    // GARANTIR: Atualizar customer no Stripe com clerkUserId no metadata se encontramos o userId
    if (userId && paymentIntent.customer) {
      if (!customer) {
        customer = await stripe.customers.retrieve(
          paymentIntent.customer as string
        );
      }

      if (!("deleted" in customer) && !customer.metadata?.clerkUserId) {
        await stripe.customers.update(customer.id, {
          metadata: {
            ...customer.metadata,
            clerkUserId: userId,
          },
        });
        console.log(
          `Updated customer ${customer.id} with clerkUserId: ${userId}`
        );
      }
    }

    if (subscriptionId && userId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId as string
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
          const finalSubscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          console.log("Final subscription status:", finalSubscription.status);

          // Atualizar metadata da subscription com user_id se não tiver
          if (!finalSubscription.metadata?.user_id && userId) {
            await stripe.subscriptions.update(subscriptionId, {
              metadata: {
                ...finalSubscription.metadata,
                user_id: userId,
                subscription_type:
                  subscriptionType ||
                  finalSubscription.metadata?.subscription_type ||
                  "monthly",
              },
            });
            console.log(
              "Updated subscription metadata with user_id from payment intent"
            );
          }

          // Sync subscription to both Clerk and database
          const subscriptionData =
            convertStripeSubscriptionToSubscriptionData(finalSubscription);
          await ClerkStripeSyncService.syncSubscriptionToClerkAndDB(
            userId,
            subscriptionData,
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
            let defaultPaymentMethod = null;
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
            } catch {
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

            const updateData: SubscriptionUpdateData = {
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
          const finalSubscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          // Atualizar metadata da subscription com user_id se não tiver
          if (!finalSubscription.metadata?.user_id && userId) {
            await stripe.subscriptions.update(subscriptionId, {
              metadata: {
                ...finalSubscription.metadata,
                user_id: userId,
                subscription_type:
                  subscriptionType ||
                  finalSubscription.metadata?.subscription_type ||
                  "monthly",
              },
            });
            console.log(
              "Updated subscription metadata with user_id from payment intent"
            );
          }

          // Sync subscription to both Clerk and database
          const subscriptionData =
            convertStripeSubscriptionToSubscriptionData(finalSubscription);
          await ClerkStripeSyncService.syncSubscriptionToClerkAndDB(
            userId,
            subscriptionData,
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
  } catch (error: unknown) {
    console.error("Error in handlePaymentIntentSucceeded:", error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  try {
    const invoice = event.data.object as Stripe.Invoice;

    console.log("Invoice Payment Succeeded:", {
      invoiceId: invoice.id,
      subscriptionId: (invoice as InvoiceWithSubscription).subscription,
      status: invoice.status,
      amount_paid: invoice.amount_paid,
      customerId: invoice.customer,
    });

    if (!invoice.customer) {
      console.log("Invoice has no customer, skipping");
      return;
    }

    // Buscar customer
    const customer = await stripe.customers.retrieve(
      invoice.customer as string
    );

    if ("deleted" in customer && customer.deleted) {
      console.error("Customer was deleted");
      return;
    }

    let subscription: Stripe.Subscription | null = null;

    // Tentar obter subscription do invoice primeiro
    if ((invoice as InvoiceWithSubscription).subscription) {
      try {
        subscription = await stripe.subscriptions.retrieve(
          (invoice as InvoiceWithSubscription).subscription as string
        );
        console.log("Found subscription from invoice:", subscription.id);
      } catch (error) {
        console.log("Could not retrieve subscription from invoice:", error);
      }
    }

    // Se não encontrou subscription no invoice, buscar todas as subscriptions do customer
    if (!subscription) {
      console.log(
        "No subscription in invoice, searching customer subscriptions"
      );
      const subscriptions = await stripe.subscriptions.list({
        customer: invoice.customer as string,
        status: "all",
        limit: 10,
      });

      // Pegar a subscription mais recente que está ativa ou trialing
      subscription =
        subscriptions.data.find(
          (sub) => sub.status === "active" || sub.status === "trialing"
        ) ||
        subscriptions.data[0] ||
        null;

      if (subscription) {
        console.log(
          `Found subscription from customer list: ${subscription.id}`
        );
      } else {
        console.log("No active subscription found for customer");
      }
    }

    if (!subscription) {
      console.log("Invoice has no associated subscription, cannot sync");
      return;
    }

    console.log("Subscription found:", {
      subscriptionId: subscription.id,
      status: subscription.status,
      platform: subscription.metadata?.platform,
      userId: subscription.metadata?.user_id,
    });

    let userId: string | null = subscription.metadata?.user_id || null;

    // Se não tiver user_id no metadata, tentar buscar pelo customer email
    if (!userId) {
      console.log(
        "No user_id in subscription metadata, trying to find user by customer email"
      );

      if (!customer.email) {
        console.error("Customer has no email address");
        return;
      }

      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUserList({
        emailAddress: [customer.email],
      });

      if (clerkUser.data.length > 0) {
        userId = clerkUser.data[0].id;
        console.log(`Found user by email: ${userId}`);

        // GARANTIR: Atualizar customer no Stripe com clerkUserId no metadata
        await stripe.customers.update(customer.id, {
          metadata: {
            ...customer.metadata,
            clerkUserId: userId,
          },
        });
        console.log(
          `Updated customer ${customer.id} with clerkUserId: ${userId}`
        );

        // Atualizar metadata da subscription com o user_id encontrado
        await stripe.subscriptions.update(subscription.id, {
          metadata: {
            ...subscription.metadata,
            user_id: userId,
          },
        });
        console.log("Updated subscription metadata with user_id");
      } else {
        console.error(`User not found for email: ${customer.email}`);
        return;
      }
    } else {
      // GARANTIR: Mesmo quando userId já existe, garantir que customer tem clerkUserId
      if (!customer.metadata?.clerkUserId) {
        await stripe.customers.update(customer.id, {
          metadata: {
            ...customer.metadata,
            clerkUserId: userId,
          },
        });
        console.log(
          `Updated customer ${customer.id} with clerkUserId: ${userId}`
        );
      }
    }

    if (!userId) {
      console.error("Could not determine user_id for subscription");
      return;
    }

    // GARANTIR: Verificar se usuário existe no banco antes de sincronizar
    const dbUserId = await ClerkStripeSyncService.getDatabaseUserId(userId);
    if (!dbUserId) {
      console.warn(
        `User ${userId} not found in database. This may happen if Clerk webhook hasn't processed user.created yet.`
      );
    }

    const subscriptionType =
      subscription.metadata?.subscription_type || "monthly";

    // Sync subscription to both Clerk and database
    const subscriptionData =
      convertStripeSubscriptionToSubscriptionData(subscription);
    await ClerkStripeSyncService.syncSubscriptionToClerkAndDB(
      userId,
      subscriptionData,
      subscriptionType
    );

    console.log(
      `User metadata updated for payment. UserId: ${userId}, SubscriptionId: ${subscription.id}`
    );
  } catch (error: unknown) {
    console.error("Error in handleInvoicePaymentSucceeded:", error);
    if (error && typeof error === "object" && "errors" in error) {
      console.error(
        "Clerk error details:",
        JSON.stringify((error as { errors: unknown }).errors, null, 2)
      );
    }
    throw error;
  }
}

// GET handler para verificar se a rota está acessível (útil para debugging)
export async function GET() {
  return NextResponse.json(
    {
      message: "Stripe webhook endpoint is active",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
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

  try {
    // Ler o body como texto (não como JSON) para validação do Stripe
    const body = await req.text();

    const event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`Processing webhook event: ${event.type}`);

    // Handle invoice payment events (both formats)
    if (
      event.type === "invoice.payment_succeeded" ||
      event.type === "invoice_payment.paid"
    ) {
      await handleInvoicePaymentSucceeded(event);
    } else {
      switch (event.type) {
        case "subscription_schedule.updated":
          await handleSubscriptionScheduleUpdated(event);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await handleSubscriptionEvent(event);
          break;
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(event);
          break;
        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(event);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
          break;
      }
    }

    return NextResponse.json({ status: 200, message: "success" });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "An error occurred processing the webhook",
        clerkTraceId:
          error && typeof error === "object" && "clerkTraceId" in error
            ? (error as { clerkTraceId: string }).clerkTraceId
            : undefined,
      },
      {
        status:
          error && typeof error === "object" && "status" in error
            ? (error as { status: number }).status
            : 400,
      }
    );
  }
}
