import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { ClerkStripeSyncService } from "#/lib/services/clerk-stripe-sync";
import { db } from "#/lib/db";
import { persons } from "#/lib/db/schema/persons";
import { eq } from "drizzle-orm";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // Verify the webhook signature
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;

    try {
      // Get primary email
      const primaryEmail = email_addresses?.find(
        (email: { id: string }) => email.id === evt.data.primary_email_address_id
      );

      if (!primaryEmail) {
        console.error("No primary email found for user:", id);
        return new NextResponse("No primary email found", { status: 400 });
      }

      // Create user in persons table
      await db.insert(persons).values({
        clerkUserId: id,
        email: primaryEmail.email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim() || primaryEmail.email_address,
      });

      console.log(`Created person record for user ${id}`);

      // Sync user data to Stripe if they have subscription-related metadata
      if (unsafe_metadata?.subscriptionType || unsafe_metadata?.plan) {
        await ClerkStripeSyncService.syncUserToStripe(id);
      }

      return new NextResponse("User created successfully", { status: 200 });
    } catch (e) {
      console.error("Error creating user:", e);
      return new NextResponse("Error creating user", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    try {
      // Get primary email
      const primaryEmail = email_addresses?.find(
        (email: { id: string }) => email.id === evt.data.primary_email_address_id
      );

      if (primaryEmail) {
        // Update user in persons table
        await db
          .update(persons)
          .set({
            email: primaryEmail.email_address,
            name: `${first_name || ""} ${last_name || ""}`.trim() || primaryEmail.email_address,
          })
          .where(eq(persons.clerkUserId, id));

        console.log(`Updated person record for user ${id}`);
      }

      // Sync updated user data to Stripe
      await ClerkStripeSyncService.syncUserToStripe(id);

      return new NextResponse("User updated successfully", { status: 200 });
    } catch (error) {
      console.error("Error updating user:", error);
      return new NextResponse("Error updating user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // Soft delete user in persons table (if you have deleted_at column)
      // Or hard delete if preferred
      await db
        .delete(persons)
        .where(eq(persons.clerkUserId, id));

      console.log(`Deleted person record for user ${id}`);

      // Note: We don't delete Stripe customers when users are deleted from Clerk
      // This is to preserve billing history and prevent data loss
      // Stripe customers can be manually managed if needed

      return new NextResponse("User deleted successfully", { status: 200 });
    } catch (error) {
      console.error("Error deleting user:", error);
      return new NextResponse("Error deleting user", { status: 500 });
    }
  }

  return new NextResponse("Webhook processed", { status: 200 });
}
