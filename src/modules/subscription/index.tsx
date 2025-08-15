import { useStripeCustom } from "#/hooks/use-stripe";
import { useEffect, useState } from "react";

type Plan = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features?: string[];
  credits?: string;
  buttonTitle?: string;
};

type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
};

export function Subscription() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { userPlan } = useStripeCustom();

  console.log({ userPlan });
  // Fetch plans from API
  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      try {
        const res = await fetch("/api/stripe/get-plans");
        const data = await res.json();
        setPlans(data || []);
      } catch (e) {
        console.log({ e });
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  // Fetch current subscription info (mocked for now)
  useEffect(() => {
    // TODO: Replace with real API call
    setCurrentPlanId("plan_basic");
    setBillingCycle("Mensal");
    setPaymentMethods([
      {
        id: "pm_1",
        brand: "visa",
        last4: "4242",
        exp_month: 12,
        exp_year: 2026,
      },
    ]);
  }, []);

  const handleSwitchPlan = (planId: string) => {
    // TODO: Implement plan switch logic
    setCurrentPlanId(planId);
    alert(`Plano alterado para ${planId}`);
  };

  const handleAddPaymentMethod = () => {
    // TODO: Implement add payment method logic
    alert("Adicionar método de pagamento");
  };

  const handleRemovePaymentMethod = (id: string) => {
    // TODO: Implement remove payment method logic
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Gerenciar Assinatura</h2>

      <section className="mb-8">
        <h3 className="text-lg font-medium mb-2">Seu plano atual</h3>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div className="border rounded p-4 mb-4">
            {plans
              .filter((p) => p.id === currentPlanId)
              .map((plan) => (
                <div key={plan.id}>
                  <div className="font-bold text-xl">{plan.title}</div>
                  <div className="text-gray-600">{plan.description}</div>
                  <div className="mt-2">
                    <span className="font-semibold">
                      {plan.price
                        ? (plan.price / 100).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: plan.currency.toUpperCase(),
                          })
                        : "Grátis"}
                    </span>{" "}
                    / {plan.interval}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Ciclo de cobrança: {billingCycle}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-medium mb-2">Trocar de plano</h3>
        <div className="grid gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between ${
                plan.id === currentPlanId
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <div>
                <div className="font-bold">{plan.title}</div>
                <div className="text-gray-600 text-sm">{plan.description}</div>
                <div className="mt-1 text-sm">
                  {plan.price
                    ? (plan.price / 100).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: plan.currency.toUpperCase(),
                      })
                    : "Grátis"}{" "}
                  / {plan.interval}
                </div>
              </div>
              <div className="mt-2 sm:mt-0">
                {plan.id === currentPlanId ? (
                  <span className="px-4 py-2 rounded bg-gray-200 text-gray-700 text-sm">
                    Plano atual
                  </span>
                ) : (
                  <button
                    className="px-4 py-2 rounded bg-purple-600 text-white text-sm hover:bg-purple-700"
                    onClick={() => handleSwitchPlan(plan.id)}
                  >
                    Trocar para este
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-medium mb-2">Métodos de pagamento</h3>
        <div className="mb-2">
          {paymentMethods.length === 0 && (
            <div className="text-gray-500 text-sm mb-2">
              Nenhum método de pagamento cadastrado.
            </div>
          )}
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className="flex items-center justify-between border rounded p-3 mb-2"
            >
              <div>
                <span className="font-medium capitalize">{pm.brand}</span>{" "}
                <span>•••• {pm.last4}</span>{" "}
                <span className="text-xs text-gray-500 ml-2">
                  {pm.exp_month}/{pm.exp_year}
                </span>
              </div>
              <button
                className="text-red-500 text-xs hover:underline"
                onClick={() => handleRemovePaymentMethod(pm.id)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
        <button
          className="px-4 py-2 rounded bg-purple-600 text-white text-sm hover:bg-purple-700"
          onClick={handleAddPaymentMethod}
        >
          Adicionar método de pagamento
        </button>
      </section>

      <section>
        <h3 className="text-lg font-medium mb-2">Histórico de cobrança</h3>
        <div className="text-gray-500 text-sm">
          {/* TODO: Implementar histórico real */}
          Nenhuma cobrança encontrada.
        </div>
      </section>
    </div>
  );
}
