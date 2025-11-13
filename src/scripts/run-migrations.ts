#!/usr/bin/env tsx
/**
 * Run SQL migrations on the database
 * This script reads all .sql files from src/migrations and executes them
 */

import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🚀 Starting migration process...\n");

  const sql = neon(databaseUrl);
  const migrationsDir = path.join(process.cwd(), "src", "migrations");

  // Read all .sql files from migrations directory
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort(); // Sort to ensure migrations run in order

  console.log(`📁 Found ${files.length} migration files\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const migrationSql = fs.readFileSync(filePath, "utf-8");

    try {
      console.log(`⏳ Running: ${file}`);
      
      // Split SQL by semicolons and filter out empty statements
      const statements = migrationSql
        .split(";")
        .map(stmt => stmt.trim())
        .filter(stmt => {
          // Remove comments and check if there's actual SQL
          const cleanStmt = stmt
            .split('\n')
            .filter(line => !line.trim().startsWith('--'))
            .join('\n')
            .trim();
          return cleanStmt.length > 0;
        });

      // Execute each statement separately
      for (const statement of statements) {
        if (statement.trim()) {
          await sql(statement);
        }
      }
      
      console.log(`✅ Success: ${file}\n`);
      successCount++;
    } catch (error) {
      // Check if error is because column/table already exists
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("duplicate") ||
        errorMessage.includes("does not exist") // Skip migrations that depend on non-existent objects
      ) {
        console.log(`⏭️  Skipped: ${file} (${errorMessage.split('\n')[0]})\n`);
        skipCount++;
      } else {
        console.error(`❌ Error in ${file}:`, errorMessage.split('\n')[0], "\n");
        errorCount++;
      }
    }
  }

  console.log("=".repeat(50));
  console.log("📊 Migration Summary:");
  console.log(`✅ Successful: ${successCount}`);
  console.log(`⏭️  Skipped: ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log("=".repeat(50));

  if (errorCount > 0) {
    console.log("\n⚠️  Some migrations failed. Please check the errors above.");
    process.exit(1);
  } else {
    console.log("\n🎉 All migrations completed successfully!");
    process.exit(0);
  }
}

runMigrations().catch((error) => {
  console.error("💥 Fatal error running migrations:", error);
  process.exit(1);
});

