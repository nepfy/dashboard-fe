"use client";

import { useState } from "react";

import Link from "next/link";
import MobileMenu from "../MobileMenu";
import Notifications from "../Notifications";
import Logo from "#/components/icons/Logo";

import { useFeatureFlag } from "#/hooks/useFeatureFlag";

export default function Navbar() {
  const { isEnabled: notificationsEnabled } = useFeatureFlag(
    "notifications_system"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="px-6">
        <div className="flex h-16 items-center justify-center gap-4">
          {/* Logo for Mobile */}
          <div className="flex items-center lg:hidden">
            <Link href="/dashboard">
              <Logo fill="#1C1A22" />
            </Link>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileMenu setIsMobileMenuOpenAction={setIsMobileMenuOpen} />
      )}

      {notificationsEnabled && (
        <Notifications
          isNotificationOpen={isNotificationOpen}
          setIsNotificationOpenAction={setIsNotificationOpen}
        />
      )}
    </nav>
  );
}
