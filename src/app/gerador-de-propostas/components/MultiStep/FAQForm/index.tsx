"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import { TextAreaField } from "#/components/Inputs";
import InfoIcon from "#/components/icons/InfoIcon";
import EyeOpened from "#/components/icons/EyeOpened";
import EyeClosed from "#/components/icons/EyeClosed";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { FAQ } from "#/types/project";

import FAQAccordion from "./FAQAccordion";

export default function FAQForm() {
  const {
    prevStep,
    nextStep,
    updateFormData,
    formData,
    currentStep,
    templateType,
  } = useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Check if template type is Prime or Essencial to show faqSubtitle
  const isPrimeOrEssencial =
    templateType?.toLowerCase() === "prime" ||
    templateType?.toLowerCase() === "essencial";

  // Get current field visibility state
  const hideFaqSubtitle = formData?.step14?.hideFaqSubtitle || false;
  const [fieldVisibility, setFieldVisibility] = useState({
    faqSubtitle: !hideFaqSubtitle && isPrimeOrEssencial,
  });

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isHidden = e.target.checked;
    setErrors({});
    updateFormData("step14", {
      ...formData?.step14,
      hideFaqSection: isHidden,
    });
  };

  const handleFAQChange = (faq: FAQ[]) => {
    updateFormData("step14", {
      ...formData?.step14,
      faq: faq,
    });
  };

  const toggleFieldVisibility = (fieldName: keyof typeof fieldVisibility) => {
    const newVisibility = !fieldVisibility[fieldName];

    setFieldVisibility((prev) => ({
      ...prev,
      [fieldName]: newVisibility,
    }));

    if (fieldName === "faqSubtitle") {
      updateFormData("step14", {
        ...formData?.step14,
        hideFaqSubtitle: !newVisibility,
      });
    }

    if (!newVisibility) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (fieldName === "faqSubtitle") {
          delete newErrors.faqSubtitle;
        }
        return newErrors;
      });
    }
  };

  const handleTextAreaChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateFormData("step14", {
        ...formData?.step14,
        [fieldName]: e.target.value,
      });

      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const hideFaqSection = formData?.step14?.hideFaqSection || false;
    const faqList = formData?.step14?.faq || [];
    const faqSubtitle = formData?.step14?.faqSubtitle || "";
    const newErrors: { [key: string]: string } = {};

    if (!hideFaqSection) {
      if (faqList.length === 0) {
        newErrors.faq = "Ao menos 1 item é requerido";
      }

      // Only validate faqSubtitle if it's visible (Prime or Essencial template)
      if (fieldVisibility.faqSubtitle && isPrimeOrEssencial) {
        if (!faqSubtitle.trim()) {
          newErrors.faqSubtitle = "O subtítulo é obrigatório";
        }

        if (faqSubtitle.length < 70) {
          newErrors.faqSubtitle =
            "O subtítulo deve ter no mínimo 70 caracteres";
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    nextStep();
  };

  const isAccordionDisabled = formData?.step14?.hideFaqSection || false;

  return (
    <div className="h-full flex flex-col justify-between overflow-y-scroll relative">
      <div className="p-7 mb-20">
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
          title="Perguntas frequentes:"
          description="Esclareça dúvidas antes que elas surjam"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step14?.hideFaqSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {isAccordionDisabled && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">
                &quot;Perguntas Frequentes&quot;
              </span>{" "}
              está atualmente oculta da proposta.
            </p>
          </div>
        )}

        <div className="py-6">
          {/* Only show Subtitle field if Prime or Essencial template */}
          {isPrimeOrEssencial && !isAccordionDisabled && (
            <div className="pb-6">
              <label
                className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Subtítulo
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFieldVisibility("faqSubtitle");
                  }}
                  className="cursor-pointer"
                >
                  {fieldVisibility.faqSubtitle ? <EyeOpened /> : <EyeClosed />}
                </button>
              </label>
              {fieldVisibility.faqSubtitle && (
                <TextAreaField
                  id="faqSubtitle"
                  placeholder="Digite uma descrição complementar para a seção de perguntas frequentes"
                  value={formData?.step14?.faqSubtitle || ""}
                  onChange={handleTextAreaChange("faqSubtitle")}
                  error={errors.faqSubtitle}
                  disabled={hideFaqSubtitle}
                  maxLength={115}
                  minLength={70}
                  showCharCount
                  autoExpand={true}
                  minHeight={60}
                  maxHeight={200}
                  allowOverText
                />
              )}
            </div>
          )}

          <div className="pt-4">
            <FAQAccordion
              faqList={formData?.step14?.faq || []}
              onFormChange={handleFAQChange}
              disabled={isAccordionDisabled}
            />
            {errors.faq && (
              <p className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.faq}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex items-center gap-2 p-6 bg-white-neutral-light-200 fixed bottom-0">
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
        {errors.faq || errors.faqSubtitle ? (
          <div className="bg-red-light-10 border border-red-light-50 rounded-2xs py-4 px-6 hidden xl:flex items-center justify-center gap-2 ">
            <InfoIcon fill="#D00003" />
            <p className="text-white-neutral-light-800 text-sm">
              Preencha todos os campos
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
