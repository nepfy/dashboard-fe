"use client";

import Lock from "#/components/icons/Lock";
import PlanAndFeatureCard from "#/components/PlanAndFeatureCard";
import { useEffect, useMemo, useState } from "react";

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
  interval === "year" ? "Cobrança anual" : "Cobrança mensal";

export default function PlansPage() {
  const [plans, setPlans] = useState<StripePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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

  const filteredPlans = useMemo(
    () => plans.filter((plan) => plan.interval === billingInterval),
    [plans, billingInterval]
  );

  const displayPlans = useMemo(() => {
    const monthlyPlans = plans.filter(
      (plan) => plan.interval === "month" && plan.price > 0
    );

    return filteredPlans.map((plan) => {
      const priceLabel = formatCurrency(plan.price, plan.currency);
      const intervalLabel = getIntervalLabel(plan.interval);

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

      return {
        id: plan.id,
        title: plan.title,
        description: plan.description,
        features: plan.features.map((feature) => feature.name),
        priceLabel,
        intervalLabel,
        buttonTitle: plan.buttonTitle || "Assinar agora",
        savingsLabel,
        isRecommended: plan.metadata?.recommended === "true",
        highlight: plan.metadata?.recommended === "true",
      };
    });
  }, [filteredPlans, plans]);

  const recommendedPlanId = useMemo(
    () =>
      displayPlans.find((plan) => plan.isRecommended)?.id ||
      displayPlans[displayPlans.length - 1]?.id ||
      null,
    [displayPlans]
  );

  useEffect(() => {
    if (!displayPlans.length) {
      setSelectedPlanId(null);
      return;
    }

    if (selectedPlanId && displayPlans.some((plan) => plan.id === selectedPlanId)) {
      return;
    }

    setSelectedPlanId(recommendedPlanId);
  }, [displayPlans, recommendedPlanId, selectedPlanId]);

  const selectedPlan = displayPlans.find(
    (plan) => plan.id === selectedPlanId
  );

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setCheckoutError(null);
  };

  const handleCheckout = async () => {
    if (!selectedPlan) return;

    setProcessingPlanId(selectedPlan.id);
    setCheckoutError(null);

    try {
      const response = await fetch(
        "/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: selectedPlan.id,
            billingCycle: billingInterval === "year" ? "annual" : "monthly",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Erro ao iniciar pagamento.");
      }

      const payload = await response.json();
      if (payload?.session?.url) {
        window.location.href = payload.session.url;
        return;
      }

      throw new Error("Não foi possível redirecionar para o Stripe.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido.";
      setCheckoutError(message);
      setProcessingPlanId(null);
    }
  };

  return (
    <div className="bg-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-center sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-600">
          Nepfy Plans
        </p>
        <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl">
          Escolha o plano que acompanha o seu crescimento
        </h1>
        <p className="mx-auto max-w-2xl text-base text-gray-500">
          Tenha acesso a propostas ilimitadas, acompanhamento dedicado e automações
          para vender mais. Selecione o plano ideal e conclua tudo dentro da Nepfy.
        </p>
        <div className="mx-auto flex w-full max-w-[380px] justify-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1 text-sm shadow-sm">
          <button
            type="button"
            className={`flex-1 rounded-full px-4 py-2 transition ${
              billingInterval === "month"
                ? "bg-white font-semibold text-indigo-600 shadow"
                : "text-gray-500 hover:text-indigo-600"
            }`}
            onClick={() => setBillingInterval("month")}
          >
            Mensal
          </button>
          <button
            type="button"
            className={`flex-1 rounded-full px-4 py-2 transition ${
              billingInterval === "year"
                ? "bg-white font-semibold text-indigo-600 shadow"
                : "text-gray-500 hover:text-indigo-600"
            }`}
            onClick={() => setBillingInterval("year")}
          >
            Anual <span className="text-xs text-emerald-600">(até 40% OFF)</span>
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            {loading ? (
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-12 text-center text-gray-500">
                Carregando planos disponíveis...
              </div>
            ) : displayPlans.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
                Nenhum plano encontrado.
              </div>
            ) : (
              <PlanAndFeatureCard
                plans={displayPlans}
                onSelectPlan={handleSelectPlan}
                selectedPlanId={selectedPlan?.id ?? null}
                processingPlanId={processingPlanId}
              />
            )}
          </div>

          <aside className="space-y-6 rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-500/10 via-white to-white p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-indigo-600">
              Resumo
            </p>
            {selectedPlan ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedPlan.title}
                    </p>
                    <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                      {selectedPlan.intervalLabel}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {selectedPlan.priceLabel}
                  </p>
                  {selectedPlan.savingsLabel && (
                    <p className="text-sm font-semibold text-emerald-600">
                      {selectedPlan.savingsLabel}
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>Propostas ilimitadas</p>
                  <p>Mentorias e suporte prioritário</p>
                  <p>Conexão segura com criptografia Stripe</p>
                </div>

                {checkoutError && (
                  <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-600">
                    {checkoutError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={!selectedPlan || !!processingPlanId}
                  className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  {processingPlanId ? "Processando pagamento..." : "Revisar e pagar"}
                </button>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock width="20" height="20" fill="#5B5B8A" />
                  <p>Conexão segura · dados criptografados com Stripe</p>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Selecione um plano para visualizar o resumo e concluir a assinatura.
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
