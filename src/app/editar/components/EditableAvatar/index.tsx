/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import { useImageUpload } from "#/hooks/useImageUpload";
import { useEditor } from "../../contexts/EditorContext";

interface EditableAvatarProps {
  imageUrl?: string | null;
  onImageChange?: (url: string | null) => void;
  className?: string;
  editingId: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function EditableAvatar({
  imageUrl,
  onImageChange,
  className = "",
  editingId,
  size = "lg",
}: EditableAvatarProps) {
  const { activeEditingId, setActiveEditingId, saveProject, projectData } =
    useEditor();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldAutoSave, setShouldAutoSave] = useState(false);
  const previousImageRef = useRef<string | null | undefined>(
    projectData?.proposalData?.introduction?.clientPhoto
  );

  const isEditing = activeEditingId === editingId;
  const canInteract = activeEditingId === null || isEditing;

  // Auto-save when clientPhoto changes in projectData
  useEffect(() => {
    const currentPhoto = projectData?.proposalData?.introduction?.clientPhoto;

    // Only auto-save if photo actually changed and we have a project
    if (
      shouldAutoSave &&
      projectData?.id &&
      previousImageRef.current !== currentPhoto
    ) {
      const saveTimeout = setTimeout(async () => {
        try {
          console.log("[EditableAvatar] Auto-saving after photo change:", {
            previousPhoto: previousImageRef.current,
            currentPhoto,
            projectId: projectData.id,
            hasProposalData: !!projectData.proposalData,
            introductionPhoto:
              projectData.proposalData?.introduction?.clientPhoto,
          });
          await saveProject?.({ skipNavigation: true });
          setShouldAutoSave(false);
          previousImageRef.current = currentPhoto;
        } catch (saveError) {
          console.error("Error auto-saving after photo change:", saveError);
          setShouldAutoSave(false);
        }
      }, 500);

      return () => clearTimeout(saveTimeout);
    }
  }, [shouldAutoSave, projectData, saveProject]);

  // Update ref when imageUrl prop changes (for initial load)
  useEffect(() => {
    if (projectData?.proposalData?.introduction?.clientPhoto !== undefined) {
      previousImageRef.current =
        projectData.proposalData.introduction.clientPhoto;
    }
  }, [projectData?.proposalData?.introduction?.clientPhoto]);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-24 h-24",
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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Tipo de arquivo não suportado. Use apenas JPG ou PNG.");
      return;
    }

    // Validate file size (2MB max for photos)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Arquivo muito grande. Tamanho máximo: 2MB.");
      return;
    }

    try {
      const result = await uploadImage(file);

      if (result.success && result.data) {
        onImageChange?.(result.data.url);
        // Trigger auto-save via useEffect
        setShouldAutoSave(true);
      } else {
        alert(result.error || "Erro ao fazer upload da foto");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Erro ao fazer upload da foto");
    } finally {
      setActiveEditingId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canInteract) return;

    onImageChange?.(null);
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
        className={` ${sizeClasses[size]} relative cursor-pointer overflow-hidden rounded-full transition-all duration-200 ${shouldShowBorder ? "ring-2 ring-[#0170D6]" : "ring-1 ring-white/20"} ${!canInteract ? "cursor-not-allowed opacity-50" : ""} ${isUploading ? "opacity-50" : ""} `}
        onClick={handleClick}
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
            {shouldShowBorder && canInteract && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-xs font-medium text-white">
                  {isUploading ? "Enviando..." : "Alterar"}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700">
            <svg
              className="h-8 w-8 text-white/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {shouldShowBorder && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-xs font-medium text-white">
                  {isUploading ? "Enviando..." : "Foto"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {imageUrl && shouldShowBorder && canInteract && !isUploading && (
        <button
          onClick={handleRemoveImage}
          className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
          title="Remover foto"
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
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
