import { auth } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { discoverySourcesTable } from "#/lib/db/schema/onboarding";
import { NextResponse } from "next/server";

export const revalidate = 86400;

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const discover = await db.select().from(discoverySourcesTable);

    return NextResponse.json(
      {
        success: true,
        data: discover,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}
