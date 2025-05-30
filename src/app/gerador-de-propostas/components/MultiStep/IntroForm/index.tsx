"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { TextField } from "#/components/Inputs";

import ImportDataModal from "../../ImportData";
import TitleDescription from "../../TitleDescription";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { Project } from "#/types/project";

export default function IntroStep() {
  const [showImportModal, setShowImportModal] = useState(true);
  const router = useRouter();
  const { updateFormData, nextStep, formData } = useProjectGenerator();

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
    router.push("/gerador-de-propostas");
  };

  const handleNext = () => {
    nextStep();
  };

  const handleFieldChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFormData("step1", {
        ...formData?.step1,
        [fieldName]: e.target.value,
      });
    };

  if (!showImportModal) {
    return (
      <div className="h-full flex flex-col justify-between">
        <div className="p-7">
          <TitleDescription
            title="Introdução:"
            description="Comece com uma apresentação impactante"
          />

          <div className="py-6">
            <div className="pb-6">
              <TextField
                label="Nome para exibição na proposta"
                id="companyName"
                inputName="companyName"
                type="text"
                placeholder="Digite o seu nome ou o nome da empresa"
                value={formData?.step1?.companyName || ""}
                onChange={handleFieldChange("companyName")}
              />
            </div>

            <div className="pb-6">
              <TextField
                label="Email"
                id="companyEmail"
                inputName="companyEmail"
                type="text"
                placeholder="Digite seu email"
                value={formData?.step1?.companyEmail || ""}
                onChange={handleFieldChange("companyEmail")}
              />
            </div>

            <div className="pb-6">
              <TextField
                label="Botão CTA"
                id="ctaButtonTitle"
                inputName="ctaButtonTitle"
                type="text"
                placeholder="Iniciar projeto"
                value={formData?.step1?.ctaButtonTitle || ""}
                onChange={handleFieldChange("ctaButtonTitle")}
              />
            </div>

            <div className="pb-6">
              <TextField
                label="Título principal"
                id="pageTitle"
                inputName="pageTitle"
                type="text"
                placeholder="Escreva seu título principal"
                value={formData?.step1?.pageTitle || ""}
                onChange={handleFieldChange("pageTitle")}
                maxLength={50}
                minLength={30}
                showCharCount
              />
            </div>

            <div className="pb-6">
              <TextField
                label="Serviços"
                id="services"
                inputName="services"
                type="text"
                placeholder="Serviços prestados"
                infoText="Separe os serviços por ponto e vírgula (;)"
                value={formData?.step1?.services || ""}
                onChange={handleFieldChange("services")}
              />
            </div>

            <div className="pb-6">
              <TextField
                label="Subtítulo"
                id="pageSubtitle"
                inputName="pageSubtitle"
                type="text"
                placeholder="Escreva seu subtítulo"
                value={formData?.step1?.pageSubtitle || ""}
                onChange={handleFieldChange("pageSubtitle")}
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
