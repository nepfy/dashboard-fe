import { AboutUsSection } from "#/types/template-data";

export default function FlashAboutUs({ hideSection, title }: AboutUsSection) {
  return (
    <>
      {!hideSection && (
        <div className="bg-black relative overflow-hidden">
          <div
            className="hidden lg:block"
            style={{
              width: 1148,
              height: 1148,
              background:
                "radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)",
              filter: "blur(80px)",
              position: "absolute",
              top: -420,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 0,
              overflow: "hidden",
              borderRadius: "100%",
            }}
          />

          <div
            className="lg:hidden"
            style={{
              width: 546,
              height: 546,
              background:
                "radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)",
              filter: "blur(80px)",
              position: "absolute",
              top: -180,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 0,
              overflow: "hidden",
              borderRadius: "100%",
            }}
          />
          <div className="flex justify-center items-center px-6 lg:px-12 xl:px-0 py-35 lg:py-62 relative z-10 max-w-[1440px] mx-auto">
            <div className="pl-4 lg:pl-10 pt-36 border-l border-l-[#A0A0A0] max-w-[1100px]">
              <p className="text-[18px] lg:text-[48px] text-[#E6E6E6] font-medium">
                <span className="font-bold block sm:inline">Sobre nós.</span>{" "}
                {title}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
