import { useState } from "react";

import {
  DigitalMarketingIcon,
  DesignerIcon,
  DeveloperIcon,
  ArchitectIcon,
  PhotographerIcon,
  ConsultingIcon,
} from "../icons";
import { Box } from "#/modules/ai-generator/components/box/Box";

interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: "agencias",
    title: "Agências",
    icon: <ConsultingIcon />,
  },
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
    id: "photography",
    title: "Fotógrafo",
    icon: <PhotographerIcon />,
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
    <section className="w-full min-h-full bg-white-neutral-light-200 flex items-center justify-center p-0 lg:p-4">
      <Box
        title="Serviços"
        description="Selecione a melhor opção que se encaixa no seu tipo de trabalho"
        handleBack={handleBack || (() => {})}
        handleNext={handleNext || (() => {})}
        disabled={!selectedService}
        data-testid="service-step"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {services.map((service) => {
            const isSelected = selectedService === service.id;

            return (
              <label
                key={service.id}
                data-testid={`service-card-${service.id}`}
                className={`w-full flex flex-col items-start cursor-pointer p-2 rounded-[8px]
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
                  data-testid={`service-radio-${service.id}`}
                  name="service"
                  value={service.id}
                  checked={isSelected}
                  onChange={() => handleServiceSelect(service.id)}
                  className="sr-only"
                />
                <div className="w-full rounded-xl flex flex-col items-start lg:items-center justify-center">
                  {service.icon}
                </div>
                <span className="mt-3 text-center font-satoshi font-medium text-sm">
                  {service.title}
                </span>
              </label>
            );
          })}
        </div>
      </Box>
    </section>
  );
}
