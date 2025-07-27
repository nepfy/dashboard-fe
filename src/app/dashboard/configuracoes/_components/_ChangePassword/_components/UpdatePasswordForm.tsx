"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useUser, useReverification } from "@clerk/nextjs";

import WarningIcon from "#/components/icons/WarningIcon";
import PasswordInput from "#/components/Inputs/PasswordInput";

import { evaluatePasswordStrength } from "#/helpers";
import RenderPasswordStrengthMeter from "#/components/RenderPassword";

interface UpdatePasswordFormProps {
  onCloseAction: Dispatch<SetStateAction<boolean>>;
}

export default function UpdatePasswordForm({
  onCloseAction,
}: UpdatePasswordFormProps) {
  const { user, isLoaded } = useUser();

  const changePassword = useReverification(
    (currentPassword: string, newPassword: string) =>
      user?.updatePassword({
        currentPassword,
        newPassword,
      })
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(
    evaluatePasswordStrength("")
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPasswordStrength(evaluatePasswordStrength(newPassword));
  }, [newPassword]);

  const handleCancelClick = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onCloseAction(false);
  };

  const isFormValid = () => {
    return (
      currentPassword.trim() !== "" &&
      newPassword.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      newPassword === confirmPassword &&
      passwordStrength.strength !== "fraca"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (!user || !isLoaded) {
        throw new Error("Usuário não autenticado");
      }

      // Update the password
      changePassword(currentPassword, newPassword);

      setSuccess("Senha atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onCloseAction(false);
    } catch (err) {
      console.error("Erro:", err);
      if (err instanceof Error) {
        if (err.message.includes("incorrect")) {
          setError(
            "Senha atual incorreta. Por favor, verifique e tente novamente."
          );
        } else {
          setError(
            "Ocorreu um erro ao atualizar sua senha. Por favor, tente novamente."
          );
        }
      } else {
        setError("Ocorreu um erro desconhecido. Por favor, tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <PasswordInput
        label="Senha atual"
        id="currentPassword"
        placeholder="Digite sua senha atual"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        showPassword={showCurrentPassword}
        toggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
      />

      <PasswordInput
        label="Nova senha"
        id="newPassword"
        placeholder="Digite a nova senha"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        showPassword={showNewPassword}
        toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
      />

      <div className="w-[112px] mb-4">
        <RenderPasswordStrengthMeter
          password={newPassword}
          passwordStrength={passwordStrength}
        />
      </div>

      <PasswordInput
        label="Confirme a nova senha"
        id="confirmPassword"
        placeholder="Confirme a nova senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <div className="flex space-x-3 mt-6">
        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className={`rounded-[var(--radius-s)] font-medium transition-colors text-white w-[160px] h-[44px]
                  ${
                    isFormValid() && !isLoading
                      ? "bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] cursor-pointer button-inner-inverse"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
        >
          {isLoading ? "Atualizando..." : "Atualizar senha"}
        </button>

        <button
          type="button"
          onClick={handleCancelClick}
          disabled={isLoading}
          className="border border-white-neutral-light-300 rounded-[var(--radius-s)] font-medium w-[92] h-[44px] cursor-pointer"
        >
          Cancelar
        </button>
      </div>

      {error && (
        <div className="mt-4 px-6 py-3 bg-red-100 text-red-700 rounded-2xs border border-red-light-50 flex">
          <WarningIcon className="mr-3" fill="#D00003" /> {error}
        </div>
      )}

      {success && (
        <div className="mt-4 px-6 py-3 bg-green-light-10 text-green-light-200 rounded-2xs border border-green-light-100 flex">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {success}
        </div>
      )}
    </form>
  );
}
