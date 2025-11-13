"use client";

import { useState } from "react";
import { PlansSection } from "#/types/template-data";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "../../../contexts/EditorContext";

interface MinimalPlansProps extends PlansSection {
  mainColor?: string;
}

export default function MinimalPlans({
  plansItems,
  hideSection,
  mainColor = "#000000",
}: MinimalPlansProps) {
  const { activeEditingId } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const canEdit = activeEditingId === null;

  // Placeholder functions for plan editing
  const updatePlanItem = (planId: string, data: never) => {
    console.log('Update plan:', planId, data);
    // Will be implemented later
  };

  const reorderPlanItems = (items: never[]) => {
    console.log('Reorder plans:', items);
    // Will be implemented later
  };

  if (hideSection || !plansItems || plansItems.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        .section_plans {
          background-color: ${mainColor};
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
          color: rgba(255, 255, 255, .6);
        }
        
        .invest-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 75rem;
          margin: 0 auto;
        }
        
        .invest-card {
          background: rgba(255, 255, 255, .02);
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 1rem;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          transition: all .3s;
          position: relative;
        }
        
        .invest-card:hover {
          background: rgba(255, 255, 255, .05);
          border-color: rgba(255, 255, 255, .2);
        }
        
        .invest-card.recommended {
          background: rgba(79, 33, 161, .1);
          border-color: #4F21A1;
        }
        
        .invest-top {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
          gap: 1.5rem;
        }
        
        .plan-description {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, .7);
        }
        
        .btn-animate-chars {
          width: 100%;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, .05);
          border: 1px solid rgba(255, 255, 255, .2);
          border-radius: .5rem;
          color: #fbfbfb;
          font-size: 1rem;
          font-weight: 500;
          text-align: center;
          cursor: pointer;
          transition: all .3s;
        }
        
        .btn-animate-chars:hover {
          background: rgba(255, 255, 255, .1);
          border-color: rgba(255, 255, 255, .4);
        }
        
        .invest-card.recommended .btn-animate-chars {
          background: #4F21A1;
          border-color: #4F21A1;
        }
        
        .invest-card.recommended .btn-animate-chars:hover {
          background: #5e28b8;
          border-color: #5e28b8;
        }
        
        .invest-divider {
          height: 1px;
          background: rgba(255, 255, 255, .1);
        }
        
        .invest-incluse {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .text-style-allcaps {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, .5);
        }
        
        .invest-feature {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .invest-list {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .invest-icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }
        
        @media screen and (max-width: 767px) {
          .section_plans {
            padding: 5rem 0;
          }
          .plans-title {
            font-size: 2rem;
          }
          .invest-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="section_plans">
        <div className="padding-global">
          <div className="container-large">
            <div className="plans-heading">
              <h2 className="plans-title">
                Escolha o plano que acompanha seu momento, e torne sua operação em impulso real
              </h2>
              <p className="plans-subtitle">
                Você está escolhendo não apenas um produto, mas sim um parceiro.
              </p>
            </div>

            <div className="invest-grid">
              {plansItems.map((plan) => (
                <div
                  key={plan.id}
                  className={`invest-card ${plan.recommended ? 'recommended' : ''} ${
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
                    <div className="plan-name">{plan.title}</div>
                    <div className="plan-price">
                      R$ {plan.value?.toLocaleString() || '0'}
                      {plan.planPeriod && (
                        <span style={{ fontSize: '1rem', fontWeight: 400, marginLeft: '0.5rem' }}>
                          /{plan.planPeriod}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="invest-button-wrap">
                    <div className="plan-description">{plan.description}</div>
                    <button className="btn-animate-chars">
                      {plan.buttonTitle || 'Contratar Plano'}
                    </button>
                  </div>

                  <div className="invest-divider"></div>

                  <div className="invest-incluse">
                    <div className="text-style-allcaps">O que está incluso:</div>
                    <div className="invest-feature">
                      {plan.includedItems?.map((item) => (
                        <div key={item.id} className="invest-list">
                          <svg className="invest-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <div className="text-size-regular">{item.description}</div>
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
