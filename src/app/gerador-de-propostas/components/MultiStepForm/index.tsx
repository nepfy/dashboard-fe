"use client";

import IntroForm from "#/app/gerador-de-propostas/components/MultiStep/IntroForm";
import AboutYourBusinessForm from "#/app/gerador-de-propostas/components/MultiStep/AboutYourBusinessForm";
import AboutYourTeamForm from "#/app/gerador-de-propostas/components/MultiStep/AboutYourTeamForm";
import AboutYourExpertiseForm from "#/app/gerador-de-propostas/components/MultiStep/AboutYourExpertiseForm";
import AboutYourResultsForm from "#/app/gerador-de-propostas/components/MultiStep/AboutYourResultsForm";
import AboutYourClientsForm from "#/app/gerador-de-propostas/components/MultiStep/AboutYourClientsForm";
import AboutYourProcessForm from "#/app/gerador-de-propostas/components/MultiStep/AboutYourProcessForm";
import CallToActionForm from "#/app/gerador-de-propostas/components/MultiStep/CallToActionForm";
import TestimonialsForm from "#/app/gerador-de-propostas/components/MultiStep/TestimonialsForm";
import InvestmentForm from "#/app/gerador-de-propostas/components/MultiStep/InvestmentForm";
import ProjectDeliveriesForm from "#/app/gerador-de-propostas/components/MultiStep/ProjectDeliveriesForm";
import PlansForm from "#/app/gerador-de-propostas/components/MultiStep/PlansForm";
import TermsAndConditionsForm from "#/app/gerador-de-propostas/components/MultiStep/TermsAndConditionsForm";
import FAQForm from "#/app/gerador-de-propostas/components/MultiStep/FAQForm";
import FinalMessageForm from "#/app/gerador-de-propostas/components/MultiStep/FinalMessageForm";
import AccessForm from "#/app/gerador-de-propostas/components/MultiStep/AccessForm";

import IntroPreview from "#/app/gerador-de-propostas/components/MultiPreview/IntroPreview";
import AboutBusinessPreview from "#/app/gerador-de-propostas/components/MultiPreview/AboutYourBusinessPreview";
import TeamPreview from "#/app/gerador-de-propostas/components/MultiPreview/TeamPreview";
import ExpertisePreview from "#/app/gerador-de-propostas/components/MultiPreview/ExpertisePreview";
import ResultsPreview from "#/app/gerador-de-propostas/components/MultiPreview/ResultsPreview";
import ClientsPreview from "#/app/gerador-de-propostas/components/MultiPreview/ClientsPreview";
import ProcessPreview from "#/app/gerador-de-propostas/components/MultiPreview/ProcessPreview";
import CTAPreview from "#/app/gerador-de-propostas/components/MultiPreview/CTAPreview";
import TestimonialsPreview from "#/app/gerador-de-propostas/components/MultiPreview/TestimonialsPreview";
import InvestmentPreview from "#/app/gerador-de-propostas/components/MultiPreview/InvestmentPreview";
import DeliveriesPreview from "#/app/gerador-de-propostas/components/MultiPreview/DeliveriesPreview";
import PlansPreview from "#/app/gerador-de-propostas/components/MultiPreview/PlansPreview";
import TermsPreview from "#/app/gerador-de-propostas/components/MultiPreview/TermsPreview";
import FAQPreview from "#/app/gerador-de-propostas/components/MultiPreview/FAQPreview";
import FinalMessagePreview from "#/app/gerador-de-propostas/components/MultiPreview/FinalMessagePreview";
import AccessPreview from "#/app/gerador-de-propostas/components/MultiPreview/AccessPreview";

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

// Mapeamento completo dos formulários e previews
const allStepComponents = {
  intro: { Form: IntroForm, Preview: IntroPreview },
  business: { Form: AboutYourBusinessForm, Preview: AboutBusinessPreview },
  team: { Form: AboutYourTeamForm, Preview: TeamPreview },
  expertise: { Form: AboutYourExpertiseForm, Preview: ExpertisePreview },
  results: { Form: AboutYourResultsForm, Preview: ResultsPreview },
  clients: { Form: AboutYourClientsForm, Preview: ClientsPreview },
  process: { Form: AboutYourProcessForm, Preview: ProcessPreview },
  cta: { Form: CallToActionForm, Preview: CTAPreview },
  testimonials: { Form: TestimonialsForm, Preview: TestimonialsPreview },
  investment: { Form: InvestmentForm, Preview: InvestmentPreview },
  deliveries: { Form: ProjectDeliveriesForm, Preview: DeliveriesPreview },
  plans: { Form: PlansForm, Preview: PlansPreview },
  terms: { Form: TermsAndConditionsForm, Preview: TermsPreview },
  faq: { Form: FAQForm, Preview: FAQPreview },
  finalMessage: { Form: FinalMessageForm, Preview: FinalMessagePreview },
  access: { Form: AccessForm, Preview: AccessPreview },
};

// Configuração dos steps por template
const templateStepConfigurations = {
  flash: [
    "intro",
    "business",
    "team",
    "expertise",
    "results",
    "clients",
    "process",
    "cta",
    "testimonials",
    "investment",
    "deliveries",
    "plans",
    "terms",
    "faq",
    "finalMessage",
    "access",
  ],
  prime: [
    "intro",
    "business",
    "team",
    "expertise",
    "results",
    "clients",
    "cta",
    "process",
    "testimonials",
    "investment",
    "deliveries",
    "plans",
    "terms",
    "faq",
    "finalMessage",
    "access",
  ],
  essencial: [
    "intro",
    "business",
    "team",
    "expertise",
    "results",
    "clients",
    "process",
    "cta",
    "testimonials",
    "investment",
    "deliveries",
    "plans",
    "terms",
    "faq",
    "finalMessage",
    "access",
  ],
  grid: [
    "intro",
    "business",
    "team",
    "expertise",
    "results",
    "testimonials",
    "plans",
    "faq",
    "finalMessage",
    "access",
  ],
};

export default function MultiStepForm() {
  const { currentStep, templateType } = useProjectGenerator();

  // Obter configuração dos steps para o template atual
  const templateKey =
    templateType?.toLowerCase() as keyof typeof templateStepConfigurations;
  const stepOrder =
    templateStepConfigurations[templateKey] || templateStepConfigurations.flash;

  // Calcular o step atual baseado na posição na configuração do template
  const currentStepIndex = Math.max(0, currentStep - 1);
  const currentStepKey = stepOrder[currentStepIndex];

  // Obter os componentes para o step atual
  const currentComponents =
    allStepComponents[currentStepKey as keyof typeof allStepComponents];

  if (!currentComponents) {
    return (
      <div className="h-full flex items-center justify-center p-7">
        <div className="text-center">
          <h2 className="text-white-neutral-light-800 text-xl font-medium mb-2">
            Step não encontrado
          </h2>
          <p className="text-white-neutral-light-500">
            O step {currentStep} não foi configurado para o template{" "}
            {templateType}.
          </p>
        </div>
      </div>
    );
  }

  const { Form, Preview } = currentComponents;

  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-full xl:w-2/5 h-full overflow-hidden">
        <Form />
      </div>

      <div className="hidden xl:block xl:w-3/5 border-l border-white-neutral-light-300">
        <Preview />
      </div>
    </div>
  );
}

export const useCurrentStep = () => {
  const { currentStep, templateType } = useProjectGenerator();

  // Obter configuração dos steps para o template atual
  const templateKey =
    templateType?.toLowerCase() as keyof typeof templateStepConfigurations;
  const stepOrder =
    templateStepConfigurations[templateKey] || templateStepConfigurations.flash;

  // Informações dos steps
  const stepInfo = {
    intro: {
      title: "Introdução",
      description: "Configure a apresentação inicial",
    },
    business: {
      title: "Sobre o Negócio",
      description: "Conte sobre sua empresa",
    },
    team: { title: "Sua Equipe", description: "Apresente seu time" },
    expertise: {
      title: "Suas Especializações",
      description: "Mostre sua experiência",
    },
    results: {
      title: "Seus Resultados",
      description: "Demonstre seus resultados",
    },
    clients: { title: "Seus Clientes", description: "Apresente seus clientes" },
    process: {
      title: "Etapas do Processo",
      description: "Explique seu processo",
    },
    cta: { title: "Chamada para Ação", description: "Configure o CTA" },
    testimonials: { title: "Depoimentos", description: "Adicione depoimentos" },
    investment: { title: "Investimento", description: "Configure preços" },
    deliveries: {
      title: "Entregas Incluídas",
      description: "Defina entregas do projeto",
    },
    plans: {
      title: "Planos e Valores",
      description: "Configure planos de serviço",
    },
    terms: {
      title: "Termos e Condições",
      description: "Adicione termos e condições",
    },
    faq: { title: "Perguntas Frequentes", description: "Perguntas frequentes" },
    finalMessage: {
      title: "Mensagem Final",
      description: "Finalize a proposta",
    },
    access: { title: "Acesso", description: "Configure acesso à proposta" },
  };

  // Calcular o step atual baseado na posição na configuração do template
  const currentStepIndex = Math.max(0, currentStep - 1);
  const currentStepKey = stepOrder[currentStepIndex];

  return {
    currentStep,
    currentStepIndex,
    currentStepKey,
    stepOrder,
    stepInfo: stepInfo[currentStepKey as keyof typeof stepInfo] || {
      title: "Step",
      description: "Configuração",
    },
    totalSteps: stepOrder.length,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === stepOrder.length,
    templateType,
  };
};
