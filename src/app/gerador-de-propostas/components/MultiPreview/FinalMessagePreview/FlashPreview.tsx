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
          <div className="w-full">
            <div className="w-full max-w-[1440px] mx-auto flex flex-col justify-center relative">
              <div className="flex flex-col xl:flex-row items-start justify-start px-14 mt-20">
                <div className="w-[355px]">
                  <p className="text-white-neutral-light-100 text-[10px] font-semibold max-w-[100px]">
                    {data?.endMessageTitle}
                  </p>
                </div>
                <div>
                  <div className="flex items-start justify-start pt-30 lg:pt-0 pb-10">
                    <p className="text-white-neutral-light-100 text-5xl max-w-[400px]">
                      {data?.endMessageTitle2}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mx-auto w-[95%] border-b border-b-[#A0A0A0] pb-10" />
              <div className="flex flex-col xl:flex-row px-14">
                <div className="w-[350px]" />
                <div className="mt-30 mb-20">
                  <p className="text-white-neutral-light-100 text-sm font-semibold max-w-[555px]">
                    {data?.endMessageDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative w-full">
              <Marquee speed={100} autoFill>
                <p className="text-4xl lg:text-7xl font-medium text-white-neutral-light-100 mr-4 pb-10">
                  {data?.ctaButtonTitle}
                </p>
              </Marquee>

              <p className="text-white-neutral-light-100 opacity-50 text-[12px] text-center w-full mb-8 mt-6">
                Proposta válida até{" "}
                {data?.projectValidUntil
                  ? formatDateToDDMonYYYY(data?.projectValidUntil.toISOString())
                  : ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
