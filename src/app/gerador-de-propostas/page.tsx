"use client";

import { useRouter } from "next/navigation";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplateSelection from "./components/TemplateSelection";

import { TemplateType } from "#/types/project";

const templates = [
  {
    title: "Flash",
    description:
      "Design vibrante e energético, ideal para quem quer se destacar.",
    colorsList: [
      "#BE8406",
      "#9B3218",
      "#05722C",
      "#4F21A1",
      "#182E9B",
      "#212121",
    ],
  },
  {
    title: "Prime",
    description: "Design sofisticado, perfeito para ambientes corporativos.",
    colorsList: [
      "#E9E9E9",
      "#F0E5E0",
      "#223630",
      "#621D1E",
      "#08306C",
      "#010101",
    ],
  },
  {
    title: "Essencial",
    description: "Design minimalista e elegante, com simplicidade impactante.",
    colorsList: [
      "#F0CCE6",
      "#EBEBEB",
      "#EEE0BA",
      "#BCFBD5",
      "#741E20",
      "#0A3EF4",
    ],
  },
];

export default function ProjectGenerator() {
  const router = useRouter();

  const { updateFormData, setTemplateType } = useProjectGenerator();

  const handleTemplateSelect = (template: TemplateType, color: string) => {
    setTemplateType(template);
    updateFormData("step1", {
      mainColor: color,
    });

    const templateRoute = template.toLowerCase();
    router.push(`/gerador-de-propostas/${templateRoute}`);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      <h2 className="text-white-neutral-light-800 text-[21px] font-medium mb-4">
        Escolha o modelo da sua proposta
      </h2>
      <TemplateSelection
        templates={templates}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  );
}
