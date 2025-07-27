/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import type {
  CompleteProjectData,
  ProjectProcessStep,
} from "#/app/project/types/project";

interface ProcessSectionPreviewProps {
  data: CompleteProjectData;
}

export default function ProcessSectionPreview({
  data,
}: ProcessSectionPreviewProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [contentHeights, setContentHeights] = useState<{
    [key: string]: number;
  }>({});
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  // Function to calculate both heights
  const calculateHeights = () => {
    calculateDesktopHeights();
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
        <div
          className="h-[900px]"
          style={{ backgroundColor: `${data?.mainColor}` }}
        >
          <div className="w-full p-6 flex items-start relative">
            <>
              {!data?.hideProcessSubtitle && (
                <div className="absolute top-6 left-10">
                  <p className="text-[#DFD5E1] font-semibold text-[8px] lg:max-w-[170px]">
                    A Jornada. {data?.processSubtitle}
                  </p>
                </div>
              )}
              {!data?.hideProcessSection && (
                <>
                  <div className="border-l-[0.5px] border-l-[#A0A0A0] lg:h-[850px]" />
                  <div className="flex flex-col items-center justify-start gap-4 lg:w-full mt-36">
                    <>
                      <div className="flex items-end justify-start gap-4">
                        <div className="border-l-[0.5px] border-l-[#A0A0A0] h-[200px]" />
                        <p className="text-5xl text-[#DFD5E1] lg:max-w-[318px] lg:text-start">
                          {" "}
                          Como funciona em{" "}
                          <span className="bg-black text-[#DFD5E1] text-xl rounded-full text-start py-1 pl-2 pr-6">
                            {data?.processSteps?.length}
                          </span>{" "}
                          passos simples{" "}
                        </p>
                      </div>
                      {!data?.hideProcessSection && (
                        <div className="w-full p-6 mx-auto my-20">
                          <div className="w-full flex-col flex items-center justify-center">
                            {sortedProcessSteps.map(
                              (process: ProjectProcessStep, index: number) => {
                                const isExpanded = expandedStep === process.id;
                                const stepNumber =
                                  process.stepCounter || index + 1;

                                return (
                                  <div
                                    key={process.id}
                                    className="border-b border-[#A0A0A0] last:border-b-0 w-full"
                                  >
                                    <div className="w-full py-1 px-6">
                                      <div className="hidden lg:flex items-start justify-between mt-5">
                                        <div className="flex items-start space-x-16">
                                          <span className="text-[10px] font-medium text-[#DFD5E1] min-w-[3rem]">
                                            {stepNumber
                                              .toString()
                                              .padStart(2, "0")}
                                            .
                                          </span>
                                          <span className="text-[10px] font-semibold text-[#DFD5E1]">
                                            {process.stepName}
                                          </span>
                                        </div>

                                        <div
                                          className="flex-1 mx-8 overflow-hidden transition-all duration-600 ease-in-out"
                                          style={{
                                            maxHeight:
                                              isExpanded && process.description
                                                ? `${
                                                    contentHeights[
                                                      process.id
                                                    ] || "auto"
                                                  }px`
                                                : "0px",
                                          }}
                                        >
                                          {process.description && (
                                            <div
                                              ref={(el) => {
                                                contentRefs.current[
                                                  process.id
                                                ] = el;
                                              }}
                                              className="pb-2"
                                            >
                                              <p className="text-[#A0A0A0] text-[10px] leading-relaxed">
                                                {process.description}
                                              </p>
                                            </div>
                                          )}
                                        </div>

                                        <button
                                          onClick={() =>
                                            handleStepClick(process.id)
                                          }
                                          className="text-left transition-all duration-600 ease-in-out"
                                        >
                                          <span
                                            className={`text-[10px] font-semibold ${
                                              isExpanded
                                                ? "text-white"
                                                : "text-[#DFD5E1]"
                                            }`}
                                          >
                                            LEIA
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      )}
    </>
  );
}
