import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";

import Stars from "#/components/icons/Stars";
import { TemplateType } from "#/types/project";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Template {
  title: string;
  description: string;
  colorsList: string[];
}

interface TemplateSelectionProps {
  templates: Template[];
  onSelectTemplate: (template: TemplateType, color: string) => void;
}

// Color Selection Component
const ColorPicker = ({
  colors,
  selectedColor,
  onColorSelect,
}: {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}) => (
  <div className="flex items-center gap-2">
    {colors.map((color) => (
      <div
        key={color}
        className={`h-6 w-6 rounded-2xs cursor-pointer border p-0.5 flex items-center justify-center ${
          selectedColor === color
            ? "border-primary-light-400"
            : "border-transparent"
        }`}
        onClick={() => onColorSelect(color)}
      >
        <div
          className="h-5 w-6 rounded-md"
          style={{ backgroundColor: color }}
        />
      </div>
    ))}
  </div>
);

// Template Card Component
const TemplateCard = ({
  template,
  selectedColor,
  onColorSelect,
  onSelectTemplate,
}: {
  template: Template;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onSelectTemplate: () => void;
}) => (
  <div className="h-[500px] w-[340px] max-w-full border border-white-neutral-light-300 rounded-2xs bg-white-neutral-light-100">
    {/* Header */}
    <div className="px-7 py-4">
      <h4 className="font-medium text-white-neutral-light-800 text-lg">
        {template.title}
      </h4>
      <p className="text-white-neutral-light-500 text-sm mt-2">
        {template.description}
      </p>
    </div>

    {/* Preview */}
    <div
      className="rounded-2xs h-[190px] m-2 flex items-center justify-center p-7"
      style={{ backgroundColor: selectedColor }}
    >
      <p className="text-white-neutral-light-100">{template.description}</p>
    </div>

    {/* Color Selection */}
    <div className="px-7 py-4">
      <p className="text-white-neutral-light-500 text-sm mb-2">
        Escolha a cor principal que será usada em toda a proposta
      </p>
      <ColorPicker
        colors={template.colorsList}
        selectedColor={selectedColor}
        onColorSelect={onColorSelect}
      />
    </div>

    {/* Actions */}
    <div className="border-t border-white-neutral-light-300 flex items-center gap-4 p-5">
      <button
        type="button"
        className="w-[105px] h-9 border border-white-neutral-light-300 bg-white-neutral-light-100 rounded-xs flex items-center justify-center cursor-pointer hover:bg-white-neutral-light-200 transition-colors"
        onClick={onSelectTemplate}
      >
        Selecionar
      </button>
      <button
        type="button"
        className="w-[105px] h-9 cursor-pointer text-white-neutral-light-800 hover:text-white-neutral-light-600 transition-colors"
      >
        Visualizar
      </button>
    </div>
  </div>
);

// Coming Soon Card
const ComingSoonCard = () => (
  <div className="rounded-2xs bg-primary-light-300 w-[700px] h-[220px] p-6 flex flex-col justify-between gap-4 relative">
    <p className="text-white-neutral-light-100 text-2xl font-bold max-w-[390px]">
      Novos templates chegando em breve
    </p>
    <p className="text-white-neutral-light-100 text-sm font-medium max-w-[390px]">
      A gente tá preparando opções incríveis pra você personalizar ainda mais
      suas propostas.
    </p>
    <Stars className="absolute top-0 right-0" />
  </div>
);

// Mobile Navigation
const MobileNavigation = ({
  currentSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onGoToSlide,
}: {
  currentSlide: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onGoToSlide: (index: number) => void;
}) => (
  <div className="flex flex-col items-center mt-6 gap-4">
    <div className="flex items-center gap-4">
      {/* Previous Button */}
      <button
        onClick={onPrevSlide}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          currentSlide === 0 ? "opacity-60 cursor-not-allowed" : ""
        }`}
        disabled={currentSlide === 0}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => onGoToSlide(index)}
            className={`w-10 h-10 flex items-center justify-center rounded-2xs text-lg transition-colors text-white-neutral-light-900 cursor-pointer ${
              currentSlide === index
                ? "bg-white-neutral-light-300 font-medium"
                : "hover:bg-gray-50 font-normal"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNextSlide}
        className={`w-10 h-10 rounded-full hover:bg-white-neutral-light-200 flex items-center justify-center transition-colors ${
          currentSlide === totalSlides - 1
            ? "opacity-60 cursor-not-allowed"
            : ""
        }`}
        disabled={currentSlide === totalSlides - 1}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  </div>
);

// Main Component
export default function TemplateSelection({
  templates,
  onSelectTemplate,
}: TemplateSelectionProps) {
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    {}
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  // Get selected color or default to first color
  const getSelectedColor = (template: Template) => {
    return (
      selectedColors[template.title] ||
      template.colorsList[0] ||
      "#primary-light-300"
    );
  };

  const handleColorSelect = (templateTitle: string, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [templateTitle]: color }));
  };

  const handleSelectTemplate = (template: Template) => {
    const selectedColor = getSelectedColor(template);
    onSelectTemplate(
      template.title.toLowerCase() as TemplateType,
      selectedColor
    );
  };

  // Slider controls
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
    <div className="w-full lg:h-full lg:flex justify-center items-center lg:px-7 lg:py-4">
      {/* Desktop View */}
      <div className="hidden lg:flex flex-wrap items-end lg:justify-center xl:justify-start gap-4 max-w-[1100px]">
        {templates.map((template) => (
          <TemplateCard
            key={template.title}
            template={template}
            selectedColor={getSelectedColor(template)}
            onColorSelect={(color) => handleColorSelect(template.title, color)}
            onSelectTemplate={() => handleSelectTemplate(template)}
          />
        ))}
        <ComingSoonCard />
      </div>

      {/* Mobile View */}
      <div className="mb-8 lg:hidden">
        <Slider ref={sliderRef} {...sliderSettings}>
          {templates.map((template) => (
            <div key={template.title} className="px-4 shadow-lg">
              <div className="mx-auto flex justify-center items-center">
                <TemplateCard
                  template={template}
                  selectedColor={getSelectedColor(template)}
                  onColorSelect={(color) =>
                    handleColorSelect(template.title, color)
                  }
                  onSelectTemplate={() => handleSelectTemplate(template)}
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
