/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useImageUpload } from "#/hooks/useImageUpload";
import { useEditor } from "../../contexts/EditorContext";

interface EditableMarqueeImageProps {
  imageUrl?: string | null;
  onImageChange?: (url: string | null) => void;
  className?: string;
  editingId: string;
  alt?: string;
}

export default function EditableMarqueeImage({
  imageUrl,
  onImageChange,
  className = "",
  editingId,
  alt = "",
}: EditableMarqueeImageProps) {
  const { activeEditingId, setActiveEditingId } = useEditor();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isEditing = activeEditingId === editingId;
  const canInteract = activeEditingId === null || isEditing;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

    // Validate file size (5MB max for marquee images)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Arquivo muito grande. Tamanho máximo: 5MB.");
      return;
    }

    try {
      const result = await uploadImage(file);
      
      if (result.success && result.data) {
        onImageChange?.(result.data.url);
      } else {
        alert(result.error || "Erro ao fazer upload da imagem");
      }
    } catch (error) {
      console.error("Error uploading marquee image:", error);
      alert("Erro ao fazer upload da imagem");
    } finally {
      setActiveEditingId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canInteract) return;
    
    onImageChange?.(null);
    setActiveEditingId(null);
  };

  const shouldShowOverlay = isHovered || isEditing;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative
          w-full
          h-full
          overflow-hidden
          rounded-[1rem]
          transition-all
          duration-200
          cursor-pointer
          ${shouldShowOverlay ? "ring-4 ring-[#0170D6] ring-offset-2 ring-offset-black" : ""}
          ${!canInteract ? "opacity-50 cursor-not-allowed" : ""}
          ${isUploading ? "opacity-50" : ""}
        `}
        onClick={handleClick}
      >
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={alt}
              fill
              style={{ objectFit: "cover" }}
              className="pointer-events-none select-none"
              priority
            />
            {shouldShowOverlay && canInteract && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[2]">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-white/80 mx-auto mb-2"
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
                  <span className="text-white text-lg font-medium">
                    {isUploading ? "Enviando..." : "Alterar Imagem"}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-white/40 mx-auto mb-3"
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
              {shouldShowOverlay && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    {isUploading ? "Enviando..." : "Adicionar Imagem"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {imageUrl && shouldShowOverlay && canInteract && !isUploading && (
        <button
          onClick={handleRemoveImage}
          className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors z-[3] shadow-lg"
          title="Remover imagem"
        >
          <svg
            className="w-5 h-5"
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

