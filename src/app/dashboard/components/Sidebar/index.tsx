"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useUserStore } from "#/store/user.slice";

import Logo from "#/components/icons/Logo";
import GridIcon from "#/components/icons/GridIcon";
import FileIcon from "#/components/icons/FileIcon";
import ContractIcon from "#/components/icons/ContractIcon";
import CalculatorIcon from "#/components/icons/CalculatorIcon";
import HelpIcon from "#/components/icons/HelpIcon";
import GearIcon from "#/components/icons/GearIcon";
import SignOutIcon from "#/components/icons/SignOutIcon";
import TutorialIcon from "#/components/icons/TutorialIcon";
import { trackDashboardTabClicked } from "#/lib/analytics/track";
import { MoreVerticalIcon } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const logout = useUserStore((state) => state.logout);
  const { user } = useUser();

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
    <aside className="bg-white-neutral-light-200 hidden h-screen flex-col border-r border-gray-200 lg:flex">
      <div className="p-4">
        <Link href="/dashboard" className="flex items-center">
          <Logo fill="#1C1A22" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <nav className="space-y-1">
          <ul className="space-y-2">
            {mainMenuItems.map((item) => (
              <li key={item.name}>
                {item.name === "Contratos" || item.name === "Calculadora" ? (
                  <div
                    className={
                      "rounded-2xs text-white-neutral-light-500 flex cursor-not-allowed items-center justify-between px-4 py-3 text-sm font-medium"
                    }
                  >
                    <div className="flex items-center">
                      <span className="mr-2 opacity-50">{item.icon}</span>
                      {item.name}
                    </div>
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                      EM BREVE
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    onClick={() => {
                      // Track tab clicks
                      if (item.path === "/dashboard/propostas") {
                        trackDashboardTabClicked({ tab_name: "propostas" });
                      }
                    }}
                    className={`rounded-2xs text-white-neutral-light-900 flex items-center px-4 py-3 text-sm font-medium ${
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
                      "rounded-2xs text-white-neutral-light-800 flex cursor-not-allowed items-center px-4 py-3 text-sm font-medium opacity-60"
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`rounded-2xs text-white-neutral-light-900 flex items-center px-4 py-3 text-sm font-medium ${
                      isActive(item.path)
                        ? "bg-white-neutral-light-100 e0 cursor-default font-medium"
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
                className="rounded-2xs text-white-neutral-light-900 flex cursor-pointer items-center px-4 py-3 text-sm font-medium hover:bg-gray-100"
              >
                <span className="mr-2">
                  <SignOutIcon width="20" height="20" fill="#19171F" />
                </span>
                Sair
              </div>
            </li>
            <li>
              <div className="relative ml-1 hidden lg:block">
                <div className="mb-6 flex items-center justify-between p-1">
                  <div className="flex items-center gap-2 rounded-full text-sm focus:outline-none">
                    <div className="h-8 w-8 rounded-full bg-gray-300">
                      {user?.imageUrl && (
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
                      )}
                    </div>
                    <span className="text-white-neutral-light-900 text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <button className="flex items-center justify-center">
                    <MoreVerticalIcon width="20" height="20" fill="#19171F" />
                  </button>
                </div>
              </div>
            </li>
            <li>
              <div className="gradient-border bg-white-neutral-light-100 h-[144px] w-[236px] rounded-[var(--radius-m)] p-[3px]">
                <div className="flex h-full w-full flex-col items-start justify-between rounded-[var(--radius-s)] bg-[var(--color-white-neutral-light-200)] p-5">
                  <TutorialIcon />
                  <p className="text-white-neutral-light-900 text-sm font-normal">
                    Aprenda a criar propostas
                    <span className="text-white-neutral-light-400 cursor-pointer font-medium underline">
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
