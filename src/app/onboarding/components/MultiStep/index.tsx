// MultiStep/index.tsx
import React from "react";
import { useFormContext } from "#/app/onboarding/helpers/FormContext";

interface Step {
  name: string;
  content: React.ReactNode;
}

interface MultiStepProps {
  steps: Step[];
  currentStep: number;
  onChange: (step: number) => void;
}

const MultiStep: React.FC<MultiStepProps> = ({
  steps,
  currentStep,
  onChange,
}) => {
  const { nextStep, prevStep } = useFormContext();

  return (
    <div className="w-full flex flex-col justify-start h-[452px]">
      {/* Step indicators */}
      <div className="flex items-center justify-start mb-8 space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium cursor-pointer
              ${
                currentStep === index + 1
                  ? "bg-indigo-500 text-white"
                  : index + 1 < currentStep
                  ? "bg-white text-gray-500 border border-gray-200"
                  : "bg-white text-gray-500 border border-gray-200"
              }`}
              onClick={() => onChange(index + 1)}
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">{steps[currentStep - 1]?.content}</div>

      <div className="flex justify-between">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="flex items-center px-4 py-2 text-white-neutral-light-900 bg-white border border-white-neutral-light-300 rounded-xs mr-2 h-[44px] font-medium hover:cursor-pointer"
          >
            <svg
              className="w-[16px] h-[16px] mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Voltar
          </button>
        )}

        {currentStep < steps.length && (
          <button
            onClick={nextStep}
            className="w-full py-3 px-4 bg-[var(--color-primary-light-400)] text-white rounded-[var(--radius-s)] font-medium hover:bg-[var(--color-primary-light-500)] transition-colors h-[44px] hover:cursor-pointer"
          >
            Avançar
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStep;
