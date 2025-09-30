import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/migrations",
  schema: ["./src/lib/db/schema/*"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    database: process.env.DB_NAME!,
  },
});
