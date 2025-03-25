import PlanAndFeatureCard from "#/components/PlanAndFeatureCard";

const plans = [
  {
    id: 1,
    title: "Teste Gratuito",
    features: [
      "Calculadora de projetos",
      "Gestão de propostas",
      "Gestão de contratos",
      "Personalização e-mail",
    ],
    credits: 15,
    price: "R$ 0,00",
    buttonTitle: "Começar agora",
    isFreeTrial: true,
  },
  {
    id: 2,
    title: "Profissional",
    features: [
      "Incluso tudo do Teste Gratuito",
      "Propostas em Landing Pages",
      "Exportar documentos em PDF",
      "Personalização e-mail",
    ],
    credits: 15,
    price: "R$ 75,00",
    buttonTitle: "Assinar agora",
    highlight: true,
  },
  {
    id: 3,
    title: "Ilimitado",
    features: [
      "Incluso tudo do plano Profissional",
      "Propostas em Landing Pages",
      "Exportar documentos em PDF",
      "Personalização e-mail",
    ],
    credits: 25,
    price: "R$ 135,00",
    buttonTitle: "Assinar agora",
  },
];

export default function PlansPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
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
          <PlanAndFeatureCard plans={plans} />
        </div>
      </section>
    </main>
  );
}
