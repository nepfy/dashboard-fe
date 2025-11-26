"use client";

import { useState } from "react";
import { BellIcon, SearchIcon } from "lucide-react";
import { useNotifications } from "#/hooks/useNotifications";
import Notifications from "#/app/dashboard/components/Notifications";

export function ProposalModuleHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const { unreadCount } = useNotifications();
  // const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
          Propostas
        </h1>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div className="hidden">
            <form onSubmit={handleSearch} className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Faça uma busca..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block h-10 w-[406px] rounded-lg border-0 bg-[#EDEEF4] py-2 pr-20 pl-10 text-sm text-gray-900 transition-colors placeholder:text-gray-500 focus:bg-white focus:ring-1 focus:ring-gray-200 focus:outline-none"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <kbd className="flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-500">
                  <span className="text-sm">⌘</span> K
                </kbd>
              </div>
            </form>
          </div>

          {/* Theme Toggle */}
          {/* <button
            className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#EDEEF4] text-gray-600 transition-colors hover:bg-gray-200 sm:flex"
            aria-label="Toggle theme"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button> */}

          {/* Notifications */}
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#EDEEF4] text-gray-600 transition-colors hover:bg-gray-200 sm:h-10 sm:w-10"
            aria-label="Notificações"
          >
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white">
                {unreadCount}
              </span>
            )}
            <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Notifications Dropdown */}
      <Notifications
        isNotificationOpen={isNotificationOpen}
        setIsNotificationOpenAction={setIsNotificationOpen}
      />
    </>
  );
}
