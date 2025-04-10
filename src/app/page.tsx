"use client";

import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Onboarding from "./onboarding/page";
import Dashboard from "./dashboard/page";

export default function Home() {
  const { user } = useUser();

  const onboardingCompleted = user?.publicMetadata.onboardingCompleted;
  return (
    <>
      <SignedIn>
        {onboardingCompleted ? <Dashboard /> : <Onboarding />}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
