import type { CompleteProjectData } from "#/app/project/types/project";

interface FinalMessageSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function FinalMessageSectionPreview({
  data,
}: FinalMessageSectionPreviewProps) {
  return (
    <>
      {!data?.hideFinalMessageSection &&
        (data?.endMessageTitle ||
          data?.endMessageTitle2 ||
          data?.endMessageDescription ||
          data?.ctaButtonTitle) && (
          <div
            className="w-full px-10 lg:px-30 pt-20 pb-6"
            style={{
              background: `${data?.mainColor}`,
            }}
          >
            {(data?.endMessageTitle || data?.endMessageTitle2) && (
              <div className="flex items-start justify-start border-b-[0.5px] border-b-[#A0A0A0] pb-10">
                {data?.endMessageTitle && (
                  <p className="text-[#DFD5E1] text-sm font-semibold w-[30%]">
                    {data.endMessageTitle}
                  </p>
                )}
                {data?.endMessageTitle2 && (
                  <p className="text-[#DFD5E1] text-3xl lg:text-7xl max-w-[630px]">
                    {data.endMessageTitle2}
                  </p>
                )}
              </div>
            )}

            {data?.endMessageDescription && (
              <div className="flex items-center justify-center mt-30 mb-20">
                <p className="text-[#DFD5E1] text-sm font-semibold max-w-[550px]">
                  {data.endMessageDescription}
                </p>
              </div>
            )}

            {data?.ctaButtonTitle && (
              <div className="relative w-full">
                <div className="flex w-fit gap-20">
                  <p className="text-4xl lg:text-9xl font-medium text-[#DFD5E1] whitespace-nowrap">
                    {data.ctaButtonTitle}
                  </p>

                  <p className="text-4xl lg:text-9xl font-medium text-[#DFD5E1] whitespace-nowrap">
                    {data.ctaButtonTitle}
                  </p>

                  <p className="text-4xl lg:text-9xl font-medium text-[#DFD5E1] whitespace-nowrap">
                    {data.ctaButtonTitle}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
    </>
  );
}
