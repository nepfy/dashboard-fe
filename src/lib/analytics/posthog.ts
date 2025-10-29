"use client";

import posthog from "posthog-js";

export const initPostHog = () => {
  if (typeof window === "undefined") return null;

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  // US Cloud region
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (!posthogKey) {
    console.warn("PostHog key not found. Analytics will be disabled.");
    return null;
  }

  if (posthog.__loaded) {
    return posthog;
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    person_profiles: "identified_only", // Only create profiles for identified users
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") {
        console.log("PostHog loaded:", ph);
      }
    },
  });

  return posthog;
};

export const getPostHog = () => {
  if (typeof window === "undefined") return null;
  if (!posthog.__loaded) return null;
  return posthog;
};

