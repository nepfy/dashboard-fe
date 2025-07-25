"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./PasswordSection.css";

interface PasswordSectionProps {
  password?: string | null;
  onPasswordCorrect: () => void;
  mainColor?: string | null;
  data?: { id?: string }; // Add data prop for session storage key
}

export default function PasswordSection({
  password,
  onPasswordCorrect,
  mainColor,
  data,
}: PasswordSectionProps) {
  const [inputPassword, setInputPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      // If no password is set, allow access
      onPasswordCorrect();
      return;
    }

    setIsLoading(true);
    setError(false);

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (inputPassword === password) {
      // Store in session storage to remember the user has entered the correct password
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `flash-password-${data?.id || "default"}`,
          "true"
        );
      }
      onPasswordCorrect();
    } else {
      setError(true);
      setInputPassword("");
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-6 password-section-enter password-section-enter-active"
      style={{
        background: `radial-gradient(80.7% 1103.34% at 0 0, #000000 0%, #000000 0%, ${mainColor} 64.9%, ${mainColor} 81.78%)`,
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-white-neutral-light-100 text-2xl font-medium mb-2">
            Inserir Senha
          </h2>

          <p className="text-white-neutral-light-100 text-base mb-6 opacity-80">
            Por favor, insira a senha para visualizar a proposta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  if (error) setError(false);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Insira a senha"
                className={`w-full px-4 py-4 pr-12 text-white-neutral-light-900 bg-white border rounded-lg ${
                  error ? "border-red-500 password-error" : "border-[#A0A0A0]"
                }`}
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white-neutral-light-600"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm mt-2 password-error">
                Senha incorreta. Tente novamente.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputPassword.trim()}
            className={`w-full bg-black text-white py-4 px-6 rounded-lg font-semibold text-sm cursor-pointer ${
              isLoading || !inputPassword.trim()
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isLoading ? "Verificando..." : "Acessar"}
          </button>
        </form>
      </div>
    </div>
  );
}
