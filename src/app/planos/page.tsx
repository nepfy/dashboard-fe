"use client";

import PlanAndFeatureCard from "#/components/PlanAndFeatureCard";
import { useEffect, useState } from "react";

interface Plan {
  id: number;
  title: string;
  features: { name: string }[];
  credits: number;
  price: string;
  buttonTitle: string;
  isFreeTrial?: boolean;
  highlight?: boolean;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const plansResponse = await fetch(
          `${process.env.NEXT_PUBLIC_NEPFY_API_URL}/stripe/get-plans`
        );
        const plansData = (await plansResponse.json()) || [];
        setPlans(plansData);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <div>
      <section className="mt-22 sm:mt-0 px-4 text-center">
        <h1 className="text-4xl text-[var(--color-white-neutral-light-800)] mb-4 font-medium">
          Escolha seu plano
        </h1>
        <p className="text-lg text-[var(--color-white-neutral-light-600)] max-w-[400px] mx-auto font-normal">
          Selecione o plano que melhor atende às suas necessidades e aproveite o
          melhor da Nepfy.
        </p>
      </section>

      <section className="sm:max-w-[1248px] px-4 py-12 w-full mx-auto">
        <div className="flex flex-row justify-around items-center w-full">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando planos...</p>
            </div>
          ) : (
            <PlanAndFeatureCard plans={plans} />
          )}
        </div>
      </section>
    </div>
  );
}
