import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";

import { db } from "#/lib/db";
import { personUserTable } from "#/lib/db/schema/users";
import { parseOnboardingProgress } from "#/app/api/onboarding/_utils";
import type { OnboardingStatusData } from "#/types/onboarding";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const emailAddress = user.emailAddresses[0]?.emailAddress;

    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: "User email not found" },
        { status: 400 }
      );
    }

    // Buscar usuário por clerk_user_id OU por email
    // Isso resolve o problema de usuários migrados que têm clerk_user_id com prefixo legacy
    const [personRecord] = await db
      .select({ id: personUserTable.id })
      .from(personUserTable)
      .where(
        or(
          eq(personUserTable.clerkUserId, user.id),
          eq(personUserTable.email, emailAddress)
        )
      )
      .limit(1);

    const hasPersonRecord = Boolean(personRecord?.id);
    const onboardingComplete =
      user.publicMetadata?.onboardingComplete === true;
    const progress = parseOnboardingProgress(
      user.publicMetadata?.onboardingProgress
    );

    const needsOnboarding = !onboardingComplete || !hasPersonRecord;

    const data: OnboardingStatusData = {
      onboardingComplete,
      hasPersonRecord,
      needsOnboarding,
      progress,
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}

