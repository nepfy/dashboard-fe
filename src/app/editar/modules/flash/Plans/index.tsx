import Checkbox from "#/components/icons/Checkbox";
import StarIcon from "./StarIcon";
import { formatCurrencyDisplayNoCents } from "#/helpers/formatCurrency";
import { PlansSection } from "#/types/template-data";

export default function FlashPlans({
  mainColor,
  hideSection,
  plansItems,
}: PlansSection) {
  let bg: string;
  if (mainColor === "#4F21A1") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #200D42 0.01%, #4F21A1 41.86%, #A46EDB 81.78%)`;
  }
  if (mainColor === "#BE8406") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #2B1B01 0.01%, #BE8406 41.86%, #CEA605 81.78%)`;
  }
  if (mainColor === "#9B3218") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #2B0707 0.01%, #9B3218 41.86%, #BE4E3F 81.78%)`;
  }
  if (mainColor === "#05722C") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #072B14 0.01%, #05722C 41.86%, #4ABE3F 81.78%)`;
  }
  if (mainColor === "#182E9B") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #070F2B 0.01%, #182E9B 41.86%, #443FBE 81.78%)`;
  }
  if (mainColor === "#212121") {
    bg = `radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #0D0D0D 0.01%, #212121 41.86%, #3A3A3A 81.78%)`;
  }
  return (
    <div className="bg-black relative overflow-hidden">
      {!hideSection && (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-41 pt-10 lg:pt-22 pb-23 xl:pb-36 relative z-10">
          <div className="flex flex-wrap gap-6">
            {plansItems?.map((plan) => (
              <div
                key={plan.id}
                className="w-full md:w-[310px] min-h-[600px] flex flex-col my-10 lg:my-0 relative"
              >
                {plan.recommended && (
                  <div
                    className="absolute top-[-44px] left-0 w-[145px] h-[37px] flex items-center justify-center rounded-[4px] gap-2"
                    style={{
                      background: bg,
                    }}
                  >
                    <StarIcon />
                    <p className="text-[#E6E6E6] text-[14px] font-semibold">
                      Melhor Oferta
                    </p>
                  </div>
                )}
                <div
                  className="rounded-[4px] p-6"
                  style={{
                    background: plan.recommended
                      ? "radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)"
                      : "#111111",
                  }}
                >
                  {!plan.hideTitleField && (
                    <p className="text-[#E6E6E6] text-[24px] font-bold">
                      {plan.title}
                    </p>
                  )}
                  {!plan.hideDescription && (
                    <p className="text-[#E6E6E6]/30 text-sm mb-4">
                      {plan.description}
                    </p>
                  )}
                  <div className="flex items-baseline gap-4">
                    {!plan.hidePrice && (
                      <p className="text-[#E6E6E6] text-[32px] font-medium">
                        {formatCurrencyDisplayNoCents(plan.value)}
                      </p>
                    )}
                    {!plan.hidePlanPeriod && (
                      <p className="text-[#E6E6E6]">/{plan.planPeriod}</p>
                    )}
                  </div>
                </div>

                <div className="flex-grow">
                  <p className="text-[#E6E6E6] text-[12px] font-semibold mb-4 uppercase px-6 mt-8">
                    Incluso:
                  </p>
                  {plan.includedItems?.map((includedItem) => (
                    <div
                      key={includedItem.id}
                      className="flex items-center gap-2 px-6 py-2"
                    >
                      <span className="w-4 h-4 flex items-start justify-center">
                        <Checkbox fill="rgba(230, 230, 230, 0.7)" />
                      </span>
                      {!includedItem.hideDescription && (
                        <p className="text-[#E6E6E6]/70 text-sm">
                          {includedItem.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {!plan.hideButtonTitle && (
                  <button
                    className={`w-full py-4 rounded-full mt-8 font-semibold ${
                      plan.recommended
                        ? "text-[#121212] bg-[#FBFBFB]"
                        : "text-[#FBFBFB] bg-[#121212]"
                    }`}
                  >
                    {plan.buttonTitle}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
