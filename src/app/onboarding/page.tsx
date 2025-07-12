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

  const date = new Date();

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
      <div className="grid place-items-center pb-2 sm:pb-0 pt-0 h-screen min-h-[740px]">
        <Navbar />
        <div className="flex items-center justify-center gap-0 w-full h-full relative">
          <IntroSlider />

          <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20 mb-6 sm:mb-0 box-border w-full lg:w-1/2">
            <div className="w-full flex flex-col items-center justify-center space-y-8 h-full box-border">
              <MultiStepForm
                onComplete={handleOnboardingComplete}
                error={error}
              />
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute z-40 bottom-5 left-5 right-0">
          <Footer />
        </div>
        <div className="text-white-neutral-light-400 xl:text-primary-light-200 flex items-center sm:items-end w-full h-[80px] sm:h-full box-border lg:hidden">
          <span className="px-8 sm:py-6">
            &copy; {date.getFullYear()} Nepfy
          </span>
        </div>
      </div>
    </FormProvider>
  );
}
