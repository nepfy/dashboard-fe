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
  const mainColor = data?.mainColor || "#4F21A1";

  const gradientStyle = {
    background: `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, ${mainColor} 64.9%, #A46EDB 81.78%)`,
  };

  const mobileGradient = {
    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), radial-gradient(154.7% 130.34% at 7.84% 8.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`,
    backdropFilter: `blur(120px)`,
  };

  return (
    <>
      <div className="hidden lg:block w-full px-6 py-11" style={gradientStyle}>
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
      </div>

      <div className="block lg:hidden w-full px-6 py-11" style={mobileGradient}>
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

        <input
          type="checkbox"
          id="hamburger-toggle"
          className="hidden mobile-menu-toggle"
        />

        <MobileMenu ctaButtonTitle={data?.ctaButtonTitle} />
      </div>
    </>
  );
}
