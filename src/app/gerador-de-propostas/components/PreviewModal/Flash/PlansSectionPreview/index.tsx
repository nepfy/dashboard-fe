import { Check } from "lucide-react";
import { formatCurrency } from "#/helpers";
import type { CompleteProjectData } from "#/app/project/types/project";

interface PlansSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function PlansSectionPreview({
  data,
}: PlansSectionPreviewProps) {
  const sortedPlans = data?.plans?.sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });

  const pricePeriodConverter = (pricePeriod: string) => {
    if (pricePeriod === "monthly") {
      return "Mensal";
    }
    if (pricePeriod === "yearly") {
      return "Anual";
    }
    if (pricePeriod === "one-time") {
      return "Único";
    }
  };

  return (
    <>
      {!data?.hidePlansSection && sortedPlans && sortedPlans.length > 0 && (
        <div className="w-full text-white py-40 px-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sortedPlans.map((plan) => (
              <div
                key={plan.id}
                className="border border-[#A0A0A0] rounded-[18px] p-3 h-full flex flex-col justify-between relative overflow-hidden"
              >
                <div
                  className="py-4 px-5 rounded-[18px] flex flex-col"
                  style={{
                    background: plan.isBestOffer
                      ? `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, ${data?.mainColor} 104.22%, ${data?.mainColor} 64.9%, ${data?.mainColor} 81.78%)`
                      : "transparent",
                  }}
                >
                  {plan.isBestOffer && (
                    <p className="text-[#DFD5E1] font-bold bg-black rounded-xs px-4 py-2 text-xs w-[144px] self-end flex items-center gap-2 mb-4 md:mb-0">
                      <span>
                        <svg
                          width="10"
                          height="9"
                          viewBox="0 0 10 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.56132 0.302089C4.75098 -0.0446829 5.24902 -0.0446824 5.43868 0.30209L6.6975 2.60375C6.74338 2.68764 6.81236 2.75662 6.89625 2.8025L9.19791 4.06132C9.54468 4.25098 9.54468 4.74902 9.19791 4.93868L6.89625 6.1975C6.81236 6.24338 6.74338 6.31236 6.6975 6.39625L5.43868 8.69791C5.24902 9.04468 4.75098 9.04468 4.56132 8.69791L3.3025 6.39625C3.25662 6.31236 3.18764 6.24338 3.10375 6.1975L0.802089 4.93868C0.455317 4.74902 0.455318 4.25098 0.80209 4.06132L3.10375 2.8025C3.18764 2.75662 3.25662 2.68764 3.3025 2.60375L4.56132 0.302089Z"
                            fill="#DFD5E1"
                          />
                        </svg>
                      </span>
                      Melhor oferta
                    </p>
                  )}
                  <h2 className="text-2xl font-bold text-[#DFD5E1] mb-2">
                    {plan.title}
                  </h2>
                  <p className="text-[#DFD5E1] mb-12 flex-grow">
                    {plan.description}
                  </p>

                  <div className="flex items-end">
                    <p className="text-[#DFD5E1] font-medium text-2xl md:text-4xl mb-1">
                      {plan.price ? formatCurrency(plan.price) : ""}
                    </p>
                    <p className="text-[#DFD5E1] font-semibold">
                      /{pricePeriodConverter(plan?.pricePeriod || "")}
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[#DFD5E1] font-medium mb-4">Incluso</p>
                  <ul className="mb-6 space-y-2">
                    {plan.planDetails.map((item, index) => (
                      <li
                        key={index}
                        className="text-sm text-[#DFD5E1] font-medium flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        {item.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="w-full py-3 px-6 font-medium rounded-full relative h-[56px]"
                  style={{
                    background: plan.isBestOffer
                      ? `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, ${data?.mainColor} 104.22%, ${data?.mainColor} 64.9%, ${data?.mainColor} 81.78%)`
                      : `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, ${data?.mainColor} 104.22%, ${data?.mainColor} 64.9%, ${data?.mainColor} 81.78%)`,
                  }}
                >
                  <div
                    className="absolute inset-[2px] rounded-full"
                    style={{
                      background: plan.isBestOffer ? "transparent" : "#000000",
                    }}
                  />
                  <span className="relative z-10 text-[#DFD5E1]">
                    {plan.ctaButtonTitle}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
