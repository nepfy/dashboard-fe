"use client";

import PlanAndFeatureCard from "#/components/PlanAndFeatureCard";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

type BillingInterval = "month" | "year";

interface StripePlan {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  interval: BillingInterval;
  features: { name: string }[];
  buttonTitle: string;
  metadata: Record<string, string>;
}

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);

const getIntervalLabel = (interval: BillingInterval) =>
  interval === "year" ? "COBRANÇA ANUAL" : "COBRANÇA MENSAL";

export default function PlansPage() {
  const [plans, setPlans] = useState<StripePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("year");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [currentPlanPriceId, setCurrentPlanPriceId] = useState<string | null>(
    null
  );
  const [, setBillingInfo] = useState<{
    hasActiveSubscription: boolean;
    currentPlan: { subscriptionType?: string; priceId?: string } | null;
  } | null>(null);
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isChangingPlan = searchParams?.get("change") === "true";

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("/api/stripe/get-plans");
        const data = (await response.json()) as StripePlan[];
        setPlans(data || []);
      } catch (error) {
        console.error("Falha ao carregar planos:", error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  // Fetch current subscription info and find current plan price ID
  useEffect(() => {
    async function fetchBillingInfo() {
      try {
        const res = await fetch("/api/stripe/billing-info");
        const data = await res.json();
        if (data.success) {
          setBillingInfo(data.data);

          // Find current plan price ID - always check if user has subscription
          console.log("📊 Billing info response:", {
            hasActiveSubscription: data.data.hasActiveSubscription,
            currentPlan: data.data.currentPlan,
          });

          if (data.data.hasActiveSubscription) {
            // Get price ID directly from billing info response
            if (data.data.currentPlan?.priceId) {
              const priceId = data.data.currentPlan.priceId;
              setCurrentPlanPriceId(priceId);
              console.log(
                "✅ Current plan price ID from billing-info:",
                priceId
              );
            } else {
              console.log(
                "⚠️ No priceId in currentPlan:",
                data.data.currentPlan
              );
            }

            // Set billing interval to match current subscription (only if changing plan)
            if (isChangingPlan && data.data.currentPlan?.subscriptionType) {
              const subscriptionType = data.data.currentPlan.subscriptionType;
              const currentInterval =
                subscriptionType === "yearly" ? "year" : "month";
              setBillingInterval(currentInterval);
            }
          } else {
            // No active subscription, clear current plan
            setCurrentPlanPriceId(null);
            console.log("❌ No active subscription found");
          }
        }
      } catch (e) {
        console.error("Failed to fetch billing info:", e);
      }
    }

    if (user) {
      fetchBillingInfo();
    }
  }, [user, isChangingPlan]);

  const filteredPlans = useMemo(
    () => plans.filter((plan) => plan.interval === billingInterval),
    [plans, billingInterval]
  );

  const displayPlans = useMemo(() => {
    // Incluir planos mensais (incluindo gratuitos)
    const monthlyPlans = plans.filter((plan) => plan.interval === "month");

    const processedPlans = filteredPlans.map((plan) => {
      // Se for anual, calcular preço mensal equivalente (dividir por 12)
      const displayPrice =
        plan.interval === "year" ? Math.round(plan.price / 12) : plan.price;

      const priceLabel = formatCurrency(displayPrice, plan.currency);
      // Sempre mostrar "/mês" mesmo quando for anual
      const intervalSuffix = "/mês";
      const intervalLabel = getIntervalLabel(plan.interval);

      // Get original price from metadata
      const originalPrice = plan.metadata?.originalPrice
        ? parseInt(plan.metadata.originalPrice, 10)
        : undefined;

      // Se for anual e tiver originalPrice, também dividir por 12 para mostrar mensal equivalente
      const displayOriginalPrice =
        originalPrice && plan.interval === "year"
          ? Math.round(originalPrice / 12)
          : originalPrice;

      const originalPriceLabel = displayOriginalPrice
        ? formatCurrency(displayOriginalPrice, plan.currency)
        : undefined;

      // Calculate discount percentage usando os preços de exibição (mensais equivalentes)
      let discountPercent: number | undefined;
      if (displayOriginalPrice && displayOriginalPrice > displayPrice) {
        discountPercent = Math.round(
          ((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100
        );
      }

      // Parse coming soon features from metadata
      let comingSoonFeatures: string[] = [];
      if (plan.metadata?.comingSoonFeatures) {
        try {
          comingSoonFeatures = JSON.parse(plan.metadata.comingSoonFeatures);
        } catch {
          // If parsing fails, ignore
        }
      }

      // Separate active features from coming soon
      const activeFeatures = plan.features
        .map((feature) => feature.name)
        .filter((feature) => !comingSoonFeatures.includes(feature));

      let savingsLabel: string | undefined;
      if (plan.interval === "year") {
        const monthlyMatch = monthlyPlans.find(
          (monthlyPlan) => monthlyPlan.title === plan.title
        );
        if (monthlyMatch && monthlyMatch.price > 0) {
          const yearlyMonthlyTotal = monthlyMatch.price * 12;
          if (yearlyMonthlyTotal > plan.price) {
            const savingsPercent = Math.round(
              ((yearlyMonthlyTotal - plan.price) / yearlyMonthlyTotal) * 100
            );
            savingsLabel = `Economize ${savingsPercent}% em relação ao mensal`;
          }
        }
      }

      // Determine if plan should be highlighted/recommended
      // For monthly billing, always highlight "Plano Essencial"
      // For yearly billing, use metadata recommendation
      const isEssencialPlan = plan.title === "Plano Essencial";
      const isRecommended =
        billingInterval === "month"
          ? isEssencialPlan
          : plan.metadata?.recommended === "true";
      const highlight = isRecommended;

      return {
        id: plan.id,
        title: plan.title,
        description: plan.description,
        features: activeFeatures,
        comingSoonFeatures,
        priceLabel,
        originalPriceLabel,
        intervalLabel,
        intervalSuffix,
        buttonTitle: plan.buttonTitle || "Assinar agora",
        savingsLabel,
        discountPercent,
        isRecommended,
        highlight,
      };
    });

    // Sort plans in correct order: Free, Starter, Essencial, Pro
    const planOrder = [
      "Plano Free",
      "Plano Starter",
      "Plano Essencial",
      "Plano Pro",
    ];
    return processedPlans.sort((a, b) => {
      const indexA = planOrder.indexOf(a.title);
      const indexB = planOrder.indexOf(b.title);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [filteredPlans, plans, billingInterval]);

  // Update displayPlans to mark current plan
  const displayPlansWithCurrent = useMemo(() => {
    return displayPlans.map((plan) => {
      const isCurrent = currentPlanPriceId === plan.id;
      if (isCurrent) {
        console.log(
          "✅ Current plan identified:",
          plan.title,
          "Price ID:",
          plan.id,
          "Current Price ID:",
          currentPlanPriceId
        );
      }
      return {
        ...plan,
        isCurrentPlan: isCurrent,
      };
    });
  }, [displayPlans, currentPlanPriceId]);

  const recommendedPlanId = useMemo(
    () =>
      displayPlansWithCurrent.find((plan) => plan.isRecommended)?.id ||
      displayPlansWithCurrent[displayPlansWithCurrent.length - 1]?.id ||
      null,
    [displayPlansWithCurrent]
  );

  useEffect(() => {
    if (!displayPlansWithCurrent.length) {
      setSelectedPlanId(null);
      return;
    }

    if (
      selectedPlanId &&
      displayPlansWithCurrent.some((plan) => plan.id === selectedPlanId)
    ) {
      return;
    }

    setSelectedPlanId(recommendedPlanId);
  }, [displayPlansWithCurrent, recommendedPlanId, selectedPlanId]);

  const selectedPlan = displayPlansWithCurrent.find(
    (plan) => plan.id === selectedPlanId
  );

  const handleSelectPlan = async (planId: string) => {
    const plan = displayPlansWithCurrent.find((p) => p.id === planId);
    const originalPlan = plans.find((p) => p.id === planId);

    // Se for o plano Free (preço 0), não fazer checkout
    if (originalPlan && originalPlan.price === 0) {
      // Aqui você pode adicionar lógica para lidar com o plano free
      // Por exemplo, redirecionar para o dashboard ou mostrar uma mensagem
      return;
    }

    if (!plan || !originalPlan) {
      console.error("Plano não encontrado");
      return;
    }

    // Definir o plano como processando
    setProcessingPlanId(planId);

    try {
      // Determinar o billing cycle baseado no intervalo selecionado
      const billingCycle = billingInterval === "year" ? "yearly" : "monthly";

      // Criar sessão de checkout no Stripe
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: planId,
          billingCycle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao criar sessão de checkout");
      }

      const data = await response.json();

      if (data.session?.url) {
        // Redirecionar para o checkout do Stripe
        window.location.href = data.session.url;
      } else {
        throw new Error("URL de checkout não encontrada");
      }
    } catch (error) {
      console.error("Erro ao criar sessão de checkout:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao criar sessão de checkout. Tente novamente."
      );
      setProcessingPlanId(null);
    }
  };

  return (
    <div className="bg-white">
      <section className="mx-auto flex flex-col gap-4 px-4 py-8 text-center sm:py-12 md:py-16">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Escolha seu plano
        </h1>
        <p className="mx-auto text-sm text-neutral-500 sm:text-base">
          Selecione o plano que melhor atende às suas necessidades e aproveite o
          melhor da Nepfy.
        </p>
        <div className="mx-auto inline-flex w-full max-w-[657px] items-center justify-center gap-2 rounded-lg bg-[#F6F8FA] p-1 sm:gap-4">
          <button
            type="button"
            className={`rounded-md px-4 py-2 text-sm font-medium sm:px-6 sm:py-3 sm:text-base ${
              billingInterval === "month"
                ? "border border-gray-200 bg-white text-neutral-900 shadow-xs"
                : "bg-transparent text-neutral-900"
            }`}
            onClick={() => setBillingInterval("month")}
          >
            Mensal
          </button>
          <button
            type="button"
            className={`rounded-[10px] px-4 py-2 text-sm font-bold sm:px-6 sm:py-3 sm:text-base ${
              billingInterval === "year"
                ? "border border-gray-200 bg-white text-[#6366f1] shadow-xs"
                : "bg-transparent text-[#6366f1]"
            }`}
            onClick={() => setBillingInterval("year")}
          >
            Anual (até <span className="font-black italic">40% OFF</span>)
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-8 sm:pb-12 md:pb-16">
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 sm:rounded-3xl sm:p-12 sm:text-base">
            Carregando planos disponíveis...
          </div>
        ) : (
          <PlanAndFeatureCard
            plans={displayPlansWithCurrent}
            onSelectPlan={handleSelectPlan}
            selectedPlanId={selectedPlan?.id ?? null}
            processingPlanId={processingPlanId}
            currentPlanPriceId={currentPlanPriceId}
          />
        )}
        {!loading && displayPlans.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 sm:rounded-3xl sm:p-12 sm:text-base">
            Nenhum plano encontrado.
          </div>
        )}
      </section>

      <footer className="mx-auto max-w-[1440px] px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-4">
          <p className="text-xs text-gray-500 sm:text-sm">
            Cobrança anual em uma só vez • Valor mensal apenas para comparação
          </p>
        </div>
        <div className="flex items-center justify-center pt-8 sm:justify-end sm:pt-12 md:pt-16">
          <p className="text-xs text-gray-500 sm:text-sm">© 2025 Nepfy</p>
        </div>
      </footer>
    </div>
  );
}
