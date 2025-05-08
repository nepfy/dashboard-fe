"use client";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

import UploadIcon from "#/components/icons/UploadIcon";
import { TextField } from "#/components/Inputs";
import { useUserAccount } from "#/hooks/useUserAccount";

interface PersonalDataProps {
  isEditing: boolean;
}

interface PersonalDataRef {
  handleSubmit: () => Promise<void>;
  handleCancel: () => void;
}

const PersonalData = forwardRef<PersonalDataRef, PersonalDataProps>(
  (props, ref) => {
    const { isEditing } = props;
    const { user, isLoaded: userLoaded } = useUser();
    const { userData, isLoading, updateUserData } = useUserAccount();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formValues, setFormValues] = useState({
      fullName: "", // Add a fullName field to hold the combined name
      firstName: "",
      lastName: "",
      cpf: "",
      phone: "",
      cep: "",
      street: "",
      neighborhood: "",
      state: "",
      number: "",
      additionalAddress: "",
    });

    useEffect(() => {
      if (userData) {
        // When loading data, combine firstName and lastName into fullName
        const fullName = `${userData.firstName || ""} ${
          userData.lastName || ""
        }`.trim();

        setFormValues({
          fullName: fullName,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          cpf: userData.cpf || "",
          phone: userData.phone || "",
          cep: userData.cep || "",
          street: userData.street || "",
          neighborhood: userData.neighborhood || "",
          state: userData.state || "",
          number: userData.number || "",
          additionalAddress: userData.additionalAddress || "",
        });
      }
    }, [userData]);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === "fullName") {
        // When fullName changes, split it into firstName and lastName
        const nameParts = value.split(" ");
        const firstName = nameParts[0] || "";
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        setFormValues((prev) => ({
          ...prev,
          fullName: value, // Store the complete input as fullName
          firstName: firstName,
          lastName: lastName,
        }));
      } else {
        // Handle other fields normally
        setFormValues((prev) => ({ ...prev, [name]: value }));
      }
    };

    // Handle image upload button click
    const handleUploadClick = () => {
      if (!isEditing || isLoading || uploading) return;
      fileInputRef.current?.click();
    };

    // Handle file selection
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      try {
        // Create a preview of the image
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload the image to Clerk
        setUploading(true);
        await user.setProfileImage({ file });
        setUploading(false);

        // Clear the input value to ensure the change event fires if the same file is selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
        setUploading(false);
        setImagePreview(null);
      }
    };

    // Handle form submission
    const handleSubmit = async (): Promise<void> => {
      try {
        // Use the already split firstName and lastName from state
        await updateUserData({
          // Explicitly include firstName and lastName, omit fullName
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          cpf: formValues.cpf,
          phone: formValues.phone,
          cep: formValues.cep,
          street: formValues.street,
          neighborhood: formValues.neighborhood,
          state: formValues.state,
          number: formValues.number,
          additionalAddress: formValues.additionalAddress,
        });
        return Promise.resolve();
      } catch (error) {
        console.error("Error updating user data:", error);
        return Promise.reject(error);
      }
    };

    // Handle cancel button click
    const handleCancel = (): void => {
      // Reset form values to original user data
      if (userData) {
        const fullName = `${userData.firstName || ""} ${
          userData.lastName || ""
        }`.trim();

        setFormValues({
          fullName: fullName,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          cpf: userData.cpf || "",
          phone: userData.phone || "",
          cep: userData.cep || "",
          street: userData.street || "",
          neighborhood: userData.neighborhood || "",
          state: userData.state || "",
          number: userData.number || "",
          additionalAddress: userData.additionalAddress || "",
        });
      }
      // Clear image preview if it exists
      setImagePreview(null);
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      handleSubmit,
      handleCancel,
    }));

    return (
      <div className="max-w-[595px] bg-white-neutral-light-100 border border-white-neutral-light-300 rounded-[12px] p-6 mb-[64px] sm:mb-[100px]">
        <p className="text-white-neutral-light-900 font-medium leading-[18px] mb-3 sm:mb-0">
          Dados Pessoais
        </p>

        <form>
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
              <p className="text-white-neutral-light-900 font-medium">
                Upload de Imagem
              </p>
            </div>
          </div>

          <div className="pb-2">
            <TextField
              label="Nome Completo"
              inputName="fullName"
              id="fullName"
              type="text"
              placeholder="Nome Completo"
              onChange={handleChange}
              value={formValues.fullName}
              disabled={!isEditing || isLoading}
            />
          </div>

          <div className="py-2">
            <TextField
              label="CPF"
              inputName="cpf"
              id="cpf"
              type="text"
              placeholder="CPF"
              onChange={handleChange}
              value={formValues.cpf}
              disabled={!isEditing || isLoading}
            />
          </div>

          <div className="py-2">
            <TextField
              label="Telefone"
              inputName="phone"
              id="phone"
              type="text"
              placeholder="Telefone"
              onChange={handleChange}
              value={formValues.phone}
              disabled={!isEditing || isLoading}
            />
          </div>

          <div className="py-2">
            <TextField
              label="CEP"
              inputName="cep"
              id="cep"
              type="text"
              placeholder="CEP"
              onChange={handleChange}
              value={formValues.cep}
              disabled={!isEditing || isLoading}
            />
          </div>

          <div className="py-2">
            <TextField
              label="Endereço"
              inputName="street"
              id="street"
              type="text"
              placeholder="Endereço"
              onChange={handleChange}
              value={formValues.street}
              disabled={!isEditing || isLoading}
            />
          </div>

          <div className="py-2 flex flex-col sm:flex-row justify-center items-center">
            <div className="py-2 w-full sm:w-2/3 sm:pr-2">
              <TextField
                label="Bairro"
                inputName="neighborhood"
                id="neighborhood"
                type="text"
                placeholder="Bairro"
                onChange={handleChange}
                value={formValues.neighborhood}
                disabled={!isEditing || isLoading}
              />
            </div>
            <div className="py-2 w-full sm:w-1/3">
              <TextField
                label="UF"
                inputName="state"
                id="state"
                type="text"
                placeholder="UF"
                onChange={handleChange}
                value={formValues.state}
                disabled={!isEditing || isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center pb-2">
            <div className="py-2 sm:py-0 w-full sm:w-1/3 sm:pr-2">
              <TextField
                label="Número"
                inputName="number"
                id="number"
                type="text"
                placeholder="Número"
                onChange={handleChange}
                value={formValues.number}
                disabled={!isEditing || isLoading}
              />
            </div>
            <div className="py-2 sm:py-0 w-full sm:w-2/3">
              <TextField
                label="Complemento"
                inputName="additionalAddress"
                id="additionalAddress"
                type="text"
                placeholder="Complemento"
                onChange={handleChange}
                value={formValues.additionalAddress}
                disabled={!isEditing || isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
);

PersonalData.displayName = "PersonalData";

export default PersonalData;
