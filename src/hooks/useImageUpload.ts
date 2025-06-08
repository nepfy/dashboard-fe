// src/hooks/useImageUpload.ts
import { useState } from "react";

interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    filename: string;
  };
  error?: string;
}

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        setUploadError(result.error || "Erro ao fazer upload da imagem");
        return {
          success: false,
          error: result.error || "Erro ao fazer upload da imagem",
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      setUploadError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsUploading(false);
    }
  };

  const clearError = () => {
    setUploadError(null);
  };

  return {
    uploadImage,
    isUploading,
    uploadError,
    clearError,
  };
};
