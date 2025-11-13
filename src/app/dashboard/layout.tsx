"use client";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      setIsCheckingOnboarding(false);
      router.push("/login");
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
            router.replace("/onboarding?recovery=1");
            return;
          }
        }
      } catch (error) {
        console.error("Failed to verify onboarding status:", error);
      } finally {
        if (isMounted) {
          setIsCheckingOnboarding(false);
        }
      }

      if (user.unsafeMetadata.stripe) {
        const hasActiveSubscription = (
          user.unsafeMetadata.stripe as { subscriptionActive?: boolean }
        )?.subscriptionActive;

        if (!hasActiveSubscription) {
          router.push("/planos");
        }
      }
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [user, isLoaded, router]);

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

          <div className="flex h-screen flex-col overflow-scroll">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </CopyLinkCacheProvider>
  );
}
