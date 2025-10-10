import { FlashProjectData } from "#/types/template-data";
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
  projectData: FlashProjectData;
}

export default function Flash({ projectData }: FlashProps) {
  return (
    <div className="p-6">
      <p className="mb-4">
        <span className="font-semibold">Project:</span>{" "}
        {projectData.project.projectName}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Template Type:</span>{" "}
        {projectData.project.templateType}
      </p>

      <FlashIntro {...projectData.template.introduction.section} />
      <FlashAboutUs {...projectData.template.aboutUs} />
      <FlashTeam {...projectData.template.team.section} />
      <FlashExpertise {...projectData.template.expertise.section} />
      <FlashResults {...projectData.template.results.section} />
      <FlashTestimonials {...projectData.template.testimonials.section} />
      <FlashSteps {...projectData.template.steps.section} />
      <FlashInvestment {...projectData.template.investment} />
      <FlashPlans {...projectData.template.plans.section} />
      <FlashFAQ {...projectData.template.faq.section} />
      <FlashFooter {...projectData.template.footer.section} />
    </div>
  );
}
