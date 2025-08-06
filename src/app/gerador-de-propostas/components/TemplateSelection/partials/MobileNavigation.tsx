import { ChevronLeft, ChevronRight } from "lucide-react";

export const MobileNavigation = ({
  currentSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onGoToSlide,
}: {
  currentSlide: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onGoToSlide: (index: number) => void;
}) => (
  <div className="flex flex-col items-center mt-6 gap-4">
    <div className="flex items-center gap-4">
      {/* Previous Button */}
      <button
        onClick={onPrevSlide}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          currentSlide === 0 ? "opacity-60 cursor-not-allowed" : ""
        }`}
        disabled={currentSlide === 0}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => onGoToSlide(index)}
            className={`w-10 h-10 flex items-center justify-center rounded-2xs text-lg transition-colors text-white-neutral-light-900 cursor-pointer ${
              currentSlide === index
                ? "bg-white-neutral-light-300 font-medium"
                : "hover:bg-gray-50 font-normal"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNextSlide}
        className={`w-10 h-10 rounded-full hover:bg-white-neutral-light-200 flex items-center justify-center transition-colors ${
          currentSlide === totalSlides - 1
            ? "opacity-60 cursor-not-allowed"
            : ""
        }`}
        disabled={currentSlide === totalSlides - 1}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  </div>
);
