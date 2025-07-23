import type { CompleteProjectData } from "#/app/project/types/project";

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
          <div className="w-full h-full flex flex-col justify-around px-6">
            {/* Main Business Section */}
            {data?.aboutUsTitle && (
              <div className="flex justify-center items-center mb-8">
                <div className="font-medium lg:font-semibold text-2xl lg:text-5xl leading-3xl lg:leading-4xl text-[#DFD5E1] pl-6 lg:pl-15 max-w-[1100px] h-[415px] lg:h-[360px] border-l lg:border-l-2 border-l-[#A0A0A0] flex items-end">
                  <p className="lg:mb-3">
                    <span className="text-[#A0A0A0]">Sobre nós. </span>
                    {data.aboutUsTitle}
                  </p>
                </div>
              </div>
            )}

            {/* Business Section Complement */}
            {(data?.aboutUsSubtitle1 || data?.aboutUsSubtitle2) && (
              <div className="w-full h-full flex flex-col justify-center px-6">
                <div className="px-6 h-[600px] flex flex-col lg:flex-row justify-between items-start mb-6">
                  {!data?.hideAboutUsSubtitle1 && data?.aboutUsSubtitle1 && (
                    <p className="max-w-[200px] text-white-neutral-light-100 lg:font-semibold lg:text-sm mb-12 lg:mb-0 mr-0 sm:mr-6 xl:mr-0">
                      {data.aboutUsSubtitle1}
                    </p>
                  )}

                  {!data?.hideAboutUsSubtitle2 && data?.aboutUsSubtitle2 && (
                    <div className="h-[400px] border-l border-l-[#A0A0A0] pl-6 flex items-end">
                      <p className="max-w-[750px] text-white-neutral-light-100 font-medium text-lg">
                        {data.aboutUsSubtitle2}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
    </>
  );
}
