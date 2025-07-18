import type { CompleteProjectData } from "#/app/project/types/project";
import IntroSection from "./IntroSection";
import PasswordSection from "./PasswordSection";
import ClientsSection from "./ClientsSection";
import BusinessSection from "./BusinessSection";
import ExpertiseSection from "./ExpertiseSection";
import ProcessSection from "./ProcessSection";
import ResultsSection from "./ResultsSection";
import TeamSection from "./TeamSection";
import PlansSection from "./PlansSection";
import CTASection from "./CTASection";
import FAQSection from "./FAQSection";
import FinalMessageSection from "./FinalMessageSection";
import TermsSection from "./TermsSection";
import TestimonialsSection from "./TestimonialsSection";
import DeliverySection from "./DeliverySection";
import InvestmentSection from "./InvestmentSection";

interface FlashTemplateProps {
  data?: CompleteProjectData;
}

export default function FlashTemplate({ data }: FlashTemplateProps) {
  return (
    <div className="font-manrope relative w-screen">
      <IntroSection data={data} />
      <PasswordSection />
      <ClientsSection />
      <BusinessSection />
      <ExpertiseSection />
      <ProcessSection />
      <ResultsSection />
      <TeamSection />
      <PlansSection />
      <CTASection />
      <FAQSection />
      <FinalMessageSection />
      <TermsSection />
      <TestimonialsSection />
      <DeliverySection />
      <InvestmentSection />
    </div>
  );
}
