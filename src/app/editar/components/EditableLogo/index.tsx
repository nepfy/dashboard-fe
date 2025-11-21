/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
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
  const { activeEditingId, setActiveEditingId } = useEditor();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isEditing = activeEditingId === editingId;
  const canInteract = activeEditingId === null || isEditing;

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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
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
  };

  const shouldShowBorder = isHovered || isEditing;

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          ${sizeClasses[size]}
          relative
          overflow-hidden
          rounded-lg
          transition-all
          duration-200
          cursor-pointer
          ${shouldShowBorder ? "ring-2 ring-[#0170D6]" : "ring-1 ring-white/20"}
          ${!canInteract ? "opacity-50 cursor-not-allowed" : ""}
          ${isUploading ? "opacity-50" : ""}
        `}
        onClick={handleClick}
      >
        {logoUrl ? (
          <>
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-full object-contain bg-white/5"
            />
            {shouldShowBorder && canInteract && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-[10px] font-medium">
                  {isUploading ? "Enviando..." : "Alterar"}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white/40"
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
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-[10px] font-medium">
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
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors z-10"
          title="Remover logo"
        >
          <svg
            className="w-3 h-3"
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

