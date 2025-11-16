"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import Modal from "#/components/Modal";
import KeyIcon from "./KeyIcon";

interface PasswordManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentPassword?: string | null;
  onPasswordChange?: (newPassword: string) => Promise<void>;
}

export default function PasswordManagerModal({
  isOpen,
  onClose,
  projectId,
  currentPassword,
  onPasswordChange,
}: PasswordManagerModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword(currentPassword || "");
      setShowPassword(false);
      setShowSuccessMessage(false);
      setIsEditing(false);
    }
  }, [isOpen, currentPassword]);

  const handleCopyPassword = async () => {
    if (!password) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(password);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy password:", error);
    } finally {
      setIsCopying(false);
    }
  };

  const handleChangePassword = async () => {
    if (!onPasswordChange || !password.trim()) return;

    setIsLoading(true);
    try {
      await onPasswordChange(password.trim());
      setShowSuccessMessage(true);
      setIsEditing(false);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gerenciar senha"
      footer={false}
      closeOnClickOutside={!isLoading}
      showCloseButton={!isLoading}
      width="520px"
    >
      <div className="px-6 pb-6">
        <div className="w-full px-2 pt-4 pb-0">
          <KeyIcon />
        </div>

        <p className="text-white-neutral-light-500 text-sm mb-6 mt-4">
          Gerencie a senha da sua proposta: visualize, copie ou altere quando
          quiser.
        </p>

        {/* Password Display/Copy Field */}
        <div className="mb-6">
          <label className="text-white-neutral-light-900 text-sm font-semibold mb-2 block">
            Copiar senha
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsEditing(true)}
                className="w-full px-4 py-3 pr-20 rounded-lg border border-white-neutral-light-300 bg-white-neutral-light-100 text-white-neutral-light-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light-400"
                placeholder={password ? undefined : "Senha não definida"}
                disabled={isLoading && !isEditing}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded hover:bg-white-neutral-light-200 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-white-neutral-light-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-white-neutral-light-600" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  disabled={!password || isCopying}
                  className="p-1.5 rounded hover:bg-white-neutral-light-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Copiar senha"
                >
                  {isCopying ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-white-neutral-light-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm text-center">
              Senha utilizada com sucesso!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white-neutral-light-300">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-primary-light-400 text-primary-light-400 text-sm font-medium hover:bg-primary-light-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fechar
          </button>
          <button
            onClick={handleChangePassword}
            disabled={isLoading || !password.trim()}
            className="px-4 py-2 rounded-lg bg-primary-light-400 text-white text-sm font-medium hover:bg-primary-light-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Alterando..." : "Alterar senha"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

