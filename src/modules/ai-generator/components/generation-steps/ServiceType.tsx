import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Service {
  id: string;
  title: string;
  imageSrc: string;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: "marketing-digital",
    title: "Marketing digital",
    imageSrc: "/images/ai-generator/services/marketing-digital.png",
  },
  {
    id: "designer",
    title: "Designer",
    imageSrc: "/images/ai-generator/services/designer.png",
  },
  {
    id: "desenvolvedor",
    title: "Desenvolvedor",
    imageSrc: "/images/ai-generator/services/developer.png",
  },
  {
    id: "arquiteto",
    title: "Arquiteto",
    imageSrc: "/images/ai-generator/services/architect.png",
  },
  {
    id: "fotografo",
    title: "Fotógrafo",
    imageSrc: "/images/ai-generator/services/photographer.png",
  },
  {
    id: "medicos",
    title: "Médico",
    imageSrc: "/images/ai-generator/services/doctor.png",
  },
];

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

  // Use external selected service if provided, otherwise use internal state
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

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_32px_0_rgba(108,79,249,0.12)] p-0 border border-white/20">
        {/* Header */}
        <div className="px-8 pt-8 pb-2 text-start">
          <h1 className="text-2xl font-semibold text-[#6C4FF9] mb-2 font-satoshi">
            Serviços
          </h1>
          <p className="text-[#23232C] text-sm leading-relaxed font-satoshi opacity-80">
            Selecione a melhor opção que se encaixa no seu tipo de trabalho
          </p>
        </div>

        {/* Services Grid - 3 columns */}
        <div className="grid grid-cols-3 gap-10 p-8">
          {services.map((service) => {
            const isSelected = selectedService === service.id;

            return (
              <label
                key={service.id}
                className={`flex flex-col items-start w-full cursor-pointer group relative`}
              >
                <div className="flex justify-start w-full absolute -top-8 -left-3 z-10 pointer-events-none">
                  <div className="flex justify-start w-full absolute top-3 left-3 z-10 pointer-events-none">
                    <span
                      className={`block w-4 h-4 rounded-full border-2 transition-all duration-200
                      ${
                        isSelected
                          ? "border-[#6C4FF9] bg-white"
                          : "border-[#C9C9D9] bg-white"
                      }
                    `}
                    >
                      {isSelected && (
                        <span className="block w-2 h-2 m-auto mt-[2px] rounded-full bg-[#6C4FF9]" />
                      )}
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="service"
                  value={service.id}
                  checked={isSelected}
                  onChange={() => handleServiceSelect(service.id)}
                  className="sr-only"
                />
                <div
                  className={`w-full aspect-[1.3/1] rounded-xl flex flex-col items-center justify-center transition-all duration-200 relative
                    ${
                      isSelected
                        ? "shadow-[0_2px_12px_0_rgba(108,79,249,0.12)]"
                        : " hover:border-[#B7AFFF] shadow-[0_2px_12px_0_rgba(108,79,249,0.08)]"
                    }
                  `}
                >
                  <Image
                    src={service.imageSrc}
                    alt={service.title}
                    width={100}
                    height={100}
                    className="object-contain w-full"
                    style={
                      isSelected
                        ? {
                            filter:
                              "drop-shadow(0 1px 3px rgba(108,79,249,0.3))",
                          }
                        : {}
                    }
                  />
                </div>
                <span
                  className={`mt-1 text-center text-sm font-satoshi transition-all duration-200 ${
                    isSelected
                      ? "text-[#6C4FF9] font-medium"
                      : "text-0 font-normal"
                  }`}
                >
                  {service.title}
                </span>
              </label>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="border-t border-gray-200 mx-4">
          <div className="w-full flex items-center gap-4 py-4">
            <button
              onClick={handleBack}
              className="cursor-pointer flex items-center justify-start gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:bg-gray-50 rounded-lg group"
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
              className={`py-3 px-8 font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                !selectedService
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
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
