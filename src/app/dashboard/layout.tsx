"use client";

import Sidebar from "./components/Sidebar";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { CopyLinkCacheProvider } from "#/contexts/CopyLinkCacheContext";
import type { OnboardingStatusApiResponse } from "#/types/onboarding";
import { LoaderCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      setIsCheckingOnboarding(false);
      if (!hasRedirected) {
        setHasRedirected(true);
        router.push("/login");
      }
      return;
    }

    if (hasRedirected) {
      return;
    }

    // Prevent multiple redirects
    if (hasRedirectedRef.current) {
      setIsCheckingOnboarding(false);
      return;
    }

    let isMounted = true;

    const verifyAccess = async () => {
      try {
        const response = await fetch("/api/onboarding/status", {
          cache: "no-store",
        });

        if (response.ok) {
          const result = (await response.json()) as OnboardingStatusApiResponse;
          if (result.success && result.data.needsOnboarding) {
            // Only redirect if we're not already on onboarding page
            if (!pathname?.startsWith("/onboarding")) {
              hasRedirectedRef.current = true;
              router.replace("/onboarding?recovery=1");
              return;
            }
          }
        }
      } catch (error) {
        console.error("Failed to verify onboarding status:", error);
      } finally {
        if (isMounted) {
          setIsCheckingOnboarding(false);
        }
      }

      if (user.unsafeMetadata.stripe && isMounted && !hasRedirected) {
        const hasActiveSubscription = (
          user.unsafeMetadata.stripe as { subscriptionActive?: boolean }
        )?.subscriptionActive;

        if (!hasActiveSubscription && !pathname?.startsWith("/planos")) {
          router.push("/planos");
        }
      }
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [user, isLoaded, hasRedirected, router, pathname]);

  if (!isLoaded || isCheckingOnboarding) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="text-primary-light-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <CopyLinkCacheProvider>
      <div className="relative bg-gray-50">
        <div className="relative grid h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <div className="flex h-screen flex-col overflow-scroll bg-gray-50">
            <main className="flex-1 bg-gray-50">{children}</main>
          </div>
        </div>
      </div>
    </CopyLinkCacheProvider>
  );
}
