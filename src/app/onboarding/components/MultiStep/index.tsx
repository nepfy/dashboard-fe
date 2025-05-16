import { useEffect } from "react";
import { useFormContext } from "#/app/onboarding/helpers/FormContext";

interface Step {
  name: string;
  content: React.ReactNode;
}

interface MultiStepProps {
  steps: Step[];
  currentStep: number;
  onChange: (step: number) => void;
  isLastOptionSelected?: boolean;
  onComplete?: () => Promise<void>;
}

const MultiStep: React.FC<MultiStepProps> = ({
  steps,
  currentStep,
  onChange,
  isLastOptionSelected,
  onComplete,
}) => {
  const {
    nextStep,
    prevStep,
    enableNextStep,
    enableNextStepPersonalInfo,
    enableNextStepJobType,
    enableNextStepDiscoverySource,
    enableNextStepUsedBefore,
    formData,
  } = useFormContext();

  useEffect(() => {
    switch (currentStep) {
      case 1:
        enableNextStepPersonalInfo();
        break;
      case 2:
        enableNextStepJobType();
        break;
      case 3:
        enableNextStepDiscoverySource();
        break;
      case 4:
        enableNextStepUsedBefore();
        break;
      default:
        break;
    }
  }, [
    currentStep,
    formData,
    enableNextStepPersonalInfo,
    enableNextStepJobType,
    enableNextStepDiscoverySource,
    enableNextStepUsedBefore,
  ]);

  return (
    <div className="w-full flex flex-col justify-start sm:h-[452px]">
      <div className="flex items-center justify-start mb-8 space-x-2 sm:space-x-4 box-border">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold 
                ${
                  currentStep === index + 1
                    ? "border border-primary-light-500 text-primary-light-500 bg-primary-light-25"
                    : index + 1 < currentStep
                    ? "bg-white text-white-neutral-light-900 cursor-pointer e0"
                    : "bg-white-neutral-light-200 text-white-neutral-light-500 border border-white-neutral-light-400 opacity-50"
                }`}
              onClick={() => {
                if (index + 1 <= currentStep) {
                  onChange(index + 1);
                }
              }}
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
            className="h-[44px] px-4 flex items-center text-white-neutral-light-900 bg-white border border-white-neutral-light-300 rounded-xs mr-2 font-medium hover:cursor-pointer"
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

        {!isLastOptionSelected && currentStep < steps.length ? (
          <button
            onClick={nextStep}
            disabled={!enableNextStep}
            className={` w-full text-white rounded-[var(--radius-s)] font-medium transition-colors text-center border h-[43px] ${
              enableNextStep
                ? "bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] hover:cursor-pointer button-inner-inverse"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Avançar
          </button>
        ) : (
          <button
            onClick={onComplete}
            disabled={!isLastOptionSelected}
            className={`w-full text-white rounded-[var(--radius-s)] font-medium transition-colors text-center border h-[43px]
            ${
              isLastOptionSelected
                ? "bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] transition-colors hover:cursor-pointer"
                : " bg-gray-300 cursor-not-allowed"
            }
              `}
          >
            Finalizar cadastro
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStep;
