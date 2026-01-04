"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";

import Link from "next/link";
import type { OnboardingStatusApiResponse } from "#/types/onboarding";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      setIsChecking(false);
      router.push("/login");
      return;
    }

    const verifyAccess = async () => {
      try {
        // Don't redirect if we're on the success page - let users see the confetti!
        if (pathname === "/planos/success") {
          setIsChecking(false);
          return;
        }

        // Verificar se onboarding foi completado
        const response = await fetch("/api/onboarding/status", {
          cache: "no-store",
        });

        if (response.ok) {
          const result = (await response.json()) as OnboardingStatusApiResponse;
          if (result.success && result.data?.needsOnboarding) {
            // Se precisa completar onboarding, redirecionar
            router.replace("/onboarding");
            return;
          }
        }

        // Allow access if user is changing plan (query param) or if no subscription
        const isChangingPlan = searchParams?.get("change") === "true";

        if (!isChangingPlan) {
          // Parse stripe metadata (handle both object and JSON string)
          let hasActiveSubscription = false;
          const rawStripeData = user?.unsafeMetadata?.stripe;
          if (rawStripeData) {
            let stripeData: { subscriptionActive?: boolean } | null = null;
            if (typeof rawStripeData === "object" && rawStripeData !== null) {
              stripeData = rawStripeData as { subscriptionActive?: boolean };
            } else if (typeof rawStripeData === "string") {
              try {
                stripeData = JSON.parse(rawStripeData) as {
                  subscriptionActive?: boolean;
                };
              } catch (error) {
                console.error("Error parsing stripe metadata:", error);
              }
            }
            hasActiveSubscription = stripeData?.subscriptionActive || false;
          }

          if (hasActiveSubscription) {
            router.push("/dashboard");
            return;
          }
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Failed to verify access:", error);
        setIsChecking(false);
      }
    };

    verifyAccess();
  }, [user, isLoaded, router, pathname]);

  if (!isLoaded || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="text-primary-light-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      <header className="justify-start p-4 md:p-6">
        <div className="flex max-w-6xl items-center justify-between">
          <Link href="/">
            <div className="text-xl font-bold text-gray-900">.nepfy</div>
          </Link>
          <button className="md:hidden">
            <div className="flex h-6 w-6 flex-col justify-center space-y-1">
              <div className="h-0.5 w-full bg-gray-600"></div>
              <div className="h-0.5 w-full bg-gray-600"></div>
              <div className="h-0.5 w-full bg-gray-600"></div>
            </div>
          </button>
        </div>
      </header>
      <div className="flex-1 items-center justify-center">{children}</div>
    </div>
  );
}
