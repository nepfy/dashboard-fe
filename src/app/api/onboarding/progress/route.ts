import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

import {
  sanitizeOnboardingFormData,
  sanitizeOnboardingStep,
} from "#/app/api/onboarding/_utils";

type ProgressPayload = {
  currentStep?: unknown;
  formData?: unknown;
};

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json().catch(() => null)) as ProgressPayload | null;

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Payload inválido" },
        { status: 400 }
      );
    }

    const progress = {
      currentStep: sanitizeOnboardingStep(body.currentStep),
      formData: sanitizeOnboardingFormData(body.formData),
      updatedAt: new Date().toISOString(),
    };

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    await client.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        onboardingComplete: false,
        onboardingProgress: progress,
      },
    });

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    await client.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        onboardingProgress: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}

