"use client";

import { useStripeCustom } from "#/hooks/use-stripe";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Plan = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features?: { name: string }[];
  credits?: string;
  buttonTitle?: string;
};

interface BillingInfo {
  hasActiveSubscription: boolean;
  currentPlan: {
    id: string;
    status: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
  } | null;
  paymentMethod: {
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  nextBillingDate: Date | null;
  invoices: Array<{
    id: string;
    number: string;
    status: string;
    amountPaid: number;
    currency: string;
    created: Date;
    paidAt: Date | null;
    pdfUrl: string | null;
  }>;
}

export function Subscription() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState(true);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);
  const { userPlan, isLoaded } = useStripeCustom();
  const { user } = useUser();
  // const router = useRouter();

  console.log({ user: user?.unsafeMetadata.stripe });

  // Fetch billing info from API
  useEffect(() => {
    async function fetchBillingInfo() {
      setBillingLoading(true);
      try {
        const res = await fetch("/api/stripe/billing-info");
        const data = await res.json();
        if (data.success) {
          setBillingInfo(data.data);
        }
      } catch (e) {
        console.error("Failed to fetch billing info:", e);
      } finally {
        setBillingLoading(false);
      }
    }
    fetchBillingInfo();
  }, []);

  // Fetch plans from API
  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEPFY_API_URL}/stripe/get-plans`
        );
        const data = await res.json();
        setPlans(data || []);
      } catch (e) {
        console.error("Failed to fetch plans:", e);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  // Set current plan based on user's subscription
  useEffect(() => {
    if (!isLoaded || billingLoading) return; // Wait for both Clerk and billing data to load

    // Use billing info to determine current plan
    if (billingInfo?.hasActiveSubscription && billingInfo.currentPlan) {
      // User has an active subscription, find matching plan
      const matchingPlan = plans.find((plan) => {
        // Match by price and interval
        return (
          plan.price > 0 &&
          ((billingCycle === "monthly" && plan.interval === "month") ||
            (billingCycle === "yearly" && plan.interval === "year"))
        );
      });

      if (matchingPlan) {
        setCurrentPlanId(matchingPlan.id);
      }
    } else {
      // No active subscription, set to free plan
      const freePlan = plans.find((p) => !p.price || p.price === 0);
      setCurrentPlanId(freePlan?.id || null);
    }
  }, [userPlan, plans, isLoaded, billingLoading, billingInfo, billingCycle]);

  const handleSwitchPlan = async (planId: string) => {
    try {
      // Track upgrade modal opened
      const { trackUpgradeModalOpened } = await import("#/lib/analytics/track");
      trackUpgradeModalOpened({
        source: "subscription_page",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEPFY_API_URL}/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ priceId: planId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { session } = await response.json();

      if (session?.url) {
        window.open(session.url, "_blank");
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert("Erro ao criar sessão de checkout. Tente novamente.");
    }
  };

  const handleEditPaymentMethod = async () => {
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.open(data.url, "_blank");
      } else {
        alert("Erro ao abrir portal de pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Error opening payment portal:", error);
      alert("Erro ao abrir portal de pagamento. Tente novamente.");
    }
  };

  const getPlanPrice = (plan: Plan) => {
    if (!plan.price) return "Grátis";
    const basePrice = plan.price / 100;
    const yearlyPrice = basePrice * 12 * 0.8; // 20% discount for yearly
    const finalPrice = billingCycle === "yearly" ? yearlyPrice : basePrice;
    return finalPrice.toLocaleString("pt-BR", {
      style: "currency",
      currency: plan.currency.toUpperCase(),
    });
  };

  const getPlanInterval = () => {
    if (billingCycle === "yearly") {
      return "/ano";
    }
    return "/mês";
  };

  // Check if a plan is currently active for the user
  const isActivePlan = (plan: Plan) => {
    if (!isLoaded || billingLoading) return false; // Wait for both Clerk and billing data to load

    // Use billing info to determine active plan
    if (billingInfo?.hasActiveSubscription) {
      // User has active subscription, check if this plan matches
      return plan.id === currentPlanId;
    } else {
      // No active subscription, check if this is the free plan
      return !plan.price || plan.price === 0;
    }
  };

  const getButtonText = (plan: Plan) => {
    if (isActivePlan(plan)) {
      return "Plano Atual";
    }
    return "Trocar para este";
  };

  const isButtonDisabled = (plan: Plan) => {
    return isActivePlan(plan);
  };

  if (loading || !isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8">
      {/* Debug Section */}

      {/* Billing Cycle Toggle */}
      <div className="flex justify-start mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "monthly"
                ? "bg-white text-[#815ffd] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === "yearly"
                ? "bg-white text-[#815ffd] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Anual
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Subscription Plans */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Planos de Assinatura
          </h2>

          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white border rounded-lg p-6 shadow-sm ${
                isActivePlan(plan)
                  ? "gradient-border bg-orange-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-gray-900"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {plan.title}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {getPlanPrice(plan)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getPlanInterval()}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Incluído no plano
                </h4>
                <ul className="space-y-2">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 text-gray-900"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">
                        {feature.name}
                      </span>
                    </li>
                  )) || (
                    <>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4">
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 text-gray-900"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          Ferramentas avançadas de mensagens e automação
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4">
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 text-gray-900"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          Insights e análises em tempo real
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4">
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 text-gray-900"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          Campanhas de outreach personalizáveis
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4">
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 text-gray-900"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          Integração com as principais plataformas
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4">
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 text-gray-900"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          Suporte padrão
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <button
                onClick={() => handleSwitchPlan(plan.id)}
                disabled={isButtonDisabled(plan)}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isButtonDisabled(plan)
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-[#ac99f3] hover:text-white cursor-pointer"
                }`}
              >
                {getButtonText(plan)}
              </button>
            </div>
          ))}
        </div>

        {/* Right Column - Billing Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Informações de Cobrança
          </h2>

          {/* Only show billing info if user has a paid plan */}
          {userPlan ? (
            <>
              {/* Current Billing Cycle */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Ciclo de Cobrança Atual
                </h3>
                {billingInfo?.nextBillingDate && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Próxima data de emissão da fatura:{" "}
                      {billingInfo.nextBillingDate.toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {/* Payment Method */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-sm font-bold capitalize">
                        {billingInfo?.paymentMethod?.brand?.toUpperCase() ||
                          "VISA"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {billingInfo?.paymentMethod?.brand || "Desconhecido"}
                      </p>
                      <p className="text-xs text-gray-500">
                        terminando em{" "}
                        {billingInfo?.paymentMethod?.last4 || "0000"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleEditPaymentMethod}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
                  >
                    Editar
                  </button>
                </div>
              </div>

              {/* Past Bills */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Faturas Anteriores
                </h3>
                {billingInfo?.invoices && billingInfo.invoices.length > 0 ? (
                  <div className="space-y-3">
                    {billingInfo.invoices.map((invoice, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Fatura #{invoice.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(invoice.created).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {invoice.amountPaid.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: invoice.currency.toUpperCase(),
                              })}
                            </p>
                            <p
                              className={`text-xs ${
                                invoice.paidAt
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {invoice.paidAt ? "Pago" : "Pendente"}
                            </p>
                          </div>
                          {invoice.pdfUrl && (
                            <button
                              onClick={() =>
                                window.open(invoice.pdfUrl!, "_blank")
                              }
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                              PDF
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      Nenhuma fatura anterior disponível
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Show message for free plan users */
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Plano Gratuito
              </h3>
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  Você está usando o plano gratuito. Para acessar recursos
                  avançados e gerenciar cobranças, faça upgrade para um plano
                  pago.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
