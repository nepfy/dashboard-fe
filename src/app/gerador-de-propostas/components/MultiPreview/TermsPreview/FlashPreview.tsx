import type { CompleteProjectData } from "#/app/project/types/project";

interface TermsSectionProps {
  data?: CompleteProjectData;
}

export default function TermsPreview({ data }: TermsSectionProps) {
  return (
    <>
      {!data?.hideTermsSection && (
        <div className="w-full max-w-[1200px] p-6 flex bg-black pl-16">
          <p className="w-1/4 2xl:w-1/3 font-semibold text-[10px] text-[#DFD5E1] h-[120px] border-l-[0.5px] border-l-[#A0A0A0] flex items-end justify-start pl-4 mb-8">
            Nossos termos
          </p>
          <div className="border-l-[0.5px] border-l-[#A0A0A0] flex flex-col justify-center items-center pl-6">
            {data?.termsConditions
              ?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map((condition) => (
                <div
                  key={condition?.id}
                  className="max-w-[250px] flex flex-col justify-center py-10"
                >
                  <h2 className="text-sm text-[#CBDED4] mb-3">
                    {condition?.title}
                  </h2>
                  <p className="text-[#CBDED4] text-[10px]">
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
