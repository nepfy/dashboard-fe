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

interface PlanConfig {
  name: string;
  description: string;
  monthlyPrice: number; // in cents (BRL)
  yearlyPrice: number; // in cents (BRL)
  features: string[];
  recommended?: boolean;
  buttonTitle?: string;
  credits?: string;
}

const plans: PlanConfig[] = [
  {
    name: "Plano Free",
    description: "Experimente grátis e descubra o potencial",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "1 proposta personalizada",
      "Gestor de propostas",
      "Calculadora de projetos EM BREVE",
    ],
    buttonTitle: "Experimentar grátis",
    credits: "1",
  },
  {
    name: "Plano Starter",
    description: "Primeiro passo para autônomos brilharem",
    monthlyPrice: 4400, // R$ 44,00 (desconto de R$ 49,00)
    yearlyPrice: 52800, // R$ 528,00 (R$ 44,00 * 12)
    features: [
      "5 propostas por mês",
      "Gestor de propostas",
      "Calculadora de projetos EM BREVE",
      "Gerador e gestor de contratos EM BREVE",
    ],
    buttonTitle: "Escolher plano",
    credits: "5",
  },
  {
    name: "Plano Essencial",
    description: "A escolha certa para equipes em ascensão",
    monthlyPrice: 9500, // R$ 95,00 (desconto de R$ 119,00)
    yearlyPrice: 114000, // R$ 1.140,00 (R$ 95,00 * 12)
    features: [
      "20 propostas por mês",
      "Gestor de propostas",
      "Calculadora de projetos EM BREVE",
      "Gerador e gestor de contratos EM BREVE",
    ],
    buttonTitle: "Escolher plano",
    credits: "20",
  },
  {
    name: "Plano Pro",
    description: "Maximize resultados da sua empresa",
    monthlyPrice: 8300, // R$ 83,00 (desconto de R$ 140,00 - 40% OFF)
    yearlyPrice: 99600, // R$ 996,00 (R$ 83,00 * 12)
    features: [
      "Propostas ilimitadas",
      "Gestor de propostas",
      "Grupo exclusivo no WhatsApp",
      "Mentorias ao vivo",
      "Feedbacks sob demanda",
      "Acesso antecipado a novos recursos",
      "Bônus surpresa",
      "Calculadora de projetos EM BREVE",
      "Gerador e gestor de contratos EM BREVE",
    ],
    recommended: true,
    buttonTitle: "Escolher plano",
    credits: "unlimited",
  },
];

async function createStripePlans() {
  console.log("🚀 Starting Stripe plans creation/update...\n");

  try {
    // Buscar produtos existentes
    const existingProducts = await stripe.products.list({
      active: true,
      limit: 100,
    });

    // Criar mapa de produtos existentes por nome
    const productsMap = new Map(
      existingProducts.data.map((p) => [p.name, p])
    );

    for (const plan of plans) {
      console.log(`📦 Processing plan: ${plan.name}`);

      // Verificar se produto já existe
      let product = productsMap.get(plan.name);

      if (product) {
        console.log(`  ℹ️  Product already exists: ${product.id}`);
        // Atualizar produto existente
        product = await stripe.products.update(product.id, {
          description: plan.description,
          metadata: {
            credits: plan.credits || "0",
            buttonTitle: plan.buttonTitle || "Assinar",
            recommended: plan.recommended ? "true" : "false",
          },
          marketing_features: plan.features.map((feature) => ({
            name: feature,
          })),
        });
        console.log(`  ✅ Product updated: ${product.id}`);
      } else {
        // Criar novo produto
        product = await stripe.products.create({
          name: plan.name,
          description: plan.description,
          metadata: {
            credits: plan.credits || "0",
            buttonTitle: plan.buttonTitle || "Assinar",
            recommended: plan.recommended ? "true" : "false",
          },
          marketing_features: plan.features.map((feature) => ({
            name: feature,
          })),
        });
        console.log(`  ✅ Product created: ${product.id}`);
      }

      // Buscar preços existentes para este produto
      const existingPrices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 100,
      });

      // Calculate original prices for discount display
      const originalMonthlyPrices: Record<string, number> = {
        "Plano Starter": 4900, // R$ 49,00
        "Plano Essencial": 11900, // R$ 119,00
        "Plano Pro": 14000, // R$ 140,00
      };

      const originalMonthlyPrice = originalMonthlyPrices[plan.name] || plan.monthlyPrice;

      // Verificar se já existe preço mensal
      const existingMonthlyPrice = existingPrices.data.find(
        (p) =>
          p.recurring?.interval === "month" &&
          p.unit_amount === plan.monthlyPrice &&
          p.currency === "brl"
      );

      if (existingMonthlyPrice) {
        console.log(`  ℹ️  Monthly price already exists: ${existingMonthlyPrice.id} (R$ ${(plan.monthlyPrice / 100).toFixed(2)})`);
      } else {
        // Criar preço mensal apenas se não existir
        const monthlyPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.monthlyPrice,
          currency: "brl",
          recurring: {
            interval: "month",
          },
          metadata: {
            planName: plan.name,
            interval: "month",
            originalPrice: String(originalMonthlyPrice),
          },
        });
        console.log(`  ✅ Monthly price created: ${monthlyPrice.id} (R$ ${(plan.monthlyPrice / 100).toFixed(2)})`);
      }

      // Verificar se já existe preço anual
      const originalYearlyPrice = originalMonthlyPrice * 12;
      const existingYearlyPrice = existingPrices.data.find(
        (p) =>
          p.recurring?.interval === "year" &&
          p.unit_amount === plan.yearlyPrice &&
          p.currency === "brl"
      );

      if (existingYearlyPrice) {
        console.log(`  ℹ️  Yearly price already exists: ${existingYearlyPrice.id} (R$ ${(plan.yearlyPrice / 100).toFixed(2)})`);
      } else {
        // Criar preço anual apenas se não existir
        const yearlyPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.yearlyPrice,
          currency: "brl",
          recurring: {
            interval: "year",
          },
          metadata: {
            planName: plan.name,
            interval: "year",
            originalPrice: String(originalYearlyPrice),
          },
        });
        console.log(`  ✅ Yearly price created: ${yearlyPrice.id} (R$ ${(plan.yearlyPrice / 100).toFixed(2)})`);
      }

      console.log(`  ✨ ${plan.name} completed!\n`);
    }

    console.log("🎉 All plans processed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   - Processed ${plans.length} plans`);
    console.log(`   - Products updated/created as needed`);
    console.log(`   - Prices created only if they don't exist`);
    console.log("\n💡 Next steps:");
    console.log("   1. Verify plans in Stripe Dashboard");
    console.log("   2. If you need to update prices, create new prices in Stripe Dashboard");
    console.log("   3. Test checkout flow");
  } catch (error) {
    console.error("❌ Error creating Stripe plans:", error);
    if (error instanceof Stripe.errors.StripeError) {
      console.error(`   Type: ${error.type}`);
      console.error(`   Code: ${error.code}`);
      console.error(`   Message: ${error.message}`);
    }
    process.exit(1);
  }
}

// Run the script
createStripePlans()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });


