"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

import Link from "next/link";
import MobileMenu from "../MobileMenu";
import Notifications from "../Notifications";

// import NotificationIcon from "#/components/icons/NotificationIcon";
import Logo from "#/components/icons/Logo";
import MenuIcon from "#/components/icons/MenuIcon";

export default function Navbar() {
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <nav className="bg-white-neutral-light-200 border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center flex-shrink-0 lg:hidden ml-2">
              <Link href="/dashboard">
                <Logo fill="#1C1A22" />
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {/* <button
              className="p-2 text-gray-600 hover:text-gray-900 relative cursor-pointer"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <span className="absolute top-1 right-1 bg-indigo-600 rounded-full w-4 h-4 text-xs text-white flex items-center justify-center">
                2
              </span>
              <NotificationIcon width="24" height="24" />
            </button> */}

            <div className="hidden lg:block ml-3 relative">
              <div>
                <button className="flex items-center text-sm rounded-full focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-gray-300">
                    {user?.imageUrl ? (
                      <Link href="/dashboard/configuracoes" className="block">
                        <Image
                          src={user.imageUrl}
                          width={32}
                          height={32}
                          alt="Foto de perfil do usuário"
                          className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
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

            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
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

      {isNotificationOpen && (
        <Notifications
          isNotificationOpen={isNotificationOpen}
          setIsNotificationOpenAction={setIsNotificationOpen}
        />
      )}
    </nav>
  );
}
