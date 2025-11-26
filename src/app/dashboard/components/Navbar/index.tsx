"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import MobileMenu from "../MobileMenu";
import Notifications from "../Notifications";
import Logo from "#/components/icons/Logo";
import { useFeatureFlag } from "#/hooks/useFeatureFlag";
import { useNotifications } from "#/hooks/useNotifications";

export default function Navbar() {
  const { isEnabled: notificationsEnabled } = useFeatureFlag(
    "notifications_system"
  );
  const { unreadCount } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo for Mobile */}
          <div className="flex items-center lg:hidden">
            <Link href="/dashboard">
              <Logo fill="#1C1A22" />
            </Link>
          </div>

          {/* Notification Bell - Desktop & Mobile */}
          {notificationsEnabled && (
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative ml-auto cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100"
              aria-label="Notificações"
            >
              <Bell className="h-6 w-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          )}
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
