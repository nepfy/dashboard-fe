/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect } from "react";
import Marquee from "react-fast-marquee";
import {
  CompleteProjectData,
  ProjectProcessStep,
} from "#/app/project/types/project";

interface ProcessListSectionProps {
  data?: CompleteProjectData;
}

export default function ProcessListSection({ data }: ProcessListSectionProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
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

  const handleStepClick = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  // Function to calculate heights for desktop
  const calculateDesktopHeights = () => {
    const heights: { [key: string]: number } = {};
    data?.processSteps?.forEach((step) => {
      const element = contentRefs.current[step.id];
      if (element) {
        // Force a reflow and get the actual scrollHeight
        element.style.height = "auto";
        const height = element.scrollHeight;
        element.style.height = "";
        heights[step.id] = height;
      }
    });
    setContentHeights(heights);
  };

  // Function to calculate heights for mobile
  const calculateMobileHeights = () => {
    const heights: { [key: string]: number } = {};
    data?.processSteps?.forEach((step) => {
      const element = mobileContentRefs.current[step.id];
      if (element) {
        // Force a reflow and get the actual scrollHeight
        element.style.height = "auto";
        const height = element.scrollHeight;
        element.style.height = "";
        heights[step.id] = height;
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
    if (data?.processSteps) {
      // Use setTimeout to ensure DOM is rendered
      const timeout = setTimeout(() => {
        calculateHeights();
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [data?.processSteps]);

  // Recalculate heights when a step is expanded (to handle dynamic content)
  useEffect(() => {
    if (expandedStep) {
      const timeout = setTimeout(() => {
        calculateHeights();
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [expandedStep]);

  if (!data?.processSteps || data.processSteps.length === 0) {
    return null;
  }

  const sortedProcessSteps = data.processSteps.sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return (
    <>
      {!data?.hideProcessSection && (
        <div id="process-list" className="w-full p-6 mt-30 lg:mt-0 mb-20">
          {/* Static Process List */}
          <div className="w-full lg:max-w-[1300px] mx-auto flex-col flex items-center justify-center mb-12">
            {sortedProcessSteps.map(
              (process: ProjectProcessStep, index: number) => {
                const isExpanded = expandedStep === process.id;
                const stepNumber = process.stepCounter || index + 1;

                return (
                  <div
                    key={process.id}
                    className="border-b border-white-neutral-light-100 opacity-50 last:border-b-0 w-full"
                  >
                    <div className="w-full py-4 px-6">
                      {/* Desktop Layout */}
                      <div
                        className="hidden lg:flex items-start justify-between mt-5 cursor-pointer"
                        onClick={() => handleStepClick(process.id)}
                      >
                        <div className="flex items-start xl:space-x-70">
                          <span className="text-[16px] font-medium text-[#DFD5E1] mr-50">
                            {stepNumber.toString().padStart(2, "0")}.
                          </span>
                          <span className="text-[16px] font-medium text-[#DFD5E1]">
                            {process.stepName}
                          </span>
                        </div>

                        <div
                          className="flex-1 mx-8 overflow-hidden transition-all duration-600 ease-in-out"
                          style={{
                            maxHeight:
                              isExpanded && process.description
                                ? `${contentHeights[process.id] || "auto"}px`
                                : "0px",
                          }}
                        >
                          {process.description && (
                            <div
                              ref={(el) => {
                                contentRefs.current[process.id] = el;
                              }}
                              className="ml-30 mr-24 pb-2"
                            >
                              <p className="text-white-neutral-light-100 opacity-50 leading-relaxed">
                                {process.description}
                              </p>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleStepClick(process.id)}
                          className="text-left transition-all duration-600 ease-in-out"
                        >
                          <span
                            className={`text-sm font-semibold ${
                              isExpanded
                                ? "text-white-neutral-light-100 opacity-50"
                                : "text-white"
                            }`}
                          >
                            LEIA
                          </span>
                        </button>
                      </div>

                      {/* Mobile Layout */}
                      <div className="lg:hidden">
                        <div
                          className="flex items-center justify-between mb-4"
                          onClick={() => handleStepClick(process.id)}
                        >
                          <div className="flex items-center">
                            <span className="text-[14px] lg:text-lg font-medium text-[#DFD5E1] mr-6 opacity-90">
                              {stepNumber.toString().padStart(2, "0")}.
                            </span>
                            <span className="text-[14px] lg:text-lg font-medium text-[#DFD5E1]">
                              {process.stepName}
                            </span>
                          </div>

                          <button
                            onClick={() => handleStepClick(process.id)}
                            className="text-left transition-all duration-600 ease-in-out"
                          >
                            <span
                              className={`text-sm font-semibold ${
                                isExpanded ? "text-white" : "text-[#DFD5E1]"
                              }`}
                            >
                              LEIA
                            </span>
                          </button>
                        </div>

                        {/* Mobile Description */}
                        <div
                          className="overflow-hidden transition-all duration-600 ease-in-out"
                          style={{
                            maxHeight:
                              isExpanded && process.description
                                ? `${
                                    mobileContentHeights[process.id] || "auto"
                                  }px`
                                : "0px",
                          }}
                        >
                          {process.description && (
                            <div
                              ref={(el) => {
                                mobileContentRefs.current[process.id] = el;
                              }}
                              className="pb-2" // Add some padding to ensure proper height calculation
                            >
                              <p className="text-white-neutral-light-100 opacity-50 leading-relaxed">
                                {process.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {sortedProcessSteps.length >= 2 && (
        <div className="pb-8 w-full">
          <Marquee speed={100} gradientWidth={0} autoFill>
            {sortedProcessSteps.map((process: ProjectProcessStep) => {
              return (
                <p
                  key={`first-${process.id}`}
                  className="text-9xl font-medium text-black whitespace-nowrap mb-10 mr-6"
                >
                  {process.stepName}.
                </p>
              );
            })}
          </Marquee>
        </div>
      )}

      {sortedProcessSteps.length < 2 && (
        <div className="flex items-center justify-center gap-20 w-full mb-8">
          {sortedProcessSteps.map((process: ProjectProcessStep) => {
            return (
              <p
                key={process.id}
                className="text-9xl font-medium text-black whitespace-nowrap mb-6"
              >
                {process.stepName}
              </p>
            );
          })}
        </div>
      )}
    </>
  );
}
