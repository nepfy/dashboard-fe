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
    enableNextStepUserName,
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
      case 5:
        enableNextStepUserName();
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
    enableNextStepUserName,
  ]);

  const isFinalStep = currentStep === steps.length;
  const primaryDisabled = isFinalStep ? !isLastOptionSelected : !enableNextStep;

  const handlePrimaryAction = () => {
    if (isFinalStep) {
      void onComplete?.();
      return;
    }
    nextStep();
  };

  return (
    <div className="flex w-full flex-col justify-start sm:h-[452px]">
      <div className="mb-8 box-border flex items-center justify-start space-x-2 sm:space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                currentStep === index + 1
                  ? "border-primary-light-500 text-primary-light-500 bg-primary-light-25 border"
                  : index + 1 < currentStep
                    ? "text-white-neutral-light-900 e0 cursor-pointer bg-white"
                    : "bg-white-neutral-light-200 text-white-neutral-light-500 border-white-neutral-light-400 border opacity-50"
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
            className="text-white-neutral-light-900 border-white-neutral-light-300 mr-2 flex h-[44px] items-center rounded-xs border bg-white px-4 font-medium hover:cursor-pointer"
          >
            <svg
              className="mr-2 h-[16px] w-[16px]"
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

        <button
          onClick={handlePrimaryAction}
          disabled={primaryDisabled}
          className={`h-[43px] w-full rounded-[var(--radius-s)] border text-center font-medium text-white transition-colors ${
            primaryDisabled
              ? "cursor-not-allowed bg-gray-300"
              : isFinalStep
                ? "bg-[var(--color-primary-light-400)] transition-colors hover:cursor-pointer hover:bg-[var(--color-primary-light-500)]"
                : "button-inner-inverse bg-[var(--color-primary-light-400)] hover:cursor-pointer hover:bg-[var(--color-primary-light-500)]"
          }`}
        >
          {isFinalStep ? "Finalizar cadastro" : "Próximo"}
        </button>
      </div>
    </div>
  );
};

export default MultiStep;
