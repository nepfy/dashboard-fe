"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";

import { TextAreaField } from "#/components/Inputs";

import TitleDescription from "../../TitleDescription";
import StepProgressIndicator from "../../StepProgressIndicator";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TeamMemberAccordion from "./TeamMembersAccordion";
import { TeamMember } from "#/types/project";
import InfoIcon from "#/components/icons/InfoIcon";

export default function AboutYourTeamForm() {
  const { prevStep, nextStep, updateFormData, formData, currentStep } =
    useProjectGenerator();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleHideSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    updateFormData("step3", {
      ...formData?.step3,
      hideAboutYourTeamSection: e.target.checked,
    });
  };

  const handleFieldChange =
    (fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateFormData("step3", {
        ...formData?.step3,
        [fieldName]: e.target.value,
      });

      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    };

  const [uploadingMembers, setUploadingMembers] = useState<Set<string>>(
    new Set()
  );

  const handleTeamMembersChange = (members: TeamMember[]) => {
    updateFormData("step3", {
      ...formData?.step3,
      teamMembers: members,
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith("member_") || key === "teamMembers") {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const handleUploadStateChange = (memberId: string, isUploading: boolean) => {
    setUploadingMembers((prev) => {
      const newSet = new Set(prev);
      if (isUploading) {
        newSet.add(memberId);
      } else {
        newSet.delete(memberId);
      }
      return newSet;
    });
  };

  const handleBack = () => {
    prevStep();
  };

  const handleNext = () => {
    setErrors({});

    const hideSection = formData?.step3?.hideAboutYourTeamSection || false;
    const ourTeamSubtitle = formData?.step3?.ourTeamSubtitle || "";
    const teamMembers = formData?.step3?.teamMembers || [];
    const newErrors: { [key: string]: string } = {};

    if (!hideSection) {
      if (ourTeamSubtitle.length < 30 || ourTeamSubtitle.length > 55) {
        newErrors.ourTeamSubtitle =
          "O campo 'Subtítulo' deve ter pelo menos 30 e no máximo 55 caracteres";
      }

      if (teamMembers.length === 0) {
        newErrors.teamMembers = "Ao menos 1 integrante é requerido";
      } else {
        // Validação dos campos obrigatórios de cada membro
        teamMembers.forEach((member, index) => {
          const memberNumber = index + 1;

          if (!member.photo || member.photo.trim() === "") {
            newErrors[
              `member_${member.id}_photo`
            ] = `A foto do Integrante ${memberNumber} é obrigatória`;
          }

          if (!member.name || member.name.trim() === "") {
            newErrors[
              `member_${member.id}_name`
            ] = `O nome do Integrante ${memberNumber} é obrigatório`;
          }

          if (!member.role || member.role.trim() === "") {
            newErrors[
              `member_${member.id}_role`
            ] = `O cargo do Integrante ${memberNumber} é obrigatório`;
          }
        });
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    nextStep();
  };

  const hideSectionChecked = formData?.step3?.hideAboutYourTeamSection || false;

  const hasTeamMemberErrors = Object.keys(errors).some(
    (key) => key.startsWith("member_") || key === "teamMembers"
  );

  const hasUploadsInProgress = uploadingMembers.size > 0;

  return (
    <div className="h-full flex flex-col justify-between relative overflow-y-scroll">
      <div className="p-7 mb-20">
        <div className="mb-6">
          <StepProgressIndicator currentStep={currentStep} />
        </div>
        <button
          type="button"
          onClick={() => {}}
          className="xl:hidden mb-4 w-full p-3 border-1 border-white-neutral-light-300 rounded-[10px] bg-white-neutral-light-100 hover:bg-white-neutral-light-200 transition-colors flex items-center justify-center gap-2 text-white-neutral-light-800 button-inner cursor-pointer"
        >
          <Eye width="18" height="18" /> Pré-visualizar essa seção
        </button>
        <TitleDescription
          title="Sobre seu time:"
          description="Mostre quem está por trás do projeto"
        />

        <label className="flex items-center gap-2 text-white-neutral-light-800 text-xs py-4">
          <input
            type="checkbox"
            checked={hideSectionChecked}
            onChange={handleHideSectionChange}
            className="border border-white-neutral-light-300 checkbox-custom"
          />
          Ocultar seção
        </label>

        {hideSectionChecked && (
          <div className="border border-yellow-light-50 rounded-2xs bg-yellow-light-25 p-4">
            <p className="text-white-neutral-light-800 text-sm">
              A seção{" "}
              <span className="font-bold">&quot;Sobre seu time&quot;</span> está
              atualmente oculta da proposta.
            </p>
          </div>
        )}

        <div className="py-6">
          <div className="py-2">
            <label
              className={`text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center ${
                hideSectionChecked ? "bg-white-neutral-light-300" : ""
              }`}
              style={{
                backgroundColor: hideSectionChecked
                  ? undefined
                  : "rgba(107, 70, 245, 0.05)",
              }}
            >
              Subtítulo
            </label>
            <TextAreaField
              id="ourTeamSubtitle"
              textareaName="ourTeamSubtitle"
              placeholder="Fale mais sobre você ou seu time"
              value={formData?.step3?.ourTeamSubtitle || ""}
              onChange={handleFieldChange("ourTeamSubtitle")}
              maxLength={55}
              minLength={30}
              rows={2}
              showCharCount
              error={errors.ourTeamSubtitle}
              disabled={hideSectionChecked}
              allowOverText
            />
          </div>
          <div className="pt-4">
            <TeamMemberAccordion
              teamMembers={formData?.step3?.teamMembers || []}
              onTeamMembersChange={handleTeamMembersChange}
              disabled={hideSectionChecked}
              errors={errors}
              onUploadStateChange={handleUploadStateChange}
            />
            {errors.teamMembers && (
              <p className="text-red-700 rounded-md text-sm font-medium mt-3">
                {errors.teamMembers}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex gap-2 p-6 items-center fixed bottom-0 bg-white-neutral-light-200">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center gap-1 w-[110px] h-[44px] px-4 py-2 text-sm font-medium border rounded-[12px] border-white-neutral-light-300 cursor-pointer button-inner text-white-neutral-light-900 hover:bg-white-neutral-light-300"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <button
          type="button"
          className={`w-full sm:w-[100px] h-[44px] px-4 py-2 text-sm font-medium border rounded-[12px] border-white-neutral-light-300 cursor-pointer ${
            hasUploadsInProgress
              ? "bg-white-neutral-light-300 text-white-neutral-light-500 cursor-not-allowed"
              : "bg-primary-light-500 button-inner-inverse text-white-neutral-light-100"
          }`}
          onClick={handleNext}
          disabled={hasUploadsInProgress}
        >
          {hasUploadsInProgress ? "Aguarde" : "Avançar"}
        </button>
        {errors.ourTeamSubtitle || hasTeamMemberErrors ? (
          <div className="bg-red-light-10 border border-red-light-50 rounded-2xs py-4 px-6 hidden xl:flex items-center justify-center gap-2 ">
            <InfoIcon fill="#D00003" />
            <p className="text-white-neutral-light-800 text-sm">
              Preencha todos os campos
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
