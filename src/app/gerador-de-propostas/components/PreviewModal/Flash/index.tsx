import type { CompleteProjectData } from "#/app/project/types/project";
import IntroSectionPreview from "./IntroSectionPreview";
import BusinessSectionPreview from "./BusinessSectionPreview";
import TeamSectionPreview from "./TeamSectionPreview";
import ExpertiseSectionPreview from "./ExpertiseSectionPreview";
import ResultsSectionPreview from "./ResultsSectionPreview";
import ClientSectionPreview from "./ClientSectionPreview";
import ProcessSectionPreview from "./ProcessSectionPreview";
import ProcessListSectionPreview from "./ProcessListSectionPreview";
import CTASectionPreview from "./CTASectionPreview";
import TestimonialsSectionPreview from "./TestimonialsSectionPreview";
import InvestmentSectionPreview from "./InvestmentSectionPreview";
import DeliverySectionPreview from "./DeliverySectionPreview";
import PlansSectionPreview from "./PlansSectionPreview";
import TermsSectionPreview from "./TermsSectionPreview";
import FAQSectionPreview from "./FAQSectionPreview";
import FinalMessageSectionPreview from "./FinalMessageSectionPreview";

interface FlashTemplatePreviewProps {
  data?: CompleteProjectData;
}

export default function FlashTemplatePreview({
  data,
}: FlashTemplatePreviewProps) {
  const initialGradient = `radial-gradient(220% 130% at 10.84% 2.05003%, #000000 10%, #000000 10%, ${data?.mainColor} 45.22%, ${data?.mainColor} 54.9%, ${data?.mainColor} 34.9%, #000000 61.78%)`;

  return (
    <div
      className="font-manrope relative w-full"
      style={{
        background: initialGradient,
      }}
    >
      {/* Intro Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <IntroSectionPreview data={data} />
        </div>
      </div>

      {/* Business Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <BusinessSectionPreview data={data} />
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="overflow-hidden">
        <div
          style={{
            background: `linear-gradient(
          190deg, 
          #000000 0%,
          #000000 10%,
          #000000 20%,
          #000000 30%,
          #000000 30%,
          #000000 40%,
          ${data?.mainColor} 50%, 
          ${data?.mainColor} 55%, 
          ${data?.mainColor} 65%, 
          #000000 70%, 
          #000000 80%, 
          #000000 90%, 
          #000000 100%
          )`,
          }}
        >
          <TeamSectionPreview data={data} />
          <ExpertiseSectionPreview data={data} />
        </div>

        <div className="bg-black">
          <ResultsSectionPreview data={data} />
          <ClientSectionPreview data={data} />
        </div>

        <div
          style={{
            background: `${data?.mainColor}`,
          }}
        >
          <ProcessSectionPreview data={data} />
          <ProcessListSectionPreview data={data} />
        </div>

        <CTASectionPreview data={data} />

        <div
          style={{
            background: `linear-gradient(
              160deg,
              #000000 0%,
              #000000 10%,
              ${data?.mainColor} 25%,
              #000000 30%,
              #000000 60%,
              #000000 80%,
              #000000 100%
            )`,
          }}
        >
          <TestimonialsSectionPreview data={data} />
          <InvestmentSectionPreview data={data} />
          <DeliverySectionPreview data={data} />
          <PlansSectionPreview data={data} />
          <TermsSectionPreview data={data} />
        </div>

        <FAQSectionPreview data={data} />
        <FinalMessageSectionPreview data={data} />
      </div>
    </div>
  );
}
