"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { CopyLinkCacheProvider } from "#/contexts/CopyLinkCacheContext";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   if (isLoaded && user) {
  //     // Example: Assume subscription status is stored in user.publicMetadata.hasActiveSubscription
  //     const hasActiveSubscription = user?.publicMetadata?.hasActiveSubscription;

  //     if (!hasActiveSubscription) {
  //       router.push("/planos"); // Redirect to pricing/plans page
  //     }
  //     // Optionally, you can add onboarding logic here as well if needed
  //   }
  // }, [user, isLoaded, router]);

  return (
    <div className="flex flex-col bg-gray-50 relative w-full min-h-screen">
      <header className="p-4 md:p-6 justify-start">
        <div className="flex items-center justify-between max-w-6xl">
          <Link href="/">
            <div className="text-xl font-bold text-gray-900">.nepfy</div>
          </Link>
          <button className="md:hidden">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </button>
        </div>
      </header>
      <div className="flex-1 justify-center items-center py-8">{children}</div>
    </div>
  );
}
