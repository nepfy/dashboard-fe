"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RedirectToSignIn, SignedOut, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const onboardingComplete = user?.publicMetadata?.onboardingComplete;

      if (onboardingComplete) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Carregando, por favor aguarde!</p>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
