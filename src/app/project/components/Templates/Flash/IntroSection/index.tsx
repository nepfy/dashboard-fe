import type { CompleteProjectData } from "#/app/project/types/project";
import Header from "./Header";
import Hero from "./Hero";
import ServicesFooter from "./ServiceFooter";

interface IntroSectionProps {
  data?: CompleteProjectData;
}

export default function IntroSection({ data }: IntroSectionProps) {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col px-6 py-11">
        <Header
          companyName={data?.companyName}
          companyEmail={data?.companyEmail}
          ctaButtonTitle={data?.ctaButtonTitle}
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
  );
}
