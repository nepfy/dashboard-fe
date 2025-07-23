import type {
  CompleteProjectData,
  ProjectProcessStep,
} from "#/app/project/types/project";

interface ProcessListSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function ProcessListSectionPreview({
  data,
}: ProcessListSectionPreviewProps) {
  if (!data?.processSteps || data.processSteps.length === 0) {
    return null;
  }

  const sortedProcessSteps = data.processSteps.sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
  );

  return (
    <>
      {!data?.hideProcessSection && sortedProcessSteps.length > 0 && (
        <div className="w-full p-6 lg:max-w-[70%] mx-auto mt-30 lg:mt-0 mb-20">
          {/* Static Process List */}
          <div className="w-full flex-col flex items-center justify-center mb-12">
            {sortedProcessSteps.map(
              (process: ProjectProcessStep, index: number) => {
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

                        <div className="flex-1 mx-8">
                          {process.description && (
                            <div className="pb-2">
                              <p className="text-[#A0A0A0] leading-relaxed">
                                {process.description}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="text-left">
                          <span className="text-sm font-semibold text-white">
                            LEIA
                          </span>
                        </div>
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

                          <div className="text-left">
                            <span className="text-sm font-semibold text-white">
                              LEIA
                            </span>
                          </div>
                        </div>

                        {/* Mobile Description */}
                        {process.description && (
                          <div className="pb-2">
                            <p className="text-[#A0A0A0] leading-relaxed">
                              {process.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {sortedProcessSteps.length > 0 && (
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
