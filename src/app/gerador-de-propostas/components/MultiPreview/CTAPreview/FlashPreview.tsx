import type { CompleteProjectData } from "#/app/project/types/project";

interface CTASectionPreviewProps {
  data?: CompleteProjectData;
}

export default function CTASectionPreview({ data }: CTASectionPreviewProps) {
  if (data?.hideCTASection) {
    return null;
  }

  return (
    <>
      {!data?.hideCTASection && (data?.pageTitle || data?.ctaButtonTitle) && (
        <div
          className="w-full h-[500px] 2xl:h-[600px] relative flex items-center justify-center"
          style={{
            backgroundImage: data?.ctaBackgroundImage
              ? `url(${data.ctaBackgroundImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full px-8 lg:px-0">
            <div className="border-l-[0.5px] border-l-[#A0A0A0] h-[220px] pl-8 flex flex-col items-start justify-center">
              {data?.pageTitle && (
                <h1 className="text-white-neutral-light-100 font-normal text-5xl max-w-[610px] leading-[1.1] mb-8">
                  {data.pageTitle}
                </h1>
              )}

              {data?.ctaButtonTitle && (
                <button className="bg-black w-[108px] h-[44px] flex items-center justify-center text-white-neutral-light-100 rounded-full font-semibold text-[10px]">
                  {data.ctaButtonTitle}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
