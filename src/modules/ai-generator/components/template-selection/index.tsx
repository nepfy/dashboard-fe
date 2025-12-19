import React, { useState, useRef, useEffect, useCallback } from "react";

import Slider from "react-slick";

import { TemplateType } from "#/types/project";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { useProposalGenerator } from "#/app/gerar-proposta/ProposalGeneratorContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Template, TemplateCard } from "./partials/TemplateCard";
import { ComingSoonCard } from "./partials/ComingSoonCard";
import { MobileNavigation } from "./partials/MobileNavigation";
import Modal from "#/components/Modal";
import { Trash2 } from "lucide-react";
import type { SavedTemplate } from "#/types/templates";

interface TemplateSelectionProps {
  templates: Template[];
  onNextStep?: () => void;
  hideBanner?: boolean;
}

export default function TemplateSelection({
  templates,
  onNextStep,
  hideBanner = false,
}: TemplateSelectionProps) {
  const router = useRouter();
  const {
    updateFormData,
    setTemplateType,
    templateType,
    setCustomTemplate,
    customTemplate,
  } = useProjectGenerator();
  const {
    setClientName,
    setProjectName,
    setProjectDescription,
    setDetailedClientInfo,
    setCompanyInfo,
    setCurrentStep,
  } = useProposalGenerator();
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    {}
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [activeTab, setActiveTab] = useState<"nepfy" | "custom">("nepfy");

  const [customTemplates, setCustomTemplates] = useState<SavedTemplate[]>([]);
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(
    null
  );

  const getSelectedColor = (key: string, colors: string[]) => {
    return selectedColors[key] || colors[0] || "#4F21A1";
  };

  const handleColorSelect = (key: string, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [key]: color }));
  };

  const handleSelectTemplate = (template: Template) => {
    const templateKey = template.title;
    const selectedColor = getSelectedColor(templateKey, template.colorsList);
    const templateType = template.title.toLowerCase() as TemplateType;

    setTemplateType(templateType);
    updateFormData("step1", {
      templateType: templateType,
      mainColor: selectedColor,
    });

    if (onNextStep) {
      onNextStep();
    }
  };

  const fetchCustomTemplates = useCallback(async () => {
    setIsCustomLoading(true);
    setCustomError(null);

    try {
      const response = await fetch("/api/templates");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Erro ao carregar templates");
      }

      setCustomTemplates(data.data ?? []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível carregar";
      setCustomError(message);
    } finally {
      setIsCustomLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomTemplates();
    const handleSave = () => fetchCustomTemplates();

    if (typeof window !== "undefined") {
      window.addEventListener("templateSaved", handleSave);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("templateSaved", handleSave);
      }
    };
  }, [fetchCustomTemplates]);

  const handleDeleteTemplate = async (templateId: string) => {
    setDeletingTemplateId(templateId);

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao excluir template");
      }

      toast.success("Template removido com sucesso!", {
        position: "top-right",
        autoClose: 3000,
      });

      await fetchCustomTemplates();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao excluir template";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setDeletingTemplateId(null);
    }
  };

  const handleCustomTemplateSelect = (
    template: SavedTemplate,
    options: { selectedColor: string; previewTemplate: TemplateType }
  ) => {
    const fallbackType =
      template.templateType ??
      (template.templateData?.templateType as TemplateType) ??
      "flash";
    const description =
      template.templateData?.proposalData?.introduction?.description ?? "";

    const mainColor =
      options.selectedColor ||
      template.mainColor ||
      template.templateData?.mainColor ||
      "";

    setCustomTemplate({
      ...template,
      selectedColor: options.selectedColor,
      previewTemplate: options.previewTemplate,
    });
    setTemplateType(fallbackType, { keepCustomTemplate: true });

    setProjectDescription(description);
    setDetailedClientInfo(description);
    setCompanyInfo(template.templateData?.companyName ?? "");
    updateFormData("step1", {
      clientName: "",
      projectName: "",
      mainColor: mainColor || undefined,
      templateType: fallbackType,
    });
    if (setCurrentStep) {
      setCurrentStep("custom_template_finalize");
    }
    // Step navigation is handled by the parent component (custom template flow)
  };

  const renderCustomTemplates = () => {
    if (isCustomLoading) {
      return (
        <div className="bg-white-neutral-light-100 rounded-[12px] border border-dashed border-gray-300 p-4 text-sm text-gray-600">
          Carregando seus templates...
        </div>
      );
    }

    if (customError) {
      return (
        <div className="rounded-[12px] border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {customError}
        </div>
      );
    }

    if (customTemplates.length === 0) {
      return (
        <div className="bg-white-neutral-light-100 rounded-[12px] border border-gray-200 p-4 text-sm text-gray-500">
          Você ainda não salvou nenhum template personalizado.
        </div>
      );
    }

    const handleEditTemplate = (id: string, type: TemplateType) => {
      router.push(`/editar?templateId=${id}&templateType=${type}`);
    };

    return (
      <>
        {customTemplates.map((template) => {
          const proposalDataMainColor = (
            template.templateData?.proposalData as { mainColor?: string }
          )?.mainColor;
          const templateColors = [
            template.mainColor,
            template.templateData?.mainColor,
            proposalDataMainColor,
          ].filter(Boolean) as string[];
          const colorsList =
            templateColors.length > 0
              ? Array.from(new Set(templateColors))
              : ["#4F21A1"];
          const templateKey = template.id;
          const selectedColor = getSelectedColor(templateKey, colorsList);
          const previewTheme: TemplateType =
            template.templateType ??
            (template.templateData?.templateType as TemplateType) ??
            "flash";
          const cardTemplate: Template = {
            title: template.name ?? "Template personalizado",
            description:
              template.description ??
              template.templateData?.proposalData?.introduction?.description ??
              "Sem descrição",
            colorsList,
            previewTemplate: previewTheme,
          };
          const isDeleting = deletingTemplateId === template.id;

          return (
            <div key={template.id} className="relative">
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="border-white-neutral-light-200 rounded-full border bg-white px-3 py-1 text-xs text-gray-600 capitalize shadow">
                  {template.templateType ?? "Personalizado"}
                </span>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  disabled={isDeleting}
                  className="border-white-neutral-light-200 hover:border-white-neutral-light-300 rounded-full border bg-white p-2 text-gray-500 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <TemplateCard
                isCustomTemplate
                template={cardTemplate}
                selectedColor={selectedColor}
                onColorSelect={(color) => handleColorSelect(templateKey, color)}
                onSelectTemplate={() =>
                  handleCustomTemplateSelect(template, {
                    selectedColor,
                    previewTemplate: previewTheme,
                  })
                }
                onEditTemplate={() =>
                  handleEditTemplate(template.id, previewTheme)
                }
                onPreviewTemplate={() => handlePreviewTemplate(previewTheme)}
                isSelected={customTemplate?.id === template.id}
              />
            </div>
          );
        })}
      </>
    );
  };

  const [previewTemplate, setPreviewTemplate] = useState<string>("flash");

  const handlePreviewTemplate = (templateName: string) => {
    if (templateName === "flash" || templateName === "minimal") {
      setPreviewTemplate(templateName);
      setModalOpen(true);
      return;
    }

    if (templateName === "prime") {
      window.open("/prime", "_blank", "noopener,noreferrer");
    }

    if (templateName === "grid") {
      window.open("/grid", "_blank", "noopener,noreferrer");
    }
  };

  const nextSlide = () => sliderRef.current?.slickNext();
  const prevSlide = () => sliderRef.current?.slickPrev();
  const goToSlide = (index: number) => sliderRef.current?.slickGoTo(index);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <div className="w-full items-center space-y-10 py-8 lg:flex lg:h-full lg:flex-col lg:px-7">
      <div className="flex flex-col gap-4 px-2 sm:px-0">
        <div className="items-centersm:justify-between flex flex-col gap-3 sm:flex-row">
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                activeTab === "nepfy"
                  ? "border-primary-light-600 text-primary-light-500"
                  : "border-white-neutral-light-300 bg-white-neutral-light-100 text-white-neutral-light-600 hover:border-white-neutral-light-400"
              }`}
              onClick={() => setActiveTab("nepfy")}
            >
              Templates Nepfy
            </button>
            <button
              type="button"
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                activeTab === "custom"
                  ? "border-primary-light-600 text-primary-light-500"
                  : "border-white-neutral-light-300 bg-white-neutral-light-100 text-white-neutral-light-600 hover:border-white-neutral-light-400"
              }`}
              onClick={() => setActiveTab("custom")}
            >
              Meus templates
            </button>
          </div>
        </div>
      </div>

      {activeTab === "nepfy" ? (
        <>
          <div className="hidden max-w-[1100px] flex-wrap items-end gap-4 lg:flex xl:justify-start">
            {templates.map((template) => {
              const templateKey = template.title;
              return (
                <TemplateCard
                  key={template.title}
                  template={template}
                  selectedColor={getSelectedColor(
                    templateKey,
                    template.colorsList
                  )}
                  onColorSelect={(color) =>
                    handleColorSelect(templateKey, color)
                  }
                  onSelectTemplate={() => handleSelectTemplate(template)}
                  onPreviewTemplate={() =>
                    handlePreviewTemplate(template.title.toLowerCase())
                  }
                  isSelected={
                    template.title.toLowerCase() === templateType?.toLowerCase()
                  }
                />
              );
            })}
            {!hideBanner && <ComingSoonCard />}
          </div>
          <div className="space-y-6 lg:hidden">
            <div className="h-full w-full">
              <Slider ref={sliderRef} {...sliderSettings}>
                {templates.map((template) => {
                  const templateKey = template.title;
                  return (
                    <div key={template.title} className="px-4">
                      <div className="mx-auto flex items-center justify-center">
                        <TemplateCard
                          template={template}
                          selectedColor={getSelectedColor(
                            templateKey,
                            template.colorsList
                          )}
                          onColorSelect={(color) =>
                            handleColorSelect(templateKey, color)
                          }
                          onSelectTemplate={() =>
                            handleSelectTemplate(template)
                          }
                          onPreviewTemplate={() =>
                            handlePreviewTemplate(template.title.toLowerCase())
                          }
                          isSelected={template.title === templateType}
                        />
                      </div>
                    </div>
                  );
                })}
              </Slider>

              <MobileNavigation
                currentSlide={currentSlide}
                totalSlides={templates.length}
                onPrevSlide={prevSlide}
                onNextSlide={nextSlide}
                onGoToSlide={goToSlide}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="hidden max-w-[1100px] flex-wrap items-end gap-4 lg:flex xl:justify-start">
          {renderCustomTemplates()}
        </div>
      )}

      <style jsx global>{`
        .slick-slider {
          margin-bottom: 0;
        }
        .slick-list {
          overflow: hidden;
        }
        .slick-track {
          display: flex;
          align-items: center;
        }
        .slick-slide {
          height: auto;
        }
        .slick-slide > div {
          height: 100%;
        }
      `}</style>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        showCloseButton={false}
        footer={false}
        width="100%"
      >
        <iframe
          ref={iframeRef}
          src={
            previewTemplate === "minimal"
              ? "/template-minimal-visualize/index.html"
              : "/template-flash-visualize/index.html"
          }
          style={{ width: "100%", height: "100vh", border: "none" }}
          title={`${previewTemplate.charAt(0).toUpperCase() + previewTemplate.slice(1)} Template`}
        />
      </Modal>
    </div>
  );
}
