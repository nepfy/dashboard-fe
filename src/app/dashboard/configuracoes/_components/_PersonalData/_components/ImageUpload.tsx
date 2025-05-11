// ImageUpload.tsx
import { useRef, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import UploadIcon from "#/components/icons/UploadIcon";

interface ImageUploadProps {
  isEditing: boolean;
  isLoading: boolean;
  imagePreview: string | null;
  onImageChange: (imageUrl: string | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  isEditing,
  isLoading,
  imagePreview,
  onImageChange,
}) => {
  const { user, isLoaded: userLoaded } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    if (!isEditing || isLoading || uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      setUploading(true);
      await user.setProfileImage({ file });
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setUploading(false);
      onImageChange(null);
    }
  };

  return (
    <div className="sm:pt-6 sm:pb-2 flex items-center justify-start flex-wrap">
      <div className="h-[88px] w-[88px] rounded-full m-3 sm:m-0 sm:mr-6 overflow-hidden relative">
        {imagePreview ? (
          <Image
            src={imagePreview}
            fill
            style={{ objectFit: "cover" }}
            alt="Preview da foto de perfil"
            className="rounded-full"
          />
        ) : user?.imageUrl ? (
          <Image
            src={user.imageUrl}
            fill
            style={{ objectFit: "cover" }}
            alt="Foto de perfil usuário"
            className="rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="h-full w-full bg-gray-300 rounded-full"></div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center py-3 sm:py-0">
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={!isEditing || isLoading || uploading || !userLoaded}
          className={`border border-white-neutral-light-300 button-inner bg-white-neutral-light-100 rounded-xs w-[36px] h-[36px] flex items-center justify-center mr-2 ${
            !isEditing || isLoading || uploading || !userLoaded
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-white-neutral-light-200 cursor-pointer"
          }`}
        >
          <UploadIcon fill="#1C1A22" width="14" height="14" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p
          className={`font-medium ${
            !isEditing || isLoading || uploading || !userLoaded
              ? "opacity-50"
              : "text-white-neutral-light-900"
          }`}
        >
          Upload de Imagem
        </p>
      </div>
    </div>
  );
};
