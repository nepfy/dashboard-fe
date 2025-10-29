"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import CloseIcon from "#/components/icons/CloseIcon";
import UploadFileIcon from "#/components/icons/UploadFileIcon";
import { useImageUpload } from "#/hooks/useImageUpload";
import {
  getAspectRatio,
  createImage,
  getCroppedImg,
} from "#/helpers/imageUtils";
import { TeamMember, Result, Testimonial } from "#/types/template-data";
import { ChevronLeft } from "lucide-react";

interface UploadImageProps {
  onClose: () => void;
  itemType: "team" | "results" | "testimonials";
  items: (TeamMember | Result | Testimonial)[];
  onUpdate: (
    data: Partial<TeamMember> | Partial<Result> | Partial<Testimonial>
  ) => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function UploadImage({
  onClose,
  itemType,
  items,
  onUpdate,
}: UploadImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading, uploadError } = useImageUpload();

  // Calculate aspect ratio based on visible items count
  const visibleItems =
    items?.filter((item) =>
      itemType === "team"
        ? !(item as TeamMember).hidePhoto && (item as TeamMember).image
        : itemType === "results"
          ? !(item as Result).hidePhoto && (item as Result).photo
          : !(item as Testimonial).hidePhoto && (item as Testimonial).photo
    ) || [];

  const aspectRatio = getAspectRatio(visibleItems.length);

  const onCropComplete = useCallback(
    (croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("Tipo de arquivo não suportado. Use apenas JPG ou PNG.");
      return;
    }

    // Validate file size (1MB max)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      setError("Arquivo muito grande. Tamanho máximo: 1MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
    });
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Create a proper file list and trigger file selection
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fakeEvent = {
        target: { files: dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const image = await createImage(imageSrc);
      const croppedImageFile = await getCroppedImg(
        image,
        croppedAreaPixels,
        `cropped-image-${Date.now()}.jpg`
      );

      const result = await uploadImage(croppedImageFile);
      if (result.success && result.data) {
        if (itemType === "team") {
          onUpdate({ image: result.data.url });
        } else if (itemType === "results" || itemType === "testimonials") {
          onUpdate({ photo: result.data.url });
        }
        onClose();
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Erro ao processar a imagem. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);
    // Clear and open file input dialog
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.click();
      }
    }, 0);
  };

  return (
    <div
      className="bg-white-neutral-light-100 flex h-full w-full flex-col overflow-y-auto pt-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className="mb-6 flex w-full flex-shrink-0 items-center justify-between border-b border-b-[#E0E3E9] pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <ChevronLeft
          className="cursor-pointer text-[#2A2A2A]"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />

        <span className="text-lg font-medium text-[#2A2A2A]">
          Adicionar imagem
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[4px] border border-[#DBDDDF] bg-[#F7F6FD] p-1.5"
        >
          <CloseIcon width="12" height="12" fill="#1C1A22" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        {!imageSrc ? (
          /* File Selection Area */
          <div
            className="flex flex-1 flex-col items-start justify-start"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div
              className="border-white-neutral-light-300 hover:border-white-neutral-light-400 relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center transition-colors"
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #F6F8FA 25%, transparent 25%),
                  linear-gradient(-45deg, #F6F8FA 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #F6F8FA 75%),
                  linear-gradient(-45deg, transparent 75%, #F6F8FA 75%)
                `,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }}
            >
              <UploadFileIcon />
              <p className="mt-4 text-sm font-medium text-[#7C7C7C]">
                Selecionar arquivos...
              </p>
              <p className="mt-1 text-xs font-medium text-[#7C7C7C]">
                Tamanho max: 1MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          /* Image Cropping Area */
          <div className="flex flex-1 flex-col">
            <div className="relative min-h-0 flex-1">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={true}
                style={{
                  containerStyle: {
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  },
                }}
              />
            </div>

            {/* Zoom Control */}
            <div className="mt-4 mb-4 flex items-center justify-between gap-3 px-4">
              <label className="block text-sm font-medium text-gray-700">
                Zoom
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {(error || uploadError) && (
          <div className="mt-4 px-4">
            <p className="text-center text-sm text-red-600">
              {error || uploadError}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-white-neutral-light-300 flex flex-col gap-2 border-t pt-4">
          <button
            onClick={imageSrc ? handleReset : onClose}
            className="bg-white-neutral-light-100 border-white-neutral-light-300 button-inner text-white-neutral-light-900 hover:bg-white-neutral-light-200 flex w-full transform cursor-pointer items-center justify-center rounded-[12px] border px-6 py-3.5 text-sm font-medium transition-all duration-200"
          >
            {imageSrc ? "Escolher outra" : "Voltar"}
          </button>

          {imageSrc && (
            <button
              onClick={handleSave}
              disabled={isProcessing || isUploading || !croppedAreaPixels}
              className="flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
            >
              {isProcessing || isUploading
                ? "Processando..."
                : "Salvar alterações"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
