import type { CompleteProjectData } from "#/app/project/types/project";

interface CTASectionProps {
  data?: CompleteProjectData;
}

export default function CTASection({ data }: CTASectionProps) {
  if (data?.hideCTASection) {
    return null;
  }

  return (
    <div
      className="w-full min-h-screen relative flex items-center justify-center"
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
        <div className="border-l-1 border-l-[#A0A0A0] h-[359px] pl-6 lg:pl-16 flex flex-col items-start justify-center">
          <h1 className="text-white font-normal text-4xl lg:text-7xl max-w-[1120px] lg:leading-[1.1] mb-8">
            {data?.pageTitle}
          </h1>

          {data?.ctaButtonTitle && (
            <button
              className="w-[112px] h-[56px] flex items-center justify-center text-white-neutral-light-100 rounded-full font-semibold text-xs cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, ${data?.mainColor} 64.9%, #A46EDB 81.78%)`,
              }}
            >
              {data?.ctaButtonTitle}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
