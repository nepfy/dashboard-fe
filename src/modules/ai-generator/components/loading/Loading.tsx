import { useState, useEffect } from "react";

import { Box } from "../box/Box";
import { SparkleIcon } from "#/modules/ai-generator/components/icons/SparkleIcon";
import carregando from "#/lotties/carregando.json";
import Lottie from "lottie-react";

const tips = [
  {
    title: "Revise os textos",
    description: "Ajuste detalhes para deixar a proposta com a sua cara.",
  },
  {
    title: "Personalize a URL",
    description: "Ajuste detalhes para deixar a proposta com a sua cara.",
  },
  {
    title: "Valor antes de preço",
    description: "Explique os benefícios antes de falar em preço.",
  },
  {
    title: "Destaque seus diferenciais",
    description: "Mostre o que te torna único e feche mais negócios.",
  },
];

export function Loading() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentTipIndex((prevIndex) =>
          prevIndex === tips.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 800);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentTip = tips[currentTipIndex];

  return (
    <Box
      title="Gerando sua proposta"
      description="Sua proposta está sendo preparada com as informações que você preencheu."
    >
      <Lottie animationData={carregando} className="w-full" />
      <p className="text-white-neutral-light-500 my-6 text-sm">
        Esse processo leva só alguns segundos. Enquanto isso, confira algumas
        dicas para aproveitar ao máximo sua proposta.
      </p>

      <div className="button-inner flex items-center gap-2 rounded-[12px] border border-[#5639C6] bg-[#DBD2FF1A]/90 p-4">
        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#DBD2FF] md:flex">
          <SparkleIcon />
        </div>
        <div className="w-[88%]">
          <div
            className="transition-opacity duration-1000 ease-in-out"
            style={{ opacity: isVisible ? 1 : 0 }}
          >
            <p className="text-white-neutral-light-900 font-medium">
              {currentTip.title}
            </p>
            <p className="text-white-neutral-light-500 text-xs">
              {currentTip.description}
            </p>
          </div>
        </div>
      </div>
    </Box>
  );
}
