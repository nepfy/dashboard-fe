import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        unsafeMetadata: user.unsafeMetadata,
        publicMetadata: user.publicMetadata,
        stripe: user.unsafeMetadata?.stripe || null,
      },
    });
  } catch (error) {
    console.error("Error fetching user account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
