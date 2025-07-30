import Marquee from "react-fast-marquee";
import { formatDateToDDMonYYYY } from "#/helpers/formatDateAndTime";
import type { CompleteProjectData } from "#/app/project/types/project";

interface FinalMessageSectionProps {
  data?: CompleteProjectData;
}

export default function FinalMessageSection({
  data,
}: FinalMessageSectionProps) {
  return (
    <div id="final-message">
      {!data?.hideFinalMessageSection && (
        <div
          className="w-full pt-20 pb-6"
          style={{
            background: `${data?.mainColor}`,
          }}
        >
          <div className="w-full">
            <div className="w-full max-w-[1440px] mx-auto flex flex-col justify-center relative">
              <div className="flex flex-col xl:flex-row items-start justify-start px-14 xl:mt-30">
                <div className="w-[445px]">
                  <p className="text-white-neutral-light-100 text-sm font-semibold max-w-[130px]">
                    {data?.endMessageTitle}
                  </p>
                </div>
                <div>
                  <div className="flex items-start justify-start pt-30 xl:pt-0 pb-10">
                    <p className="text-white-neutral-light-100 text-3xl xl:text-7xl max-w-[400px] xl:max-w-[630px]">
                      {data?.endMessageTitle2}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mx-auto w-[95%] border-b border-b-[#A0A0A0] pb-10" />
              <div className="flex flex-col xl:flex-row px-14">
                <div className="w-[445px]" />
                <div className="mt-30 mb-20">
                  <p className="text-white-neutral-light-100 text-sm font-semibold max-w-[78%] xl:max-w-[555px]">
                    {data?.endMessageDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative w-full -mt-10 xl:mt-0">
              <Marquee speed={100} autoFill>
                <p className="text-4xl xl:text-9xl font-medium text-white-neutral-light-100 mr-10 lg:pb-10">
                  {data?.ctaButtonTitle}
                </p>
              </Marquee>

              <p className="text-[#DFD5E1] text-[14px] xl:text-lg text-center w-full mb-8 mt-6">
                Proposta válida até{" "}
                {data?.projectValidUntil
                  ? formatDateToDDMonYYYY(data?.projectValidUntil.toISOString())
                  : ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
