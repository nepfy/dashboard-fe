/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect } from "react";
import type { CompleteProjectData } from "#/app/project/types/project";

interface FAQSectionProps {
  data?: CompleteProjectData;
}

export default function FAQSection({ data }: FAQSectionProps) {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contentHeights, setContentHeights] = useState<{
    [key: string]: number;
  }>({});
  const [mobileContentHeights, setMobileContentHeights] = useState<{
    [key: string]: number;
  }>({});
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const mobileContentRefs = useRef<{ [key: string]: HTMLDivElement | null }>(
    {}
  );

  const handleFaqClick = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  // Function to calculate heights for desktop
  const calculateDesktopHeights = () => {
    const heights: { [key: string]: number } = {};
    data?.faq?.forEach((faq) => {
      const element = contentRefs.current[faq.id];
      if (element) {
        // Force a reflow and get the actual scrollHeight
        element.style.height = "auto";
        const height = element.scrollHeight;
        element.style.height = "";
        heights[faq.id] = height;
      }
    });
    setContentHeights(heights);
  };

  // Function to calculate heights for mobile
  const calculateMobileHeights = () => {
    const heights: { [key: string]: number } = {};
    data?.faq?.forEach((faq) => {
      const element = mobileContentRefs.current[faq.id];
      if (element) {
        // Force a reflow and get the actual scrollHeight
        element.style.height = "auto";
        const height = element.scrollHeight;
        element.style.height = "";
        heights[faq.id] = height;
      }
    });
    setMobileContentHeights(heights);
  };

  // Function to calculate both heights
  const calculateHeights = () => {
    calculateDesktopHeights();
    calculateMobileHeights();
  };

  // Calculate heights when data changes
  useEffect(() => {
    if (data?.faq) {
      // Use setTimeout to ensure DOM is rendered
      const timeout = setTimeout(() => {
        calculateHeights();
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [data?.faq]);

  // Recalculate heights when a FAQ is expanded (to handle dynamic content)
  useEffect(() => {
    if (expandedFaq) {
      const timeout = setTimeout(() => {
        calculateHeights();
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [expandedFaq]);

  return (
    <>
      {!data?.hideFaqSection && data?.faq && data?.faq.length > 0 && (
        <div
          className="w-full px-10 lg:px-30 py-20"
          style={{
            background: `linear-gradient(
            190deg, 
            #000000 0%,
            #000000 10%,
            #000000 20%,
            #000000 30%,
            #200D42 40%, 
            ${data?.mainColor} 50%, 
            #C085FD 65%, 
            #000000 80%, 
            #000000 90%, 
            #000000 100%
            )`,
          }}
        >
          <p className="text-[#DFD5E1] text-4xl lg:text-7xl">
            Perguntas <br /> Frequentes
          </p>
          <div className="w-full mt-30">
            {data?.faq.map((faq, index) => {
              const isExpanded = expandedFaq === faq.id;

              return (
                <div
                  key={faq.id}
                  className="border-b border-gray-300 last:border-b-0 w-full"
                >
                  <div className="w-full py-4 px-6">
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex flex-col items-stretch justify-between mt-5">
                      <div className="flex items-start mb-4">
                        <span className="text-lg font-medium text-[#DFD5E1] w-[30%]">
                          {index + 1}.
                        </span>

                        <div className="flex-1 flex justify-start px-4">
                          <div className="w-full mx-auto">
                            <p className="text-lg font-medium text-[#DFD5E1] text-left">
                              {faq.question}
                            </p>

                            <div
                              className="w-full overflow-hidden transition-all duration-600 ease-in-out"
                              style={{
                                maxHeight:
                                  isExpanded && faq.answer
                                    ? `${contentHeights[faq.id] || "auto"}px`
                                    : "0px",
                              }}
                            >
                              {faq.answer && (
                                <div
                                  ref={(el) => {
                                    contentRefs.current[faq.id] = el;
                                  }}
                                  className="pb-2"
                                >
                                  <p className="text-[#DFD5E1] leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleFaqClick(faq.id)}
                          className="text-left transition-all duration-600 ease-in-out min-w-[4rem] flex justify-end"
                        >
                          <span
                            className={`text-sm font-semibold  ${
                              isExpanded ? "text-[#DFD5E1]" : "text-white"
                            }`}
                          >
                            LEIA
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-medium text-[#DFD5E1]">
                            {index + 1}.
                          </span>
                          <span className="text-lg font-medium text-white">
                            {faq.question}
                          </span>
                        </div>

                        <button
                          onClick={() => handleFaqClick(faq.id)}
                          className="text-left transition-all duration-600 ease-in-out"
                        >
                          <span
                            className={`text-sm font-semibold ${
                              isExpanded ? "text-[#DFD5E1]" : "text-white"
                            }`}
                          >
                            LEIA
                          </span>
                        </button>
                      </div>

                      {/* Mobile Answer */}
                      <div
                        className="overflow-hidden transition-all duration-600 ease-in-out"
                        style={{
                          maxHeight:
                            isExpanded && faq.answer
                              ? `${mobileContentHeights[faq.id] || "auto"}px`
                              : "0px",
                        }}
                      >
                        {faq.answer && (
                          <div
                            ref={(el) => {
                              mobileContentRefs.current[faq.id] = el;
                            }}
                            className="pb-2"
                          >
                            <p className="text-[#A0A0A0] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
