import { useEditor } from "../../contexts/EditorContext";
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

export default function Flash() {
  const { projectData } = useEditor();

  if (!projectData?.proposalData) {
    return null;
  }
  return (
    <div className="font-manrope overflow-hidden p-3">
      <FlashIntro
        {...projectData?.proposalData?.introduction}
        mainColor={projectData?.mainColor}
      />
      <FlashAboutUs
        {...projectData?.proposalData?.aboutUs}
        mainColor={projectData?.mainColor}
      />
      <FlashTeam
        {...projectData?.proposalData?.team}
        mainColor={projectData?.mainColor}
      />
      <FlashExpertise {...projectData?.proposalData?.expertise} />
      <FlashResults {...projectData?.proposalData?.results} />
      <FlashTestimonials
        {...projectData?.proposalData?.testimonials}
        mainColor={projectData?.mainColor}
      />
      <FlashSteps
        {...projectData?.proposalData?.steps}
        mainColor={projectData?.mainColor}
      />
      <FlashInvestment
        {...projectData?.proposalData?.investment}
        mainColor={projectData?.mainColor}
        hideProjectScope={projectData?.proposalData?.escope?.hideSection}
      />
      <FlashPlans
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
