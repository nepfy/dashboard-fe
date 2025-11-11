import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import UploadIcon from "#/components/icons/UploadIcon";
import { LoaderCircle, Trash2 } from "lucide-react";

interface ImageUploadProps {
  isEditing: boolean;
  isLoading: boolean;
  imagePreview: string | null;
  onImageChange: (imageUrl: string | null) => void;
  setHasChanges: (hasChanges: boolean) => void; // Add this prop
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  isEditing,
  isLoading,
  imagePreview,
  onImageChange,
  setHasChanges,
}) => {
  const { user, isLoaded: userLoaded } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.imageUrl) {
      setOriginalImageUrl(user.imageUrl);
    } else {
      setOriginalImageUrl(null);
    }
  }, [user?.imageUrl]);

  useEffect(() => {
    if (isEditing) {
      const hasImageChanged =
        (imagePreview !== null && imagePreview !== originalImageUrl) ||
        (imagePreview === null && originalImageUrl !== null);

      setHasChanges(hasImageChanged);
    }
  }, [imagePreview, originalImageUrl, isEditing, setHasChanges]);

  const handleUploadClick = () => {
    if (!isEditing || isLoading || uploading || removing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImageChange(result);
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

  const handleRemoveImage = async () => {
    if (!isEditing || isLoading || uploading || removing || !user) return;

    try {
      setRemoving(true);

      await user.setProfileImage({ file: null });

      onImageChange(null);

      setRemoving(false);
    } catch (error) {
      console.error("Error removing profile image:", error);
      setRemoving(false);
    }
  };

  const showRemoveButton =
    isEditing && (imagePreview || user?.imageUrl) && !uploading && !removing;

  const getStatusText = () => {
    if (removing) return "Removendo imagem...";
    if (uploading) return "Enviando imagem...";
    if (isEditing) return "Edite a imagem de perfil";
    return "Upload de Imagem";
  };

  const isActionDisabled =
    !isEditing || isLoading || uploading || removing || !userLoaded;

  const getButtonClassName = () => {
    const baseClasses =
      "border border-white-neutral-light-300 button-inner bg-white-neutral-light-100 rounded-xs w-[36px] h-[36px] flex items-center justify-center mr-2";
    const stateClasses = isActionDisabled
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-white-neutral-light-200 cursor-pointer";

    return `${baseClasses} ${stateClasses}`;
  };

  const getStatusClassName = () => {
    const baseClasses = "font-medium mt-2 sm:mt-0";
    const stateClasses = isActionDisabled
      ? "opacity-50"
      : "text-white-neutral-light-900";

    return `${baseClasses} ${stateClasses}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-start sm:pt-6 sm:pb-2">
      <div className="relative m-3 h-[88px] w-[88px] overflow-hidden rounded-full sm:m-0 sm:mr-6">
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
          <div className="h-full w-full rounded-full bg-gray-300"></div>
        )}
        {(uploading || removing) && (
          <div className="bg-opacity-30 absolute inset-0 flex items-center justify-center rounded-full bg-black">
            <LoaderCircle className="text-primary-light-400 animate-spin" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-start py-3 sm:justify-center sm:py-0">
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={
            !isEditing || isLoading || uploading || removing || !userLoaded
          }
          className={getButtonClassName()}
          aria-label="Upload de imagem"
        >
          <UploadIcon fill="#1C1A22" width="14" height="14" />
        </button>

        {showRemoveButton && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="border-white-neutral-light-300 button-inner bg-white-neutral-light-100 hover:bg-white-neutral-light-200 mr-2 flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-xs border"
            aria-label="Remove image"
          >
            <Trash2 size={14} color="#D00003" />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className={getStatusClassName()}>{getStatusText()}</p>
      </div>
    </div>
  );
};
