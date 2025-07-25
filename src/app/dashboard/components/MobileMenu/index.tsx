"use client";

import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useUserStore } from "#/store/userStore";
import Logo from "#/components/icons/Logo";
import GridIcon from "#/components/icons/GridIcon";
import FileIcon from "#/components/icons/FileIcon";
import ContractIcon from "#/components/icons/ContractIcon";
import CalculatorIcon from "#/components/icons/CalculatorIcon";
import HelpIcon from "#/components/icons/HelpIcon";
import GearIcon from "#/components/icons/GearIcon";
import SignOutIcon from "#/components/icons/SignOutIcon";
import CloseIcon from "#/components/icons/CloseIcon";

export default function MobileMenu({
  setIsMobileMenuOpenAction,
}: {
  setIsMobileMenuOpenAction: (isOpen: boolean) => void;
}) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const logout = useUserStore((state) => state.logout);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSignOut = async () => {
    logout(); // Clear user data from store and localStorage
    await signOut({ redirectUrl: "/login" });
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <GridIcon
          width="20"
          height="20"
          fill={isActive("/dashboard") ? "#6B46F5" : "#19171F"}
        />
      ),
    },
    {
      name: "Propostas",
      path: "/dashboard/propostas",
      icon: (
        <FileIcon
          width="20"
          height="20"
          fill={isActive("/dashboard/propostas") ? "#6B46F5" : "#19171F"}
        />
      ),
    },
    {
      name: "Contratos",
      path: "/dashboard/contratos",
      icon: (
        <ContractIcon
          width="20"
          height="20"
          fill={isActive("/dashboard/contratos") ? "#6B46F5" : "#19171F"}
        />
      ),
    },
    {
      name: "Calculadora",
      path: "/dashboard/calculadora",
      icon: (
        <CalculatorIcon
          width="20"
          height="20"
          fill={isActive("/dashboard/calculadora") ? "#6B46F5" : "#19171F"}
        />
      ),
    },
    {
      name: "Ajuda",
      path: "/dashboard/ajuda",
      icon: (
        <HelpIcon
          width="20"
          height="20"
          fill={isActive("/dashboard/ajuda") ? "#6B46F5" : "#19171F"}
        />
      ),
    },
    {
      name: "Configurações",
      path: "/dashboard/configuracoes",
      icon: (
        <GearIcon
          width="20"
          height="20"
          fill={isActive("/dashboard/configuracoes") ? "#6B46F5" : "#19171F"}
        />
      ),
    },
  ];

  return (
    <div className="lg:hidden">
      <div className="fixed inset-0 flex z-100 bg-white-neutral-light-200 border-b border-gray-200">
        <div className="flex flex-col w-full">
          <div className="border-b border-gray-200 flex flex-row items-center justify-between h-16 px-8">
            <Link href="/dashboard">
              <Logo fill="#1C1A22" />
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpenAction(false)}
            >
              <CloseIcon width="20" height="20" />
            </button>
          </div>

          <div className="h-0">
            <nav className="px-2 py-4">
              <ul className="space-y-1 bg-white-neutral-light-200">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    {item.name === "Contratos" ||
                    item.name === "Calculadora" ? (
                      <div className="flex items-center px-4 py-3 text-sm rounded-2xs text-white-neutral-light-500 font-medium cursor-not-allowed">
                        <span className="mr-2 opacity-50">{item.icon}</span>
                        {item.name}
                      </div>
                    ) : (
                      <Link
                        href={item.path}
                        onClick={() => setIsMobileMenuOpenAction(false)}
                        className={`flex items-center px-4 py-3 text-sm rounded-2xs text-white-neutral-light-900 font-medium  ${
                          isActive(item.path)
                            ? "bg-white-neutral-light-100 e0"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span> {item.name}
                      </Link>
                    )}
                  </li>
                ))}
                <li>
                  <div
                    onClick={handleSignOut}
                    className={`flex items-center px-4 py-3 text-sm rounded-2xs text-white-neutral-light-900 font-medium hover:bg-gray-100 cursor-pointer`}
                  >
                    <span className="mr-2">
                      {" "}
                      <SignOutIcon width="20" height="20" fill="#19171F" />
                    </span>{" "}
                    Sair
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
