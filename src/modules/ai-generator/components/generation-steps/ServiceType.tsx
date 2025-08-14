import { ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import Slider from "react-slick";

import {
  DigitalMarketingIcon,
  DesignerIcon,
  DeveloperIcon,
  ArchitectIcon,
  PhotographerIcon,
  DoctorIcon,
} from "../icons";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: "marketing-digital",
    title: "Marketing digital",
    icon: <DigitalMarketingIcon />,
  },
  {
    id: "designer",
    title: "Designer",
    icon: <DesignerIcon />,
  },
  {
    id: "desenvolvedor",
    title: "Desenvolvedor",
    icon: <DeveloperIcon />,
  },
  {
    id: "arquiteto",
    title: "Arquiteto",
    icon: <ArchitectIcon />,
  },
  {
    id: "fotografo",
    title: "Fotógrafo",
    icon: <PhotographerIcon />,
  },
  {
    id: "medicos",
    title: "Médico",
    icon: <DoctorIcon />,
  },
];

// Mobile Navigation Component
const MobileNavigation = ({
  currentSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
}: {
  currentSlide: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
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
        <ArrowLeft size={24} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        <span className="text-lg text-white-neutral-light-900 font-medium">
          {currentSlide + 1} de {totalSlides}
        </span>
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
        <ArrowLeft size={24} className="rotate-180" />
      </button>
    </div>
  </div>
);

export function ServiceType({
  services = DEFAULT_SERVICES,
  onServiceSelect,
  selectedService: externalSelectedService,
  handleBack,
  handleNext,
}: {
  services?: Service[];
  onServiceSelect?: (serviceId: string) => void;
  selectedService?: string | null;
  handleBack?: () => void;
  handleNext?: () => void;
}) {
  const [internalSelectedService, setInternalSelectedService] = useState<
    string | null
  >(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const selectedService =
    externalSelectedService !== undefined
      ? externalSelectedService
      : internalSelectedService;

  const handleServiceSelect = (serviceId: string) => {
    if (onServiceSelect) {
      onServiceSelect(serviceId);
    } else {
      setInternalSelectedService(serviceId);
    }
  };

  const nextSlide = () => sliderRef.current?.slickNext();
  const prevSlide = () => sliderRef.current?.slickPrev();

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <section className="w-full h-full bg-gray-50 flex items-center justify-center p-4">
      <div
        className="hidden lg:block e1 p-0.5 rounded-[12px]"
        style={{
          background: `linear-gradient(141.87deg, rgba(253, 253, 253, 0) 1.74%, rgba(172, 153, 243, 0.5) 50.87%, rgba(106, 75, 222, 0.5) 100%)`,
        }}
      >
        <div className="bg-white-neutral-light-200 rounded-[12px] p-0.5">
          {/* Header */}
          <div className="px-8 pt-8 pb-2 text-start">
            <h1 className="text-2xl font-medium text-primary-light-400 mb-2 font-satoshi">
              Serviços
            </h1>
            <p className="text-white-neutral-light-800 leading-relaxed font-light font-satoshi">
              Selecione a melhor opção que se encaixa no seu tipo de trabalho
            </p>
          </div>

          {/* Desktop View - Original Services Grid - 3 columns */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-10 p-8">
              {services.map((service) => {
                const isSelected = selectedService === service.id;

                return (
                  <label
                    key={service.id}
                    className={`flex flex-col items-start w-full cursor-pointer group relative p-2 rounded-[8px]
                    ${
                      isSelected
                        ? "bg-white-neutral-light-100 e0"
                        : "bg-white-neutral-light-200"
                    }
                      `}
                  >
                    {/* Custom Radio Button */}
                    <div
                      className={`h-5 w-5 flex items-center justify-center rounded-full border border-white-neutral-light-400 mb-4`}
                    >
                      <div
                        className={`h-3 w-3 rounded-full
                        ${
                          isSelected
                            ? "bg-primary-light-400"
                            : "bg-white-neutral-light-100"
                        }
                        `}
                      />
                    </div>
                    <input
                      type="radio"
                      name="service"
                      value={service.id}
                      checked={isSelected}
                      onChange={() => handleServiceSelect(service.id)}
                      className="sr-only"
                    />
                    <div className="w-full rounded-xl flex flex-col items-center justify-center">
                      {service.icon}
                    </div>
                    <span className="mt-3 text-center font-satoshi font-medium text-sm">
                      {service.title}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="border-t border-gray-200 mx-4">
            <div className="w-full flex items-center gap-4 py-4">
              <button
                onClick={handleBack}
                className="cursor-pointer button-inner border border-white-neutral-light-300 flex items-center justify-start gap-2 px-6 py-3 text-white-neutral-light-900 hover:text-gray-800 transition-all duration-200 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 rounded-[10px] group"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedService}
                className={`px-6 py-3.5 text-sm font-medium rounded-[10px] flex justify-center items-center gap-1 transition-all duration-200 transform shadow-lg hover:shadow-xl cursor-pointer ${
                  !selectedService
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform"
                }`}
              >
                Avançar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col gap-4 w-full bg-white-neutral-light-200">
        <div
          className="w-full rounded-[14px] p-0.5"
          style={{
            background: `linear-gradient(141.87deg, rgba(253, 253, 253, 0) 1.74%, rgba(172, 153, 243, 0.5) 50.87%, rgba(106, 75, 222, 0.5) 100%)`,
          }}
        >
          <div className="bg-white-neutral-light-200 rounded-[12px] w-full p-4">
            <div className="pb-6 text-start">
              <h1 className="text-2xl font-medium text-primary-light-400 mb-2 font-satoshi">
                Serviços
              </h1>
              <p className="text-white-neutral-light-800 leading-relaxed font-light font-satoshi">
                Selecione a melhor opção que se encaixa no seu tipo de trabalho
              </p>
            </div>
            <Slider ref={sliderRef} {...sliderSettings}>
              {services.map((service) => {
                const isSelected = selectedService === service.id;
                return (
                  <div key={service.id} className="w-full">
                    <div className="flex justify-center items-center w-full">
                      <label
                        className={`flex flex-col items-start cursor-pointer group relative p-2 rounded-[8px] border border-white-neutral-light-300 w-[220px] h-[240px]
                    ${
                      isSelected
                        ? "bg-white-neutral-light-100 e0"
                        : "bg-white-neutral-light-200"
                    }
                      `}
                      >
                        {/* Custom Radio Button */}
                        <div
                          className={`h-5 w-5 flex items-center justify-center p-1 rounded-full border border-white-neutral-light-400 mb-3`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full
                        ${
                          isSelected
                            ? "bg-primary-light-400"
                            : "bg-white-neutral-light-100"
                        }
                        `}
                          />
                        </div>
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={isSelected}
                          onChange={() => handleServiceSelect(service.id)}
                          className="sr-only"
                        />
                        <div className="w-full h-full flex items-center justify-center">
                          {service.icon}
                        </div>
                        <span className="mt-3 text-center font-satoshi font-medium text-sm">
                          {service.title}
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </Slider>

            <MobileNavigation
              currentSlide={currentSlide}
              totalSlides={services.length}
              onPrevSlide={prevSlide}
              onNextSlide={nextSlide}
            />

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
        </div>
        <div className="fixed bottom-0 left-0 right-0 border-t border-white-neutral-light-300">
          <div className="w-full flex justify-center items-center gap-4 py-3">
            <button
              onClick={handleBack}
              className="cursor-pointer button-inner border border-white-neutral-light-300 flex items-center justify-start gap-2 px-6 py-3 text-white-neutral-light-900 hover:text-gray-800 transition-all duration-200 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 rounded-[10px] group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedService}
              className={`px-6 py-3.5 text-sm font-medium rounded-[10px] flex justify-center items-center gap-1 transition-all duration-200 transform shadow-lg hover:shadow-xl cursor-pointer" ${
                !selectedService
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform"
              }`}
            >
              Avançar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
