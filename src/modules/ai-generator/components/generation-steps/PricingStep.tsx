"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";

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
  const [showInfoModal, setShowInfoModal] = useState(false);

  const planOptions = [
    { id: 1, dots: 1 },
    { id: 2, dots: 2 },
    { id: 3, dots: 3 },
  ];

  const handleAdvance = () => {
    if (selectedPlan === 1) {
      setShowInfoModal(true);
    } else {
      handleNext();
    }
  };

  const renderDots = (count: number) => {
    return (
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="w-4 h-4 bg-white/30 rounded-full" />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Main Pricing Plans Modal */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-purple-600 mb-3">
            Planos e Investimento
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            A criação de análise do serviço e criação de pacotes ideais para
            vender mais e fechar com facilidade.
          </p>
        </div>

        {/* Question */}
        <div className="mb-6">
          <p className="text-gray-700 text-sm mb-4">
            Quantos planos você quer oferecer para seu cliente?
          </p>
        </div>

        {/* Plan Options */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {planOptions.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className={`
                relative h-20 rounded-xl transition-all duration-200
                bg-gradient-to-br from-purple-500 to-purple-700
                hover:from-purple-600 hover:to-purple-800
                ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-purple-400 ring-offset-2 scale-105"
                    : "hover:scale-105"
                }
              `}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {renderDots(plan.dots)}
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-200 w-full flex items-center gap-4 mt-8 pt-6">
          <button
            onClick={handleBack}
            className="cursor-pointer flex items-center justify-start gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:bg-gray-50 rounded-lg group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Voltar
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedPlan}
            className={`cursor-pointer py-3 px-8 font-medium rounded-lg transition-all duration-200 ${
              !selectedPlan
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            Avançar
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-auto">
            {/* Header */}
            <h3 className="text-lg font-semibold text-purple-600 mb-4 text-center">
              Ofereça mais planos para potencializar suas vendas
            </h3>

            {/* Icon Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 mb-4 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="text-sm text-gray-600 space-y-3 mb-6">
              <p>
                Ter mais de um plano disponível permite que você atenda
                diferentes perfis de clientes e aumente suas chances de fechar
                negócios.
              </p>
              <p>
                Além disso, oferecer opções torna fácil o cliente a escolher um
                pacote com mais benefícios, aumentando o valor final do
                contrato.
              </p>
              <p>
                Por isso,{" "}
                <span className="font-semibold">
                  recomendamos criar ao menos dois ou três planos
                </span>
                , com serviços e preços distintos, para que o cliente possa
                escolher o que melhor atende às suas necessidades.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
