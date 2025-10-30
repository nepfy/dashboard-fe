import { useState } from "react";
import Checkbox from "#/components/icons/Checkbox";
import StarIcon from "./StarIcon";
import { formatCurrencyDisplayNoCents } from "#/helpers/formatCurrency";
import { PlansSection } from "#/types/template-data";
import EditablePlan from "#/app/editar/components/EditablePlan";

export default function FlashPlans({
  mainColor,
  hideSection,
  plansItems,
}: PlansSection) {
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  let bg: string;
  let planBg: string;
  if (mainColor === "#4F21A1") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #200D42 0.01%, #4F21A1 41.86%, #A46EDB 81.78%)`;
    planBg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`;
  }
  if (mainColor === "#BE8406") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #2B1B01 0.01%, #BE8406 41.86%, #CEA605 81.78%)`;
    planBg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B1B01 34.22%, #BE8406 64.9%, #CEA605 81.78%)`;
  }
  if (mainColor === "#9B3218") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #2B0707 0.01%, #9B3218 41.86%, #BE4E3F 81.78%)`;
    planBg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B0707 34.22%, #9B3218 64.9%, #BE4E3F 81.78%)`;
  }
  if (mainColor === "#05722C") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #072B14 0.01%, #05722C 41.86%, #4ABE3F 81.78%)`;
    planBg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #072B14 34.22%, #05722C 64.9%, #4ABE3F 81.78%)`;
  }
  if (mainColor === "#182E9B") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #070F2B 0.01%, #182E9B 41.86%, #443FBE 81.78%)`;
    planBg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #070F2B 34.22%, #182E9B 64.9%, #443FBE 81.78%)`;
  }
  if (mainColor === "#212121") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #0D0D0D 0.01%, #212121 41.86%, #3A3A3A 81.78%)`;
    planBg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #0D0D0D 34.22%, #212121 64.9%, #3A3A3A 81.78%)`;
  }
  return (
    <div className="relative overflow-hidden bg-black">
      {!hideSection && (
        <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-10 pb-23 lg:px-41 lg:pt-22 xl:pb-36">
          <div
            className={`flex flex-wrap justify-center gap-6 ${plansItems && plansItems.length === 2 ? "lg:justify-start" : "lg:justify-between"}`}
          >
            {plansItems?.map((plan) => (
              <div
                key={plan.id}
                className={`relative my-10 flex min-h-[600px] w-full cursor-pointer flex-col rounded-[4px] border border-transparent hover:border-[#0170D6] hover:bg-[#0170D666] md:w-[310px] lg:my-0 lg:w-[350px] ${openModalId === plan.id ? "cursor-default border-[#0170D6] bg-[#0170D666]" : "cursor-pointer border-transparent bg-transparent"}`}
                onClick={() => setOpenModalId(plan.id)}
              >
                {plan.recommended && (
                  <div
                    className="absolute top-[-44px] left-0 flex h-[37px] w-[145px] items-center justify-center gap-2 rounded-[4px]"
                    style={{
                      background: bg,
                    }}
                  >
                    <StarIcon />
                    <p className="text-[14px] font-semibold text-[#E6E6E6]">
                      Melhor Oferta
                    </p>
                  </div>
                )}
                <div
                  className="flex h-[210px] flex-col items-start justify-between rounded-[4px] p-6"
                  style={{
                    background: plan.recommended ? planBg : "#111111",
                  }}
                >
                  <div>
                    {!plan.hideTitleField && (
                      <p className="text-[24px] font-bold text-[#E6E6E6]">
                        {plan.title}
                      </p>
                    )}
                    {!plan.hideDescription && (
                      <p className="mb-4 text-sm text-[#E6E6E6]/30">
                        {plan.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-baseline gap-4">
                    {!plan.hidePrice && (
                      <p className="text-[32px] font-medium text-[#E6E6E6]">
                        {formatCurrencyDisplayNoCents(plan.value)}
                      </p>
                    )}
                    {!plan.hidePlanPeriod && (
                      <p className="text-[#E6E6E6]">/{plan.planPeriod}</p>
                    )}
                  </div>
                </div>

                <div className="flex-grow">
                  <p className="mt-8 mb-4 px-6 text-[12px] font-semibold text-[#E6E6E6] uppercase">
                    Incluso:
                  </p>
                  {plan.includedItems?.map((includedItem) => (
                    <div
                      key={includedItem.id}
                      className="flex items-center gap-2 px-6 py-2"
                    >
                      <span className="flex h-4 w-4 items-start justify-center">
                        <Checkbox fill="rgba(230, 230, 230, 0.7)" />
                      </span>
                      {!includedItem.hideDescription && (
                        <p className="text-sm text-[#E6E6E6]/70">
                          {includedItem.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {!plan.hideButtonTitle && (
                  <button
                    className={`mt-8 w-full rounded-full py-4 font-semibold ${
                      plan.recommended
                        ? "bg-[#FBFBFB] text-[#121212]"
                        : "bg-[#121212] text-[#FBFBFB]"
                    }`}
                  >
                    {plan.buttonTitle}
                  </button>
                )}
                <EditablePlan
                  plan={plan}
                  isModalOpen={openModalId === plan.id}
                  setIsModalOpen={(isOpen) =>
                    setOpenModalId(isOpen ? (plan.id ?? null) : null)
                  }
                />

                <div
                  className={`absolute top-0 left-0 z-10 h-full w-full rounded-[4px] hover:bg-[#0170D666] ${openModalId === plan.id ? "bg-[#0170D666]" : "bg-transparent"}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
