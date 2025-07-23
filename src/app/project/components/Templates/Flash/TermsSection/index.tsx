import type { CompleteProjectData } from "#/app/project/types/project";

interface TermsSectionProps {
  data?: CompleteProjectData;
}

export default function TermsSection({ data }: TermsSectionProps) {
  return (
    <>
      {!data?.hideTermsSection && (
        <div className="w-[90%] p-6 text-white flex flex-col lg:flex-row lg:mx-auto">
          <p className="lg:w-2/5 w-[100px] font-semibold text-lg text-white h-[162px] border-l-[0.5px] border-l-[#A0A0A0] flex items-end justify-start pl-4 lg:pl-8 mb-8">
            Nossos termos
          </p>
          <div className="border-l-[0.5px] border-l-[#A0A0A0] flex flex-col justify-center items-center pl-4 lg:pl-8">
            {data?.termsConditions?.map((condition) => (
              <div
                key={condition?.id}
                className="max-w-[450px] flex flex-col justify-center py-10"
              >
                <h2 className="text-sm text-[#CBDED4] mb-3">
                  {condition?.title}
                </h2>
                <p className="text-[#CBDED4] text-xs">
                  {condition?.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
