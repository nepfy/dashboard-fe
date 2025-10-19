"use client";

import { useState } from "react";
import Image from "next/image";
import { MoveUp, MoveDown } from "lucide-react";
import { TestimonialsSection } from "#/types/template-data";

export default function FlashTestimonials({
  mainColor,
  hideSection,
  items,
}: TestimonialsSection) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentTestimonial = items?.[currentIndex];
  let bg;
  let bgMobile;
  if (mainColor === "#4F21A1") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`;
  }
  if (mainColor === "#BE8406") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #BE8406 64.22%, #BE8406 64.9%, #CEA605 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B1B01 34.22%, #BE8406 64.9%, #CEA605 81.78%)`;
  }
  if (mainColor === "#9B3218") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #9B3218 44.22%, #9B3218 64.9%, #9B3218 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #2B0707 34.22%, #9B3218 64.9%, #BE4E3F 81.78%)`;
  }
  if (mainColor === "#05722C") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #05722C 44.22%, #05722C 64.9%, #4ABE3F 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #072B14 34.22%, #05722C 64.9%, #4ABE3F 81.78%)`;
  }
  if (mainColor === "#182E9B") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #182E9B 44.22%, #182E9B 64.9%, #443FBE 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #070F2B 34.22%, #182E9B 64.9%, #443FBE 81.78%)`;
  }
  if (mainColor === "#212121") {
    bg = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #212121 24.22%, #212121 64.9%, #3A3A3A 81.78%)`;
    bgMobile = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #0D0D0D 34.22%, #212121 64.9%, #3A3A3A 81.78%)`;
  }

  const handlePrevious = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? (items?.length ?? 0) - 1 : prev - 1
      );
      setIsTransitioning(false);
    }, 800);
  };

  const handleNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === (items?.length ?? 0) - 1 ? 0 : prev + 1
      );
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <div className="bg-black relative overflow-hidden">
      {!hideSection && (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-60 pt-7 lg:pt-22 pb-23 xl:pb-36 relative z-10">
          <div className="flex items-center gap-2 mb-12 pl-0 xl:pl-7">
            <div className="bg-white-neutral-light-100 w-3 h-3 rounded-full" />
            <p className="text-white text-sm font-semibold">Depoimentos</p>
          </div>

          <div className="xl:border-l border-l-[#A0A0A0] xl:pl-7 pb-24 xl:pb-34">
            <div
              className={`transition-opacity duration-800 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <p className="text-[#E6E6E6] text-[24px] md:text-[32px] mb-7">
                {currentTestimonial?.testimonial}
              </p>
              <div className="flex items-center gap-3">
                {!currentTestimonial?.hidePhoto &&
                  currentTestimonial?.photo && (
                    <div className="relative w-[54px] h-[54px] rounded-full overflow-hidden">
                      <Image
                        src={currentTestimonial?.photo}
                        alt={`Depoimento de ${currentTestimonial?.name}`}
                        fill
                        className="object-cover"
                        style={{ aspectRatio: "auto" }}
                        quality={95}
                      />
                    </div>
                  )}
                <div>
                  <p className="text-[#E6E6E6] text-[18px] font-semibold">
                    {currentTestimonial?.name}
                  </p>
                  {currentTestimonial?.role && (
                    <p className="text-[#A0A0A0] text-[18px] font-medium">
                      {currentTestimonial?.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-12">
              <button
                onClick={handlePrevious}
                disabled={isTransitioning || (items?.length ?? 0) <= 1}
                className="w-10 h-10 bg-[#E6E6E6] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 rotate-270"
                aria-label="Depoimento anterior"
              >
                <MoveUp size={12} className="text-black" />
              </button>
              <button
                onClick={handleNext}
                disabled={isTransitioning || (items?.length ?? 0) <= 1}
                className="w-10 h-10 bg-[#E6E6E6] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 rotate-270"
                aria-label="Próximo depoimento"
              >
                <MoveDown size={12} className="text-black" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="block lg:hidden"
        style={{
          width: 1242,
          height: 746,
          background: bgMobile,
          filter: "blur(80px)",
          position: "absolute",
          bottom: -500,
          right: -580,
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "100%",
        }}
      />

      <div
        className="hidden lg:block"
        style={{
          width: 746,
          height: 746,
          background: bg,
          filter: "blur(80px)",
          position: "absolute",
          bottom: 0,
          right: -500,
          zIndex: 0,
          overflow: "hidden",
          borderRadius: "100%",
        }}
      />
    </div>
  );
}
