import Marquee from "react-fast-marquee";
import { formatDateToDDMonYYYY } from "#/helpers/formatDateAndTime";
import type { CompleteProjectData } from "#/app/project/types/project";

interface FinalMessageSectionProps {
  data?: CompleteProjectData;
}

export default function FinalMessagePreview({
  data,
}: FinalMessageSectionProps) {
  return (
    <>
      {!data?.hideFinalMessageSection && (
        <div
          className="w-full pt-20 pb-6"
          style={{
            background: `${data?.mainColor}`,
          }}
        >
          <div className="w-full max-w-[1100px]">
            <div className="flex items-start justify-start border-b-[0.5px] border-b-[#A0A0A0] pb-20 px-8">
              <div className="w-[30%] 2xl:w-[400px]">
                <p className="text-[#DFD5E1] text-[10px] font-semibold  max-w-[100px]">
                  {data?.endMessageTitle}
                </p>
              </div>
              <p className="text-[#DFD5E1] text-[41px] leading-12 max-w-[320px] 2xl:max-w-[350px]">
                {data?.endMessageTitle2}
              </p>
            </div>
          </div>

          {data?.endMessageDescription && !data?.hideFinalMessageSubtitle && (
            <div className="flex items-center justify-center mt-15 mb-10">
              <p className="text-[#DFD5E1] text-[10px] font-semibold max-w-[320px]">
                {data?.endMessageDescription}
              </p>
            </div>
          )}
          <Marquee speed={100} gradientWidth={0}>
            <div className="relative w-full">
              <div className="flex w-fit gap-8 py-8">
                <p className="lg:text-7xl font-medium text-[#DFD5E1] whitespace-nowrap">
                  {data?.ctaButtonTitle}
                </p>

                <p className="lg:text-7xl font-medium text-[#DFD5E1] whitespace-nowrap">
                  {data?.ctaButtonTitle}
                </p>

                <p className="lg:text-7xl font-medium text-[#DFD5E1] whitespace-nowrap">
                  {data?.ctaButtonTitle}
                </p>

                <p className="lg:text-7xl font-medium text-[#DFD5E1] whitespace-nowrap">
                  {data?.ctaButtonTitle}
                </p>

                <p className="lg:text-7xl font-medium text-[#DFD5E1] whitespace-nowrap">
                  {data?.ctaButtonTitle}
                </p>

                <p className="lg:text-7xl font-medium text-[#DFD5E1] whitespace-nowrap">
                  {data?.ctaButtonTitle}
                </p>

                <p className="lg:text-7xl font-medium text-[#DFD5E1] whitespace-nowrap">
                  {data?.ctaButtonTitle}
                </p>

                <p className="lg:text-7xl font-medium text-[#DFD5E1] whitespace-nowrap">
                  {data?.ctaButtonTitle}
                </p>

                <p className="lg:text-7xl font-medium text-[#DFD5E1] whitespace-nowrap">
                  {data?.ctaButtonTitle}
                </p>

                <p className="lg:text-7xl font-medium text-[#DFD5E1] whitespace-nowrap">
                  {data?.ctaButtonTitle}
                </p>
              </div>
            </div>
          </Marquee>

          <p className="text-[#DFD5E1] text-[10px] text-center w-full mb-8 mt-6">
            Proposta válida até{" "}
            {data?.projectValidUntil
              ? formatDateToDDMonYYYY(data?.projectValidUntil.toISOString())
              : ""}
          </p>
        </div>
      )}
    </>
  );
}
