/**
 * Check Expiring Proposals Script
 * Runs as a cron job to check for proposals expiring soon and send notifications
 * 
 * Usage: npm run check-expiring-proposals
 * 
 * Recommended cron schedule: Run twice daily (morning and evening)
 * Example: 0 9,18 * * * (9 AM and 6 PM every day)
 */

import { db } from "#/lib/db";
import { projectsTable } from "#/lib/db/schema";
import { sql } from "drizzle-orm";
import { NotificationHelper } from "#/lib/services/notification-helper";

interface ExpiringProposal {
  id: string;
  projectName: string;
  clientName: string;
  personId: string;
  projectValidUntil: Date;
  hoursLeft: number;
}

async function checkExpiringProposals() {
  console.log("🔍 Checking for expiring proposals...");

  const now = new Date();
  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const twoDaysFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  try {
    // Find proposals expiring within the next 24-48 hours
    // Only check "active" or "negotiation" status
    const expiringProposals = await db
      .select({
        id: projectsTable.id,
        projectName: projectsTable.projectName,
        clientName: projectsTable.clientName,
        personId: projectsTable.personId,
        projectValidUntil: projectsTable.projectValidUntil,
      })
      .from(projectsTable)
      .where(
        sql`${projectsTable.projectValidUntil} IS NOT NULL 
            AND ${projectsTable.projectValidUntil} > ${now}
            AND ${projectsTable.projectValidUntil} <= ${twoDaysFromNow}
            AND ${projectsTable.projectStatus} IN ('active', 'negotiation')
            AND ${projectsTable.isPublished} = true`
      );

    console.log(`📋 Found ${expiringProposals.length} expiring proposals`);

    if (expiringProposals.length === 0) {
      console.log("✅ No expiring proposals found. All good!");
      return;
    }

    // Process each expiring proposal
    const notifications: Promise<unknown>[] = [];

    for (const proposal of expiringProposals) {
      if (!proposal.projectValidUntil) continue;

      const hoursLeft = Math.floor(
        (proposal.projectValidUntil.getTime() - now.getTime()) /
          (1000 * 60 * 60)
      );

      // Only notify if within 24 hours (to avoid duplicate notifications)
      if (hoursLeft <= 24 && hoursLeft > 0) {
        console.log(
          `⏳ Sending notification for proposal "${proposal.projectName}" (${hoursLeft}h left)`
        );

        notifications.push(
          NotificationHelper.notifyProposalExpiringSoon(
            proposal.personId,
            proposal.id,
            proposal.projectName || "Sem nome",
            proposal.clientName || "Cliente",
            hoursLeft
          )
        );
      }
    }

    const results = await Promise.allSettled(notifications);

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(`✅ Notifications sent: ${successful}`);
    if (failed > 0) {
      console.log(`❌ Failed notifications: ${failed}`);
    }

    console.log("✨ Done checking expiring proposals!");
  } catch (error) {
    console.error("❌ Error checking expiring proposals:", error);
    process.exit(1);
  }
}

async function checkExpiredProposals() {
  console.log("🔍 Checking for expired proposals...");

  const now = new Date();

  try {
    // Find proposals that just expired (within last 24 hours)
    // and haven't been marked as expired yet
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const expiredProposals = await db
      .select({
        id: projectsTable.id,
        projectName: projectsTable.projectName,
        clientName: projectsTable.clientName,
        personId: projectsTable.personId,
        projectValidUntil: projectsTable.projectValidUntil,
      })
      .from(projectsTable)
      .where(
        sql`${projectsTable.projectValidUntil} IS NOT NULL 
            AND ${projectsTable.projectValidUntil} < ${now}
            AND ${projectsTable.projectValidUntil} >= ${yesterday}
            AND ${projectsTable.projectStatus} NOT IN ('expired', 'approved', 'rejected', 'archived')
            AND ${projectsTable.isPublished} = true`
      );

    console.log(`📋 Found ${expiredProposals.length} expired proposals`);

    if (expiredProposals.length === 0) {
      console.log("✅ No expired proposals found. All good!");
      return;
    }

    // Process each expired proposal
    const notifications: Promise<unknown>[] = [];

    for (const proposal of expiredProposals) {
      console.log(
        `⏰ Marking proposal "${proposal.projectName}" as expired and sending notification`
      );

      // Update status to expired
      await db
        .update(projectsTable)
        .set({
          projectStatus: "expired",
          updatedAt: new Date(),
        })
        .where(sql`${projectsTable.id} = ${proposal.id}`);

      // Send notification
      notifications.push(
        NotificationHelper.notifyProposalExpired(
          proposal.personId,
          proposal.id,
          proposal.projectName || "Sem nome",
          proposal.clientName || "Cliente"
        )
      );
    }

    const results = await Promise.allSettled(notifications);

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(`✅ Notifications sent: ${successful}`);
    if (failed > 0) {
      console.log(`❌ Failed notifications: ${failed}`);
    }

    console.log("✨ Done checking expired proposals!");
  } catch (error) {
    console.error("❌ Error checking expired proposals:", error);
    process.exit(1);
  }
}

// Run both checks
async function main() {
  console.log("🚀 Starting proposal expiration check...\n");

  await checkExpiringProposals();
  console.log("");
  await checkExpiredProposals();

  console.log("\n🎉 All checks completed!");
  process.exit(0);
}

main();

