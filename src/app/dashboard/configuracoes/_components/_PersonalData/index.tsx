"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useUserAccount } from "#/hooks/useUserAccount";
import { PersonalDataProps, PersonalDataRef } from "./types";
import { usePersonalForm } from "./hooks/usePersonalForm";
import { ImageUpload } from "./_components/ImageUpload";
import { FormFields } from "./_components/FormFields";

const PersonalData = forwardRef<PersonalDataRef, PersonalDataProps>(
  (props, ref) => {
    const { isEditing } = props;
    const { isLoading } = useUserAccount();

    const {
      formValues,
      hasChanges,
      imagePreview,
      setImagePreview,
      handleChange,
      handleSubmit,
      handleCancel,
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

        <form>
          <ImageUpload
            isEditing={isEditing}
            isLoading={isLoading}
            imagePreview={imagePreview}
            onImageChange={setImagePreview}
          />

          <FormFields
            formValues={formValues}
            handleChange={handleChange}
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
