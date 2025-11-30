"use client";

import { useState } from "react";
import Image from "next/image";
import { InvestmentSection, PlansSection } from "#/types/template-data";
import EditablePlan from "#/app/editar/components/EditablePlan";
import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "../../../contexts/EditorContext";
import { formatCurrencyDisplay } from "#/helpers/formatCurrency";

interface MinimalPlansProps extends PlansSection {
  mainColor?: string;
  investment?: InvestmentSection;
}

export default function MinimalPlans({
  plansItems,
  hideSection,
  investment,
}: MinimalPlansProps) {
  const { activeEditingId, updateInvestment } = useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const canEdit = activeEditingId === null;

  if (hideSection || !plansItems || plansItems.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        .section_plans {
          background-color: #000000;
          color: #fbfbfb;
          padding: 8rem 0 10rem;
        }

        .invest-component {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .invest-heading {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 4rem;
          align-items: flex-start;
        }

        .invest-label {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .invest-label .label {
          text-transform: capitalize;
          font-size: 1rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.4;
        }

        .invest-label-description {
          font-size: 0.9375rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.6);
        }

        .invest-title {
          font-size: 2.75rem;
          font-weight: 400;
          line-height: 1.25;
          margin: 0;
          color: #fbfbfb;
        }

        .invest-grid {
          display: grid;
          gap: 1.5rem;
          width: 100%;
        }

        /* 3 planos: grid de 3 colunas */
        .invest-grid[data-plans="3"] {
          grid-template-columns: repeat(3, 1fr);
          max-width: 1200px;
          justify-items: center;
        }

        /* 2 planos: grid de 2 colunas */
        .invest-grid[data-plans="2"] {
          grid-template-columns: repeat(2, 1fr);
          max-width: 900px;
          margin: 0 auto;
          justify-items: center;
        }

        /* 1 plano: centralizado e menor */
        .invest-grid[data-plans="1"] {
          grid-template-columns: 1fr;
          max-width: 773px;
          margin: 0 auto;
          justify-items: start;
        }

        /* Max-width para cards baseado no número de planos */
        .invest-grid[data-plans="1"] .invest-card {
          max-width: 773px;
          width: 100%;
          background-color: transparent;
          border: 1px solid #006dc5;
        }

        .invest-grid[data-plans="2"] .invest-card {
          max-width: 511px;
          width: 100%;
          background-color: transparent;
        }

        .invest-grid[data-plans="3"] .invest-card {
          width: 100%;
          background-color: transparent;
        }

        .invest-card {
          background-color: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.5rem;
          padding: 2rem 1.75rem;
          display: flex;
          flex-direction: column;
          position: relative;
          height: 100%;
          transition: all 0.2s ease;
        }

        .invest-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
        }

        .invest-card.is-best {
          border-color: #0c8ae5;
          border-width: 1px;
          background-color: #0a0a0a;
        }

        .invest-card.is-best:hover {
          border-color: #0c8ae5;
        }

        .invest-top {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .plan-name {
          font-size: 1rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.4;
        }

        .plan-price {
          font-size: 2.5rem;
          font-weight: 500;
          color: #fbfbfb;
          line-height: 1;
          margin-bottom: 1rem;
        }

        .plan-price .period {
          font-size: 1rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.6);
          margin-left: 0.375rem;
        }

        .invest-button-wrap {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .plan-description {
          font-size: 0.9375rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 0.5rem;
        }

        .btn-animate-chars {
          color: #fbfbfb;
          cursor: pointer;
          border-radius: 0.375rem;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 1rem 2rem;
          line-height: 1;
          text-decoration: none;
          display: flex;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-animate-chars:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
        }

        .btn-animate-chars__bg {
          background-color: transparent;
          border-radius: 0.375rem;
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .btn-animate-chars__bg.is-best {
          background-color: #0c8ae5;
        }

        .btn-animate-chars.is-best {
          background-color: #0c8ae5;
          border-color: #0c8ae5;
        }

        .btn-animate-chars.is-best:hover {
          background-color: #0a7bd4;
          border-color: #0a7bd4;
        }

        .btn-animate-chars__text {
          white-space: nowrap;
          line-height: 1;
          z-index: 1;
          position: relative;
        }

        .max-width-small {
          width: 100%;
          max-width: 40ch;
        }

        .invest-best_wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 0.25rem;
        }

        .invest-best-tag {
          display: flex;
          gap: 0.375rem;
          align-items: center;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #fbfbfb;
        }

        .invest-divider {
          display: none;
        }

        .invest-incluse {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 1.5rem;
        }

        .text-style-allcaps {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #fbfbfb;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .invest-feature {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        /* Quando há apenas 1 plano, os itens devem ter duas colunas */
        .invest-grid[data-plans="1"] .invest-feature {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.875rem;
        }

        .invest-list {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          font-weight: 300;
          font-size: 0.9375rem;
          line-height: 1.5;
          color: #fbfbfb;
        }

        .invest-icon {
          width: 1rem;
          height: 1rem;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .invest-best-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        @media screen and (max-width: 1200px) {
          .invest-grid[data-plans="3"] {
            grid-template-columns: 1fr;
            max-width: 600px;
            margin: 0 auto;
          }
        }

        @media screen and (max-width: 991px) {
          .invest-heading {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .invest-title {
            font-size: 2.25rem;
          }

          .invest-grid[data-plans="2"] {
            grid-template-columns: 1fr;
            max-width: 100%;
          }
        }

        @media screen and (max-width: 767px) {
          .section_plans {
            padding: 5rem 0 6rem;
          }

          .invest-heading {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .invest-title {
            font-size: 2rem;
            line-height: 1.3;
          }

          .invest-grid[data-plans="3"],
          .invest-grid[data-plans="2"],
          .invest-grid[data-plans="1"] {
            grid-template-columns: 1fr;
            max-width: 100%;
          }

          .invest-card.is-best {
            order: -1;
          }

          .invest-card {
            padding: 2rem 1.5rem;
          }

          .plan-price {
            font-size: 2rem;
          }
        }
      `}</style>

      <section className="section_plans">
        <div className="padding-global">
          <div className="container-large">
            <div className="invest-component">
              <div className="flex w-full max-w-[1200px] items-start justify-between gap-4">
                <div className="invest-label max-w-[250px]">
                  <div className="label">Investimento</div>
                  <EditableText
                    value={
                      investment?.projectScope ||
                      "Invista no que realmente importa e potencialize seus resultados."
                    }
                    onChange={(value) =>
                      updateInvestment({ projectScope: value })
                    }
                    editingId="investment-projectScope"
                    className="invest-label-description"
                    canEdit={canEdit}
                  />
                </div>
                <EditableText
                  value={
                    investment?.title ||
                    "Escolha o plano que acompanha seu momento, organiza sua operação e impulsiona sua marca."
                  }
                  onChange={(value) => updateInvestment({ title: value })}
                  editingId="investment-title"
                  className="invest-title max-w-[650px]"
                  canEdit={canEdit}
                />
              </div>
              <div className="invest-grid" data-plans={plansItems.length}>
                {plansItems.map((plan) => (
                  <div
                    key={plan.id}
                    className={`invest-card ${plan.recommended ? "is-best" : ""} ${
                      openModalId === plan.id
                        ? "border-[#0170D6]"
                        : canEdit
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                    } ${plansItems.length === 1 ? "border-[#0c8ae5]" : ""}`}
                    onClick={() => {
                      if (canEdit || openModalId === plan.id) {
                        setOpenModalId(plan?.id ?? null);
                      }
                    }}
                  >
                    {plan.recommended && (
                      <div className="invest-best_wrap">
                        <div className="plan-name mb-4">{plan.title}</div>
                        <div className="invest-best-tag">
                          <Image
                            src="/template-minimal/images/star.svg"
                            alt=""
                            width={14}
                            height={14}
                            className="invest-best-icon"
                          />
                          <span>MELHOR OFERTA!</span>
                        </div>
                      </div>
                    )}

                    {!plan.recommended && (
                      <div className="plan-name mb-4">{plan.title}</div>
                    )}

                    <div className="invest-top mb-10">
                      <div className="plan-price">
                        {formatCurrencyDisplay(plan.value)}
                        {plan.planPeriod && (
                          <span className="period">/ {plan.planPeriod}</span>
                        )}
                      </div>
                    </div>

                    {plansItems.length > 1 && (
                      <div className="invest-button-wrap">
                        <div className="plan-description">
                          {plan.description}
                        </div>
                        <button
                          className={`btn-animate-chars ${plan.recommended ? "is-best" : ""}`}
                        >
                          <span className="btn-animate-chars__text">
                            {plan.buttonTitle || "Fechar pacote"}
                          </span>
                        </button>
                      </div>
                    )}

                    <div className="invest-divider"></div>

                    <div className="flex items-end gap-4 border-t border-[rgba(255,255,255,0.08)] pt-10">
                      <div className="invest-incluse flex flex-1 gap-4">
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
                      {plansItems.length === 1 && (
                        <button
                          className={`h-[40px] w-[190px] rounded-[4px] border border-[#0c8ae5] bg-[#0c8ae5] ${plan.recommended ? "is-best border border-[#0c8ae5] bg-[#0c8ae5]" : ""}`}
                        >
                          <span className="btn-animate-chars__text">
                            {plan.buttonTitle || "Fechar pacote"}
                          </span>
                        </button>
                      )}
                    </div>

                    <EditablePlan
                      plan={plan}
                      isModalOpen={openModalId === plan.id}
                      setIsModalOpen={(isOpen) =>
                        setOpenModalId(isOpen ? (plan?.id ?? null) : null)
                      }
                      editingId={`plans-${plan.id}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
