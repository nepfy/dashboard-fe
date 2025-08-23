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
    if (!user) {
      router.push("/login");
    }

    if (isLoaded && user?.unsafeMetadata.stripe) {
      console.log({ user: user?.unsafeMetadata.stripe });
      // Example: Assume subscription status is stored in user.unsafeMetadata.stripe.hasActiveSubscription
      const hasActiveSubscription = (
        user?.unsafeMetadata.stripe as { subscriptionActive?: boolean }
      )?.subscriptionActive;

      console.log({ hasActiveSubscription });

      if (!hasActiveSubscription) {
        router.push("/planos"); // Redirect to pricing/plans page
      }
      // Optionally, you can add onboarding logic here as well if needed
    }
  }, [user, isLoaded, router]);

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
