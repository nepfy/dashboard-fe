import { useState } from "react";
import Checkbox from "#/components/icons/Checkbox";
import StarIcon from "../flash/Plans/StarIcon";
import { formatCurrencyDisplayNoCents } from "#/helpers/formatCurrency";
import { PlansSection } from "#/types/template-data";
import EditablePlan from "#/app/editar/components/EditablePlan";

export default function MinimalPlans({
  mainColor,
  hideSection,
  plansItems,
}: PlansSection) {
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  return (
    <section className="section_investment">
      {!hideSection && (
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="invest-component">
              <div className="invest-grid">
                {plansItems?.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative my-10 flex w-full cursor-pointer flex-col rounded-[4px] border border-transparent hover:border-[#0170D6] hover:bg-[#0170D666] lg:my-0 ${openModalId === plan.id ? "cursor-default border-[#0170D6] bg-[#0170D666]" : "cursor-pointer border-transparent bg-transparent"}`}
                    onClick={() => setOpenModalId(plan.id)}
                  >
                    {plan.recommended && (
                      <div className="absolute top-[-44px] left-0 flex h-[37px] w-[145px] items-center justify-center gap-2 rounded-[4px] bg-black">
                        <StarIcon />
                        <p className="text-[14px] font-semibold text-white">
                          Melhor Oferta
                        </p>
                      </div>
                    )}
                    <div className="flex flex-col items-start justify-between rounded-[4px] p-6 bg-white border border-gray-200">
                      <div>
                        {!plan.hideTitleField && (
                          <p className="text-[24px] font-bold text-[#121212]">
                            {plan.title}
                          </p>
                        )}
                        {!plan.hideDescription && (
                          <p className="mb-4 text-sm text-[#121212]">
                            {plan.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-baseline gap-4">
                        {!plan.hidePrice && (
                          <p className="text-[2.5rem] font-medium text-[#121212]">
                            {formatCurrencyDisplayNoCents(plan.value)}
                          </p>
                        )}
                        {!plan.hidePlanPeriod && (
                          <p className="text-[#121212]">{plan.planPeriod}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-10 mb-4">
                      {plan.includedItems?.map((includedItem) => (
                        <div
                          key={includedItem.id}
                          className="flex items-center gap-2 px-6 py-4"
                        >
                          <span className="flex h-4 w-4 items-start justify-center">
                            <Checkbox fill="rgba(18, 18, 18, 0.7)" />
                          </span>
                          {!includedItem.hideDescription && (
                            <p className="text-sm text-[#121212]/70">
                              {includedItem.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {!plan.hideButtonTitle && (
                      <button className="mt-8 w-full rounded-full py-4 font-semibold bg-[#121212] text-white">
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
          </div>
        </div>
      )}
    </section>
  );
}

