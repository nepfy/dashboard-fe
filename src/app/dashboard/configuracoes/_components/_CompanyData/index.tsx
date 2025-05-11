"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useUserAccount } from "#/hooks/useUserAccount";
import { CompanyDataProps, CompanyDataRef } from "./types";
import { useCompanyForm } from "./hooks/useCompanyForm";
import { FormFields } from "./_components/FormFields";
import ErrorMessage from "#/components/ErrorMessage";
import SuccessMessage from "#/components/SuccessMessage";

const CompanyData = forwardRef<CompanyDataRef, CompanyDataProps>(
  (props, ref) => {
    const { successMessage, isEditing } = props;
    const { isLoading, error } = useUserAccount();

    const {
      formValues,
      hasChanges,
      handleChange,
      updateFormValues,
      handleSubmit,
      handleCancel,
    } = useCompanyForm(isEditing);

    useImperativeHandle(ref, () => ({
      handleSubmit,
      handleCancel,
      hasChanges,
    }));

    return (
      <div className="max-w-[595px] bg-white-neutral-light-100 border border-white-neutral-light-300 rounded-[12px] p-6 mb-[64px] sm:mb-[100px]">
        <p className="text-white-neutral-light-900 font-medium leading-[18px] mb-4">
          Dados Empresariais
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

CompanyData.displayName = "CompanyData";

export default CompanyData;
