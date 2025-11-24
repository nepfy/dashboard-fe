"use client";

import { useState } from "react";

import Link from "next/link";
import MobileMenu from "../MobileMenu";
import Notifications from "../Notifications";
import Logo from "#/components/icons/Logo";
import MenuIcon from "#/components/icons/MenuIcon";
import { useNotifications } from "#/hooks/useNotifications";
import { useFeatureFlag } from "#/hooks/useFeatureFlag";

export default function Navbar() {
  const { unreadCount } = useNotifications();
  const { isEnabled: notificationsEnabled } = useFeatureFlag(
    "notifications_system"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement theme switching logic
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

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
