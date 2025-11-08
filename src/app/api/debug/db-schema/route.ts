import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return NextResponse.json({
        error: "DATABASE_URL not set",
      }, { status: 500 });
    }

    // Extract database info from URL
    const url = new URL(databaseUrl);
    const dbInfo = {
      host: url.hostname,
      database: url.pathname.substring(1),
      user: url.username,
    };

    const sql = neon(databaseUrl);

    // Check if button_config column exists
    const columnCheck = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND column_name = 'button_config'
    `;

    // Get all columns
    const allColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects'
      ORDER BY ordinal_position
    `;

    return NextResponse.json({
      success: true,
      database: dbInfo,
      buttonConfigExists: columnCheck.length > 0,
      totalColumns: allColumns.length,
      columns: allColumns.map((col: any) => ({
        name: col.column_name,
        type: col.data_type,
      })),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

