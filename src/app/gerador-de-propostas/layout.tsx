import Link from "next/link";

import CloseIcon from "#/components/icons/CloseIcon";
import Logo from "#/components/icons/Logo";

import SaveDraftButton from "./components/SaveDraftButton";
import { ProjectGeneratorProvider } from "#/contexts/ProjectGeneratorContext";

export default function ProjectGenerator({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectGeneratorProvider>
      <div className="bg-white-neutral-light-200 h-screen flex flex-col relative">
        <nav className="p-7 border-b border-b-white-neutral-light-300 bg-white-neutral-light-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo fill="#1C1A22" />

            <p
              className="hidden sm:block border border-white-neutral-light-300 rounded-2xs px-2 py-1 bg-white-neutral-light-200 text-xs sm:text-[16px]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(0,0,0,0.1) 0px,
                  rgba(0,0,0,0.1) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
              }}
            >
              Gerador de Proposta
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <SaveDraftButton />

            <Link
              href="/dashboard"
              className="h-[40px] w-[40px] sm:h-[44px] sm:w-[44px] border border-white-neutral-light-300 hover:bg-white-neutral-light-200 bg-white-neutral-light-100 rounded-[10px] flex items-center justify-center button-inner cursor-pointer"
            >
              <CloseIcon width="10" height="10" fill="#1C1A22" />
            </Link>
          </div>
        </nav>

        <main className="flex-1 h-full">{children}</main>
      </div>
    </ProjectGeneratorProvider>
  );
}
