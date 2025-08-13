"use client";

import { useState } from "react";
import { TextAreaField } from "#/components/Inputs";
import { ArrowLeft, InfoIcon } from "lucide-react";

export function CompanyInfo({
  handleNext,
  handleBack,
  setCompanyInfo,
  companyInfo,
}: {
  handleNext: () => void;
  handleBack: () => void;
  setCompanyInfo: (info: string) => void;
  companyInfo: string;
}) {
  const [aboutCompany, setAboutCompany] = useState(companyInfo);

  return (
    <section className="flex flex-col min-h-[calc(100vh-140px)] bg-gray-50 justify-center items-start gap-10 font-satoshi">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 self-center w-full max-w-lg">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-purple-600 mb-2">
            Sobre você ou sua empresa
          </h1>

          <p className="text-neutral-800 leading-relaxed">
            Desde a área de atuação até o que te diferencia no mercado.
          </p>
        </div>

        <div className="space-y-6 py-4">
          <TextAreaField
            id="description"
            textareaName="description"
            placeholder="Quanto mais detalhes você der, mais personalizada fica a proposta!"
            rows={6}
            value={aboutCompany}
            onChange={(e) => setAboutCompany(e.target.value)}
          />
        </div>
        {/* Buttons */}
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
            onClick={() => {
              setCompanyInfo(aboutCompany);

              handleNext();
            }}
            disabled={!aboutCompany}
            className={`cursor-pointer py-3 px-8 font-medium rounded-lg transition-all duration-200 ${
              !aboutCompany
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            Avançar
          </button>
        </div>
      </div>
    </section>
  );
}
