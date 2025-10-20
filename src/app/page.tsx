"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RedirectToSignIn, SignedOut, useUser } from "@clerk/nextjs";

function checkIsMainDomain(hostname: string): boolean {
  return (
    hostname === "staging-app.nepfy.com.br" ||
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

export default function Home() {
  const [isMainDomain, setIsMainDomain] = useState<boolean | null>(null);
  const [, setIsSubdomain] = useState<boolean>(false);

  useEffect(() => {
    // Client-side hostname detection
    const hostname = window.location.hostname;
    const mainDomain = checkIsMainDomain(hostname);
    setIsMainDomain(mainDomain);

    // Check if middleware set subdomain headers
    const isSubdomainPage =
      document
        .querySelector('meta[name="x-is-subdomain"]')
        ?.getAttribute("content") === "true";
    setIsSubdomain(isSubdomainPage);

    // If it's a subdomain but middleware didn't handle it, something went wrong
    if (!mainDomain && !isSubdomainPage) {
      console.log("Subdomain detected but not handled by middleware");
    }
  }, []);

  // Loading state while determining domain
  if (isMainDomain === null) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Carregando...</p>
      </div>
    );
  }

  // If this is a subdomain, middleware should have rewritten to project page
  // If we reach here on a subdomain, something went wrong
  if (!isMainDomain) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Página não encontrada</p>
      </div>
    );
  }

  // Render main domain component
  return <MainDomainHome />;
}
