"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

import { TextField, TextAreaField } from "#/components/Inputs";
import TagInput from "#/components/Inputs/TagInput";
import PictureIcon from "#/components/icons/PictureIcon";
import PreviewModal from "#/app/gerador-de-propostas/components/PreviewModal";

import EyeOpened from "#/components/icons/EyeOpened";
import EyeClosed from "#/components/icons/EyeClosed";
import ImportDataModal from "../../ImportData";
import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Project } from "#/types/project";
import { useImageUpload } from "#/hooks/useImageUpload";

// Template field configurations
const TEMPLATE_FIELDS = {
  flash: [
    "companyName",
    "companyEmail",
    "ctaButtonTitle",
    "pageTitle",
    "services",
    "pageSubtitle",
  ],
  prime: ["companyName", "companyEmail", "pageTitle", "pageSubtitle"],
  essencial: [
    "companyName",
    "ctaButtonTitle",
    "clientName",
    "clientPhoto",
    "pageTitle",
  ],
  grid: [
    "companyName",
    "ctaButtonTitle",
    "services",
    "clientName",
    "clientPhoto",
    "pageTitle",
  ],
};

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
    showImportModal,
    setShowImportModal,
    modalDismissed,
    setModalDismissed,
    hasNavigatedBeyondStep1,
    setHasNavigatedBeyondStep1,
  } = useProjectGenerator();

  const currentTemplate =
    templateType?.toLowerCase() as keyof typeof TEMPLATE_FIELDS;
  const visibleFields =
    TEMPLATE_FIELDS[currentTemplate] || TEMPLATE_FIELDS.flash;

  const hidePageSubtitle = formData?.step1?.hidePageSubtitle || false;
  const hideServices = formData?.step1?.hideServices || false;
  const hideClientName = formData?.step1?.hideClientName || false;
  const hideClientPhoto = formData?.step1?.hideClientPhoto || false;

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    uploadImage,
    isUploading: isUploadingClientPhoto,
    uploadError,
    clearError,
  } = useImageUpload();

  useEffect(() => {
    if (currentStep > 1) {
      setHasNavigatedBeyondStep1(true);
    }
  }, [currentStep, setHasNavigatedBeyondStep1]);

  useEffect(() => {
    if (!modalDismissed && (isEditMode || !hasNavigatedBeyondStep1)) {
      setShowImportModal(true);
    } else {
      setShowImportModal(false);
    }
  }, [modalDismissed, isEditMode, hasNavigatedBeyondStep1, setShowImportModal]);

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

  const toggleFieldVisibility = (fieldName: string) => {
    const currentData = formData?.step1 || {};

    if (fieldName === "pageSubtitle") {
      updateFormData("step1", {
        ...currentData,
        hidePageSubtitle: !hidePageSubtitle,
      });
    } else if (fieldName === "services") {
      updateFormData("step1", {
        ...currentData,
        hideServices: !hideServices,
      });
    } else if (fieldName === "clientName") {
      updateFormData("step1", {
        ...currentData,
        hideClientName: !hideClientName,
      });
    } else if (fieldName === "clientPhoto") {
      updateFormData("step1", {
        ...currentData,
        hideClientPhoto: !hideClientPhoto,
      });
    }

    // Clear errors for hidden fields
    const willBeHidden =
      fieldName === "pageSubtitle"
        ? !hidePageSubtitle
        : fieldName === "services"
        ? !hideServices
        : fieldName === "clientName"
        ? !hideClientName
        : fieldName === "clientPhoto"
        ? !hideClientPhoto
        : false;

    if (willBeHidden) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleBack = () => {
    setTemplateType(null);
    resetForm();
    setModalDismissed(false);
    setHasNavigatedBeyondStep1(false);
  };

  const validateField = (
    fieldName: string,
    value: string | string[]
  ): string | null => {
    switch (fieldName) {
      case "companyName":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "O nome da empresa é obrigatório";
        }
        break;

      case "companyEmail":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "O email é obrigatório";
        }
        if (typeof value === "string" && value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return "Por favor, insira um email válido";
          }
        }
        break;

      case "ctaButtonTitle":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "O texto do botão é obrigatório";
        }
        if (typeof value === "string" && value.length > 25) {
          return "O texto do botão não pode ter mais do que 25 caracteres";
        }
        break;

      case "pageTitle":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "O título da página é obrigatório";
        }
        break;

      case "pageSubtitle":
        if (!hidePageSubtitle) {
          if (!value || (typeof value === "string" && !value.trim())) {
            return "O subtítulo da página é obrigatório";
          }
        }
        break;

      case "services":
        if (!hideServices && Array.isArray(value) && value.length === 0) {
          return "Pelo menos um serviço deve ser adicionado";
        }
        break;

      case "clientName":
        if (
          !hideClientName &&
          (!value || (typeof value === "string" && !value.trim()))
        ) {
          return "O nome do cliente é obrigatório";
        }
        break;

      case "clientPhoto":
        if (
          !hideClientPhoto &&
          (!value || (typeof value === "string" && !value.trim()))
        ) {
          return "A foto do cliente é obrigatória";
        }
        break;

      default:
        break;
    }

    return null;
  };

  const handleNext = () => {
    setErrors({});

    const newErrors: { [key: string]: string } = {};

    // Validate only fields that are visible for the current template
    visibleFields.forEach((fieldName) => {
      let value: string | string[] = "";

      switch (fieldName) {
        case "companyName":
          value = formData?.step1?.companyName || "";
          break;
        case "companyEmail":
          value = formData?.step1?.companyEmail || "";
          break;
        case "ctaButtonTitle":
          value = formData?.step1?.ctaButtonTitle || "";
          break;
        case "pageTitle":
          value = formData?.step1?.pageTitle || "";
          break;
        case "pageSubtitle":
          value = formData?.step1?.pageSubtitle || "";
          break;
        case "services":
          value = formData?.step1?.services || [];
          break;
        case "clientName":
          value = formData?.step1?.clientName || "";
          break;
        case "clientPhoto":
          value = formData?.step1?.clientPhoto || "";
          break;
        default:
          break;
      }

      const error = validateField(fieldName, value);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

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

  const handleClientPhotoChange = async (file: File | null) => {
    if (!file) return;

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.clientPhoto;
      return newErrors;
    });

    const maxSize = 350 * 1024; // 350KB in bytes
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        clientPhoto: "Arquivo muito grande. Tamanho máximo: 350KB.",
      }));
      return;
    }

    try {
      clearError();

      const result = await uploadImage(file);

      if (result.success && result.data) {
        updateFormData("step1", {
          ...formData?.step1,
          clientPhoto: result.data.url,
        });
      } else {
        console.error("Upload failed:", result.error);
        console.error("Upload Error:", uploadError);
        setErrors((prev) => ({
          ...prev,
          clientPhoto: result.error || "Erro ao fazer upload da imagem",
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors((prev) => ({
        ...prev,
        clientPhoto: "Erro ao fazer upload da imagem",
      }));
    }
  };

  const renderField = (fieldName: string) => {
    switch (fieldName) {
      case "companyName":
        return (
          <div className="pb-6" key={fieldName}>
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
            />
          </div>
        );

      case "companyEmail":
        return (
          <div className="pb-6" key={fieldName}>
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
        );

      case "ctaButtonTitle":
        return (
          <div className="pb-6" key={fieldName}>
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
              showCharCount
              charCountMessage="Recomendado: 25 caracteres"
            />
          </div>
        );

      case "pageTitle":
        return (
          <div className="pb-6" key={fieldName}>
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
              showCharCount
              charCountMessage="Recomendado: 50 caracteres"
            />
          </div>
        );

      case "pageSubtitle":
        return (
          <div className="pb-6" key={fieldName}>
            <label
              className={`text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2 ${
                hidePageSubtitle ? "bg-white-neutral-light-300" : ""
              }`}
              style={{
                backgroundColor: hidePageSubtitle
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
                {hidePageSubtitle ? <EyeClosed /> : <EyeOpened />}
              </button>
            </label>
            {!hidePageSubtitle && (
              <TextAreaField
                id="pageSubtitle"
                placeholder="Digite uma descrição complementar"
                value={formData?.step1?.pageSubtitle || ""}
                onChange={handleTextAreaChange("pageSubtitle")}
                error={errors.pageSubtitle}
                showCharCount
                autoExpand={true}
                minHeight={60}
                maxHeight={200}
                charCountMessage="Recomendado: 115 caracteres"
              />
            )}
          </div>
        );

      case "services":
        return (
          <div className="pb-6" key={fieldName}>
            <label
              className={`text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2 ${
                hideServices ? "bg-white-neutral-light-300" : ""
              }`}
              style={{
                backgroundColor: hideServices
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
                {hideServices ? <EyeClosed /> : <EyeOpened />}
              </button>
            </label>
            {!hideServices && (
              <TagInput
                placeholder="Digite um serviço e pressione Enter"
                value={formData?.step1?.services || []}
                onChange={handleServicesChange}
                error={errors.services}
                infoText="Separe o serviço por ponto e vírgula (;) ou pressione Enter após digitar cada serviço."
              />
            )}
          </div>
        );

      case "clientName":
        return (
          <div className="pb-6" key={fieldName}>
            <label
              className={`text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2 ${
                hideClientName ? "bg-white-neutral-light-300" : ""
              }`}
              style={{
                backgroundColor: hideClientName
                  ? undefined
                  : "rgba(107, 70, 245, 0.05)",
              }}
            >
              Nome do Cliente
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFieldVisibility("clientName");
                }}
                className="cursor-pointer"
              >
                {hideClientName ? <EyeClosed /> : <EyeOpened />}
              </button>
            </label>
            {!hideClientName && (
              <TextField
                id="clientName"
                inputName="clientName"
                type="text"
                placeholder="Digite o nome do cliente"
                value={formData?.step1?.clientName || ""}
                onChange={handleFieldChange("clientName")}
                error={errors.clientName}
              />
            )}
          </div>
        );

      case "clientPhoto":
        return (
          <div className="pb-6" key={fieldName}>
            <label
              className={`text-white-neutral-light-800 text-sm px-3 py-2 rounded-3xs font-medium flex justify-between items-center mb-2 ${
                hideClientPhoto ? "bg-white-neutral-light-300" : ""
              }`}
              style={{
                backgroundColor: hideClientPhoto
                  ? undefined
                  : "rgba(107, 70, 245, 0.05)",
              }}
            >
              Foto do Cliente
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFieldVisibility("clientPhoto");
                }}
                className="cursor-pointer"
              >
                {hideClientPhoto ? <EyeClosed /> : <EyeOpened />}
              </button>
            </label>
            {!hideClientPhoto && (
              <div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-[160px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleClientPhotoChange(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="clientPhoto"
                      disabled={isUploadingClientPhoto}
                    />
                    <label
                      htmlFor="clientPhoto"
                      className={`w-full sm:w-[160px] inline-flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-2xs transition-colors button-inner ${
                        errors.clientPhoto
                          ? "border-red-500"
                          : "border-white-neutral-light-300"
                      } ${
                        isUploadingClientPhoto
                          ? "bg-white-neutral-light-200 cursor-not-allowed opacity-50"
                          : "bg-white-neutral-light-100 cursor-pointer hover:bg-white-neutral-light-200"
                      }`}
                    >
                      {isUploadingClientPhoto ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <PictureIcon width="16" height="16" />
                          Alterar imagem
                        </>
                      )}
                    </label>
                  </div>
                  <div className="text-xs text-white-neutral-light-500">
                    {formData?.step1?.clientPhoto
                      ? "Imagem carregada"
                      : "Nenhuma imagem selecionada"}
                  </div>
                </div>
                <div className="text-xs text-white-neutral-light-400 mt-3">
                  Tipo de arquivo: .jpg, .png ou .webp. Tamanho máximo: 350KB.
                </div>
                {errors.clientPhoto && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.clientPhoto}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isPreviewOpen) {
    return (
      <PreviewModal
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen}
      />
    );
  }

  if (!showImportModal && templateType) {
    return (
      <div className="h-full flex flex-col justify-between overflow-y-scroll relative">
        <div className="p-7 mb-12">
          <div className="mb-6">
            <StepProgressIndicator currentStep={currentStep} />
          </div>
          {/* <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="xl:hidden mb-4 w-full p-3 border-1 border-white-neutral-light-300 rounded-[10px] bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
          >
            <Eye width="18" height="18" /> Pré-visualizar essa seção
          </button> */}
          <TitleDescription
            title="Introdução:"
            description="Comece com uma apresentação impactante"
          />

          <div className="py-6">
            {/* Render fields based on template configuration */}
            {visibleFields.map((fieldName) => renderField(fieldName))}
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
    />
  ) : null;
}
