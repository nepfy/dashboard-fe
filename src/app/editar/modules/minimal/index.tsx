import { useEditor } from "../../contexts/EditorContext";
import MinimalIntro from "./Intro";
import MinimalAboutUs from "./AboutUs";
import MinimalTeam from "./Team";
import MinimalExpertise from "./Expertise";
import MinimalResults from "./Results";
import MinimalSteps from "./Steps";
import MinimalInvestment from "./Investment";
import MinimalTestimonials from "./Testimonials";
import MinimalPlans from "./Plans";
// Reusing Flash components for sections with identical structure
import FlashFAQ from "../flash/FAQ";
import FlashFooter from "../flash/Footer";
import FlashScope from "../flash/Scope";

export default function Minimal() {
  const { projectData } = useEditor();

  if (!projectData?.proposalData) {
    return null;
  }
  return (
    <div className="overflow-hidden">
      <MinimalIntro
        {...projectData?.proposalData?.introduction}
        mainColor={projectData?.mainColor}
      />
      <MinimalAboutUs
        {...projectData?.proposalData?.aboutUs}
        mainColor={projectData?.mainColor}
      />
      <MinimalTeam
        {...projectData?.proposalData?.team}
        mainColor={projectData?.mainColor}
      />
      <MinimalExpertise
        {...projectData?.proposalData?.expertise}
        mainColor={projectData?.mainColor}
      />
      <MinimalResults
        {...projectData?.proposalData?.results}
        mainColor={projectData?.mainColor}
      />
      <MinimalTestimonials
        {...projectData?.proposalData?.testimonials}
        mainColor={projectData?.mainColor}
      />
      <MinimalSteps
        {...projectData?.proposalData?.steps}
        mainColor={projectData?.mainColor}
      />
      <MinimalInvestment
        {...projectData?.proposalData?.investment}
        mainColor={projectData?.mainColor}
        hideProjectScope={projectData?.proposalData?.escope?.hideSection}
      />
      <FlashScope
        hideProjectScope={projectData?.proposalData?.escope?.hideSection}
        projectScope={projectData?.proposalData?.investment?.projectScope}
      />
      <MinimalPlans
        {...projectData?.proposalData?.plans}
        mainColor={projectData?.mainColor}
      />
      <FlashFAQ
        {...projectData?.proposalData?.faq}
        mainColor={projectData?.mainColor}
      />
      <FlashFooter
        {...projectData?.proposalData?.footer}
        validity={projectData?.projectValidUntil}
        mainColor={projectData?.mainColor}
      />
    </div>
  );
}
