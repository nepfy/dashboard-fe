"use client";

import { useState } from "react";
import Marquee from "react-fast-marquee";
import PlusIcon from "#/components/icons/PlusIcon";

interface FlashStepsProps {
  hideSection: boolean;
  topics: Array<{
    id: string;
    stepsId: string;
    stepName: string;
    stepDescription: string;
    hideStepName: boolean;
    hideStepDescription: boolean;
    sortOrder: number;
  }>;
  marquee: Array<{
    id: string;
    stepsId: string;
    stepName: string;
    hideStepName: boolean;
    sortOrder: number;
  }>;
}

const stepsField = [
  {
    id: "1",
    stepsId: "1",
    hideStepName: false,
    hideStepDescription: false,
    sortOrder: 1,
    stepName: "Briefing Detalhado",
    stepDescription:
      "Coletamos informações essenciais para alinhar objetivos, evitando retrabalhos, otimizando recursos e garantindo maior retorno sobre o investimento.",
  },
  {
    id: "2",
    stepsId: "1",
    hideStepName: false,
    hideStepDescription: false,
    sortOrder: 2,
    stepName: "Pesquisa e análise",
    stepDescription:
      "Realizamos uma análise profunda do mercado, competidores e necessidades do seu negócio para criar uma estratégia personalizada e inovadora.",
  },
  {
    id: "3",
    stepsId: "1",
    hideStepName: false,
    hideStepDescription: false,
    sortOrder: 3,
    stepName: "Conceito criativo",
    stepDescription:
      "Desenvolvemos um design personalizado que reflete a identidade da sua marca, garantindo uma experiência visual única e memorável.",
  },
  {
    id: "4",
    stepsId: "1",
    hideStepName: false,
    hideStepDescription: false,
    sortOrder: 4,
    stepName: "Desenvolvimento visual",
    stepDescription:
      "Implementamos o design criativo em todas as plataformas, garantindo uma experiência visual consistente e de alta qualidade.",
  },
  {
    id: "5",
    stepsId: "1",
    hideStepName: false,
    hideStepDescription: false,
    sortOrder: 5,
    stepName: "Entrega e suporte",
    stepDescription:
      "Entregamos o projeto final, fornecendo suporte técnico e atualizações regulares para garantir que o seu negócio continue a prosperar.",
  },
];

const marqueeField = [
  {
    id: "1",
    stepsId: "1",
    stepName: "Briefing Detalhado.",
    hideStepName: false,
  },
  {
    id: "2",
    stepsId: "1",
    stepName: "Pesquisa e análise.",
    hideStepName: false,
  },
  {
    id: "3",
    stepsId: "1",
    stepName: "Conceito criativo.",
    hideStepName: false,
  },
];

export default function FlashSteps({
  hideSection,
  topics,
  marquee,
}: FlashStepsProps) {
  const [openSteps, setOpenSteps] = useState<Set<string>>(new Set());

  console.log(marquee);

  const toggleStep = (stepId: string) => {
    setOpenSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-[#4F21A1]">
      {!hideSection && (
        <>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-41 pt-10 lg:pt-22 pb-23 xl:pb-36 relative z-10">
            <div className="flex items-end pt-14 lg:pt-30 pl-4 lg:pl-20 border-l border-l-[#A0A0A0] max-w-[340px] lg:max-w-[670px] mb-16 lg:mb-43 mx-auto">
              <p className="text-[32px] lg:text-[72px] text-[#E6E6E6] gap-2">
                Como funciona em{" "}
                <span className="w-[43px] lg:w-[75px] h-[27px] lg:h-[52px] bg-black rounded-full inline-flex items-center justify-center text-[14px] lg:text-2xl align-middle">
                  {topics?.length || 5}
                </span>{" "}
                passos simples
              </p>
            </div>

            {stepsField?.map((topic, index) => {
              const isOpen = openSteps.has(topic.id);
              const shouldShowDescription =
                isOpen && !topic.hideStepDescription;

              return (
                <div
                  key={topic.id}
                  className="pt-12 cursor-pointer"
                  onClick={() => toggleStep(topic.id)}
                >
                  <div className="flex items-baseline justify-between border-b border-[#A0A0A0]/30 last:border-b-0 w-full pb-6">
                    <span className="flex items-baseline justify-between md:justify-start gap-0 md:gap-24 w-full md:w-auto">
                      <p className="text-[15px] text-[#C085FD]">
                        0{index + 1}.
                      </p>
                      {!topic.hideStepName && (
                        <p
                          className={`text-[24px] lg:text-[36px] transition-colors duration-300 ${
                            isOpen ? "text-[#E6E6E6]" : "text-[#E6E6E6]/30"
                          }`}
                        >
                          {topic.stepName}
                        </p>
                      )}
                    </span>

                    <button
                      className={`hidden md:block text-[14px] uppercase transition-colors duration-300 ${
                        isOpen ? "text-[#E6E6E6]" : "text-[#E6E6E6]/30"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        Mais Info
                        <span
                          className={`transition-opacity duration-300 ${
                            isOpen ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {isOpen && (
                            <PlusIcon
                              width="12"
                              height="12"
                              fill="rgba(230, 230, 230, 1)"
                            />
                          )}
                        </span>
                      </span>
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      shouldShowDescription
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-[16px] text-[#E6E6E6] pl-15 md:pl-30 pt-6 pb-0 md:pb-10">
                      {topic.stepDescription}
                    </p>
                  </div>

                  <button
                    className={`flex justify-end md:hidden text-[14px] uppercase my-10 w-full transition-colors duration-300 ${
                      isOpen ? "text-[#E6E6E6]" : "text-[#E6E6E6]/30"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      Mais Info
                      <span
                        className={`transition-opacity duration-300 ${
                          isOpen ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {isOpen && (
                          <PlusIcon
                            width="12"
                            height="12"
                            fill="rgba(230, 230, 230, 1)"
                          />
                        )}
                      </span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <Marquee speed={100} gradientWidth={0} autoFill>
              {marqueeField?.map((item) => (
                <div key={item.id} className="mr-8">
                  {!item.hideStepName && (
                    <p className="text-[#E6E6E6] text-[171px]">
                      {item.stepName}
                    </p>
                  )}
                </div>
              ))}
            </Marquee>
          </div>
        </>
      )}
    </div>
  );
}
