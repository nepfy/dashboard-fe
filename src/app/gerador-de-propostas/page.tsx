"use client";

import { useProjectGenerator } from "#/hooks/useProjectGenerator/useProjectGenerator";
import TemplateSelection from "./components/TemplateSelection";
import IntroStep from "./components/IntroStep";
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
  const {
    formData,
    currentStep,
    templateType,
    updateFormData,
    setTemplateType,
  } = useProjectGenerator();

  const handleTemplateSelect = (template: TemplateType, color: string) => {
    setTemplateType(template);
    updateFormData("step1", {
      mainColor: color,
    });
  };

  // Template selection step
  if (currentStep === 0) {
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

  // Form steps (you'll add these components later)
  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <p className="text-white-neutral-light-600 text-sm">
          Step {currentStep} of 16 • Template: {templateType}
        </p>
        <div className="w-full bg-white-neutral-light-300 rounded-full h-2 mt-2">
          <div
            className="bg-primary-light-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 16) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1">
        {/* Here you'll add your step components based on currentStep */}
        <div className="bg-white-neutral-light-100 p-8 rounded-lg">
          <h3 className="text-xl font-medium mb-4">
            Step {currentStep} Content
          </h3>
          <p>Form data: {JSON.stringify(formData, null, 2)}</p>
        </div>
        <IntroStep />
      </div>
    </div>
  );
}
