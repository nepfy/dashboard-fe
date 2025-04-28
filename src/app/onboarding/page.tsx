"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Navbar from "#/components/Navbar";
import Footer from "#/components/Footer";
import IntroSlider from "#/components/IntroSlider";

import { completeOnboarding } from "#/app/actions/onboarding/_actions";
import MultiStepForm from "#/app/onboarding/components/MultiStepForm";
import { FormProvider } from "#/app/onboarding/helpers/FormContext";

export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleOnboardingComplete = async (formData: FormData) => {
    try {
      const res = await completeOnboarding(formData);

      if (res?.message) {
        await user?.reload();
        router.push("/dashboard");
      }

      if (res?.error) {
        setError(res.error);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Um erro ocorreu, por favor, tente mais tarde.");
      }
    }
  };

  return (
    <FormProvider>
      <div className="grid place-items-center pb-0 pt-0 h-screen min-h-[740px]">
        <Navbar />
        <div className="grid xl:grid-cols-2 w-full h-full relative">
          <IntroSlider
            title="Gere propostas"
            description="Prepare uma proposta visualmente cativante e bem estruturada."
          />

          <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20 mb-6 sm:mb-0">
            <div className="w-full flex flex-col items-center justify-center space-y-8 h-full">
              <MultiStepForm
                onComplete={handleOnboardingComplete}
                error={error}
              />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </FormProvider>
  );
}
