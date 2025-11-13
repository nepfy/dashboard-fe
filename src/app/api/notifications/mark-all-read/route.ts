/**
 * Mark All Notifications as Read API
 * PATCH /api/notifications/mark-all-read - Mark all notifications as read
 */

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { NotificationService } from "#/lib/services/notification-service";
import { getUserIdFromEmail } from "#/lib/db/user";

export async function PATCH() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const emailAddress = user?.emailAddresses[0]?.emailAddress;
    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: "Email não encontrado" },
        { status: 400 }
      );
    }

    const userId = await getUserIdFromEmail(emailAddress);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    await NotificationService.markAllAsRead(userId);

    return NextResponse.json({
      success: true,
      message: "Todas as notificações foram marcadas como lidas",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao marcar notificações como lidas",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

