"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import InfoIcon from "#/components/icons/InfoIcon";
import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import TestimonialsAccordion from "./TestimonialsAccordion"; // Import the accordion
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Testimonial } from "#/types/project";

export default function TestimonialsForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isHidden = e.target.checked;
    setErrors({});

    updateFormData("step9", {
      ...formData?.step9,
      hideTestimonialsSection: isHidden,
      // Keep the testimonials data - DO NOT remove them when hiding
      testimonials: formData?.step9?.testimonials || [],
    });
  };

  const handleTestimonialsChange = (testimonials: Testimonial[]) => {
    updateFormData("step9", {
      ...formData?.step9,
      testimonials: testimonials,
    });
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const testimonials = formData?.step9?.testimonials;
    const hideTestimonialsSection =
      formData?.step9?.hideTestimonialsSection || false;
    const newErrors: { [key: string]: string } = {};

    if (!hideTestimonialsSection) {
      if (!testimonials || testimonials.length === 0) {
        newErrors.testimonials = "Ao menos 1 depoimento é requerido";
      } else {
        // Validate individual testimonial items
        testimonials.forEach((testimonial: Testimonial, index: number) => {
          if (!testimonial.testimonial?.trim()) {
            newErrors[`testimonial_${index}_testimonial`] = `Depoimento ${
              index + 1
            } é obrigatório`;
          }
          if (!testimonial.name?.trim()) {
            newErrors[`testimonial_${index}_name`] = `Nome do depoimento ${
              index + 1
            } é obrigatório`;
          }
        });
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    nextStep();
  };

  const isAccordionDisabled = formData?.step9?.hideTestimonialsSection || false;

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
          title="Depoimentos:"
          description="Mostre o que dizem sobre você"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step9?.hideTestimonialsSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {isAccordionDisabled && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção <span className="font-bold">&quot;Depoimentos&quot;</span>{" "}
              está atualmente oculta da proposta.
            </p>
          </div>
        )}

        <div className="py-6">
          <TestimonialsAccordion
            testimonials={formData?.step9?.testimonials || []}
            onChange={handleTestimonialsChange}
            disabled={isAccordionDisabled}
          />
          {errors.testimonials && !isAccordionDisabled && (
            <p className="text-red-700 rounded-md text-sm font-medium mt-3">
              {errors.testimonials}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex items-center gap-2 p-6">
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
        {errors.testimonials ? (
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
