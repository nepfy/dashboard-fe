"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { Client } from "#/types/template-data";
import { useImageUpload } from "#/hooks/useImageUpload";
import UploadFileIcon from "#/components/icons/UploadFileIcon";

interface ImageTabProps {
  currentItem: Client | null;
  onUpdate: (data: Partial<Client>) => void;
  onDeleteItem: (itemId: string) => void;
}

export default function ImageTab({
  currentItem,
  onUpdate,
  onDeleteItem,
}: ImageTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputChangeRef = useRef<HTMLInputElement>(null);
  const {
    uploadImage,
    isUploading: hookIsUploading,
    uploadError,
  } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn("⚠️ No file selected");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      if (result.success && result.data) {
        onUpdate({ logo: result.data.url });
      }
    } catch (error) {
      console.error("❌ Error uploading image:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (fileInputChangeRef.current) {
        fileInputChangeRef.current.value = "";
      }
    }
  };

  if (!currentItem) {
    return (
      <div className="flex h-32 items-center justify-center text-gray-500">
        Selecione um cliente para editar
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-6">
        {/* Preview Area */}
        {currentItem.logo && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-gray-300 bg-white p-4">
            <div className="relative h-32 w-32 rounded-lg">
              <Image
                src={currentItem.logo}
                alt={currentItem.name || "Client logo"}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div>
          <div className="mb-2">
            <h3 className="text-sm font-medium text-[#2A2A2A]">
              Adicione uma nova imagem
            </h3>
          </div>

          {/* Upload Area */}
          <div className="relative">
            <label
              htmlFor="client-image-upload"
              className="flex h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-[#F6F8FA] p-8 text-center transition-colors hover:border-purple-400 hover:bg-purple-50"
            >
              <UploadFileIcon />
              <p className="mb-1 text-sm text-gray-600">
                Selecionar arquivos...
              </p>
              <p className="text-xs text-gray-400">Tamanho max: 1MB</p>
              {(isUploading || hookIsUploading) && (
                <p className="mt-2 text-xs text-gray-500">Enviando...</p>
              )}
            </label>
            <input
              id="client-image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading || hookIsUploading}
            />
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
        </div>

        {/* Change/Delete Section - Only show when logo exists */}
        {currentItem.logo && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <label
                htmlFor="client-image-upload-change"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#DBDDDF] bg-white px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-gray-50"
              >
                <UploadFileIcon />
                Alterar imagem
                {(isUploading || hookIsUploading) && (
                  <span className="ml-2 text-xs text-gray-500">
                    Enviando...
                  </span>
                )}
              </label>
              <input
                id="client-image-upload-change"
                ref={fileInputChangeRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading || hookIsUploading}
              />
            </div>

            {/* Remove Image Button */}
            <button
              onClick={() => {
                onUpdate({ logo: "" });
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Remover imagem
            </button>

            {/* Delete Client Button */}
            <button
              onClick={() => {
                if (currentItem.id) {
                  onDeleteItem(currentItem.id);
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Excluir cliente
            </button>
          </div>
        )}
      </div>
    </>
  );
}
