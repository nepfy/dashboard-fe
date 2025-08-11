import { ArrowLeft, ArrowRight } from "lucide-react";

export function StepPagination({
  steps,
  currentStep,
  handlePreviousStep,
  handleNextStep,
}: {
  steps: string[];
  currentStep: string;
  handlePreviousStep: () => void;
  handleNextStep: () => void;
}) {
  return (
    <div className="flex justify-center items-center gap-3">
      <button
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        onClick={() => handlePreviousStep()}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Numbered pagination circles */}
      {[1, 2, 3, 4, 5, 6].map((pageNum) => {
        const isActive = steps[pageNum - 1] === currentStep;

        return (
          <div
            key={pageNum}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              isActive
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {pageNum}
          </div>
        );
      })}

      <button
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        onClick={() => handleNextStep()}
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
