"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useUserAccount } from "#/hooks/useUserAccount";
import { PersonalDataProps, PersonalDataRef } from "./types";
import { usePersonalForm } from "./hooks/usePersonalForm";
import { ImageUpload } from "./_components/ImageUpload";
import { FormFields } from "./_components/FormFields";
import ErrorMessage from "#/components/ErrorMessage";
import SuccessMessage from "#/components/SuccessMessage";

const PersonalData = forwardRef<PersonalDataRef, PersonalDataProps>(
  (props, ref) => {
    const { successMessage, isEditing } = props;
    const { isLoading, error } = useUserAccount();

    const {
      formValues,
      hasChanges,
      imagePreview,
      setImagePreview,
      handleChange,
      updateFormValues,
      handleSubmit,
      handleCancel,
      setHasChanges,
    } = usePersonalForm(isEditing);

    useImperativeHandle(ref, () => ({
      handleSubmit,
      handleCancel,
      hasChanges,
    }));

    return (
      <div className="max-w-[595px] bg-white-neutral-light-100 border border-white-neutral-light-300 rounded-[12px] p-6 mb-[64px] sm:mb-[100px]">
        <p className="text-white-neutral-light-900 font-medium leading-[18px] mb-3 sm:mb-0">
          Dados Pessoais
        </p>

        {successMessage && (
          <div className="mt-3">
            <SuccessMessage message="Dados atualizados com sucesso" />
          </div>
        )}
        {error && (
          <div className="mt-3">
            <ErrorMessage error={error} />
          </div>
        )}

        <form>
          <ImageUpload
            isEditing={isEditing}
            isLoading={isLoading}
            imagePreview={imagePreview}
            onImageChange={setImagePreview}
            setHasChanges={setHasChanges}
          />

          <FormFields
            formValues={formValues}
            handleChange={handleChange}
            updateFormValues={updateFormValues}
            isEditing={isEditing}
            isLoading={isLoading}
          />
        </form>
      </div>
    );
  }
);

PersonalData.displayName = "PersonalData";

export default PersonalData;
