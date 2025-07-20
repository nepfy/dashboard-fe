/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect } from "react";
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
        <div className="w-full p-6 max-w-[1160px] mx-auto mt-30 lg:mt-0">
          {/* Static Process List */}
          <div className="w-full flex-col flex items-center justify-center mb-12">
            {sortedProcessSteps.map(
              (process: ProjectProcessStep, index: number) => {
                const isExpanded = expandedStep === process.id;
                const stepNumber = process.stepCounter || index + 1;

                return (
                  <div
                    key={process.id}
                    className="border-b border-gray-300 last:border-b-0 w-full"
                  >
                    <div className="w-full py-4 px-6">
                      {/* Desktop Layout */}
                      <div className="hidden lg:flex items-start justify-between mt-5">
                        <div className="flex items-start space-x-4">
                          <span className="text-lg font-medium text-white min-w-[3rem]">
                            {stepNumber.toString().padStart(2, "0")}.
                          </span>
                          <span className="text-lg font-medium text-white">
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
                              className="pb-2" // Add some padding to ensure proper height calculation
                            >
                              <p className="text-[#A0A0A0] leading-relaxed">
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
                              isExpanded ? "text-[#DFD5E1]" : "text-white"
                            }`}
                          >
                            LEIA
                          </span>
                        </button>
                      </div>

                      {/* Mobile Layout */}
                      <div className="lg:hidden">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-medium text-white min-w-[3rem]">
                              {stepNumber.toString().padStart(2, "0")}.
                            </span>
                            <span className="text-lg font-medium text-white">
                              {process.stepName}
                            </span>
                          </div>

                          <button
                            onClick={() => handleStepClick(process.id)}
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
                              <p className="text-[#A0A0A0] leading-relaxed">
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
        <div className="relative pb-8 w-full">
          <div className="flex animate-scroll w-fit gap-20">
            {sortedProcessSteps.map((process: ProjectProcessStep) => {
              return (
                <p
                  key={`first-${process.id}`}
                  className="text-9xl font-medium text-black whitespace-nowrap"
                >
                  {process.stepName}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {sortedProcessSteps.length < 2 && (
        <div className="flex items-center justify-center gap-20 w-full pb-8">
          {sortedProcessSteps.map((process: ProjectProcessStep) => {
            return (
              <p
                key={process.id}
                className="text-9xl font-medium text-black whitespace-nowrap"
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
