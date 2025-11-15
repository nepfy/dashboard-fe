import { useEditor } from "../../contexts/EditorContext";
import MinimalIntro from "./Intro";
import MinimalAboutUs from "./AboutUs";
import MinimalExpertise from "./Expertise";

import MinimalPlans from "./Plans";
import MinimalScope from "./Scope";
import MinimalTermsAndConditions from "./MinimalTermsAndConditions";
import MinimalFAQ from "./FAQ";
import MinimalFooter from "./Footer";

export default function Minimal() {
  const { projectData } = useEditor();

  if (!projectData?.proposalData) {
    return null;
  }
  return (
    <div className="font-overused overflow-hidden">
      <MinimalIntro {...projectData?.proposalData?.introduction} />
      <MinimalAboutUs {...projectData?.proposalData?.aboutUs} />
      <MinimalExpertise
        {...projectData?.proposalData?.expertise}
        mainColor={projectData?.mainColor}
      />
      <MinimalScope
        hideProjectScope={projectData?.proposalData?.escope?.hideSection}
        projectScope={projectData?.proposalData?.investment?.projectScope}
      />

      <MinimalPlans
        {...projectData?.proposalData?.plans}
        mainColor={projectData?.mainColor}
      />
      <MinimalTermsAndConditions
        {...projectData?.proposalData?.termsConditions}
      />
      <MinimalFAQ {...projectData?.proposalData?.faq} />
      <MinimalFooter
        {...projectData?.proposalData?.footer}
        validity={projectData?.projectValidUntil}
        buttonConfig={projectData?.buttonConfig || { buttonTitle: "" }}
      />
    </div>
  );
}
