import type { CompleteProjectData } from "#/app/project/types/project";
import Header from "./Header";
import Hero from "./Hero";
import ServicesFooter from "./ServiceFooter";

interface IntroSectionProps {
  data?: CompleteProjectData;
}

export default function IntroSection({ data }: IntroSectionProps) {
  return (
    <>
      {data?.companyName &&
        data?.companyEmail &&
        data?.ctaButtonTitle &&
        data?.pageTitle &&
        data?.createdAt &&
        data?.services &&
        data?.pageSubtitle && (
          <div id="intro" className="w-full h-full max-w-[1440px] mx-auto">
            <div className="w-full h-full flex flex-col px-8 py-12">
              <Header
                companyName={data?.companyName}
                companyEmail={data?.companyEmail}
                ctaButtonTitle={data?.ctaButtonTitle}
                color={data?.mainColor}
              />

              <div className="flex-1 flex flex-col justify-center">
                <Hero pageTitle={data?.pageTitle} createdAt={data?.createdAt} />
              </div>

              <ServicesFooter
                services={data?.services}
                pageSubtitle={data?.pageSubtitle}
                ctaButtonTitle={data?.ctaButtonTitle}
              />
            </div>
          </div>
        )}
    </>
  );
}
