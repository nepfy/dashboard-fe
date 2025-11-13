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

const buildStorageKey = (userId: string) => `${LOCAL_STORAGE_PREFIX}:${userId}`;

const isBrowser = typeof window !== "undefined";

type ResponseError = Error & {
  status?: number;
};

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
  const timeoutRef = useRef<number | null>(null);
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
    const hasProgress = hasMeaningfulProgress(formData) || currentStep > 1;
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

type BannerState = {
  type: "info" | "error";
  message: string;
};

export default function Onboarding() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [initialFormData, setInitialFormData] = useState<
    Partial<FormDataProps>
  >({});
  const [initialStep, setInitialStep] = useState<number>(1);
  const [providerKey, setProviderKey] = useState(0);
  const [hydratedProgress, setHydratedProgress] =
    useState<OnboardingProgress | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasTrackedStart = useRef(false);

  const date = new Date();
  const userId = user?.id ?? null;

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

    if (!userId) {
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
          const error = new Error(
            `Request failed with status ${response.status}`
          ) as ResponseError;
          error.status = response.status;
          throw error;
        }

        const result = (await response.json()) as OnboardingStatusApiResponse;

        if (!result.success) {
          throw new Error(result.error ?? "Status indisponível");
        }

        if (!result.data) {
          throw new Error("Status indisponível");
        }

        if (!result.data.needsOnboarding) {
          router.replace("/dashboard");
          return;
        }

        const remoteProgress = result.data.progress;
        const localProgress = readLocalProgress(userId);
        const latestProgress = selectLatestProgress(
          remoteProgress,
          localProgress
        );

        if (latestProgress) {
          if (isActive) {
            setInitialFormData(latestProgress.formData);
            setInitialStep(latestProgress.currentStep);
            setHydratedProgress(latestProgress);
            persistLocalProgress(userId, {
              currentStep: latestProgress.currentStep,
              formData: latestProgress.formData,
              updatedAt: latestProgress.updatedAt,
            });
          }
        } else if (isActive) {
          setInitialFormData({});
          setInitialStep(1);
          setHydratedProgress(null);
          clearLocalProgress(userId);
        }

        if (isActive) {
          setProviderKey((prev) => prev + 1);
          if (latestProgress) {
            setBanner({
              type: "info",
              message: "Retomamos o seu progresso. Continue de onde parou.",
            });
          } else {
            setBanner({
              type: "info",
              message:
                "Bem-vindo! Complete os dados para criar sua conta Nepfy.",
            });
          }
        }

        ensureTrackingStarted();
      } catch (err) {
        console.error("Failed to recover onboarding progress:", err);
        const localProgress = readLocalProgress(userId);

        if (localProgress) {
          if (isActive) {
            setInitialFormData(localProgress.formData);
            setInitialStep(localProgress.currentStep);
            setHydratedProgress(localProgress);
            setProviderKey((prev) => prev + 1);
            setBanner({
              type: "info",
              message: "Retomamos o seu progresso salvo neste dispositivo.",
            });
          }
          persistLocalProgress(userId, localProgress);
        } else if (isActive) {
          clearLocalProgress(userId);
          setInitialFormData({});
          setInitialStep(1);
          setHydratedProgress(null);
          setProviderKey((prev) => prev + 1);
          setBanner({
            type: "info",
            message: "Bem-vindo! Complete os dados para criar sua conta Nepfy.",
          });
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
  }, [isLoaded, userId, router]);

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
        setBanner({
          type: "error",
          message: res.error,
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setBanner({
          type: "error",
          message: "Um erro ocorreu, por favor, tente mais tarde.",
        });
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
        userId={userId}
        initialProgress={hydratedProgress}
      />
      <div className="grid h-screen min-h-[740px] place-items-center pt-0 pb-2 sm:pb-0">
        <Navbar />
        <div className="relative flex h-full w-full items-center justify-center gap-0">
          <IntroSlider />

          <div className="mb-6 box-border flex w-full items-center justify-center p-8 pb-0 sm:mb-0 sm:p-20 sm:pb-20 lg:w-1/2">
            <div className="box-border flex h-full w-full flex-col items-center justify-center space-y-8">
              <MultiStepForm
                onComplete={handleOnboardingComplete}
                error={banner?.type === "error" ? banner.message : undefined}
                infoMessage={
                  banner?.type === "info" ? banner.message : undefined
                }
              />
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-5 left-5 z-40 hidden lg:block">
          <Footer />
        </div>
        <div className="text-white-neutral-light-400 xl:text-primary-light-200 box-border flex h-[80px] w-full items-center sm:h-full sm:items-end lg:hidden">
          <span className="px-8 sm:py-6">
            &copy; {date.getFullYear()} Nepfy
          </span>
        </div>
      </div>
    </FormProvider>
  );
}
