import type { CompleteProjectData } from "#/app/project/types/project";

interface BusinessSectionProps {
  data?: CompleteProjectData;
}

export default function BusinessSection({ data }: BusinessSectionProps) {
  return (
    <>
      {!data?.hideAboutUsSection && (
        <div
          id="business"
          className="w-full max-w-[1440px] mx-auto flex flex-col justify-around px-6 mt-60"
        >
          <div className="flex justify-center items-center mb-8">
            <div className="font-medium lg:font-semibold text-2xl lg:text-5xl leading-3xl lg:leading-4xl text-[#DFD5E1] pl-4 lg:pl-15 max-w-[1100px] h-[415px] lg:h-[360px] border-l-[0.5px] border-l-[#A0A0A0] flex items-end">
              <p className="lg:mb-3">
                <span className="text-[#A0A0A0]">Sobre nós. </span>
                {data?.aboutUsTitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
