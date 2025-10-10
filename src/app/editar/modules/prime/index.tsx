import { PrimeProjectData } from "#/types/template-data";
import PrimeIntro from "./Intro";
import PrimeMarquee from "./Marquee";
import PrimeAboutUs from "./AboutUs";
import PrimeTeam from "./Team";
import PrimeExpertise from "./Expertise";
import PrimeResults from "./Results";
import PrimeClients from "./Clients";
import PrimeSteps from "./Steps";
import PrimeTestimonials from "./Testimonials";
import PrimeInvestment from "./Investment";
import PrimeDelivererables from "./Delivererables";
import PrimePlans from "./Plans";
import PrimeTermsAndConditions from "./TermsAndConditions";
import PrimeFAQ from "./FAQ";
import PrimeFooter from "./Footer";
import PrimeCTA from "./CTA";

interface PrimeProps {
  projectData: PrimeProjectData;
}

export default function Prime({ projectData }: PrimeProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prime Template Editor</h1>
      <p className="mb-4">
        <span className="font-semibold">Project:</span>{" "}
        {projectData.project.projectName}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Template Type:</span>{" "}
        {projectData.project.templateType}
      </p>
      {/* Add your Prime template editor UI here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Template Data:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
          {JSON.stringify(projectData, null, 2)}
        </pre>
      </div>

      <PrimeIntro {...projectData.template.introduction.section} />
      <PrimeMarquee marquee={projectData.template.introduction.marquee} />
      <PrimeAboutUs {...projectData.template.aboutUs} />
      <PrimeTeam {...projectData.template.team.section} />
      <PrimeExpertise {...projectData.template.expertise.section} />
      <PrimeResults {...projectData.template.results.section} />
      <PrimeClients {...projectData.template.clients.section} />
      <PrimeCTA {...projectData.template.cta} />
      <PrimeSteps {...projectData.template.steps.section} />
      <PrimeTestimonials {...projectData.template.testimonials.section} />
      <PrimeInvestment {...projectData.template.investment} />
      <PrimeDelivererables {...projectData.template.deliverables.section} />
      <PrimePlans {...projectData.template.plans.section} />
      <PrimeTermsAndConditions
        {...projectData.template.termsConditions.section}
      />
      <PrimeFAQ {...projectData.template.faq.section} />
      <PrimeFooter {...projectData.template.footer} />
    </div>
  );
}
