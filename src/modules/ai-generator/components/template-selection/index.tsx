import React, { useState, useRef, useEffect, useCallback } from "react";

import Slider from "react-slick";

import { TemplateType } from "#/types/project";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import { useProposalGenerator } from "#/app/gerar-proposta/ProposalGeneratorContext";
import { toast } from "react-toastify";

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
  const { updateFormData, setTemplateType, templateType, setCustomTemplate } =
    useProjectGenerator();
  const {
    setClientName,
    setProjectName,
    setProjectDescription,
    setDetailedClientInfo,
    setCompanyInfo,
  } = useProposalGenerator();
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    {}
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [customTemplates, setCustomTemplates] = useState<SavedTemplate[]>([]);
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(
    null
  );

  const getSelectedColor = (template: Template) => {
    return (
      selectedColors[template.title] || template.colorsList[0] || "#4F21A1"
    );
  };

  const handleColorSelect = (templateTitle: string, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [templateTitle]: color }));
  };

  const handleSelectTemplate = (template: Template) => {
    const selectedColor = getSelectedColor(template);
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

  const handleCustomTemplateSelect = (template: SavedTemplate) => {
    const fallbackType =
      template.templateType ??
      (template.templateData?.templateType as TemplateType) ??
      "flash";
    const clientName =
      template.templateData?.clientName ??
      template.templateData?.proposalData?.introduction?.clientName ??
      template.name ??
      "";
    const projectName =
      template.templateData?.projectName ?? template.name ?? "";
    const description =
      template.templateData?.proposalData?.introduction?.description ?? "";

    setCustomTemplate(template);
    setTemplateType(fallbackType);
    setClientName(clientName);
    setProjectName(projectName);
    setProjectDescription(description);
    setDetailedClientInfo(description);
    setCompanyInfo(template.templateData?.companyName ?? "");
    updateFormData("step1", {
      clientName,
      projectName,
      mainColor:
        template.mainColor || template.templateData?.mainColor || undefined,
      templateType: fallbackType,
    });
    // Step navigation is handled by the parent component
  };

  const renderCustomTemplates = (layout: "grid" | "list") => {
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

    const containerClass =
      layout === "grid"
        ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        : "space-y-3";

    return (
      <div className={containerClass}>
        {customTemplates.map((template) => (
          <CustomTemplateCard
            key={template.id}
            template={template}
            onSelect={() => handleCustomTemplateSelect(template)}
            onDelete={() => handleDeleteTemplate(template.id)}
            isDeleting={deletingTemplateId === template.id}
          />
        ))}
      </div>
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
    <div className="w-full space-y-10 py-8 lg:flex lg:h-full lg:flex-col lg:px-7 xl:items-start">
      <div className="hidden max-w-[1100px] flex-wrap items-end gap-4 lg:flex xl:justify-start">
        {templates.map((template) => (
          <TemplateCard
            key={template.title}
            template={template}
            selectedColor={getSelectedColor(template)}
            onColorSelect={(color) => handleColorSelect(template.title, color)}
            onSelectTemplate={() => handleSelectTemplate(template)}
            onPreviewTemplate={() =>
              handlePreviewTemplate(template.title.toLowerCase())
            }
            isSelected={
              template.title.toLowerCase() === templateType?.toLowerCase()
            }
          />
        ))}
        {!hideBanner && <ComingSoonCard />}
      </div>

      <div className="space-y-6 xl:hidden">
        <div className="h-full w-full">
          <Slider ref={sliderRef} {...sliderSettings}>
            {templates.map((template) => (
              <div key={template.title} className="px-4">
                <div className="mx-auto flex items-center justify-center">
                  <TemplateCard
                    template={template}
                    selectedColor={getSelectedColor(template)}
                    onColorSelect={(color) =>
                      handleColorSelect(template.title, color)
                    }
                    onSelectTemplate={() => handleSelectTemplate(template)}
                    onPreviewTemplate={() =>
                      handlePreviewTemplate(template.title.toLowerCase())
                    }
                    isSelected={template.title === templateType}
                  />
                </div>
              </div>
            ))}
          </Slider>

          <MobileNavigation
            currentSlide={currentSlide}
            totalSlides={templates.length}
            onPrevSlide={prevSlide}
            onNextSlide={nextSlide}
            onGoToSlide={goToSlide}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white-neutral-light-900 text-base font-semibold">
                Meus templates
              </p>
              <p className="text-xs text-gray-500">
                Use um template salvo anteriormente.
              </p>
            </div>
            {customTemplates.length > 0 && (
              <span className="text-xs text-gray-500">
                {customTemplates.length} template
                {customTemplates.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          {renderCustomTemplates("list")}
        </div>
      </div>

      <section className="hidden space-y-4 xl:block">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white-neutral-light-900 text-base font-semibold">
              Meus templates
            </p>
            <p className="text-sm text-gray-500">
              Crie uma proposta a partir de um template personalizado.
            </p>
          </div>
          {customTemplates.length > 0 && (
            <span className="text-sm text-gray-500">
              {customTemplates.length} template
              {customTemplates.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        {renderCustomTemplates("grid")}
      </section>

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

interface CustomTemplateCardProps {
  template: SavedTemplate;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

const CustomTemplateCard = ({
  template,
  onSelect,
  onDelete,
  isDeleting = false,
}: CustomTemplateCardProps) => (
  <div className="bg-white-neutral-light-100 flex flex-col justify-between rounded-[16px] border border-gray-200 p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: template.mainColor || "#6366f1" }}
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{template.name}</p>
          <p className="text-xs text-gray-500">
            {template.description ?? "Sem descrição"}
          </p>
        </div>
      </div>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="rounded-full border border-gray-100 p-2 text-gray-500 transition hover:border-gray-200 hover:text-gray-700"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>

    <div className="mt-4 flex items-center justify-between gap-3">
      <button
        onClick={onSelect}
        className="border-primary-light-400 text-primary-light-400 hover:bg-primary-light-50 flex-1 rounded-[10px] border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Usar template
      </button>
      <span className="text-xs text-gray-400">
        {template.templateType ?? "Personalizado"}
      </span>
    </div>
  </div>
);
