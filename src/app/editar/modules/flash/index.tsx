import { TemplateData } from "#/types/template-data";
import FlashIntro from "./Intro";
import FlashAboutUs from "./AboutUs";
import FlashTeam from "./Team";
import FlashExpertise from "./Expertise";
import FlashResults from "./Results";
import FlashSteps from "./Steps";
import FlashInvestment from "./Investment";
import FlashPlans from "./Plans";
import FlashFAQ from "./FAQ";
import FlashFooter from "./Footer";
import FlashTestimonials from "./Testimonials";

interface FlashProps {
  projectData: TemplateData;
}

export default function Flash({ projectData }: FlashProps) {
  return (
    <div className="p-3 font-manrope">
      <FlashIntro {...projectData?.proposalData?.introduction} />
      <FlashAboutUs {...projectData?.proposalData?.aboutUs} />
      <FlashTeam {...projectData?.proposalData?.team} />
      <FlashExpertise {...projectData?.proposalData?.expertise} />
      <FlashResults {...projectData?.proposalData?.results} />
      <FlashTestimonials {...projectData?.proposalData?.testimonials} />
      <FlashSteps {...projectData?.proposalData?.steps} />
      <FlashInvestment {...projectData?.proposalData?.investment} />
      <FlashPlans {...projectData?.proposalData?.plans} />
      <FlashFAQ {...projectData?.proposalData?.faq} />
      <FlashFooter
        {...projectData?.proposalData?.footer}
        validity={projectData?.proposalData?.introduction?.validity}
      />
    </div>
  );
}
