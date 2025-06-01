// TemplateSelection component with React Slick
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Slider from "react-slick";
import { TemplateType } from "#/types/project";

// Import CSS files for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface TemplateSelectionProps {
  templates: {
    title: string;
    description: string;
    colorsList: string[];
  }[];
  onSelectTemplate: (template: TemplateType, color: string) => void;
}

export default function TemplateSelection({
  templates,
  onSelectTemplate,
}: TemplateSelectionProps) {
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    {}
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const handleColorSelect = (templateTitle: string, color: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [templateTitle]: color,
    }));
  };

  const handleSelectTemplate = (templateTitle: string) => {
    const selectedColor =
      selectedColors[templateTitle] ||
      templates.find((t) => t.title === templateTitle)?.colorsList[0];
    if (selectedColor) {
      onSelectTemplate(
        templateTitle.toLowerCase() as TemplateType,
        selectedColor
      );
    }
  };

  const nextSlide = () => {
    sliderRef.current?.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current?.slickPrev();
  };

  const goToSlide = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const TemplateCard = ({ item }: { item: (typeof templates)[0] }) => (
    <div className="px-4 shadow-lg">
      <div className="h-[500px] w-[340px] max-w-full mx-auto border border-white-neutral-light-300 rounded-2xs bg-white-neutral-light-100">
        <div className="px-7 py-4">
          <h4 className="font-medium text-white-neutral-light-800 text-[18px]">
            {item.title}
          </h4>
          <p className="text-white-neutral-light-500 text-[13px] mt-2">
            {item.description}
          </p>
        </div>
        <div className="rounded-2xs bg-primary-light-300 h-[190px] m-2"> </div>

        <div className="px-7 py-4">
          <p className="text-white-neutral-light-500 text-[13px] mb-2">
            Escolha a cor principal que será usada em toda a proposta
          </p>

          <div className="flex items-center gap-2">
            {item.colorsList.map((color) => (
              <div
                key={color}
                className={`h-[24px] w-[24px] rounded-2xs cursor-pointer border-1 p-0.5 flex items-center justify-center box-border ${
                  selectedColors[item.title] === color
                    ? "border-primary-light-400"
                    : "border-transparent"
                }`}
                onClick={() => handleColorSelect(item.title, color)}
              >
                <div
                  className="h-[20px] w-[24px] rounded-[6px]"
                  style={{ backgroundColor: color }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-t-white-neutral-light-300 w-full flex items-center gap-4 p-5">
          <button
            type="button"
            className="w-[105px] h-[36px] border border-white-neutral-light-300 button-inner bg-white-neutral-light-100 rounded-xs flex items-center justify-center cursor-pointer hover:bg-white-neutral-light-200 transition-colors"
            onClick={() => handleSelectTemplate(item.title)}
          >
            Selecionar
          </button>
          <button
            type="button"
            className="w-[105px] h-[36px] cursor-pointer text-white-neutral-light-600 hover:text-white-neutral-light-800 transition-colors"
          >
            Visualizar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Desktop View - Show all cards */}
      <div className="hidden lg:flex items-center justify-center gap-4">
        {templates.map((item) => (
          <div
            key={item.title}
            className="h-[500px] w-[340px] border border-white-neutral-light-300 rounded-2xs bg-white-neutral-light-100 e0"
          >
            <div className="px-7 py-4">
              <h4 className="font-medium text-white-neutral-light-800 text-[18px]">
                {item.title}
              </h4>
              <p className="text-white-neutral-light-500 text-[13px] mt-2">
                {item.description}
              </p>
            </div>
            <div className="rounded-2xs bg-primary-light-300 h-[190px] m-2">
              {" "}
            </div>

            <div className="px-7 py-4">
              <p className="text-white-neutral-light-500 text-[13px] mb-2">
                Escolha a cor principal que será usada em toda a proposta
              </p>

              <div className="flex items-center gap-2">
                {item.colorsList.map((color) => (
                  <div
                    key={color}
                    className={`h-[24px] w-[24px] rounded-2xs cursor-pointer border-1 p-0.5 flex items-center justify-center box-border ${
                      selectedColors[item.title] === color
                        ? "border-primary-light-400"
                        : "border-transparent"
                    }`}
                    onClick={() => handleColorSelect(item.title, color)}
                  >
                    <div
                      className="h-[20px] w-[24px] rounded-[6px]"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-t-white-neutral-light-300 w-full flex items-center gap-4 p-5">
              <button
                type="button"
                className="w-[105px] h-[36px] border border-white-neutral-light-300 button-inner bg-white-neutral-light-100 rounded-xs flex items-center justify-center cursor-pointer hover:bg-white-neutral-light-200 transition-colors"
                onClick={() => handleSelectTemplate(item.title)}
              >
                Selecionar
              </button>
              <button
                type="button"
                className="w-[105px] h-[36px] cursor-pointer text-white-neutral-light-600 hover:text-white-neutral-light-800 transition-colors"
              >
                Visualizar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View - React Slick Slider */}
      <div className="mb-8 lg:hidden">
        <Slider ref={sliderRef} {...sliderSettings}>
          {templates.map((item) => (
            <TemplateCard key={item.title} item={item} />
          ))}
        </Slider>

        {/* Custom Navigation Controls */}
        <div className="flex flex-col items-center mt-6 gap-4">
          {/* Pagination Dots */}

          {/* Arrow Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                currentSlide === 0 ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex items-center gap-2">
              {templates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-10 h-10 flex items-center justify-center rounded-2xs text-lg font-normal transition-colors text-white-neutral-light-900 cursor-pointer ${
                    currentSlide === index
                      ? "bg-white-neutral-light-300 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextSlide}
              className={`w-10 h-10 rounded-full hover:bg-white-neutral-light-200 flex items-center justify-center transition-colors ${
                currentSlide === templates.length - 1
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentSlide === templates.length - 1}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for react-slick styling */}
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
