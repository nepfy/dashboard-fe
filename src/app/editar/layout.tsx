"use client";

import Link from "next/link";
import { useState } from "react";
import CloseIcon from "#/components/icons/CloseIcon";
import Logo from "#/components/icons/Logo";
import Personalize from "./components/personalize";
import Sections from "./components/sections";
import Publish from "./components/publish";
import MobileNavigation from "./components/MobileNavigation";
import MobileMenu from "./components/MobileMenu";

export default function EditarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen">
      {/* Desktop Navigation */}
      <nav className="hidden fixed top-0 left-0 right-0 z-50 sm:flex px-7 py-3 border-b border-b-white-neutral-light-300 bg-white-neutral-light-200 items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo fill="#1C1A22" />
          <div className="border-l border-l-white-neutral-light-300 h-4" />
          <Personalize />
          <Sections />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Publish />
          <Link
            href="/dashboard"
            className="h-[40px] w-[40px] sm:h-[44px] sm:w-[44px] border border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 rounded-[10px] flex items-center justify-center button-inner cursor-pointer"
          >
            <CloseIcon width="10" height="10" fill="#1C1A22" />
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavigation
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMenu={toggleMobileMenu}
      />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      <div className="mt-[56px] sm:mt-[66px]">{children}</div>
    </div>
  );
}
