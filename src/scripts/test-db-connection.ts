#!/usr/bin/env tsx

import "dotenv/config";

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...");
  
  // Check if DATABASE_URL exists
  const databaseUrl = process.env.DATABASE_URL;
  console.log("DATABASE_URL exists:", !!databaseUrl);
  
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined");
    process.exit(1);
  }
  
  // Check if it's a valid PostgreSQL URL
  if (!databaseUrl.startsWith("postgresql://")) {
    console.error("❌ DATABASE_URL doesn't look like a PostgreSQL URL");
    console.log("Current value:", databaseUrl.substring(0, 20) + "...");
    process.exit(1);
  }
  
  console.log("✅ DATABASE_URL format looks correct");
  
  try {
    // Test actual connection
    const { db } = await import("#/lib/db");
    console.log("✅ Database connection successful");
    
    // Test a simple query
    const result = await db.execute("SELECT 1 as test");
    console.log("✅ Database query successful:", result);
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
  
  console.log("🎉 All tests passed!");
}

testDatabaseConnection().catch(console.error);
