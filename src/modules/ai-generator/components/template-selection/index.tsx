import React, { useState, useRef } from "react";

import Slider from "react-slick";

import { TemplateType } from "#/types/project";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Template, TemplateCard } from "./partials/TemplateCard";
import { ComingSoonCard } from "./partials/ComingSoonCard";
import { MobileNavigation } from "./partials/MobileNavigation";

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
      window.open("/flash", "_blank", "noopener,noreferrer");
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
    <div className="w-full lg:h-full lg:flex justify-center items-start xl:items-start lg:px-7 py-8">
      <div className="hidden xl:flex flex-wrap items-end xl:justify-start gap-4 max-w-[1100px] lg:mt-0 xl:mt-0">
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
      <div className="mb-8 w-full h-full xl:hidden">
        <Slider ref={sliderRef} {...sliderSettings}>
          {templates.map((template) => (
            <div key={template.title} className="px-4">
              <div className="mx-auto flex justify-center items-center">
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
    </div>
  );
}
