import { Check } from "lucide-react";
import { formatCurrency } from "#/helpers";
import type { CompleteProjectData } from "#/app/project/types/project";

interface PlansSectionProps {
  data?: CompleteProjectData;
}

export default function PlansPreview({ data }: PlansSectionProps) {
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
      {!data?.hidePlansSection && data?.plans && data.plans.length > 0 && (
        <div className="w-full min-h-[700px] max-h-[1200px] flex items-start 2xl:items-center justify-center text-white p-6 bg-black overflow-y-scroll">
          <div className="grid gap-2 grid-cols-3">
            {sortedPlans?.map((plan) => (
              <div
                key={plan.id}
                className="border-[0.5px] border-[#A0A0A0] rounded-[18px] p-2 h-full flex flex-col justify-between relative overflow-hidden max-w-[265px]"
              >
                <div
                  className="py-2 px-3 rounded-[18px] flex flex-col justify-end"
                  style={{
                    background: plan.isBestOffer
                      ? `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, ${data?.mainColor} 104.22%, ${data?.mainColor} 64.9%, ${data?.mainColor} 81.78%)`
                      : "transparent",
                  }}
                >
                  <div className="h-10 w-full flex items-start justify-end">
                    {plan.isBestOffer && (
                      <p className="text-[#DFD5E1] font-bold bg-black rounded-[8px] px-2.5 py-1.5 text-[10px] w-[110px] flex items-center gap-2">
                        <span>
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 10 8"
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
                  </div>
                  <h2 className="text-[14px] font-bold text-[#DFD5E1] mb-2">
                    {plan.title}
                  </h2>
                  <p className="text-[#DFD5E1] text-[10px] mb-12 flex-grow">
                    {plan.description}
                  </p>

                  <div className="flex items-end">
                    <p className="text-[#DFD5E1] font-medium text-2xl">
                      {plan.price ? formatCurrency(plan.price) : ""}
                    </p>
                    <p className="text-[#DFD5E1] font-semibold text-[10px] mb-1">
                      /{pricePeriodConverter(plan?.pricePeriod || "")}
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[#DFD5E1] font-medium mb-4 text-[10px]">
                    Incluso
                  </p>
                  <ul className="mb-6 space-y-2">
                    {plan.planDetails.map((item, index) => (
                      <li
                        key={index}
                        className="text-[10px] text-[#DFD5E1] font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        {item.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="w-full px-6 font-medium rounded-full relative h-[44px] flex items-center justify-center"
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
                  <span className="relative z-10 text-[#DFD5E1] text-[10px]">
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
