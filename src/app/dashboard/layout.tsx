"use client";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { CopyLinkCacheProvider } from "#/contexts/CopyLinkCacheContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login");
      return;
    }

    if (isLoaded && user?.unsafeMetadata.stripe) {
      const hasActiveSubscription = (
        user?.unsafeMetadata.stripe as { subscriptionActive?: boolean }
      )?.subscriptionActive;

      console.log({ hasActiveSubscription });

      if (!hasActiveSubscription) {
        router.push("/planos"); // Redirect to pricing/plans page
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary-light-400)]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <CopyLinkCacheProvider>
      <div className="bg-gray-50 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] h-screen relative">
          <Sidebar />

          <div className="flex flex-col h-screen overflow-scroll">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </CopyLinkCacheProvider>
  );
}
