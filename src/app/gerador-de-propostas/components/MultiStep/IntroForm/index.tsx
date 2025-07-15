"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import { TextField, TextAreaField } from "#/components/Inputs";
import TagInput from "#/components/Inputs/TagInput";

import EyeOpened from "#/components/icons/EyeOpened";
import EyeClosed from "#/components/icons/EyeClosed";
import ImportDataModal from "../../ImportData";
import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Project } from "#/types/project";

export default function IntroStep() {
  const {
    updateFormData,
    nextStep,
    formData,
    setTemplateType,
    templateType,
    currentStep,
    resetForm,
    importProjectData,
    isEditMode,
  } = useProjectGenerator();

  const hidePageSubtitle = formData?.step1?.hidePageSubtitle || false;
  const hideServices = formData?.step1?.hideServices || false;

  const isGridTemplate = templateType?.toLowerCase() === "grid";

  const [showImportModal, setShowImportModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isComingFromOtherStep, setIsComingFromOtherStep] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [fieldVisibility, setFieldVisibility] = useState({
    pageSubtitle: !hidePageSubtitle && !isGridTemplate,
    services: !hideServices && !isGridTemplate,
  });

  useEffect(() => {
    if (currentStep === 1 && !isInitialMount) {
      if (formData?.step1?.companyName || formData?.step1?.pageTitle) {
        setIsComingFromOtherStep(true);
      } else {
        setIsComingFromOtherStep(false);
      }
    }
  }, [
    currentStep,
    isInitialMount,
    formData?.step1?.companyName,
    formData?.step1?.pageTitle,
  ]);

  // Handle modal visibility
  useEffect(() => {
    // Show modal when:
    // 1. Not dismissed AND
    // 2. (Edit mode OR (new project AND not coming from other step))
    const shouldShowModal =
      !modalDismissed &&
      (isEditMode || (!isEditMode && !isComingFromOtherStep));

    setShowImportModal(shouldShowModal);

    // After first render, mark as no longer initial mount
    if (isInitialMount) {
      setIsInitialMount(false);
    }
  }, [modalDismissed, isEditMode, isComingFromOtherStep, isInitialMount]);

  // Update field visibility when template type changes
  useEffect(() => {
    if (isGridTemplate) {
      setFieldVisibility({
        pageSubtitle: false,
        services: false,
      });
    } else {
      setFieldVisibility({
        pageSubtitle: !hidePageSubtitle,
        services: !hideServices,
      });
    }
  }, [isGridTemplate, hidePageSubtitle, hideServices]);

  const handleImportProject = (projectData: Project) => {
    updateFormData("step1", {
      ...formData?.step1,
      clientName: projectData.clientName,
      projectName: projectData.projectName,
    });

    importProjectData(projectData);

    setShowImportModal(false);
    setModalDismissed(true);
  };

  const handleCreateNew = () => {
    setShowImportModal(false);
    setModalDismissed(true);
  };

  const handleCloseModal = () => {
    setShowImportModal(false);
    setModalDismissed(true);
  };

  const toggleFieldVisibility = (fieldName: keyof typeof fieldVisibility) => {
    // Don't allow toggling if it's Grid template
    if (isGridTemplate) {
      return;
    }

    const newVisibility = !fieldVisibility[fieldName];

    setFieldVisibility((prev) => ({
      ...prev,
      [fieldName]: newVisibility,
    }));

    if (fieldName === "pageSubtitle") {
      updateFormData("step1", {
        ...formData?.step1,
        hidePageSubtitle: !newVisibility,
      });
    } else if (fieldName === "services") {
      updateFormData("step1", {
        ...formData?.step1,
        hideServices: !newVisibility,
      });
    }

    if (!newVisibility) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (fieldName === "pageSubtitle") {
          delete newErrors.pageSubtitle;
        } else if (fieldName === "services") {
          delete newErrors.services;
        }
        return newErrors;
      });
    }
  };

  const handleBack = () => {
    setTemplateType(null);
    resetForm();
    // Reset ALL navigation flags when going back to template selection
    setModalDismissed(false);
    setIsInitialMount(true);
    setIsComingFromOtherStep(false);
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

    if (!companyName.trim()) {
      newErrors.companyName = "O nome da empresa é obrigatório";
    }

    if (!companyEmail.trim()) {
      newErrors.companyEmail = "O email é obrigatório";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(companyEmail)) {
        newErrors.companyEmail = "Por favor, insira um email válido";
      }
    }

    if (companyName.length > 25) {
      newErrors.companyName =
        "O nome da empresa não pode ter mais do que 25 caracteres";
    }

    if (ctaButtonTitle.length > 25) {
      newErrors.ctaButtonTitle =
        "O texto do botão não pode ter mais do que 25 caracteres";
    }

    if (!ctaButtonTitle.trim()) {
      newErrors.ctaButtonTitle = "O texto do botão é obrigatório";
    }

    if (!pageTitle.trim()) {
      newErrors.pageTitle = "O título da página é obrigatório";
    }

    if (pageTitle.length < 30 || pageTitle.length > 50) {
      newErrors.pageTitle =
        "O título deve ter no mínimo 30 e no máximo 50 caracteres";
    }

    if (fieldVisibility.pageSubtitle && !isGridTemplate) {
      if (!pageSubtitle.trim()) {
        newErrors.pageSubtitle = "O subtítulo da página é obrigatório";
      }

      if (pageSubtitle.length < 70 || pageSubtitle.length > 115) {
        newErrors.pageSubtitle =
          "O subtítulo deve ter no mínimo 70 e no máximo 115 caracteres";
      }
    }

    if (fieldVisibility.services && !isGridTemplate) {
      if (services.length === 0) {
        newErrors.services = "Pelo menos um serviço deve ser adicionado";
      }
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

  const handleTextAreaChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      services,
    });

    if (errors.services) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.services;
        return newErrors;
      });
    }
  };

  if (!showImportModal && templateType) {
    return (
      <div className="h-full flex flex-col justify-between overflow-y-scroll relative">
        <div className="p-7 mb-12">
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
              <label
                className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Nome para exibição na proposta
              </label>
              <TextField
                id="companyName"
                inputName="companyName"
                type="text"
                placeholder="Digite o seu nome ou o nome da empresa"
                value={formData?.step1?.companyName || ""}
                onChange={handleFieldChange("companyName")}
                error={errors.companyName}
                maxLength={25}
                showCharCount
                allowOverText
              />
            </div>

            <div className="pb-6">
              <label
                className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Email
              </label>
              <TextField
                id="companyEmail"
                inputName="companyEmail"
                type="text"
                placeholder="Digite o seu email"
                value={formData?.step1?.companyEmail || ""}
                onChange={handleFieldChange("companyEmail")}
                error={errors.companyEmail}
              />
            </div>

            <div className="pb-6">
              <label
                className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Botão CTA
              </label>
              <TextField
                id="ctaButtonTitle"
                inputName="ctaButtonTitle"
                type="text"
                placeholder="Iniciar projeto"
                value={formData?.step1?.ctaButtonTitle || ""}
                onChange={handleFieldChange("ctaButtonTitle")}
                error={errors.ctaButtonTitle}
                maxLength={25}
                showCharCount
                allowOverText
              />
            </div>

            <div className="pb-6">
              <label
                className="text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Título principal
              </label>
              <TextField
                id="pageTitle"
                inputName="pageTitle"
                type="text"
                placeholder="Digite o título principal da sua proposta"
                value={formData?.step1?.pageTitle || ""}
                onChange={handleFieldChange("pageTitle")}
                error={errors.pageTitle}
                maxLength={50}
                minLength={30}
                showCharCount
                allowOverText
              />
            </div>

            {/* Only show Services field if not Grid template */}
            {!isGridTemplate && (
              <div className="pb-6">
                <label
                  className={`text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center ${
                    !fieldVisibility.services
                      ? "bg-white-neutral-light-300"
                      : ""
                  }`}
                  style={{
                    backgroundColor: !fieldVisibility.services
                      ? undefined
                      : "rgba(107, 70, 245, 0.05)",
                  }}
                >
                  Serviços
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFieldVisibility("services");
                    }}
                    className="cursor-pointer"
                  >
                    {fieldVisibility.services ? <EyeOpened /> : <EyeClosed />}
                  </button>
                </label>
                {fieldVisibility.services && (
                  <TagInput
                    placeholder="Digite um serviço e pressione Enter"
                    value={formData?.step1?.services || []}
                    onChange={handleServicesChange}
                    error={errors.services}
                    infoText="Separe o serviço por ponto e vírgula (;) ou pressione Enter após digitar cada serviço."
                    disabled={hideServices}
                  />
                )}
              </div>
            )}

            {/* Only show Subtitle field if not Grid template */}
            {!isGridTemplate && (
              <div className="pb-6">
                <label
                  className={`text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center ${
                    !fieldVisibility.pageSubtitle
                      ? "bg-white-neutral-light-300"
                      : ""
                  }`}
                  style={{
                    backgroundColor: !fieldVisibility.pageSubtitle
                      ? undefined
                      : "rgba(107, 70, 245, 0.05)",
                  }}
                >
                  Subtítulo
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFieldVisibility("pageSubtitle");
                    }}
                    className="cursor-pointer"
                  >
                    {fieldVisibility.pageSubtitle ? (
                      <EyeOpened />
                    ) : (
                      <EyeClosed />
                    )}
                  </button>
                </label>
                {fieldVisibility.pageSubtitle && (
                  <TextAreaField
                    id="pageSubtitle"
                    placeholder="Digite uma descrição complementar"
                    value={formData?.step1?.pageSubtitle || ""}
                    onChange={handleTextAreaChange("pageSubtitle")}
                    error={errors.pageSubtitle}
                    disabled={hidePageSubtitle}
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
          </div>
        </div>

        <div className="border-t border-t-white-neutral-light-300 w-full h-[90px] xl:h-[100px] flex gap-2 p-6 fixed bottom-0 bg-white-neutral-light-200">
          {!isEditMode && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-1 w-[110px] h-[44px] px-4 py-2 text-sm font-medium border rounded-[12px] border-white-neutral-light-300 cursor-pointer button-inner text-white-neutral-light-900 hover:bg-white-neutral-light-300"
            >
              <ArrowLeft size={16} /> Voltar
            </button>
          )}

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

  return showImportModal ? (
    <ImportDataModal
      onImportProject={handleImportProject}
      onCreateNew={handleCreateNew}
      onClose={handleCloseModal}
      isEditMode={isEditMode}
    />
  ) : null;
}
