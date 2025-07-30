import { Check } from "lucide-react";
import { formatCurrency } from "#/helpers";
import type { CompleteProjectData } from "#/app/project/types/project";

interface PlansSectionProps {
  data?: CompleteProjectData;
}

export default function PlansSection({ data }: PlansSectionProps) {
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

  const handleEmailClick = () => {
    if (data?.companyEmail) {
      window.location.href = `mailto:${data.companyEmail}`;
    }
  };

  return (
    <div id="plans">
      {!data?.hidePlansSection && data?.plans && data.plans.length > 0 && (
        <div className="w-full h-full flex items-start 2xl:items-center justify-center p-3 bg-black mt-50 mb-40">
          <div className="flex flex-col lg:flex-row gap-4 py-20 min-h-[900px]">
            {sortedPlans?.map((plan) => (
              <div
                key={plan.id}
                className="border-[0.5px] p-2 border-[#A0A0A0]/30 rounded-[32px] flex flex-col justify-between relative overflow-hidden max-w-[455px] min-h-[600px] mt-4 lg:mt-0"
              >
                <div
                  className="flex flex-col justify-end min-h-[260px] rounded-[32px] p-7"
                  style={{
                    background: plan.isBestOffer
                      ? `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, ${data?.mainColor} 104.22%, ${data?.mainColor} 64.9%, ${data?.mainColor} 81.78%)`
                      : "transparent",
                  }}
                >
                  <div className="h-10 w-full flex items-start justify-end">
                    {plan.isBestOffer && (
                      <p className="text-[#DFD5E1] font-bold bg-black rounded-[8px] px-4 py-2 text-[14px] w-[144px] h-[37px] flex items-center gap-2">
                        <span>
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
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
                  <h2 className="text-[24px] font-bold text-[#DFD5E1] mb-2">
                    {plan.title}
                  </h2>
                  <p className="text-[15px] font-semibold text-[#DFD5E1] flex-grow mb-12">
                    {plan.description}
                  </p>

                  <div className="flex items-end">
                    <p className="text-[#DFD5E1] font-medium text-3xl xl:text-5xl">
                      {plan.price ? formatCurrency(plan.price) : ""}{" "}
                    </p>
                    <p className="text-[#DFD5E1] font-semibold text-[15px] pl-2">
                      {" "}
                      /{pricePeriodConverter(plan?.pricePeriod || "")}
                    </p>
                  </div>
                </div>
                <div className="px-8 xl:px-17 py-20">
                  <p className="text-[#DFD5E1] font-medium mb-4 text-[16px]">
                    Incluso
                  </p>
                  <ul className="mb-6 space-y-2">
                    {plan.planDetails.map((item, index) => (
                      <li
                        key={index}
                        className="text-[16px] text-[#DFD5E1] font-medium flex items-baseline gap-2"
                      >
                        <span className="w-3 h-2 flex items-start justify-center">
                          <Check size={14} />
                        </span>
                        {item.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="w-full px-6 font-medium rounded-full relative h-[42px] lg:h-[56px] flex items-center justify-center cursor-pointer"
                  style={{
                    background: plan.isBestOffer
                      ? `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, ${data?.mainColor} 104.22%, ${data?.mainColor} 64.9%, ${data?.mainColor} 81.78%)`
                      : `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, ${data?.mainColor} 104.22%, ${data?.mainColor} 64.9%, ${data?.mainColor} 81.78%)`,
                  }}
                  onClick={handleEmailClick}
                >
                  <div
                    className="absolute inset-[2px] rounded-full"
                    style={{
                      background: plan.isBestOffer ? "transparent" : "#000000",
                    }}
                  />
                  <span className="relative z-10 text-[#DFD5E1] text-[12px]">
                    {plan.ctaButtonTitle}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
