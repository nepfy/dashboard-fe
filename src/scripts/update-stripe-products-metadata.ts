import { Stripe } from "stripe";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("❌ STRIPE_SECRET_KEY environment variable is not set");
  console.error("Please set STRIPE_SECRET_KEY in your .env.local file");
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

interface PlanMetadata {
  name: string;
  originalMonthlyPrice: number; // in cents (BRL) - preço original mensal
  originalYearlyPrice: number; // in cents (BRL) - preço original anual
}

// Configuração dos preços originais para cada plano
const plansMetadata: PlanMetadata[] = [
  {
    name: "Plano Free",
    originalMonthlyPrice: 0,
    originalYearlyPrice: 0,
  },
  {
    name: "Plano Starter",
    originalMonthlyPrice: 4900, // R$ 49,00
    originalYearlyPrice: 58800, // R$ 588,00 (R$ 49,00 * 12)
  },
  {
    name: "Plano Essencial",
    originalMonthlyPrice: 11900, // R$ 119,00
    originalYearlyPrice: 142800, // R$ 1.428,00 (R$ 119,00 * 12)
  },
  {
    name: "Plano Pro",
    originalMonthlyPrice: 14000, // R$ 140,00
    originalYearlyPrice: 168000, // R$ 1.680,00 (R$ 140,00 * 12)
  },
];

async function updateStripeProductsMetadata() {
  console.log("🚀 Starting Stripe products metadata update...\n");

  try {
    // Buscar todos os produtos ativos
    const products = await stripe.products.list({
      active: true,
      limit: 100,
    });

    console.log(`📦 Found ${products.data.length} products\n`);

    // Criar mapa de configuração por nome
    const metadataMap = new Map(
      plansMetadata.map((p) => [p.name, p])
    );

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products.data) {
      const planConfig = metadataMap.get(product.name);

      if (!planConfig) {
        console.log(`⏭️  Skipping product: ${product.name} (not in config)`);
        skippedCount++;
        continue;
      }

      console.log(`📦 Processing: ${product.name}`);

      // Buscar preços deste produto para determinar se tem mensal e/ou anual
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 100,
      });

      const hasMonthly = prices.data.some(
        (p) => p.recurring?.interval === "month"
      );
      const hasYearly = prices.data.some(
        (p) => p.recurring?.interval === "year"
      );

      console.log(`   - Monthly price: ${hasMonthly ? "✅" : "❌"}`);
      console.log(`   - Yearly price: ${hasYearly ? "✅" : "❌"}`);

      // Preparar metadata atualizado
      const currentMetadata = product.metadata || {};
      const updatedMetadata: Record<string, string> = {
        ...currentMetadata,
      };

      // Adicionar originalPrice no metadata do produto
      // Prioridade: usar preço anual se existir, senão usar mensal
      // A lógica na página vai dividir por 12 se for anual
      if (hasYearly && planConfig.originalYearlyPrice > 0) {
        updatedMetadata.originalPrice = String(planConfig.originalYearlyPrice);
        console.log(
          `   - Original price (yearly): R$ ${(planConfig.originalYearlyPrice / 100).toFixed(2)}`
        );
      } else if (hasMonthly && planConfig.originalMonthlyPrice > 0) {
        updatedMetadata.originalPrice = String(planConfig.originalMonthlyPrice);
        console.log(
          `   - Original price (monthly): R$ ${(planConfig.originalMonthlyPrice / 100).toFixed(2)}`
        );
      }

      // Atualizar produto
      const updatedProduct = await stripe.products.update(product.id, {
        metadata: updatedMetadata,
      });

      console.log(`   ✅ Product updated: ${product.id}`);
      console.log(`   📋 Metadata keys: ${Object.keys(updatedMetadata).join(", ")}\n`);

      updatedCount++;
    }

    console.log("🎉 Metadata update completed!\n");
    console.log("📋 Summary:");
    console.log(`   - Products processed: ${products.data.length}`);
    console.log(`   - Products updated: ${updatedCount}`);
    console.log(`   - Products skipped: ${skippedCount}`);
    console.log("\n💡 Next steps:");
    console.log("   1. Verify products in Stripe Dashboard");
    console.log("   2. Check that originalPrice is in product metadata");
    console.log("   3. Test the plans page to see discount badges");
  } catch (error) {
    console.error("❌ Error updating Stripe products metadata:", error);
    if (error instanceof Stripe.errors.StripeError) {
      console.error(`   Type: ${error.type}`);
      console.error(`   Code: ${error.code}`);
      console.error(`   Message: ${error.message}`);
    }
    process.exit(1);
  }
}

// Run the script
updateStripeProductsMetadata()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });

