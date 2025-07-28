import type { CompleteProjectData } from "#/app/project/types/project";
import { formatDateToDDMonYYYY } from "#/helpers/formatDateAndTime";

interface IntroSectionPreviewProps {
  data?: CompleteProjectData;
}

export default function IntroSectionPreview({
  data,
}: IntroSectionPreviewProps) {
  const gradient = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, ${data?.mainColor} 94.22%, ${data?.mainColor} 64.9%, ${data?.mainColor} 81.78%)`;

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
      {(data?.companyName ||
        data?.companyEmail ||
        data?.ctaButtonTitle ||
        data?.pageTitle ||
        data?.createdAt ||
        data?.services ||
        data?.pageSubtitle) && (
        <div
          className="w-full h-full lg:max-h-[492px] 2xl:max-h-[700px]"
          style={{
            background: gradient,
          }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-full h-full flex flex-col justify-between px-6 py-5">
              <div className="text-white-neutral-light-100 flex justify-between items-center">
                <p className="font-semibold lg:text-[10px] 2xl:text-[14px]">
                  {data.companyName}
                </p>

                <div className="hidden lg:flex items-center">
                  <p className="font-semibold lg:text-[8px] 2xl:text-[10px] mr-5">
                    {data.companyEmail}
                  </p>
                  <button className="font-semibold lg:text-[8px] 2xl:text-[10px] text-white-neutral-light-100 bg-black rounded-full lg:p-2 2xl:p-3 2xl:px-4">
                    {data.ctaButtonTitle}
                  </button>
                </div>
              </div>

              {/* Hero Section */}
              <div className="flex flex-col justify-center lg:mt-0 2xl:mt-14">
                <div className="w-full flex flex-col items-center">
                  <div>
                    <h1 className="text-white-neutral-light-100 font-normal lg:text-4xl 2xl:text-6xl lg:leading-2xl 2xl:leading-5xl lg:max-w-[643px] 2xl:max-w-[750px]">
                      {data.pageTitle}
                    </h1>
                    <p className="text-[#DFD5E1] font-bold lg:text-[8px] xl:text-[10px] mt-2">
                      Proposta {formatCreatedAt()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-start items-center">
                {!data?.hideServices && servicesArray.length > 0 && (
                  <div className="text-white-neutral-light-100 lg:h-22 2xl:h-40 border-l border-l-[#A0A0A0] pl-4 flex-col justify-end pb-2 font-semibold lg:text-[8px] 2xl:text-[12px] flex w-1/2">
                    {servicesArray.map((service, index) => (
                      <p key={index}>{service}</p>
                    ))}
                  </div>
                )}

                {!data?.hidePageSubtitle && data?.pageSubtitle && (
                  <div className="text-white-neutral-light-100 lg:h-22 2xl:h-40 border-l border-l-[#A0A0A0] pl-4 flex flex-col justify-end pb-2 font-medium lg:text-[10px] 2xl:text-[15px] lg:leading-3 2xl:leading-4 w-1/2 max-w-[220px] 2xl:max-w-[330px]">
                    {data.pageSubtitle}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
