"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useUserStore } from "#/store/userStore";

import Logo from "#/components/icons/Logo";
import GridIcon from "#/components/icons/GridIcon";
import FileIcon from "#/components/icons/FileIcon";
import ContractIcon from "#/components/icons/ContractIcon";
import CalculatorIcon from "#/components/icons/CalculatorIcon";
import HelpIcon from "#/components/icons/HelpIcon";
import GearIcon from "#/components/icons/GearIcon";
import SignOutIcon from "#/components/icons/SignOutIcon";
import TutorialIcon from "#/components/icons/TutorialIcon";

export default function Sidebar() {
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

  const date = new Date();

  const mainMenuItems = [
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
  ];

  const bottomMenuItems = [
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
    <aside className="hidden lg:flex flex-col bg-white-neutral-light-200 border-r border-gray-200 h-screen">
      <div className="p-4">
        <Link href="/dashboard" className="flex items-center">
          <Logo fill="#1C1A22" />
        </Link>
      </div>

      <div className="flex flex-col justify-between flex-1 p-4">
        <nav className="space-y-1">
          <ul className="space-y-2">
            {mainMenuItems.map((item) => (
              <li key={item.name}>
                {item.name === "Contratos" || item.name === "Calculadora" ? (
                  <div
                    className={
                      "flex items-center px-4 py-3 text-sm rounded-2xs text-white-neutral-light-500 font-medium cursor-not-allowed"
                    }
                  >
                    <span className="mr-2 opacity-50">{item.icon}</span>
                    {item.name}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 text-sm rounded-2xs text-white-neutral-light-900 font-medium ${
                      isActive(item.path)
                        ? "bg-white-neutral-light-100 e0 cursor-default"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span> {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <nav>
          <ul className="space-y-2">
            {bottomMenuItems.map((item) => (
              <li key={item.name}>
                {item.name === "Contratos" || item.name === "Calculadora" ? (
                  <div
                    className={
                      "flex items-center px-4 py-3 text-sm rounded-2xs text-white-neutral-light-800 font-medium cursor-not-allowed opacity-60"
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 text-sm rounded-2xs text-white-neutral-light-900 font-medium ${
                      isActive(item.path)
                        ? "bg-white-neutral-light-100 font-medium e0 cursor-default"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <div
                onClick={handleSignOut}
                className="flex items-center px-4 py-3 text-sm rounded-2xs text-white-neutral-light-900 font-medium hover:bg-gray-100 cursor-pointer"
              >
                <span className="mr-2">
                  <SignOutIcon width="20" height="20" fill="#19171F" />
                </span>
                Sair
              </div>
            </li>
            <li>
              <div className="gradient-border rounded-[var(--radius-m)] h-[144px] w-[236px] p-[3px] bg-white-neutral-light-100">
                <div className="w-full h-full rounded-[var(--radius-s)] p-5 bg-[var(--color-white-neutral-light-200)] flex flex-col justify-between items-start">
                  <TutorialIcon />
                  <p className="text-white-neutral-light-900 text-sm font-normal">
                    Aprenda a criar propostas
                    <span className="text-white-neutral-light-400 font-medium underline cursor-pointer">
                      {" "}
                      Assistir tutorial{" "}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          </ul>
          <p className="text-white-neutral-light-400 mt-6">
            &copy; {date.getFullYear()} Nepfy
          </p>
        </nav>
      </div>
    </aside>
  );
}
