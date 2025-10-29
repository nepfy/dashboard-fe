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
    const stripeData = (userMetadata?.stripe as Record<string, unknown>) || {};
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
      subscription_status: stripeData.status || "none",
      subscription_active: stripeData.subscriptionActive || false,
      subscription_id: stripeData.subscriptionId || null,
      customer_id: stripeData.customerId || null,
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

