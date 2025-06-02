interface StepProgressIndicatorProps {
  currentStep: number;
}

export default function StepProgressIndicator({
  currentStep,
}: StepProgressIndicatorProps) {
  const progressPercentage = (currentStep / 16) * 100;

  return (
    <div className="w-full">
      <div
        className="w-full h-[20px] border border-white-neutral-light-300 bg-white-neutral-light-200 rounded-full overflow-hidden p-0.5"
        style={{
          backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(0,0,0, 0.0) 0px,
                  rgba(0,0,0, 0.2) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
        }}
      >
        <div
          className="h-full bg-primary-light-300 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
