import type { CompleteProjectData } from "#/app/project/types/project";

interface ProcessSectionProps {
  data?: CompleteProjectData;
}

export default function ProcessSection({ data }: ProcessSectionProps) {
  return (
    <>
      {!data?.hideProcessSection && (
        <div className="w-full h-full p-6 flex flex-col lg:flex-row items-center">
          {!data?.hideProcessSubtitle && (
            <div className="flex lg:items-start lg:justify-start lg:w-[30%] gap-6 lg:gap-8">
              <div className="border-l-1 border-l-[#A0A0A0] h-[160px] lg:h-[800px]" />
              <p className="text-[#DFD5E1] font-semibold text-base lg:max-w-[300px]">
                A Jornada. {data?.processSubtitle}
              </p>
            </div>
          )}

          <div className="flex items-end justify-start gap-6 lg:gap-12 w-full lg:w-[70%] pr-10 lg:pr-0 mt-20 lg:mt-0">
            <div className="border-l-1 border-l-[#A0A0A0] h-[231px] lg:h-[360px]" />
            <p className="text-3xl lg:text-7xl text-white lg:max-w-[580px] leading-12 lg:leading-22 lg:text-start">
              {" "}
              Como funciona em{" "}
              <span className="bg-black text-white pl-4 py-2 pr-8 lg:pl-6 lg:pr-10 lg:py-3 text-2xl rounded-full text-start">
                {data?.processSteps.length}
              </span>{" "}
              passos simples{" "}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
