import type { ServicesFooterProps } from "./intro-section";

export default function ServicesFooter({
  services,
  pageSubtitle,
  isSmallHeight = false,
}: ServicesFooterProps) {
  const servicesArray = services
    ? services
        .split(",")
        .map((service) => service.trim())
        .filter((service) => service.length > 0)
    : [];

  const columnClasses = `text-white-neutral-light-100 opacity-50 border-l-[0.5px] border-l-white-neutral-light-100 opacity-50 flex flex-col justify-end ${
    isSmallHeight ? "h-24 pl-2" : "h-40 pl-4 lg:pl-8"
  }`;

  return (
    <div
      id="service-footer"
      className={`flex justify-start items-start lg:justify-start lg:items-center flex-col lg:flex-row overflow-hidden ${
        isSmallHeight ? "mt-8" : "2xl:mt-50"
      }`}
    >
      <div className="flex lg:hidden justify-between items-end w-full order-2 lg:order-1">
        <div
          id="intro-services-mobile"
          className={`${columnClasses} font-semibold ${
            isSmallHeight ? "text-xs" : "text-sm"
          }`}
        >
          {servicesArray.map((service, index) => (
            <p key={index}>{service}</p>
          ))}
        </div>
      </div>

      <div
        id="intro-services"
        className={`${columnClasses} font-semibold text-sm hidden lg:flex lg:w-1/2 order-2 lg:order-1`}
      >
        {servicesArray.map((service, index) => (
          <p key={index}>{service}</p>
        ))}
      </div>

      <div
        id="intro-page-subtitle"
        className={`${columnClasses} font-medium leading-6 mb-4 lg:mb-0 lg:w-1/2 max-w-[420px] order-1 lg:order-2 ${
          isSmallHeight ? "text-sm" : "text-lg"
        }`}
      >
        {pageSubtitle}
      </div>
    </div>
  );
}
