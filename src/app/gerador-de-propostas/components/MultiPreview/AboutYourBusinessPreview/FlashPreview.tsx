import type { CompleteProjectData } from "#/app/project/types/project";
import Gradient from "./Gradient";

interface BusinessSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function BusinessSectionPreview({
  data,
}: BusinessSectionPreviewProps) {
  return (
    <>
      {!data?.hideAboutUsSection &&
        (data?.aboutUsTitle ||
          data?.aboutUsSubtitle1 ||
          data?.aboutUsSubtitle2) && (
          <div className="relative w-full h-full flex flex-col justify-end items-end bg-black lg:max-w-[828px] 2xl:max-w-[1000px] lg:max-h-[740px] 2xl:max-h-[1000px] overflow-hidden">
            {data?.aboutUsTitle && (
              <div className="flex justify-center items-center w-full lg:pb-30 2xl:pb-50 z-10">
                <div className="font-medium lg:text-3xl 2xl:text-4xl text-[#DFD5E1] lg:pl-6 2xl:pl-8 lg:max-w-[600px] 2xl:max-w-[800px] lg:h-[200px] 2xl:h-[350px] border-l-[0.5px] border-l-[#A0A0A0] flex items-end">
                  <p className="lg:mb-3">
                    <span className="text-[#A0A0A0] font-semibold">
                      Sobre nós.{" "}
                    </span>
                    {data.aboutUsTitle}
                  </p>
                </div>
              </div>
            )}

            {(data?.aboutUsSubtitle1 || data?.aboutUsSubtitle2) && (
              <div className="flex justify-start lg:px-6 mb-26 2xl:mb-40 z-10">
                {!data?.hideAboutUsSubtitle1 && data?.aboutUsSubtitle1 && (
                  <div className="w-2/5">
                    <p className="lg:max-w-[150px] text-[#DFD5E1] font-semibold lg:text-[8px] 2xl:text-[12px]">
                      {data.aboutUsSubtitle1}
                    </p>
                  </div>
                )}

                {!data?.hideAboutUsSubtitle2 && data?.aboutUsSubtitle2 && (
                  <div className="h-[200px] border-l-[0.5px] border-l-[#A0A0A0] pl-4 flex items-end w-3/5">
                    <p className="max-w-[750px] text-[#DFD5E1] font-medium lg:text-[10px] 2xl:text-[15px]">
                      {data.aboutUsSubtitle2}
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="absolute lg:-top-30 2xl:-top-50 w-full h-full flex justify-center items-start z-2">
              <Gradient />
            </div>
          </div>
        )}
    </>
  );
}
