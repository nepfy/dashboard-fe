"use client";

import Image from "next/image";
import { useState } from "react";
import { MoveUp, MoveDown } from "lucide-react";
import type { CompleteProjectData } from "#/app/project/types/project";

interface TestimonialsSectionProps {
  data?: CompleteProjectData;
}

export default function TestimonialsSection({
  data,
}: TestimonialsSectionProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sort testimonials by sortOrder
  const sortedTestimonials = [...(data?.testimonials || [])].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    return orderA - orderB;
  });

  const totalTestimonials = sortedTestimonials.length;

  const handlePrevious = () => {
    if (isTransitioning) return;
    const nextIndex =
      currentTestimonial === 0 ? totalTestimonials - 1 : currentTestimonial - 1;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial(nextIndex);
      setTimeout(() => setIsTransitioning(false), 450);
    }, 550);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    const nextIndex =
      currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial(nextIndex);
      setTimeout(() => setIsTransitioning(false), 450);
    }, 550);
  };

  if (data?.hideTestimonialsSection || totalTestimonials === 0) {
    return null;
  }

  const currentTestimonialData = sortedTestimonials[currentTestimonial];

  return (
    <>
      {!data?.hideTestimonialsSection && (
        <div className="w-full flex items-center justify-center mt-28 p-6 border-b-[0.5px] border-b-[#A0A0A0]">
          <div className="lg:w-4/5 not-first:relative flex flex-col items-center justify-center w-full mb-30 lg:border-r-[0.5px] lg:border-r-[#A0A0A0]">
            <div className="flex items-start justify-center gap-12 lg:mb-40">
              <div className="flex flex-col gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={isTransitioning}
                  className="w-12 h-12 bg-[#DFD5E1] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  aria-label="Previous testimonial"
                >
                  <MoveUp size={14} className="text-black" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={isTransitioning}
                  className="w-12 h-12 bg-[#DFD5E1] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  aria-label="Next testimonial"
                >
                  <MoveDown size={14} className="text-black" />
                </button>
              </div>

              <div className="w-full h-full flex flex-col lg:flex-row items-start gap-8 lg:gap-12 min-h-[300px]">
                <div className="flex-1 max-w-[914px]">
                  <blockquote
                    className={`text-white text-2xl lg:text-3xl leading-3xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      isTransitioning
                        ? "opacity-0 transform translate-y-3 scale-95"
                        : "opacity-100 transform translate-y-0 scale-100"
                    }`}
                  >
                    {currentTestimonialData.testimonial}
                  </blockquote>
                </div>
              </div>
            </div>

            <div className="w-[300px] flex items-start md:items-end justify-center lg:justify-start h-[160px] lg:gap-6">
              <div className="hidden md:block h-full bg-[#A0A0A0] w-[0.5px]" />

              <div className="min-w-[200px] flex flex-col lg:flex-row items-center xl:items-end gap-4 lg:gap-6">
                {currentTestimonialData.photo &&
                  !currentTestimonialData.hidePhoto && (
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={currentTestimonialData.photo!}
                        alt={currentTestimonialData.name}
                        width={80}
                        height={80}
                        className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          isTransitioning
                            ? "opacity-0 scale-90 rotate-1"
                            : "opacity-100 scale-100 rotate-0"
                        }`}
                      />
                    </div>
                  )}

                <div className="flex flex-col self-center">
                  <h4
                    className={`text-white font-semibold text-lg transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      isTransitioning
                        ? "opacity-0 transform translate-y-2 scale-98"
                        : "opacity-100 transform translate-y-0 scale-100"
                    }`}
                  >
                    {currentTestimonialData.name}
                  </h4>
                  {currentTestimonialData.role && (
                    <p
                      className={`text-[#A0A0A0] text-lg transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] delay-100 ${
                        isTransitioning
                          ? "opacity-0 transform translate-y-2 scale-98"
                          : "opacity-100 transform translate-y-0 scale-100"
                      }`}
                    >
                      {currentTestimonialData.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
