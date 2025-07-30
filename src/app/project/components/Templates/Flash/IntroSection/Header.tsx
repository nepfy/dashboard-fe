import type { HeaderProps } from "./intro-section";

export default function Header({
  companyName,
  companyEmail,
  ctaButtonTitle,
  isSmallHeight = false,
}: HeaderProps) {
  const ctaButtonClasses =
    "font-semibold text-xs text-white-neutral-light-100 bg-black rounded-full";

  const handleEmailClick = () => {
    if (companyEmail) {
      window.location.href = `mailto:${companyEmail}`;
    }
  };

  return (
    <>
      {companyName && companyEmail && ctaButtonTitle && (
        <div
          id="intro-header-container"
          className="text-white-neutral-light-100 flex justify-between items-center overflow-hidden"
        >
          <p
            id="intro-company-name"
            className={`font-semibold ${isSmallHeight ? "text-sm" : "text-lg"}`}
          >
            {companyName}
          </p>

          <div id="intro-company-email" className="hidden lg:flex items-center">
            <p className="font-semibold text-sm mr-11">{companyEmail}</p>
            <button
              className={`${ctaButtonClasses} p-5 cursor-pointer`}
              onClick={handleEmailClick}
            >
              {ctaButtonTitle}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
