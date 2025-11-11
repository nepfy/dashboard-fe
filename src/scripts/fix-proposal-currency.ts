// src/scripts/fix-proposal-currency.ts
import "dotenv/config";
import { db } from "#/lib/db";
import { projectsTable } from "#/lib/db/schema/projects";
import { eq, isNotNull } from "drizzle-orm";
import {
  parseCurrencyValue,
  formatCurrencyDisplay,
} from "#/helpers/formatCurrency";

const normalizeCurrency = (raw: string | number | null | undefined): string => {
  const numeric = parseCurrencyValue(raw);
  if (numeric === 0) return "R$ 0,00";

  const rawString =
    typeof raw === "string" ? raw.replace(/\s/g, "") : undefined;
  const shouldUpscale =
    numeric > 0 &&
    numeric < 100 &&
    (typeof raw === "number" ||
      (rawString !== undefined &&
        /^(?:R\$)?\d{1,3},\d{2}$/.test(rawString) &&
        !rawString.includes(".")));

  const corrected = shouldUpscale ? numeric * 1000 : numeric;
  return formatCurrencyDisplay(corrected);
};

async function main() {
  const projects = await db
    .select({
      id: projectsTable.id,
      proposalData: projectsTable.proposalData,
    })
    .from(projectsTable)
    .where(isNotNull(projectsTable.proposalData));

  let touchedCount = 0;

  for (const project of projects) {
    const proposal = project.proposalData;
    if (!proposal) continue;

    const updated = JSON.parse(JSON.stringify(proposal));
    let touched = false;

    if (updated.plans?.plansItems) {
      updated.plans.plansItems = updated.plans.plansItems.map((plan) => {
        const normalized = normalizeCurrency(plan.value);
        if (plan.value !== normalized) {
          touched = true;
          return { ...plan, value: normalized };
        }
        return plan;
      });
    }

    if (updated.results?.items) {
      updated.results.items = updated.results.items.map((item) => {
        const normalized = normalizeCurrency(item.investment);
        if (item.investment !== normalized) {
          touched = true;
          return { ...item, investment: normalized };
        }
        return item;
      });
    }

    if (touched) {
      touchedCount += 1;
      await db
        .update(projectsTable)
        .set({ proposalData: updated })
        .where(eq(projectsTable.id, project.id));
    }
  }

  console.log(`Propostas corrigidas: ${touchedCount}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
