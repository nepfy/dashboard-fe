import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Heart,
  Lightbulb,
  Monitor,
  Palette,
  Ruler,
} from "lucide-react";
import { useState } from "react";
import { StepPagination } from "../pagination";

interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: "marketing-digital",
    title: "Marketing digital",
    icon: <Lightbulb className="w-6 h-6" />,
  },
  {
    id: "designer",
    title: "Designer",
    icon: <Palette className="w-6 h-6" />,
  },
  {
    id: "desenvolvedor",
    title: "Desenvolvedor",
    icon: <Monitor className="w-6 h-6" />,
  },
  {
    id: "arquiteto",
    title: "Arquiteto",
    icon: <Ruler className="w-6 h-6" />,
  },
  {
    id: "fotografo",
    title: "Fotógrafo",
    icon: <Camera className="w-6 h-6" />,
  },
  {
    id: "medicos",
    title: "Médicos",
    icon: <Heart className="w-6 h-6" />,
  },
];

export function ServiceType({
  steps,
  services = DEFAULT_SERVICES,
  handleNextStep,
  handlePreviousStep,
  onServiceSelect,
  selectedService: externalSelectedService,
  currentStep,
}: {
  steps: string[];
  services?: Service[];
  currentStep?: string;
  onServiceSelect?: (serviceId: string) => void;
  selectedService?: string | null;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
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
      <div className="w-full">
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="mb-8 text-start">
            <h1 className="text-3xl font-semibold text-purple-600 mb-3">
              Serviços
            </h1>
            <p className="text-black text-lg leading-relaxed">
              Selecione a melhor opção que se encaixa no seu tipo de trabalho
            </p>
          </div>

          {/* Services Grid - 3 columns as shown in the image */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            {services.map((service) => (
              <div key={service.id} className="relative">
                {/* Service Card */}
                <button
                  onClick={() => handleServiceSelect(service.id)}
                  className={`w-full p-6 rounded-xl border transition-all duration-200 flex flex-col items-start gap-4 ${
                    selectedService === service.id
                      ? "border-purple-300 bg-purple-50 shadow-lg"
                      : "border-gray-200 bg-purple-50/50 hover:border-purple-200 hover:shadow-md"
                  }`}
                >
                  {/* Radio Button - positioned inside the card at top left */}
                  <div className="self-start">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedService === service.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selectedService === service.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {/* Icon with darker purple background */}
                  <div className="w-16 h-16 bg-purple-700 rounded-xl flex items-center justify-center shadow-md mx-auto">
                    <div className="text-white text-2xl">{service.icon}</div>
                  </div>

                  {/* Text label - left aligned */}
                  <span className="text-gray-700 font-medium text-start text-base w-full">
                    {service.title}
                  </span>
                </button>
              </div>
            ))}
          </div>

          <StepPagination
            steps={steps}
            currentStep={currentStep || "start"}
            handlePreviousStep={handlePreviousStep}
            handleNextStep={handleNextStep}
          />
        </div>
      </div>
    </section>
  );
}
