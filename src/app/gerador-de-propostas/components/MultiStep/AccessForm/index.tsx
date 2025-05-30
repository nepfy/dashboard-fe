"use client";

import { ArrowLeft } from "lucide-react";

import TitleDescription from "../../TitleDescription";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

export default function AccessForm() {
  const { prevStep, formData } = useProjectGenerator();

  const handleBack = () => {
    prevStep();
  };

  const handleFinish = () => {
    console.log("finalizar");
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="p-7">
        <TitleDescription
          title="Acesso:"
          description="Personalize e proteja sua proposta com segurança"
        />

        <div className="mt-6 space-y-4">
          <div>
            {formData.step16?.pageUrl}
            {formData.step16?.pagePassword}
            {formData.step16?.projectValidUntil?.toString()}
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex gap-2 p-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center gap-1 w-[110px] h-[44px] px-4 py-2 text-sm font-medium border rounded-[12px] border-white-neutral-light-300 cursor-pointer button-inner text-white-neutral-light-900 hover:bg-white-neutral-light-300"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <button
          type="button"
          className="w-full sm:w-[100px] h-[44px] px-4 py-2 text-sm font-medium border rounded-[12px] bg-primary-light-500 button-inner-inverse border-white-neutral-light-300 cursor-pointer text-white-neutral-light-100"
          onClick={handleFinish}
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}
