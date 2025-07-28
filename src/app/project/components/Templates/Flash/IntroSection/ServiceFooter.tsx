import type { ServicesFooterProps } from "./intro-section";

export default function ServicesFooter({
  services,
  pageSubtitle,
}: ServicesFooterProps) {
  const servicesArray = services
    ? services
        .split(",")
        .map((service) => service.trim())
        .filter((service) => service.length > 0)
    : [];

  const columnClasses =
    "text-white-neutral-light-100 h-40 border-l-[0.5px] border-l-[#A0A0A0] pl-4 lg:pl-8 flex flex-col justify-end";

  return (
    <div className="flex justify-start items-start lg:justify-start lg:items-center flex-col lg:flex-row lg:12 2xl:mt-50">
      <div className="flex lg:hidden justify-between items-end w-full order-2 lg:order-1">
        <div className={`${columnClasses} font-semibold text-sm`}>
          {servicesArray.map((service, index) => (
            <p key={index}>{service}</p>
          ))}
        </div>
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
