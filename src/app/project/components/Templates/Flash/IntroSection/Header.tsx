import MobileMenu from "./MobileMenu";
import type { HeaderProps } from "./intro-section";

export default function Header({
  companyName,
  companyEmail,
  ctaButtonTitle,
  color,
}: HeaderProps) {
  const ctaButtonClasses =
    "font-semibold text-xs text-white-neutral-light-100 bg-black rounded-full";

  return (
    <>
      {companyName && companyEmail && ctaButtonTitle && (
        <div className="text-white-neutral-light-100 flex justify-between items-center">
          <p className="font-semibold text-lg">{companyName}</p>

          <div className="hidden lg:flex items-center">
            <p className="font-semibold text-sm mr-11">{companyEmail}</p>
            <button className={`${ctaButtonClasses} p-5`}>
              {ctaButtonTitle}
            </button>
          </div>

          <MobileMenu ctaButtonTitle={ctaButtonTitle} color={color} />
        </div>
      )}
    </>
  );
}
