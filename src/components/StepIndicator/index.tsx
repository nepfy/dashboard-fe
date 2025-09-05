export function StepIndicator({
  activeStep,
  onStepClick,
}: {
  activeStep: number;
  onStepClick: (step: number) => void;
}) {
  const steps = [
    {
      label: "Iniciar Proposta",
      step: 1,
    },
    {
      label: "Escolher Modelo",
      step: 2,
    },
    {
      label: "Configurar",
      step: 3,
    },
  ];

  const isActive = (step: number) => activeStep === step;

  return (
    <div className="flex items-center justify-center gap-16">
      <div className="flex items-center gap-16">
        {steps.map((step, index) => (
          <div
            role="button"
            tabIndex={index}
            key={step.step}
            onClick={() => onStepClick(step.step)}
            className="flex items-center gap-4 min-w-[160px] justify-center hover:cursor-pointer"
          >
            <div
              className={`w-10 h-10 flex-shrink-0 ${
                isActive(step.step)
                  ? "bg-primary-light-500 text-white"
                  : "bg-gray-300 text-gray-500"
              } rounded-full flex items-center justify-center text-base font-medium transition-all duration-200`}
            >
              {step.step}
            </div>
            <span
              className={`text-left text-base font-medium ${
                isActive(step.step) ? "text-gray-900" : "text-gray-500"
              }`}
              style={{ lineHeight: "1.1" }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
