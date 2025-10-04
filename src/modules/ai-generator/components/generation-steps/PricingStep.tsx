"use client";

import { useState } from "react";
import DotsOneIcon from "../icons/DotsOneIcon";
import DotsTwoIcon from "../icons/DotsTwoIcon";
import DotsThreeIcon from "../icons/DotsThreeIcon";
import DotsOneMobileIcon from "../icons/DotsOneMobileIcon";
import DotsTwoMobileIcon from "../icons/DotsTwoMobileIcon";
import DotsThreeMobileIcon from "../icons/DotsThreeMobileIcon";
import { Box } from "#/modules/ai-generator/components/box/Box";
import { Label } from "#/components/Label";
import { PricingModal } from "#/modules/ai-generator/components/modal/PricingModal";

export function PricingStep({
  handleBack,
  handleNext,
  handlePlanSelect,
  selectedPlan,
}: {
  handleBack: () => void;
  handleNext: () => void;
  handlePlanSelect: (planId: number) => void;
  selectedPlan: number;
}) {
  const planOptions = [
    {
      id: 1,
      dots: 1,
      desktopIcon: <DotsOneIcon />,
      mobileIcon: <DotsOneMobileIcon />,
    },
    {
      id: 2,
      dots: 2,
      desktopIcon: <DotsTwoIcon />,
      mobileIcon: <DotsTwoMobileIcon />,
    },
    {
      id: 3,
      dots: 3,
      desktopIcon: <DotsThreeIcon />,
      mobileIcon: <DotsThreeMobileIcon />,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
      {/* Main Pricing Plans Modal */}
      <Box
        title="Planos e Investimento"
        description="A nossa IA analisa seu serviço e cria os pacotes ideais pra vender mais e fechar com facilidade."
        handleBack={handleBack}
        handleNext={handleNext}
        disabled={!selectedPlan}
      >
        <div className="mb-6 mt-6">
          <Label info onClick={() => setIsModalOpen(true)}>
            Quantos planos você quer oferecer para seu cliente?
          </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {planOptions.map((plan) => (
            <label
              key={plan.id}
              className={`flex flex-col items-start w-full cursor-pointer group relative p-2 rounded-[8px]
                    ${
                      selectedPlan === plan.id
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
                          selectedPlan === plan.id
                            ? "bg-primary-light-400"
                            : "bg-white-neutral-light-100"
                        }
                        `}
                />
              </div>
              <input
                type="radio"
                name="service"
                value={plan.id}
                checked={selectedPlan === plan.id}
                onChange={() => handlePlanSelect(plan.id)}
                className="sr-only"
              />
              <div className="w-full h-[175px] rounded-xl flex flex-col items-start lg:items-center justify-center">
                <div className="hidden w-full lg:block">{plan.desktopIcon}</div>
                <div className="w-full flex justify-center items-center lg:hidden">
                  {plan.mobileIcon}
                </div>
              </div>
            </label>
          ))}
        </div>
      </Box>

      <PricingModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
