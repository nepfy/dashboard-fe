import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("per_page") || "15";

    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Pexels API key not configured" },
        { status: 500 }
      );
    }

    // If no query, get curated photos
    const url = query
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`
      : `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`;

    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch images" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      photos: data.photos,
      total_results: data.total_results,
      page: data.page,
      per_page: data.per_page,
    });
  } catch (error) {
    console.error("Pexels API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
