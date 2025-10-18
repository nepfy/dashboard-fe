// import PrimeIntro from "./Intro";
// import PrimeMarquee from "./Marquee";
// import PrimeAboutUs from "./AboutUs";
// import PrimeTeam from "./Team";
// import PrimeExpertise from "./Expertise";
// import PrimeResults from "./Results";
// import PrimeClients from "./Clients";
// import PrimeSteps from "./Steps";
// import PrimeTestimonials from "./Testimonials";
// import PrimeInvestment from "./Investment";
// import PrimeDelivererables from "./Delivererables";
// import PrimePlans from "./Plans";
// import PrimeTermsAndConditions from "./TermsAndConditions";
// import PrimeFAQ from "./FAQ";
// import PrimeFooter from "./Footer";
// import PrimeCTA from "./CTA";
import { useEditor } from "../../contexts/EditorContext";

export default function Prime() {
  const { projectData } = useEditor();

  if (!projectData) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prime Template Editor</h1>
      <p className="mb-4">
        <span className="font-semibold">Project:</span>{" "}
        {projectData.projectName}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Template Type:</span>{" "}
        {projectData.templateType}
      </p>
      {/* Add your Prime template editor UI here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Template Data:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
          {JSON.stringify(projectData, null, 2)}
        </pre>
      </div>

      {/* <PrimeIntro {...projectData.proposalData.introduction} />
      <PrimeMarquee marquee={projectData.proposalData.introduction.marquee} />
      <PrimeAboutUs {...projectData.proposalData.aboutUs} />
      <PrimeTeam {...projectData.proposalData.team} />
      <PrimeExpertise {...projectData.proposalData.expertise} />
      <PrimeResults {...projectData.proposalData.results} />
      <PrimeClients {...projectData.proposalData.clients} />
      <PrimeCTA {...projectData.proposalData.cta} />
      <PrimeSteps {...projectData.proposalData.steps} />
      <PrimeTestimonials {...projectData.proposalData.testimonials} />
      <PrimeInvestment {...projectData.proposalData.investment} />
      <PrimeDelivererables {...projectData.proposalData.deliverables} />
      <PrimePlans {...projectData.proposalData.plans} />
      <PrimeTermsAndConditions {...projectData.proposalData.termsConditions} />
      <PrimeFAQ {...projectData.proposalData.faq} />
      <PrimeFooter {...projectData.proposalData.footer} /> */}
    </div>
  );
}
