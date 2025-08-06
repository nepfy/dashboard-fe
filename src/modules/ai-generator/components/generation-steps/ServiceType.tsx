import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
}

export function ServiceType({
  services,
  setCurrentStep,
  onServiceSelect,
  selectedService: externalSelectedService,
}: {
  services: Service[];
  setCurrentStep: (step: number) => void;
  onServiceSelect?: (serviceId: string) => void;
  selectedService?: string | null;
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
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-purple-600 text-start mb-2">
              Serviços
            </h1>
            <p className="text-black text-start leading-normal">
              Selecione a melhor opção que se encaixa no seu tipo de trabalho
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {services.map((service) => (
              <div key={service.id} className="relative">
                {/* Radio Button */}
                <div className="absolute -top-2 -left-2 z-10">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedService === service.id
                        ? "border-purple-600 bg-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedService === service.id && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Service Card */}
                <button
                  onClick={() => handleServiceSelect(service.id)}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 ${
                    selectedService === service.id
                      ? "border-gray-300 bg-white shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center">
                    <div className="text-white">{service.icon}</div>
                  </div>
                  <span className="text-black font-medium text-center text-sm">
                    {service.title}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 bg-white border border-gray-200 text-black rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              disabled={!selectedService}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedService
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Avançar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
