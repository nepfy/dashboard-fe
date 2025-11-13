"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";

const RedirectingScreen = ({ message }: { message: string }) => (
  <div className="flex h-screen flex-col items-center justify-center gap-4 p-6 text-center">
    <LoaderCircle className="text-primary-light-400 animate-spin" />
    <div className="space-y-1">
      <p className="text-lg font-semibold text-[var(--color-white-neutral-light-800)]">
        {message}
      </p>
      <p className="text-sm text-[var(--color-white-neutral-light-500)]">
        Estamos direcionando você para a área correta.
      </p>
    </div>
  </div>
);

export default function AppLanding() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoaded || hasRedirected) {
      return;
    }

    if (!user) {
      setHasRedirected(true);
      router.replace("/login");
      return;
    }

    const onboardingComplete = Boolean(user.publicMetadata?.onboardingComplete);

    setHasRedirected(true);
    router.replace(onboardingComplete ? "/dashboard" : "/onboarding");
  }, [isLoaded, user, router, hasRedirected]);

  if (!isLoaded) {
    return <RedirectingScreen message="Carregando suas informações" />;
  }

  if (!user) {
    return <RedirectingScreen message="Redirecionando para login" />;
  }

  return <RedirectingScreen message="Entrando na sua conta" />;
}
