/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RedirectToSignIn, SignedOut, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const onboardingComplete = user?.publicMetadata?.onboardingComplete;

  useEffect(() => {
    if (onboardingComplete) {
      router.push("/dashboard");
    } else {
      router.push("/onboarding");
    }
  }, [onboardingComplete]);

  if (!isLoaded)
    return (
      <div className="h-screen flex justify-center items-center">
        <p> Carrregando, por favor aguarde! </p>
      </div>
    );

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
