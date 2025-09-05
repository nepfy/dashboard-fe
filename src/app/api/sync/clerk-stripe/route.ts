import { NextRequest, NextResponse } from "next/server";
import { ClerkStripeSyncService } from "#/lib/services/clerk-stripe-sync";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, targetUserId } = await req.json();

    // Only allow users to sync their own data, or admin operations
    if (action === "sync-user" && targetUserId && targetUserId !== userId) {
      // Check if user has admin privileges (you can implement your own admin check)
      // For now, we'll restrict to self-sync only
      return NextResponse.json(
        { error: "Can only sync your own data" },
        { status: 403 }
      );
    }

    switch (action) {
      case "sync-user":
        const targetId = targetUserId || userId;
        await ClerkStripeSyncService.syncUserToStripe(targetId);

        return NextResponse.json({
          success: true,
          message: `User ${targetId} synced to Stripe successfully`,
        });

      case "get-subscription-data":
        const subscriptionData =
          await ClerkStripeSyncService.getUserSubscriptionData(userId);

        return NextResponse.json({
          success: true,
          data: subscriptionData,
        });

      case "cancel-subscription":
        const { subscriptionId } = await req.json();
        if (!subscriptionId) {
          return NextResponse.json(
            { error: "Subscription ID is required" },
            { status: 400 }
          );
        }

        await ClerkStripeSyncService.cancelSubscription(userId, subscriptionId);

        return NextResponse.json({
          success: true,
          message: "Subscription canceled successfully",
        });

      case "reactivate-subscription":
        const { reactivateSubscriptionId } = await req.json();
        if (!reactivateSubscriptionId) {
          return NextResponse.json(
            { error: "Subscription ID is required" },
            { status: 400 }
          );
        }

        await ClerkStripeSyncService.reactivateSubscription(
          userId,
          reactivateSubscriptionId
        );

        return NextResponse.json({
          success: true,
          message: "Subscription reactivated successfully",
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in Clerk-Stripe sync API:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptionData =
      await ClerkStripeSyncService.getUserSubscriptionData(userId);

    return NextResponse.json({
      success: true,
      data: subscriptionData,
    });
  } catch (error) {
    console.error("Error getting subscription data:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
