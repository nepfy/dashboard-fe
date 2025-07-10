"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RedirectToSignIn, SignedOut, useUser } from "@clerk/nextjs";

function checkIsMainDomain(hostname: string): boolean {
  return (
    hostname === "app.nepfy.com" ||
    hostname === "localhost:3000" ||
    hostname === "nepfy.com" ||
    hostname === "www.nepfy.com" ||
    hostname === "localhost"
  );
}

// Component for main domain (with Clerk)
function MainDomainHome() {
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

// Component for subdomains (without Clerk)
function SubdomainHome() {
  return (
    <div className="h-screen flex justify-center items-center">
      <p>Página não encontrada</p>
    </div>
  );
}

export default function Home() {
  const [isMainDomain, setIsMainDomain] = useState<boolean | null>(null);

  useEffect(() => {
    // Client-side hostname detection
    const hostname = window.location.hostname;
    setIsMainDomain(checkIsMainDomain(hostname));
  }, []);

  // Loading state while determining domain
  if (isMainDomain === null) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Carregando...</p>
      </div>
    );
  }

  // Render appropriate component based on domain
  if (isMainDomain) {
    return <MainDomainHome />;
  }

  return <SubdomainHome />;
}
