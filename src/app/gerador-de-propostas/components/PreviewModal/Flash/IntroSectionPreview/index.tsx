import type { CompleteProjectData } from "#/app/project/types/project";
import { formatDateToDDMonYYYY } from "#/helpers/formatDateAndTime";

interface IntroSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function IntroSectionPreview({
  data,
}: IntroSectionPreviewProps) {
  const formatCreatedAt = () => {
    const createdAt = data?.createdAt;
    if (!createdAt) return "";

    if (createdAt instanceof Date) {
      return formatDateToDDMonYYYY(createdAt.toISOString().split("T")[0]);
    }

    return "";
  };

  const servicesArray = data?.services
    ? (typeof data.services === "string" ? data.services : "")
        .split(",")
        .map((service) => service.trim())
        .filter((service) => service.length > 0)
    : [];

  return (
    <>
      {data?.companyName &&
        data?.companyEmail &&
        data?.ctaButtonTitle &&
        data?.pageTitle &&
        data?.createdAt &&
        data?.services &&
        data?.pageSubtitle && (
          <div className="w-full h-full max-h-[1200px]">
            <div className="w-full h-full flex flex-col justify-between px-6 py-11">
              {/* Header */}
              <div className="text-white-neutral-light-100 flex justify-between items-center">
                <p className="font-semibold text-lg">{data.companyName}</p>

                <div className="hidden lg:flex items-center">
                  <p className="font-semibold text-sm mr-11">
                    {data.companyEmail}
                  </p>
                  <button className="font-semibold text-xs text-white-neutral-light-100 bg-black rounded-full p-5">
                    {data.ctaButtonTitle}
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button className="lg:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1 cursor-pointer">
                  <span className="w-8 h-[1px] bg-white-neutral-light-100" />
                  <span className="w-8 h-[1px] bg-white-neutral-light-100 mb-2 mt-1" />
                  <span className="w-8 h-[1px] bg-white-neutral-light-100" />
                </button>
              </div>

              {/* Hero Section */}
              <div className="flex flex-col justify-center">
                <div className="w-full flex flex-col items-center">
                  <div>
                    <h1 className="text-white-neutral-light-100 font-normal text-4xl lg:text-7xl max-w-[1120px] lg:leading-8xl">
                      {data.pageTitle}
                    </h1>
                    <p className="text-[#DFD5E1] font-bold text-xs mt-6">
                      Proposta {formatCreatedAt()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Services Footer */}
              <div className="flex justify-start items-start lg:justify-start lg:items-center flex-col lg:flex-row">
                <div className="flex lg:hidden justify-between items-end w-full order-2 lg:order-1">
                  <div className="text-white-neutral-light-100 h-40 border-l lg:border-l-2 border-l-[#A0A0A0] pl-4 lg:pl-8 flex flex-col justify-end pb-2 font-semibold text-sm">
                    {servicesArray.map((service, index) => (
                      <p key={index}>{service}</p>
                    ))}
                  </div>
                  <button className="font-semibold text-xs text-white-neutral-light-100 bg-black rounded-full p-6">
                    {data.ctaButtonTitle}
                  </button>
                </div>

                <div className="text-white-neutral-light-100 h-40 border-l lg:border-l-2 border-l-[#A0A0A0] pl-4 lg:pl-8 flex-col justify-end pb-2 font-semibold text-sm hidden lg:flex lg:w-1/2 order-2 lg:order-1">
                  {servicesArray.map((service, index) => (
                    <p key={index}>{service}</p>
                  ))}
                </div>

                <div className="text-white-neutral-light-100 h-40 border-l lg:border-l-2 border-l-[#A0A0A0] pl-4 lg:pl-8 flex flex-col justify-end pb-2 font-medium text-lg leading-6 mb-4 lg:mb-0 lg:w-1/2 max-w-[420px] order-1 lg:order-2">
                  {data.pageSubtitle}
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
