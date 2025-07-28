import type { CompleteProjectData } from "#/app/project/types/project";

interface BusinessSectionPropsComplement {
  data?: CompleteProjectData;
}

export default function BusinessSectionComplement({
  data,
}: BusinessSectionPropsComplement) {
  return (
    <>
      {!data?.hideAboutUsSection && (
        <div
          id="business-complement"
          className="w-full max-w-[1440px] mx-auto h-full flex flex-col justify-center lg:px-1 mt-70 pb-20 lg:pb-0"
        >
          <div className="px-6 h-[600px] flex flex-col lg:flex-row justify-between items-start">
            {!data?.hideAboutUsSubtitle1 && (
              <p className="max-w-[200px] text-[#DFD5E1] lg:font-semibold lg:text-sm mb-12 lg:mb-0 mr-0 sm:mr-6 xl:mr-0">
                {data?.aboutUsSubtitle1}
              </p>
            )}

            {!data?.hideAboutUsSubtitle2 && (
              <div className="h-[400px] border-l-[0.5px] border-l-[#A0A0A0] pl-4 flex items-end">
                <p className="max-w-[750px] text-[#DFD5E1] font-medium text-lg">
                  {data?.aboutUsSubtitle2}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
