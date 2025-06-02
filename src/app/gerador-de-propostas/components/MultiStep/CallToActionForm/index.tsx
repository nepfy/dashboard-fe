"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import PictureIcon from "#/components/icons/PictureIcon";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

export default function CallToActionForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("step8", {
      ...formData?.step8,
      hideSection: e.target.checked,
    });
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      // For demo purposes, we'll use a placeholder URL
      // In production, you'd upload the file and get a URL
      const imageUrl = URL.createObjectURL(file);
      updateFormData("step8", {
        ...formData?.step8,
        ctaBackgroundImage: imageUrl,
      });
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const ctaBackgroundImage = formData?.step8?.ctaBackgroundImage;
    const hideSection = formData?.step8?.hideSection || false;
    const newErrors: { [key: string]: string } = {};

    if (!hideSection) {
      if (!ctaBackgroundImage) {
        newErrors.ctaBackgroundImage = "Uma imagem de fundo é obrigatória";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    nextStep();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="p-7">
        <div className="mb-6">
          <StepProgressIndicator currentStep={currentStep} />
        </div>

        <button
          type="button"
          onClick={() => {}}
          className="xl:hidden mb-4 w-full p-3 border-1 border-white-neutral-light-300 rounded-[10px] bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
        >
          <Eye width="18" height="18" /> Pré-visualizar essa seção
        </button>

        <TitleDescription
          title="Chamada para ação:"
          description="Reforce o convite para seguir com o projeto"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step8?.hideSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white-neutral-light-700 mb-2">
              Plano de fundo do CTA
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-[200px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.[0] || null)
                  }
                  className="hidden"
                  id="cta-background-image"
                />
                <label
                  htmlFor="cta-background-image"
                  className="w-full sm:w-[200px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border bg-white-neutral-light-100 border-white-neutral-light-300 rounded-2xs cursor-pointer hover:bg-white-neutral-light-200 transition-colors button-inner"
                >
                  <PictureIcon width="16" height="16" /> Alterar imagem
                </label>
              </div>
              <div className="text-xs text-white-neutral-light-500">
                {formData?.step8?.ctaBackgroundImage
                  ? formData?.step8?.ctaBackgroundImage
                  : "Nenhuma imagem selecionada"}
              </div>
            </div>
            <div className="text-xs text-white-neutral-light-400 mt-3">
              Tipo de arquivo: .jpg ou .png. Tamanho recomendado: 1920×1080px e
              peso entre 150 KB e 300 KB
            </div>
            {errors.ctaBackgroundImage && (
              <p className="text-red-700 rounded-md text-sm font-medium mt-2">
                {errors.ctaBackgroundImage}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex gap-2 p-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center gap-1 w-[110px] h-[44px] px-4 py-2 text-sm font-medium border rounded-[12px] border-white-neutral-light-300 cursor-pointer button-inner text-white-neutral-light-900 hover:bg-white-neutral-light-300"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <button
          type="button"
          className="w-full sm:w-[100px] h-[44px] px-4 py-2 text-sm font-medium border rounded-[12px] bg-primary-light-500 button-inner-inverse border-white-neutral-light-300 cursor-pointer text-white-neutral-light-100"
          onClick={handleNext}
        >
          Avançar
        </button>
      </div>
    </div>
  );
}
