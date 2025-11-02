import React, { useState, useRef } from "react";

import Slider from "react-slick";

import { TemplateType } from "#/types/project";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Template, TemplateCard } from "./partials/TemplateCard";
import { ComingSoonCard } from "./partials/ComingSoonCard";
import { MobileNavigation } from "./partials/MobileNavigation";
import Modal from "#/components/Modal";

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
  const { updateFormData, setTemplateType, templateType } =
    useProjectGenerator();
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    {}
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

    // Call onNextStep if provided
    if (onNextStep) {
      onNextStep();
    }
  };

  const handlePreviewTemplate = (templateName: string) => {
    if (templateName === "flash") {
      setModalOpen(true);
      return;
    }

    if (templateName === "prime") {
      window.open("/prime", "_blank", "noopener,noreferrer");
    }

    if (templateName === "grid") {
      window.open("/grid", "_blank", "noopener,noreferrer");
    }

    if (templateName === "minimal") {
      window.open("/minimal", "_blank", "noopener,noreferrer");
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
    <div className="w-full items-start justify-center py-8 lg:flex lg:h-full lg:px-7 xl:items-start">
      <div className="hidden max-w-[1100px] flex-wrap items-end gap-4 lg:mt-0 xl:mt-0 xl:flex xl:justify-start">
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

      {/* Mobile View */}
      <div className="mb-8 h-full w-full xl:hidden">
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

      {/* Slider Styles */}
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
          src="/template-flash-visualize/index.html"
          style={{ width: "100%", height: "100vh", border: "none" }}
          title="Flash Template"
        />
      </Modal>
    </div>
  );
}
