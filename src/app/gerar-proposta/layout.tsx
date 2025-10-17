"use client";

import { CopyLinkCacheProvider } from "#/contexts/CopyLinkCacheContext";
import { ProjectGeneratorProvider } from "#/contexts/ProjectGeneratorContext";
import { ProposalGeneratorProvider } from "./ProposalGeneratorContext";

export default function NepfyAILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectGeneratorProvider>
      <CopyLinkCacheProvider>
        <ProposalGeneratorProvider>
          <div className="h-screen">
            <div className="bg-white-neutral-light-200 flex flex-col h-[calc(100vh-7rem)]">
              <main className="flex-1 flex-col gap-8 h-full">{children}</main>
            </div>
          </div>
        </ProposalGeneratorProvider>
      </CopyLinkCacheProvider>
    </ProjectGeneratorProvider>
  );
}
