"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const hasActiveSubscription = (
        user?.unsafeMetadata.stripe as { subscriptionActive?: boolean }
      )?.subscriptionActive;

      if (hasActiveSubscription) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoaded, router]);

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
