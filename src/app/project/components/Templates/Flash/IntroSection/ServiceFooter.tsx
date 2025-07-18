import type { ServicesFooterProps } from "./intro-section";

export default function ServicesFooter({
  services,
  pageSubtitle,
  ctaButtonTitle,
}: ServicesFooterProps) {
  const servicesArray = services
    ? services
        .split(",")
        .map((service) => service.trim())
        .filter((service) => service.length > 0)
    : [];

  const columnClasses =
    "text-white-neutral-light-100 h-40 border-l lg:border-l-2 border-l-[#A0A0A0] pl-4 lg:pl-8 flex flex-col justify-end pb-2";
  const ctaButtonClasses =
    "font-semibold text-xs text-white-neutral-light-100 bg-black rounded-full";

  const mobileButtonStyle = {
    borderRight: "1px solid",
    borderImageSource: `linear-gradient(0deg, #000000, #000000), radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`,
    borderImageSlice: 1,
  };

  return (
    <div className="flex justify-start items-start lg:justify-start lg:items-center flex-col lg:flex-row">
      <div className="flex lg:hidden justify-between items-end w-full order-2 lg:order-1">
        <div className={`${columnClasses} font-semibold text-sm`}>
          {servicesArray.map((service, index) => (
            <p key={index}>{service}</p>
          ))}
        </div>
        <button className={`${ctaButtonClasses} p-6`} style={mobileButtonStyle}>
          {ctaButtonTitle}
        </button>
      </div>

      <div
        className={`${columnClasses} font-semibold text-sm hidden lg:flex lg:w-1/2 order-2 lg:order-1`}
      >
        {servicesArray.map((service, index) => (
          <p key={index}>{service}</p>
        ))}
      </div>

      <div
        className={`${columnClasses} font-medium text-lg leading-6 mb-4 lg:mb-0 lg:w-1/2 max-w-[420px] order-1 lg:order-2`}
      >
        {pageSubtitle}
      </div>
    </div>
  );
}
