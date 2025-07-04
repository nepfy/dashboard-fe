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

// Mapeamento dos formulários e previews
const stepComponents = {
  1: { Form: IntroForm, Preview: IntroPreview },
  2: { Form: AboutYourBusinessForm, Preview: AboutBusinessPreview },
  3: { Form: AboutYourTeamForm, Preview: TeamPreview },
  4: { Form: AboutYourExpertiseForm, Preview: ExpertisePreview },
  5: { Form: AboutYourResultsForm, Preview: ResultsPreview },
  6: { Form: AboutYourClientsForm, Preview: ClientsPreview },
  7: { Form: AboutYourProcessForm, Preview: ProcessPreview },
  8: { Form: CallToActionForm, Preview: CTAPreview },
  9: { Form: TestimonialsForm, Preview: TestimonialsPreview },
  10: { Form: InvestmentForm, Preview: InvestmentPreview },
  11: { Form: ProjectDeliveriesForm, Preview: DeliveriesPreview },
  12: { Form: PlansForm, Preview: PlansPreview },
  13: { Form: TermsAndConditionsForm, Preview: TermsPreview },
  14: { Form: FAQForm, Preview: FAQPreview },
  15: { Form: FinalMessageForm, Preview: FinalMessagePreview },
  16: { Form: AccessForm, Preview: AccessPreview },
};

export default function MultiStepForm() {
  const { currentStep } = useProjectGenerator();

  const currentComponents =
    stepComponents[currentStep as keyof typeof stepComponents];

  if (!currentComponents) {
    return (
      <div className="h-full flex items-center justify-center p-7">
        <div className="text-center">
          <h2 className="text-white-neutral-light-800 text-xl font-medium mb-2">
            Step não encontrado
          </h2>
          <p className="text-white-neutral-light-500">
            O step {currentStep} não foi configurado.
          </p>
        </div>
      </div>
    );
  }

  const { Form, Preview } = currentComponents;

  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-full xl:w-1/2 h-full overflow-hidden">
        <Form />
      </div>

      <div className="hidden xl:block xl:w-1/2 border-l border-white-neutral-light-300">
        <Preview />
      </div>
    </div>
  );
}

export const useCurrentStep = () => {
  const { currentStep } = useProjectGenerator();

  const stepInfo = {
    1: { title: "Introdução", description: "Configure a apresentação inicial" },
    2: { title: "Sobre o Negócio", description: "Conte sobre sua empresa" },
    3: { title: "Sua Equipe", description: "Apresente seu time" },
    4: { title: "Expertise", description: "Mostre sua experiência" },
    5: { title: "Resultados", description: "Demonstre seus resultados" },
    6: { title: "Clientes", description: "Apresente seus clientes" },
    7: { title: "Processo", description: "Explique seu processo" },
    8: { title: "Chamada para Ação", description: "Configure o CTA" },
    9: { title: "Depoimentos", description: "Adicione depoimentos" },
    10: { title: "Investimento", description: "Configure preços" },
    11: { title: "Entregas", description: "Defina entregas do projeto" },
    12: { title: "Planos", description: "Configure planos de serviço" },
    13: { title: "Termos", description: "Adicione termos e condições" },
    14: { title: "FAQ", description: "Perguntas frequentes" },
    15: { title: "Mensagem Final", description: "Finalize a proposta" },
    16: { title: "Acesso", description: "Configure acesso à proposta" },
  };

  return {
    currentStep,
    stepInfo: stepInfo[currentStep as keyof typeof stepInfo] || {
      title: "Step",
      description: "Configuração",
    },
    totalSteps: Object.keys(stepInfo).length,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 16,
  };
};
