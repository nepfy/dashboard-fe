import TemplateSelection from "../template-selection";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { useEffect } from "react";

interface TemplateModel {
  id: string;
  title: string;
  description: string;
  colorsList: string[];
  preview: string;
}

const templates: TemplateModel[] = [
  {
    id: "flash",
    title: "Flash",
    description:
      "Design vibrante e energético, ideal para quem quer se destacar.",
    colorsList: [
      "#4F21A1",
      "#BE8406",
      "#9B3218",
      "#05722C",
      "#182E9B",
      "#212121",
    ],
    preview: "flash",
  },
  {
    id: "prime",
    title: "Prime",
    description: "Design sofisticado, perfeito para ambientes corporativos.",
    colorsList: [
      "#010101",
      "#E9E9E9",
      "#F0E5E0",
      "#223630",
      "#621D1E",
      "#08306C",
    ],
    preview: "prime",
  },
  {
    id: "minimal",
    title: "Minimal",
    description: "Design minimalista e elegante, focado no essencial.",
    colorsList: [
      "#000000",
      "#FFFFFF",
      "#F5F5F5",
      "#333333",
      "#666666",
      "#999999",
    ],
    preview: "minimal",
  },
  {
    id: "grid",
    title: "Grid",
    description:
      "Design limpo e funcional, com estrutura compacta e navegação direta ao ponto.",
    colorsList: [
      "#2C2C2C",
      "#146EF4",
      "#78838E",
      "#294D41",
      "#5E4D35",
      "#7C4257",
    ],
    preview: "grid",
  },
];

export function SelectTemplate({
  handleNextStep,
}: {
  handleNextStep: () => void;
}) {
  const { setTemplateType, templateType } = useProjectGenerator();

  useEffect(() => {
    if (!templateType) {
      setTemplateType("flash");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full w-full md:flex flex-col justify-center pb-6">
      <h2 className="text-neutral-light-600 text-[24px] text-center font-medium py-4 px-6 sm:px-0 lg:pt-10 pb-0">
        Escolha o modelo da sua proposta
      </h2>
      <TemplateSelection
        templates={templates}
        onNextStep={handleNextStep}
        hideBanner
      />
    </div>
  );
}
