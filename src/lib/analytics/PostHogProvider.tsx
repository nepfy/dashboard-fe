"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { initPostHog, getPostHog } from "./posthog";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    initPostHog();
  }, []);

  // Identify user when they are loaded and authenticated
  useEffect(() => {
    if (!isLoaded || !user) return;

    const posthog = getPostHog();
    if (!posthog) return;

    const userMetadata = user.unsafeMetadata;
    
    // Parse stripe metadata (handle both object and JSON string)
    let stripeData: Record<string, unknown> = {};
    const rawStripeData = userMetadata?.stripe;
    if (rawStripeData) {
      if (typeof rawStripeData === "object" && rawStripeData !== null) {
        stripeData = rawStripeData as Record<string, unknown>;
      } else if (typeof rawStripeData === "string") {
        try {
          stripeData = JSON.parse(rawStripeData) as Record<string, unknown>;
        } catch (error) {
          console.error("Error parsing stripe metadata in PostHog:", error);
        }
      }
    }
    
    const onboardingData = userMetadata?.onboardingComplete
      ? {
          applicationName: userMetadata?.applicationName,
          applicationType: userMetadata?.applicationType,
        }
      : {};

    // Identify user with PostHog
    posthog.identify(user.id, {
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      plan: stripeData.subscriptionActive ? "paid" : "free",
      subscription_status: (stripeData.status as string) || "none",
      subscription_active: Boolean(stripeData.subscriptionActive),
      subscription_id: (stripeData.subscriptionId as string) || null,
      customer_id: (stripeData.customerId as string) || null,
      onboarding_complete: userMetadata?.onboardingComplete || false,
      ...onboardingData,
    });

    // Set user properties
    posthog.setPersonProperties({
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      ...onboardingData,
    });
  }, [user, isLoaded]);

  return <>{children}</>;
}

