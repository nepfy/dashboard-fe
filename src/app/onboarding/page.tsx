// page.tsx
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "#/app/actions/onboarding/_actions";
import IntroSlider from "#/components/IntroSlider";
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
      setError("Um erro ocorreu, por favor, tente mais tarde.");
      console.error(err);
    }
  };

  return (
    <FormProvider>
      <div className="grid place-items-center pt-20 pb-10 sm:pb-0 sm:pt-0 sm:min-h-screen">
        <div className="grid xl:grid-cols-2 w-full min-h-screen">
          <IntroSlider
            title="Gere propostas"
            description="Prepare uma proposta visualmente cativante e bem estruturada."
          />

          <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20">
            <div className="w-full flex items-center justify-center space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              <MultiStepForm onComplete={handleOnboardingComplete} />
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
