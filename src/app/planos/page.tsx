import PlanAndFeatureCard from "#/components/PlanAndFeatureCard";

export default async function PlansPage() {
  const plansResponse = await fetch(
    `${process.env.NEXT_PUBLIC_NEPFY_API_URL}/stripe/get-plans`
  );
  const plansData = (await plansResponse.json()) || [];
  console.log(plansData);

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
          <PlanAndFeatureCard plans={plansData} />
        </div>
      </section>
    </div>
  );
}
