/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import MultiStepForm from "./components/MultiStepForm";
import TemplateSelection from "./components/TemplateSelection";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { TemplateType } from "#/types/project";

const templates = [
  {
    title: "Flash",
    description:
      "Design vibrante e energético, ideal para quem quer se destacar.",
    colorsList: [
      "#4F21A1",
      "#BE8406",
      "#9B3218",
      "#05722C",
      "#182E9B",
      "#212121",
    ],
  },
  {
    title: "Prime",
    description: "Design sofisticado, perfeito para ambientes corporativos.",
    colorsList: [
      "#010101",
      "#E9E9E9",
      "#F0E5E0",
      "#223630",
      "#621D1E",
      "#08306C",
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
  {
    title: "Grid",
    description:
      "Design limpo e funcional, com estrutura compacta e navegação direta ao ponto.",
    colorsList: [
      "#2C2C2C",
      "#146EF4",
      "#78838E",
      "#294D41",
      "#5E4D35",
      "#7C4257",
    ],
  },
];

export default function ProjectGenerator() {
  const searchParams = useSearchParams();
  const { updateFormData, setTemplateType, templateType, loadProjectData } =
    useProjectGenerator();

  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [hasLoadedEdit, setHasLoadedEdit] = useState(false);

  useEffect(() => {
    const editId = searchParams?.get("editId");

    if (!editId || hasLoadedEdit) {
      return;
    }

    const loadEditData = async () => {
      try {
        setIsLoadingEdit(true);
        console.log("Carregando dados da proposta:", editId);

        const response = await fetch(`/api/projects/${editId}`);
        const result = await response.json();

        console.log("Resposta da API:", result);

        if (result.success) {
          const projectData = result.data;
          console.log("Dados do projeto:", projectData);

          loadProjectData(projectData);

          if (projectData.templateType) {
            setTemplateType(projectData.templateType);
          }

          setHasLoadedEdit(true);
        } else {
          console.error("Erro ao carregar dados da proposta:", result.error);
          setIsLoadingEdit(false);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da proposta:", error);
        setIsLoadingEdit(false);
      }
    };

    loadEditData();
  }, [searchParams?.get("editId"), hasLoadedEdit]);

  useEffect(() => {
    if (hasLoadedEdit && templateType) {
      setIsLoadingEdit(false);
    }
  }, [hasLoadedEdit, templateType]);

  const handleTemplateSelect = (template: TemplateType, color: string) => {
    setTemplateType(template);
    updateFormData("step1", {
      templateType: template,
      mainColor: color,
    });
  };

  if (isLoadingEdit) {
    return (
      <div className="flex items-center justify-center h-full p-7">
        <LoaderCircle className="animate-spin text-primary-light-400 mr-2" />{" "}
        Carregando proposta...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      {templateType ? (
        <div className="w-full h-full">
          <MultiStepForm />
        </div>
      ) : (
        <>
          <h2 className="text-white-neutral-light-800 text-[21px] text-center lg:text-left font-medium py-4 lg:pb-0 lg:pt-8">
            Escolha o modelo da sua proposta
          </h2>
          <TemplateSelection
            templates={templates}
            onSelectTemplate={handleTemplateSelect}
          />
        </>
      )}
    </div>
  );
}
