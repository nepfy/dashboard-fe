"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import { TextField } from "#/components/Inputs";
import TagInput from "#/components/Inputs/TagInput"; // Import the new component

import ImportDataModal from "../../ImportData";
import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Project } from "#/types/project";

export default function IntroStep() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const {
    updateFormData,
    nextStep,
    formData,
    setTemplateType,
    templateType,
    currentStep,
    resetForm,
  } = useProjectGenerator();

  useEffect(() => {
    const hasFormData =
      formData?.step1 &&
      (formData.step1.companyName ||
        formData.step1.companyEmail ||
        formData.step1.ctaButtonTitle ||
        formData.step1.pageTitle ||
        formData.step1.pageSubtitle ||
        (formData.step1.services && formData.step1.services.length > 0));

    if (templateType && currentStep === 1 && !hasFormData) {
      setShowImportModal(true);
    } else {
      setShowImportModal(false);
    }
  }, [templateType, currentStep, formData?.step1]);

  const handleImportProject = (projectData: Project) => {
    updateFormData("step1", {
      companyName: projectData.companyName,
      companyEmail: projectData.companyEmail,
      ctaButtonTitle: projectData.ctaButtonTitle,
      pageTitle: projectData.pageTitle,
      pageSubtitle: projectData.pageSubtitle,
      mainColor: projectData.mainColor,
    });

    setShowImportModal(false);
  };

  const handleCreateNew = () => {
    setShowImportModal(false);
  };

  const handleCloseModal = () => {
    setShowImportModal(false);
  };

  const handleBack = () => {
    setTemplateType(null);
    resetForm();
  };

  const handleNext = () => {
    setErrors({});

    const companyName = formData?.step1?.companyName || "";
    const companyEmail = formData?.step1?.companyEmail || "";
    const ctaButtonTitle = formData?.step1?.ctaButtonTitle || "";
    const pageTitle = formData?.step1?.pageTitle || "";
    const pageSubtitle = formData?.step1?.pageSubtitle || "";
    const services = formData?.step1?.services || [];

    const newErrors: { [key: string]: string } = {};

    // Validate required fields
    if (!companyName.trim()) {
      newErrors.companyName = "O nome da empresa é obrigatório";
    }

    if (!companyEmail.trim()) {
      newErrors.companyEmail = "O email é obrigatório";
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(companyEmail)) {
        newErrors.companyEmail = "Digite um email válido";
      }
    }

    if (!ctaButtonTitle.trim()) {
      newErrors.ctaButtonTitle = "O texto do botão CTA é obrigatório";
    }

    if (!pageTitle.trim()) {
      newErrors.pageTitle = "O título principal é obrigatório";
    } else if (pageTitle.length < 30) {
      newErrors.pageTitle =
        "O título principal deve ter pelo menos 30 caracteres";
    } else if (pageTitle.length > 50) {
      newErrors.pageTitle =
        "O título principal deve ter no máximo 50 caracteres";
    }

    if (!pageSubtitle.trim()) {
      newErrors.pageSubtitle = "O subtítulo é obrigatório";
    } else if (pageSubtitle.length < 70) {
      newErrors.pageSubtitle = "O subtítulo deve ter pelo menos 70 caracteres";
    } else if (pageSubtitle.length > 115) {
      newErrors.pageSubtitle = "O subtítulo deve ter no máximo 115 caracteres";
    }

    if (services.length === 0) {
      newErrors.services = "Adicione pelo menos um serviço";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    nextStep();
  };

  const handleFieldChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFormData("step1", {
        ...formData?.step1,
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

  const handleServicesChange = (services: string[]) => {
    updateFormData("step1", {
      ...formData?.step1,
      services: services,
    });

    if (errors.services && services.length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.services;
        return newErrors;
      });
    }
  };

  if (!showImportModal && templateType) {
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
            title="Introdução:"
            description="Comece com uma apresentação impactante"
          />

          <div className="py-6">
            <div className="pb-6">
              <p
                className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Nome para exibição na proposta
              </p>
              <TextField
                id="companyName"
                inputName="companyName"
                type="text"
                placeholder="Digite o seu nome ou o nome da empresa"
                value={formData?.step1?.companyName || ""}
                onChange={handleFieldChange("companyName")}
                error={errors.companyName}
              />
            </div>

            <div className="pb-6">
              <p
                className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Email
              </p>
              <TextField
                id="companyEmail"
                inputName="companyEmail"
                type="email"
                placeholder="Digite seu email"
                value={formData?.step1?.companyEmail || ""}
                onChange={handleFieldChange("companyEmail")}
                error={errors.companyEmail}
              />
            </div>

            <div className="pb-6">
              <p
                className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Botão CTA
              </p>
              <TextField
                id="ctaButtonTitle"
                inputName="ctaButtonTitle"
                type="text"
                placeholder="Iniciar projeto"
                value={formData?.step1?.ctaButtonTitle || ""}
                onChange={handleFieldChange("ctaButtonTitle")}
                error={errors.ctaButtonTitle}
              />
            </div>

            <div className="pb-6">
              <p
                className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Título principal
              </p>
              <TextField
                id="pageTitle"
                inputName="pageTitle"
                type="text"
                placeholder="Escreva seu título principal"
                value={formData?.step1?.pageTitle || ""}
                onChange={handleFieldChange("pageTitle")}
                maxLength={50}
                minLength={30}
                showCharCount
                error={errors.pageTitle}
              />
            </div>

            <div className="pb-6">
              <p
                className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Serviços
              </p>
              <TagInput
                placeholder="Digite um serviço e pressione ; ou Tab"
                value={formData?.step1?.services || []}
                onChange={handleServicesChange}
                infoText="Separe os serviços por ponto e vírgula (;) ou Tab. Use as setas para navegar e Delete para remover."
                error={errors.services}
              />
            </div>

            <div className="pb-6">
              <p
                className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Subtítulo
              </p>
              <TextField
                id="pageSubtitle"
                inputName="pageSubtitle"
                type="text"
                placeholder="Escreva seu subtítulo"
                value={formData?.step1?.pageSubtitle || ""}
                onChange={handleFieldChange("pageSubtitle")}
                maxLength={115}
                minLength={70}
                showCharCount
                error={errors.pageSubtitle}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-t-white-neutral-light-300 w-full h-[90px] xl:h-[100px] flex gap-2 p-6">
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

  return (
    <ImportDataModal
      onImportProject={handleImportProject}
      onCreateNew={handleCreateNew}
      onClose={handleCloseModal}
    />
  );
}
