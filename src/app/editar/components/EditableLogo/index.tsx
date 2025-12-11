/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import { useImageUpload } from "#/hooks/useImageUpload";
import { useEditor } from "../../contexts/EditorContext";

interface EditableLogoProps {
  logoUrl?: string | null;
  onLogoChange?: (url: string | null) => void;
  className?: string;
  editingId: string;
  size?: "sm" | "md" | "lg";
}

export default function EditableLogo({
  logoUrl,
  onLogoChange,
  className = "",
  editingId,
  size = "md",
}: EditableLogoProps) {
  const { activeEditingId, setActiveEditingId, saveProject, projectData } =
    useEditor();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldAutoSave, setShouldAutoSave] = useState(false);
  const previousLogoRef = useRef<string | null | undefined>(
    projectData?.proposalData?.introduction?.logo
  );

  const isEditing = activeEditingId === editingId;
  const canInteract = activeEditingId === null || isEditing;

  // Auto-save when logo changes in projectData
  useEffect(() => {
    const currentLogo = projectData?.proposalData?.introduction?.logo;

    // Only auto-save if logo actually changed and we have a project
    if (
      shouldAutoSave &&
      projectData?.id &&
      previousLogoRef.current !== currentLogo
    ) {
      const saveTimeout = setTimeout(async () => {
        try {
          console.log("[EditableLogo] Auto-saving after logo change:", {
            previousLogo: previousLogoRef.current,
            currentLogo,
            projectId: projectData.id,
            hasProposalData: !!projectData.proposalData,
            introductionLogo: projectData.proposalData?.introduction?.logo,
            fullIntroduction: projectData.proposalData?.introduction,
          });
          await saveProject?.({ skipNavigation: true });
          setShouldAutoSave(false);
          previousLogoRef.current = currentLogo;
        } catch (saveError) {
          console.error("Error auto-saving after logo change:", saveError);
          setShouldAutoSave(false);
        }
      }, 500); // Increased delay to ensure state is fully updated

      return () => clearTimeout(saveTimeout);
    }
  }, [shouldAutoSave, projectData, saveProject]);

  // Update ref when logoUrl prop changes (for initial load)
  useEffect(() => {
    if (projectData?.proposalData?.introduction?.logo !== undefined) {
      previousLogoRef.current = projectData.proposalData.introduction.logo;
    }
  }, [projectData?.proposalData?.introduction?.logo]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const handleClick = () => {
    if (!canInteract || isUploading) return;

    if (!isEditing) {
      setActiveEditingId(editingId);
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Tipo de arquivo não suportado. Use apenas JPG, PNG ou SVG.");
      return;
    }

    // Validate file size (1MB max)
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Arquivo muito grande. Tamanho máximo: 1MB.");
      return;
    }

    try {
      const result = await uploadImage(file);

      if (result.success && result.data) {
        onLogoChange?.(result.data.url);
        // Trigger auto-save via useEffect
        setShouldAutoSave(true);
      } else {
        alert(result.error || "Erro ao fazer upload da logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Erro ao fazer upload da logo");
    } finally {
      setActiveEditingId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canInteract) return;

    onLogoChange?.(null);
    setActiveEditingId(null);
    // Trigger auto-save via useEffect
    setShouldAutoSave(true);
  };

  const shouldShowBorder = isHovered || isEditing;

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={` ${sizeClasses[size]} relative cursor-pointer overflow-hidden rounded-lg transition-all duration-200 ${shouldShowBorder ? "ring-2 ring-[#0170D6]" : "ring-1 ring-white/20"} ${!canInteract ? "cursor-not-allowed opacity-50" : ""} ${isUploading ? "opacity-50" : ""} `}
        onClick={handleClick}
      >
        {logoUrl ? (
          <>
            <img
              src={logoUrl}
              alt="Logo"
              className="h-full w-full bg-white/5 object-contain"
            />
            {shouldShowBorder && canInteract && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-[10px] font-medium text-white">
                  {isUploading ? "Enviando..." : "Alterar"}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <svg
              className="h-5 w-5 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {shouldShowBorder && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-[10px] font-medium text-white">
                  {isUploading ? "Enviando..." : "Logo"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {logoUrl && shouldShowBorder && canInteract && !isUploading && (
        <button
          onClick={handleRemoveLogo}
          className="absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
          title="Remover logo"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
