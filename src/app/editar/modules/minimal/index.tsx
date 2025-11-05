import { useEditor } from "../../contexts/EditorContext";
import MinimalIntro from "./Intro";
import MinimalAboutUs from "./AboutUs";
import MinimalExpertise from "./Expertise";
import MinimalInvestment from "./Investment";
import MinimalPlans from "./Plans";
import MinimalFAQ from "./FAQ";
import MinimalFooter from "./Footer";

export default function Minimal() {
  const { projectData } = useEditor();

  if (!projectData?.proposalData) {
    return null;
  }
  return (
    <div className="font-manrope overflow-hidden p-3">
      <MinimalIntro
        {...projectData?.proposalData?.introduction}
        mainColor={projectData?.mainColor}
      />
      <MinimalAboutUs
        {...projectData?.proposalData?.aboutUs}
        mainColor={projectData?.mainColor}
      />
      <MinimalExpertise {...projectData?.proposalData?.expertise} />
      <MinimalInvestment
        {...projectData?.proposalData?.investment}
        mainColor={projectData?.mainColor}
        hideProjectScope={projectData?.proposalData?.escope?.hideSection}
      />
      <MinimalPlans
        {...projectData?.proposalData?.plans}
        mainColor={projectData?.mainColor}
      />
      <MinimalFAQ
        {...projectData?.proposalData?.faq}
        mainColor={projectData?.mainColor}
      />
      <MinimalFooter
        {...projectData?.proposalData?.footer}
        validity={projectData?.projectValidUntil}
        mainColor={projectData?.mainColor}
      />
    </div>
  );
}

