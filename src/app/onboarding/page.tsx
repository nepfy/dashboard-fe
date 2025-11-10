"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Navbar from "#/components/Navbar";
import Footer from "#/components/Footer";
import IntroSlider from "#/components/IntroSlider";

import { completeOnboarding } from "#/app/actions/onboarding/_actions";
import MultiStepForm from "#/app/onboarding/components/MultiStepForm";
import {
  FormProvider,
  useFormContext,
  type FormDataProps,
} from "#/app/onboarding/helpers/FormContext";
import {
  trackOnboardingStarted,
  trackOnboardingCompleted,
} from "#/lib/analytics/track";
import type {
  OnboardingProgress,
  OnboardingStatusApiResponse,
} from "#/types/onboarding";
import {
  parseOnboardingProgress,
  sanitizeOnboardingFormData,
  isProgressMoreRecent,
} from "#/lib/onboarding/progress";

const LOCAL_STORAGE_PREFIX = "nepfy:onboarding-progress";
const SYNC_DEBOUNCE_MS = 800;
const EMPTY_PROGRESS_KEY = "__empty__";

const buildStorageKey = (userId: string) =>
  `${LOCAL_STORAGE_PREFIX}:${userId}`;

const isBrowser = typeof window !== "undefined";

function readLocalProgress(userId?: string | null): OnboardingProgress | null {
  if (!userId || !isBrowser) {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(buildStorageKey(userId));
    if (!stored) {
      return null;
    }

    return parseOnboardingProgress(JSON.parse(stored));
  } catch (error) {
    console.error("Failed to parse onboarding progress from storage:", error);
    return null;
  }
}

function persistLocalProgress(
  userId: string | null | undefined,
  progress: OnboardingProgress
) {
  if (!userId || !isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(
      buildStorageKey(userId),
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error("Failed to persist onboarding progress:", error);
  }
}

function clearLocalProgress(userId?: string | null) {
  if (!userId || !isBrowser) {
    return;
  }

  window.localStorage.removeItem(buildStorageKey(userId));
}

function selectLatestProgress(
  remote: OnboardingProgress | null,
  local: OnboardingProgress | null
): OnboardingProgress | null {
  if (isProgressMoreRecent(local, remote)) {
    return local;
  }
  return remote ?? local ?? null;
}

function hasMeaningfulProgress(formData: FormDataProps): boolean {
  if (formData.fullName.trim() !== "") return true;
  if (formData.userName.trim() !== "") return true;
  if (formData.cpf.trim() !== "") return true;
  if (formData.phone.trim() !== "") return true;
  if (formData.usedBefore.trim() !== "") return true;
  if (formData.jobType.length > 0) return true;
  if (formData.discoverySource.length > 0) return true;
  return false;
}

function OnboardingProgressSync({
  userId,
  initialProgress,
}: {
  userId?: string | null;
  initialProgress: OnboardingProgress | null;
}) {
  const { formData, currentStep } = useFormContext();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialisedRef = useRef(false);
  const lastSyncedPayloadRef = useRef<string>(
    initialProgress
      ? JSON.stringify({
          currentStep: initialProgress.currentStep,
          formData: initialProgress.formData,
        })
      : EMPTY_PROGRESS_KEY
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const sanitizedFormData = sanitizeOnboardingFormData(formData);
    const hasProgress =
      hasMeaningfulProgress(formData) || currentStep > 1;
    const payloadKey = hasProgress
      ? JSON.stringify({
          currentStep,
          formData: sanitizedFormData,
        })
      : EMPTY_PROGRESS_KEY;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    const runSync = () => {
      if (!hasProgress) {
        clearLocalProgress(userId);
        if (lastSyncedPayloadRef.current !== EMPTY_PROGRESS_KEY) {
          fetch("/api/onboarding/progress", { method: "DELETE" }).catch(
            () => {}
          );
          lastSyncedPayloadRef.current = EMPTY_PROGRESS_KEY;
        }
        return;
      }

      if (payloadKey === lastSyncedPayloadRef.current) {
        // Keep local storage fresh even if nothing changed
        persistLocalProgress(userId, {
          currentStep,
          formData: sanitizedFormData,
          updatedAt: new Date().toISOString(),
        });
        lastSyncedPayloadRef.current = payloadKey;
        return;
      }

      const progressPayload: OnboardingProgress = {
        currentStep,
        formData: sanitizedFormData,
        updatedAt: new Date().toISOString(),
      };

      persistLocalProgress(userId, progressPayload);

      fetch("/api/onboarding/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(progressPayload),
      }).catch(() => {});

      lastSyncedPayloadRef.current = payloadKey;
    };

    if (!hasInitialisedRef.current) {
      hasInitialisedRef.current = true;
      runSync();
      return;
    }

    timeoutRef.current = window.setTimeout(runSync, SYNC_DEBOUNCE_MS);
  }, [formData, currentStep, userId]);

  return null;
}

export default function Onboarding() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isHydrating, setIsHydrating] = useState(true);
  const [initialFormData, setInitialFormData] = useState<Partial<FormDataProps>>(
    {}
  );
  const [initialStep, setInitialStep] = useState<number>(1);
  const [providerKey, setProviderKey] = useState(0);
  const [hydratedProgress, setHydratedProgress] =
    useState<OnboardingProgress | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasTrackedStart = useRef(false);

  const date = new Date();

  const ensureTrackingStarted = () => {
    if (!hasTrackedStart.current) {
      startTimeRef.current = Date.now();
      trackOnboardingStarted();
      hasTrackedStart.current = true;
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    let isActive = true;

    const hydrate = async () => {
      setIsHydrating(true);

      try {
        const response = await fetch("/api/onboarding/status", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const result = (await response.json()) as OnboardingStatusApiResponse;
        const result = (await response.json()) as OnboardingStatusApiResponse;

        if (!result.success || !result.data) {
          throw new Error(result.error ?? "Status indisponível");
        }

        if (!result.data.needsOnboarding) {
          router.replace("/dashboard");
          return;
        }

        const remoteProgress = result.data.progress;
        const localProgress = readLocalProgress(user.id);
        const latestProgress = selectLatestProgress(remoteProgress, localProgress);

        if (latestProgress) {
          if (isActive) {
            setInitialFormData(latestProgress.formData);
            setInitialStep(latestProgress.currentStep);
            setHydratedProgress(latestProgress);
            persistLocalProgress(user.id, {
              currentStep: latestProgress.currentStep,
              formData: latestProgress.formData,
              updatedAt: latestProgress.updatedAt,
            });
          }
        } else if (isActive) {
          setInitialFormData({});
          setInitialStep(1);
          setHydratedProgress(null);
          clearLocalProgress(user.id);
        }

        if (isActive) {
          setProviderKey((prev) => prev + 1);
          setError("");
        }

        ensureTrackingStarted();
      } catch (err) {
        console.error("Failed to recover onboarding progress:", err);
        const localProgress = readLocalProgress(user.id);

        if (localProgress) {
          if (isActive) {
            setInitialFormData(localProgress.formData);
            setInitialStep(localProgress.currentStep);
            setHydratedProgress(localProgress);
            setProviderKey((prev) => prev + 1);
            setError("");
          }
          persistLocalProgress(user.id, localProgress);
        } else if (isActive) {
          setInitialFormData({});
          setInitialStep(1);
          setHydratedProgress(null);
          setProviderKey((prev) => prev + 1);
          setError(
            "Não foi possível recuperar o seu progresso. Por favor, reinicie o onboarding."
          );
        }

        ensureTrackingStarted();
      } finally {
        if (isActive) {
          setIsHydrating(false);
        }
      }
    };

    hydrate();

    return () => {
      isActive = false;
    };
  }, [isLoaded, user, router]);

  const handleOnboardingComplete = async (formData: FormData) => {
    try {
      const res = await completeOnboarding(formData);

      if (res?.message) {
        const completionTimeSeconds = startTimeRef.current
          ? Math.round((Date.now() - startTimeRef.current) / 1000)
          : undefined;

        trackOnboardingCompleted({
          job_type: formData.get("jobType")?.toString(),
          discovery_source: formData.get("discoverySource")?.toString(),
          used_before: formData.get("usedBefore")?.toString(),
          application_name: formData.get("applicationName")?.toString(),
          application_type: formData.get("applicationType")?.toString(),
          completion_time_seconds: completionTimeSeconds,
        });

        clearLocalProgress(user?.id);
        fetch("/api/onboarding/progress", { method: "DELETE" }).catch(() => {});

        await user?.reload();
        router.push("/dashboard");
      }

      if (res?.error) {
        setError(res.error);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Um erro ocorreu, por favor, tente mais tarde.");
      }
    }
  };

  if (isHydrating) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando suas informações...</p>
      </div>
    );
  }

  return (
    <FormProvider
      key={providerKey}
      initialFormData={initialFormData}
      initialStep={initialStep}
    >
      <OnboardingProgressSync
        userId={user?.id}
        initialProgress={hydratedProgress}
      />
      <div className="grid place-items-center pb-2 sm:pb-0 pt-0 h-screen min-h-[740px]">
        <Navbar />
        <div className="flex items-center justify-center gap-0 w-full h-full relative">
          <IntroSlider />

          <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20 mb-6 sm:mb-0 box-border w-full lg:w-1/2">
            <div className="w-full flex flex-col items-center justify-center space-y-8 h-full box-border">
              <MultiStepForm
                onComplete={handleOnboardingComplete}
                error={error}
              />
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute z-40 bottom-5 left-5 right-0">
          <Footer />
        </div>
        <div className="text-white-neutral-light-400 xl:text-primary-light-200 flex items-center sm:items-end w-full h-[80px] sm:h-full box-border lg:hidden">
          <span className="px-8 sm:py-6">
            &copy; {date.getFullYear()} Nepfy
          </span>
        </div>
      </div>
    </FormProvider>
  );
}
