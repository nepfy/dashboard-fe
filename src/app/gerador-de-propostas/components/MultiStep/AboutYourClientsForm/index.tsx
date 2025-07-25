"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import InfoIcon from "#/components/icons/InfoIcon";
import { TextAreaField } from "#/components/Inputs";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Client } from "#/types/project";

import ClientsAccordion from "./ClientsAccordion";

export default function AboutYourClientsForm() {
  const {
    prevStep,
    nextStep,
    updateFormData,
    formData,
    currentStep,
    templateType,
  } = useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Check if template type is Essencial to show subtitle field
  const isEssencialTemplate = templateType?.toLowerCase() === "essencial";
  const shouldShowSubtitle = isEssencialTemplate;

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isHidden = e.target.checked;
    setErrors({});

    updateFormData("step6", {
      ...formData?.step6,
      hideClientsSection: isHidden,
    });
  };

  const handleClientsChange = (clients: Client[]) => {
    // Clear any client-related errors when clients change
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith("client_") || key === "clients") {
          delete newErrors[key];
        }
      });
      return newErrors;
    });

    updateFormData("step6", {
      ...formData?.step6,
      clients: clients,
    });
  };

  const handleFieldChange =
    (fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateFormData("step6", {
        ...formData?.step6,
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
    const hideClientsSection = formData?.step6?.hideClientsSection || false;
    const clientSubtitle = formData?.step6?.clientSubtitle || "";
    const clients = formData?.step6?.clients || [];
    const newErrors: { [key: string]: string } = {};

    if (!hideClientsSection) {
      // Only validate subtitle if it should be visible (Essencial template)
      if (shouldShowSubtitle) {
        if (!clientSubtitle.trim()) {
          newErrors.clientSubtitle = "O subtítulo é obrigatório";
        }
      }

      if (clients.length === 0) {
        newErrors.clients = "Ao menos 1 cliente é requerido";
      } else {
        clients.forEach((client: Client, index: number) => {
          const clientPrefix = `client_${index}`;

          // Validate client name if not hidden
          if (!client.hideClientName && !client.name?.trim()) {
            newErrors[`${clientPrefix}_name`] = `Nome do cliente ${
              index + 1
            } é obrigatório`;
          }

          // Validate logo if not hidden
          if (!client.hideLogo && !client.logo?.trim()) {
            newErrors[`${clientPrefix}_logo`] = `Logo do cliente ${
              index + 1
            } é obrigatório`;
          }

          // If both logo and client name are hidden, show error
          if (client.hideLogo && client.hideClientName) {
            newErrors[`${clientPrefix}_visibility`] = `Cliente ${
              index + 1
            } deve ter pelo menos o logo ou o nome visível`;
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

  const isAccordionDisabled = formData?.step6?.hideClientsSection || false;

  // Helper function to check if there are any client validation errors
  const hasClientErrors = () => {
    return Object.keys(errors).some(
      (key) => key.startsWith("client_") || key === "clients"
    );
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-y-scroll relative">
      <div className="p-7 mb-13">
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
          title="Seus clientes:"
          description="Mostre quem já confiou no seu trabalho"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={formData?.step6?.hideClientsSection || false}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {isAccordionDisabled && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Seus clientes&quot;</span> está
              atualmente oculta da proposta.
            </p>
          </div>
        )}

        {/* Only show subtitle field if Essencial template */}
        {shouldShowSubtitle && (
          <div className="py-4">
            <label
              className={`text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center ${
                isAccordionDisabled ? "bg-white-neutral-light-300" : ""
              }`}
              style={{
                backgroundColor: isAccordionDisabled
                  ? undefined
                  : "rgba(107, 70, 245, 0.05)",
              }}
            >
              Subtítulo
            </label>
            <TextAreaField
              id="clientSubtitle"
              textareaName="clientSubtitle"
              placeholder="Descreva seus clientes"
              value={formData?.step6?.clientSubtitle || ""}
              onChange={handleFieldChange("clientSubtitle")}
              error={errors.clientSubtitle}
              autoExpand={true}
              showCharCount
              charCountMessage="Recomendado: 100 caracteres"
            />
          </div>
        )}

        <div className="py-6">
          <div>
            <ClientsAccordion
              clients={formData?.step6?.clients || []}
              onClientsChange={handleClientsChange}
              disabled={isAccordionDisabled}
              errors={errors}
            />
            {errors.clients && !isAccordionDisabled && (
              <div className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.clients}
              </div>
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
        {errors.clients || errors.clientSubtitle || hasClientErrors() ? (
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
