"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RedirectToSignIn, SignedOut, useUser } from "@clerk/nextjs";
import type { OnboardingStatusApiResponse } from "#/types/onboarding";

function checkIsMainDomain(hostname: string): boolean {
  return (
    hostname === "staging-app.nepfy.com" ||
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
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || hasRedirected) {
      return;
    }

    const routeUser = async () => {
      try {
        const response = await fetch("/api/onboarding/status", {
          cache: "no-store",
        });

        if (response.ok) {
          const result = (await response.json()) as OnboardingStatusApiResponse;
          if (result.success && result.data && !hasRedirected) {
            setHasRedirected(true);
            router.push(
              result.data.needsOnboarding ? "/onboarding" : "/dashboard"
            );
            return;
          }
        }
      } catch (error) {
        console.error("Failed to determine onboarding status:", error);
      }

      if (!hasRedirected) {
        const onboardingComplete = Boolean(
          user.publicMetadata?.onboardingComplete
        );
        setHasRedirected(true);
        router.push(onboardingComplete ? "/dashboard" : "/onboarding");
      }
    };

    routeUser();
  }, [user, isLoaded, router, hasRedirected]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
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
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  // If this is a subdomain, middleware should have rewritten to project page
  // If we reach here on a subdomain, something went wrong
  if (!isMainDomain) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Página não encontrada</p>
      </div>
    );
  }

  // Render main domain component
  return <MainDomainHome />;
}
