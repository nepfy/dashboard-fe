import HamburgerButton from "./HamburgerButton";
import type { HeaderProps } from "./intro-section";

export default function Header({
  companyName,
  companyEmail,
  ctaButtonTitle,
}: HeaderProps) {
  const ctaButtonClasses =
    "font-semibold text-xs text-white-neutral-light-100 bg-black rounded-full";

  return (
    <div className="text-white-neutral-light-100 flex justify-between items-center">
      <p className="font-semibold text-lg">{companyName}</p>

      <div className="hidden lg:flex items-center">
        <p className="font-semibold text-sm mr-11">{companyEmail}</p>
        <button className={`${ctaButtonClasses} p-5`}>{ctaButtonTitle}</button>
      </div>

      <HamburgerButton />
    </div>
  );
}
