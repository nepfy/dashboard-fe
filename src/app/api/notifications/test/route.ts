/**
 * Test Notification API
 * POST /api/notifications/test - Create a test notification
 * 
 * FOR TESTING ONLY - Remove in production
 */

import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { NotificationService } from "#/lib/services/notification-service";
import { getUserIdFromEmail } from "#/lib/db/user";

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const notification = await NotificationService.create({
      userId,
      type: body.type || "system_announcement",
      title: body.title || "Notificação de Teste",
      message:
        body.message ||
        "Esta é uma notificação de teste criada pela API de teste.",
      projectId: body.projectId,
      metadata: body.metadata,
      actionUrl: body.actionUrl,
    });

    return NextResponse.json({
      success: true,
      notification,
      message: "Notificação de teste criada com sucesso!",
    });
  } catch (error) {
    console.error("Error creating test notification:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao criar notificação de teste",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

