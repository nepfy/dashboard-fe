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
          className="w-full h-full max-w-[1440px] mx-auto flex flex-col justify-center items-center px-6"
        >
          <div className="flex w-full h-full justify-center items-center mb-8">
            <div className="w-full font-medium lg:font-semibold text-2xl lg:text-5xl leading-3xl lg:leading-4xl text-white-neutral-light-100 pl-4 lg:pl-15 max-w-[1100px] h-[415px] lg:h-[360px] border-l-[0.5px] border-l-[#A0A0A0] relative">
              <p id="business-title" className="lg:mb-3 absolute w-full top-0">
                <span className="text-white-neutral-light-100 opacity-50">
                  Sobre nós.{" "}
                </span>
                {data?.aboutUsTitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
