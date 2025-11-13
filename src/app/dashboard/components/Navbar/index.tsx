"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

import Link from "next/link";
import MobileMenu from "../MobileMenu";
import Notifications from "../Notifications";
import NotificationIcon from "#/components/icons/NotificationIcon";
import Logo from "#/components/icons/Logo";
import MenuIcon from "#/components/icons/MenuIcon";
import { useNotifications } from "#/hooks/useNotifications";
import { useFeatureFlag } from "#/hooks/useFeatureFlag";

export default function Navbar() {
  const { user } = useUser();
  const { unreadCount } = useNotifications();
  const { isEnabled: notificationsEnabled } = useFeatureFlag(
    "notifications_system"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <nav className="bg-white-neutral-light-200 border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <div className="ml-2 flex flex-shrink-0 items-center lg:hidden">
              <Link href="/dashboard">
                <Logo fill="#1C1A22" />
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications Button - Feature Flag Controlled */}
            {notificationsEnabled && (
              <button
                className="relative cursor-pointer p-2 text-gray-600 transition-colors hover:text-gray-900"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                aria-label="Notificações"
              >
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-medium text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
                <NotificationIcon width="24" height="24" />
              </button>
            )}

            {/* User Profile */}
            <div className="relative ml-1 hidden lg:block">
              <div>
                <button className="flex items-center rounded-full text-sm focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-gray-300">
                    {user?.imageUrl ? (
                      <Link href="/dashboard/configuracoes" className="block">
                        <Image
                          src={user.imageUrl}
                          width={32}
                          height={32}
                          alt="Foto de perfil do usuário"
                          className="cursor-pointer rounded-full transition-opacity hover:opacity-80"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </Link>
                    ) : null}
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon />
            </button>
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
