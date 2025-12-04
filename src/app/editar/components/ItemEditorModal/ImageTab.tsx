"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import InfoIcon from "#/components/icons/InfoIcon";
import { TeamMember, Result, Testimonial, AboutUsItem, IntroductionService } from "#/types/template-data";
import { useImageUpload } from "#/hooks/useImageUpload";
import UploadFileIcon from "#/components/icons/UploadFileIcon";

interface ImageTabProps {
  itemType: "team" | "results" | "testimonials" | "aboutUs" | "introServices";
  currentItem: TeamMember | Result | Testimonial | AboutUsItem | IntroductionService | null;
  onUpdate: (
    data: Partial<TeamMember> | Partial<Result> | Partial<Testimonial> | Partial<AboutUsItem> | Partial<IntroductionService>
  ) => void;
  setShowExploreGalleryInfo: (show: boolean) => void;
  setShowPexelsGallery: (show: boolean) => void;
  setShowUploadImageInfo: (show: boolean) => void;
  setShowUploadImage: (show: boolean) => void;
}

export default function ImageTab({
  itemType,
  onUpdate,
  setShowExploreGalleryInfo,
  setShowPexelsGallery,
  setShowUploadImageInfo,
  setShowUploadImage,
}: ImageTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showPexelsTooltip, setShowPexelsTooltip] = useState(false);
  const [showNewImageTooltip, setShowNewImageTooltip] = useState(false);
  const [pexelsTooltipPosition, setPexelsTooltipPosition] = useState({
    x: 0,
    y: 0,
  });
  const [newImageTooltipPosition, setNewImageTooltipPosition] = useState({
    x: 0,
    y: 0,
  });
  const iconRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    uploadImage,
    isUploading: hookIsUploading,
    uploadError,
  } = useImageUpload();

  const handlePexelsMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPexelsTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 48,
      });
    }
    setShowPexelsTooltip(true);
  };

  const handleNewImageMouseEnter = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setNewImageTooltipPosition({
        x: rect.left + 42,
        y: rect.top + 122,
      });
    }
    setShowNewImageTooltip(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      if (result.success && result.data) {
        if (itemType === "team" || itemType === "aboutUs" || itemType === "introServices") {
          onUpdate({ image: result.data.url });
        } else if (itemType === "results" || itemType === "testimonials") {
          onUpdate({ photo: result.data.url });
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const TooltipPortal = () => {
    if (!showPexelsTooltip && !showNewImageTooltip) return null;

    return createPortal(
      <div
        className="pointer-events-none fixed z-[9999]"
        style={{
          left: showPexelsTooltip
            ? pexelsTooltipPosition.x
            : newImageTooltipPosition.x,
          top: showPexelsTooltip
            ? pexelsTooltipPosition.y
            : newImageTooltipPosition.y,
          transform: "translateX(-50%)",
        }}
      >
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-nowrap text-gray-800 shadow-lg">
          Clique para saber mais
          <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-t-white border-r-transparent border-l-transparent"></div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="mb-20 min-h-[351px] space-y-6 sm:mb-0">
      {/* Gallery Section - Placeholder */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-sm font-medium text-[#2A2A2A]">
            Explorar nossa galeria
          </h3>
          <div
            className="relative"
            ref={iconRef}
            onClick={() => setShowExploreGalleryInfo(true)}
          >
            <InfoIcon
              width="14"
              height="14"
              fill="#7C7C7C"
              className="cursor-pointer"
              onMouseEnter={handlePexelsMouseEnter}
              onMouseLeave={() => setShowPexelsTooltip(false)}
            />
          </div>
        </div>
        <div
          className="relative h-[120px] w-full cursor-pointer overflow-hidden rounded-lg bg-gray-50"
          onClick={() => {
            setShowPexelsGallery(true);
            setShowExploreGalleryInfo(false);
          }}
        >
          <Image
            src="/images/pexels.jpg"
            alt="Galeria de imagens"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Upload Section */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-sm font-medium text-[#2A2A2A]">
            Adicione uma nova imagem
          </h3>
          <div
            className="relative"
            onClick={() => {
              setShowUploadImageInfo(true);
              setShowNewImageTooltip(false);
            }}
          >
            <InfoIcon
              width="14"
              height="14"
              fill="#7C7C7C"
              className="cursor-pointer"
              onMouseEnter={handleNewImageMouseEnter}
              onMouseLeave={() => setShowNewImageTooltip(false)}
            />
          </div>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => {
            setShowUploadImage(true);
            setShowUploadImageInfo(false);
          }}
          className="h-[120px] cursor-pointer rounded-lg border border-dashed border-gray-300 bg-[#F6F8FA] p-8 text-center transition-colors hover:border-purple-400 hover:bg-purple-50"
        >
          <div className="flex flex-col items-center">
            <UploadFileIcon />

            <p className="mb-1 text-sm text-gray-600">Selecionar arquivos...</p>
            <p className="text-xs text-gray-400">Tamanho max: 1MB</p>
          </div>
        </div>

        {/* Upload Status */}
        {(isUploading || hookIsUploading) && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-blue-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              Enviando imagem...
            </div>
          </div>
        )}

        {uploadError && (
          <div className="mt-3 text-center">
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <TooltipPortal />
    </div>
  );
}
