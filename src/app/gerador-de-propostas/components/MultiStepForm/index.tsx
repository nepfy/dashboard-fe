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

import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

export default function MultiStepForm() {
  const { currentStep } = useProjectGenerator();

  if (currentStep === 1) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <IntroForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <AboutYourBusinessForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <AboutYourTeamForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 4) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <AboutYourExpertiseForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <AboutYourResultsForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 6) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <AboutYourClientsForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 7) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <AboutYourProcessForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 8) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <CallToActionForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 9) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <TestimonialsForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 10) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <InvestmentForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 11) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <ProjectDeliveriesForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 12) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <PlansForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 13) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <TermsAndConditionsForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 14) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <FAQForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 15) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <FinalMessageForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  if (currentStep === 16) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full h-full">
          <AccessForm />
        </div>

        <div className="hidden xl:block w-full h-full bg-primary-light-100">
          <IntroPreview />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full h-full">
        <IntroForm />
      </div>

      <div className="hidden xl:block w-full h-full bg-primary-light-100">
        <IntroPreview />
      </div>
    </div>
  );
}
