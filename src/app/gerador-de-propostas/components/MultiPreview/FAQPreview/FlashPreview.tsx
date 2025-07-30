/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import type { CompleteProjectData } from "#/app/project/types/project";

interface FAQSectionProps {
  data?: CompleteProjectData;
}

export default function FAQPreview({ data }: FAQSectionProps) {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contentHeights, setContentHeights] = useState<{
    [key: string]: number;
  }>({});
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleFaqClick = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const calculateDesktopHeights = () => {
    const heights: { [key: string]: number } = {};
    data?.faq?.forEach((faq) => {
      const element = contentRefs.current[faq.id];
      if (element) {
        element.style.height = "auto";
        const height = element.scrollHeight;
        element.style.height = "";
        heights[faq.id] = height;
      }
    });
    setContentHeights(heights);
  };

  const calculateHeights = () => {
    calculateDesktopHeights();
  };

  useEffect(() => {
    if (data?.faq) {
      const timeout = setTimeout(() => {
        calculateHeights();
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [data?.faq]);

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
          className="w-full px-15 py-20"
          style={{
            background: `linear-gradient(
            190deg, 
            #000000 0%,
            #000000 10%,
            #000000 20%,
            #000000 30%,
            ${data?.mainColor} 40%, 
            ${data?.mainColor} 50%, 
            #000000 65%, 
            #000000 80%, 
            #000000 90%, 
            #000000 100%
            )`,
          }}
        >
          <p className="text-white-neutral-light-100 text-5xl">
            Perguntas <br /> Frequentes
          </p>
          <div className="w-full mt-15">
            {data?.faq.map((faq, index) => {
              const isExpanded = expandedFaq === faq.id;

              return (
                <div
                  key={faq.id}
                  className="border-b border-white-neutral-light-100/50 last:border-b-0 w-full"
                >
                  <div className="w-full py-4 px-6">
                    <div
                      className="flex flex-col items-stretch justify-between mt-5 cursor-pointer"
                      onClick={() => handleFaqClick(faq.id)}
                    >
                      <div className="flex items-start mb-1">
                        <span className="text-[10px] font-semibold text-white-neutral-light-100 opacity-50 w-[30%]">
                          0{index + 1}.
                        </span>

                        <div className="flex-1 flex justify-start px-2">
                          <div className="w-full mx-auto">
                            <p className="text-[10px] font-semibold text-white-neutral-light-100 text-left">
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
                                  className="py-2"
                                >
                                  <p className="text-white-neutral-light-100 opacity-50 text-[10px] leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleFaqClick(faq.id)}
                          className=" text-left transition-all duration-600 ease-in-out min-w-[4rem] flex justify-end cursor-pointer"
                        >
                          <span
                            className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                              isExpanded ? "text-[#DFD5E1]" : "text-white"
                            }`}
                          >
                            <ArrowDown
                              size={14}
                              className={`transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                            LEIA
                          </span>
                        </button>
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
