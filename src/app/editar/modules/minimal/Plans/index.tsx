"use client";

import { useState } from "react";
import Image from "next/image";
import { PlansSection } from "#/types/template-data";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "../../../contexts/EditorContext";
import { formatCurrencyDisplay } from "#/helpers/formatCurrency";

interface MinimalPlansProps extends PlansSection {
  mainColor?: string;
}

export default function MinimalPlans({
  plansItems,
  hideSection,
}: MinimalPlansProps) {
  const { activeEditingId } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const canEdit = activeEditingId === null;

  // Placeholder functions for plan editing
  const updatePlanItem = (planId: string, data: never) => {
    console.log("Update plan:", planId, data);
    // Will be implemented later
  };

  const reorderPlanItems = (items: never[]) => {
    console.log("Reorder plans:", items);
    // Will be implemented later
  };

  if (hideSection || !plansItems || plansItems.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        .section_plans {
          background-color: #000000;
          color: #fbfbfb;
          padding: 8rem 0;
        }

        .plans-heading {
          text-align: center;
          margin-bottom: 4rem;
        }

        .plans-title {
          font-size: 3rem;
          font-weight: 300;
          line-height: 1.3;
          margin: 0 0 1rem;
          color: #fbfbfb;
        }

        .plans-subtitle {
          font-size: 1.25rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.6);
        }

        .invest-grid {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          align-items: flex-start;
        }

        .invest-card {
          background-color: #040404;
          border: 1px solid #333030;
          border-radius: 4px;
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
        }

        .invest-card.is-best {
          border-color: #0c8ae5;
        }

        .invest-top {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          margin-bottom: 2rem;
        }

        .plan-name {
          font-size: 1.125rem;
          font-weight: 500;
          color: #fbfbfb;
        }

        .plan-price {
          font-size: 3rem;
          font-weight: 600;
          color: #fbfbfb;
          line-height: 1;
        }

        .invest-button-wrap {
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
        }

        .plan-description {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
        }

        .btn-animate-chars {
          color: #fbfbfb;
          cursor: pointer;
          border-radius: 0.5rem;
          flex-grow: 1;
          justify-content: center;
          align-items: center;
          max-width: none;
          padding: 1.2rem 2rem;
          line-height: 1;
          text-decoration: none;
          display: flex;
          position: relative;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 500;
        }

        .btn-animate-chars__bg {
          background-color: #202020;
          border-radius: 0.25rem;
          position: absolute;
          inset: 0;
        }

        .btn-animate-chars__bg.is-best {
          background-color: #006dc5;
        }

        .btn-animate-chars__text {
          white-space: nowrap;
          line-height: 1.3;
          z-index: 1;
          position: relative;
        }

        .max-width-small {
          width: 100%;
          max-width: 40ch;
        }

        .invest-best_wrap {
          display: flex;
          flex-flow: wrap;
          gap: 1rem;
          justify-content: space-between;
          align-items: center;
        }

        .invest-best-tag {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-start;
          align-items: center;
        }

        .invest-divider {
          background-color: #fbfbfb;
          opacity: 0.1;
          width: 100%;
          height: 1px;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .invest-incluse {
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
        }

        .text-style-allcaps {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255);
        }

        .invest-feature {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .invest-list {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 300;
        }

        .invest-icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
        }

        @media screen and (max-width: 767px) {
          .section_plans {
            padding: 5rem 0;
          }
          .plans-title {
            font-size: 2rem;
          }
          .invest-grid {
            flex-direction: column;
            justify-content: space-between;
            align-items: stretch;
          }

          .invest-card.is-best {
            order: -1;
          }
        }
      `}</style>

      <section className="section_plans">
        <div className="padding-global">
          <div className="container-large">
            <div className="invest-grid">
              {plansItems.map((plan) => (
                <div
                  key={plan.id}
                  className={`invest-card ${plan.recommended ? "is-best" : ""} ${
                    openModalId === plan.id
                      ? "border-[#0170D6]"
                      : canEdit
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (canEdit || openModalId === plan.id) {
                      setOpenModalId(plan?.id ?? null);
                    }
                  }}
                >
                  <div className="invest-top">
                    {plan.recommended ? (
                      <div className="invest-best_wrap">
                        <div className="plan-name">{plan.title}</div>
                        <div className="invest-best-tag">
                          <Image
                            src="/template-minimal/images/star.svg"
                            alt=""
                            width={16}
                            height={16}
                            className="invest-icon"
                          />
                          <div>Melhor oferta!</div>
                        </div>
                      </div>
                    ) : (
                      <div className="plan-name">{plan.title}</div>
                    )}
                    <div className="plan-price">
                      {formatCurrencyDisplay(plan.value)}
                      {plan.planPeriod && (
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: 400,
                            marginLeft: "0.5rem",
                          }}
                        >
                          /{plan.planPeriod}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="invest-button-wrap">
                    <div className="max-width-small">
                      <div className="plan-description">{plan.description}</div>
                    </div>
                    <button className="btn-animate-chars is-invest">
                      <div
                        className={`btn-animate-chars__bg ${plan.recommended ? "is-best" : ""}`}
                      ></div>
                      <span className="btn-animate-chars__text text-size-regular text-weight-medium">
                        {plan.buttonTitle || "Contratar Plano"}
                      </span>
                    </button>
                  </div>

                  <div className="invest-divider"></div>

                  <div className="invest-incluse">
                    <div className="text-style-allcaps text-[0.875rem]">
                      O que está incluso:
                    </div>
                    <div className="invest-feature">
                      {plan.includedItems?.map((item) => (
                        <div key={item.id} className="invest-list">
                          <svg
                            className="invest-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="text-size-regular text-[1rem]">
                            {item.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <EditableImage
                    isModalOpen={openModalId === plan.id}
                    setIsModalOpen={(isOpen) =>
                      setOpenModalId(isOpen ? (plan?.id ?? null) : null)
                    }
                    editingId={`plans-${plan.id}`}
                    // @ts-expect-error - Type mismatch for plans
                    itemType="plans"
                    items={plansItems || []}
                    currentItemId={plan?.id ?? null}
                    // @ts-expect-error - Type mismatch
                    onUpdateItem={updatePlanItem}
                    // @ts-expect-error - Type mismatch
                    onReorderItems={reorderPlanItems}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
