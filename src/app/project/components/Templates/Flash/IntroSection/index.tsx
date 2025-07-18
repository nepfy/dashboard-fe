import type { CompleteProjectData } from "#/app/project/types/project";
import Header from "./Header";
import Hero from "./Hero";
import ServicesFooter from "./ServiceFooter";
import MobileMenu from "./MobileMenu";
import { MOBILE_MENU_STYLES } from "./styles";

interface IntroSectionProps {
  data?: CompleteProjectData;
}

export default function IntroSection({ data }: IntroSectionProps) {
  return (
    <div
      className="w-full px-6 py-11"
      style={{ backgroundColor: data?.mainColor || "#4F21A1" }}
    >
      <style dangerouslySetInnerHTML={{ __html: MOBILE_MENU_STYLES }} />

      <Header
        companyName={data?.companyName}
        companyEmail={data?.companyEmail}
        ctaButtonTitle={data?.ctaButtonTitle}
      />

      <Hero pageTitle={data?.pageTitle} createdAt={data?.createdAt} />

      <ServicesFooter
        services={data?.services}
        pageSubtitle={data?.pageSubtitle}
        ctaButtonTitle={data?.ctaButtonTitle}
      />

      {/* Hidden checkbox for mobile menu toggle */}
      <input
        type="checkbox"
        id="hamburger-toggle"
        className="hidden mobile-menu-toggle"
      />

      <MobileMenu ctaButtonTitle={data?.ctaButtonTitle} />
    </div>
  );
}
