/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
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
  const { activeEditingId, setActiveEditingId } = useEditor();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isEditing = activeEditingId === editingId;
  const canInteract = activeEditingId === null || isEditing;

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
          rounded-full
          transition-all
          duration-200
          cursor-pointer
          ${shouldShowBorder ? "ring-2 ring-[#0170D6]" : "ring-1 ring-white/20"}
          ${!canInteract ? "opacity-50 cursor-not-allowed" : ""}
          ${isUploading ? "opacity-50" : ""}
        `}
        onClick={handleClick}
      >
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            {shouldShowBorder && canInteract && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {isUploading ? "Enviando..." : "Alterar"}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white/60"
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
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
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
          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors z-10 shadow-lg"
          title="Remover foto"
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
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

