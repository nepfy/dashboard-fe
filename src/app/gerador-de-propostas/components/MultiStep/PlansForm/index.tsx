"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import InfoIcon from "#/components/icons/InfoIcon";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Plan } from "#/types/project";

import PlansAccordion from "./PlansAccordion";

export default function PlansForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isHidden = e.target.checked;
    setErrors({});
    updateFormData("step12", {
      ...formData?.step12,
      hidePlansSection: isHidden,
    });
  };

  const handlePlansChange = (plans: Plan[]) => {
    updateFormData("step12", {
      ...formData?.step12,
      plans: plans,
    });
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const hidePlansSection = formData?.step12?.hidePlansSection || false;
    const plansList = formData?.step12?.plans || [];
    const newErrors: { [key: string]: string } = {};

    if (!hidePlansSection) {
      if (plansList.length === 0) {
        newErrors.plans = "Ao menos 1 plano é requerido";
      } else {
        // Validate individual plan items
        plansList.forEach((plan: Plan, index: number) => {
          // Validate plan title (Nome do Plano)
          if (!plan.title?.trim()) {
            newErrors[`plan_${index}_title`] = `Nome do plano ${
              index + 1
            } é obrigatório`;
          } else if (plan.title.length > 25) {
            newErrors[`plan_${index}_title`] = `Nome do plano ${
              index + 1
            } deve ter no máximo 25 caracteres`;
          }

          // Validate plan description (Descrição do pacote)
          if (!plan.description?.trim()) {
            newErrors[`plan_${index}_description`] = `Descrição do plano ${
              index + 1
            } é obrigatória`;
          } else {
            // Check character limits for description
            if (plan.description.length < 50) {
              newErrors[`plan_${index}_description`] = `Descrição do plano ${
                index + 1
              } deve ter pelo menos 50 caracteres`;
            } else if (plan.description.length > 130) {
              newErrors[`plan_${index}_description`] = `Descrição do plano ${
                index + 1
              } deve ter no máximo 130 caracteres`;
            }
          }

          // Validate price (Valor)
          if (
            !plan.price ||
            plan.price === 0 ||
            plan.price.toString().trim() === ""
          ) {
            newErrors[`plan_${index}_price`] = `Valor do plano ${
              index + 1
            } é obrigatório`;
          }

          // Validate CTA button (Botão do CTA)
          if (!plan.ctaButtonTitle?.trim()) {
            newErrors[
              `plan_${index}_ctaButtonTitle`
            ] = `Botão do CTA do plano ${index + 1} é obrigatório`;
          } else if (plan.ctaButtonTitle.length > 25) {
            newErrors[
              `plan_${index}_ctaButtonTitle`
            ] = `Botão do CTA do plano ${
              index + 1
            } deve ter no máximo 25 caracteres`;
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

  const isAccordionDisabled = formData?.step12?.hidePlansSection || false;

  return (
    <div className="h-full flex flex-col justify-between relative overflow-y-scroll">
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
          title="Planos e valores:"
          description="Ofereça opções para diferentes perfis de cliente"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step12?.hidePlansSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {isAccordionDisabled && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Planos e Valores&quot;</span>{" "}
              está atualmente oculta da proposta.
            </p>
          </div>
        )}

        <div className="py-6">
          <div className="pt-4">
            <PlansAccordion
              plansList={formData?.step12?.plans || []}
              onFormChange={handlePlansChange}
              disabled={isAccordionDisabled}
              errors={errors}
            />
            {errors.plans && !isAccordionDisabled && (
              <p className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.plans}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex items-center gap-2 p-6 fixed bottom-0 bg-white-neutral-light-200">
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
        {Object.keys(errors).length > 0 && !isAccordionDisabled ? (
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
