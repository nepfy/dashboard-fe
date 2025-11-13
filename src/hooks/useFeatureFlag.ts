/**
 * useFeatureFlag Hook
 * Check PostHog feature flags
 */

import { useEffect, useState } from "react";
import { getPostHog } from "#/lib/analytics/posthog";

export function useFeatureFlag(flagKey: string): {
  isEnabled: boolean;
  isLoading: boolean;
} {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🚨 MANUAL OVERRIDE: Force disable while feature flag is not configured
    // TODO: Remove this override once feature flag is active in PostHog
    if (flagKey === "notifications_system") {
      setIsEnabled(false);
      setIsLoading(false);
      return;
    }

    const posthog = getPostHog();

    if (!posthog) {
      setIsLoading(false);
      setIsEnabled(false);
      return;
    }

    // Check if flags are already loaded
    const checkFlag = () => {
      const flagValue = posthog.isFeatureEnabled(flagKey);
      setIsEnabled(flagValue === true);
      setIsLoading(false);
    };

    // PostHog might take a moment to load flags
    if (posthog.isFeatureEnabled !== undefined) {
      checkFlag();
    }

    // Listen for flag changes
    posthog.onFeatureFlags?.(checkFlag);

    return () => {
      // Cleanup if needed
    };
  }, [flagKey]);

  return { isEnabled, isLoading };
}

/**
 * Multiple feature flags at once
 */
export function useFeatureFlags(
  flagKeys: string[]
): Record<string, boolean> {
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const posthog = getPostHog();

    if (!posthog) {
      const disabledFlags = flagKeys.reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      );
      setFlags(disabledFlags);
      return;
    }

    const checkFlags = () => {
      const newFlags = flagKeys.reduce((acc, key) => {
        const flagValue = posthog.isFeatureEnabled(key);
        return { ...acc, [key]: flagValue === true };
      }, {});
      setFlags(newFlags);
    };

    checkFlags();
    posthog.onFeatureFlags?.(checkFlags);
  }, [flagKeys]);

  return flags;
}

