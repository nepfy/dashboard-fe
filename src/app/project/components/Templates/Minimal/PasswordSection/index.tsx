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
          `minimal-password-${data?.id || "default"}`,
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
      className="password-section-enter password-section-enter-active flex min-h-screen w-full items-center justify-center px-6"
      style={{
        background: `radial-gradient(80.7% 1103.34% at 0 0, #000000 0%, #000000 0%, ${mainColor} 64.9%, ${mainColor} 81.78%)`,
      }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-white-neutral-light-100 mb-2 text-2xl font-medium">
            Inserir Senha
          </h2>

          <p className="text-white-neutral-light-100 mb-6 text-base opacity-80">
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
                className={`text-white-neutral-light-900 w-full rounded-lg border bg-white px-4 py-4 pr-12 ${
                  error ? "password-error border-red-500" : "border-[#A0A0A0]"
                }`}
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white-neutral-light-600 absolute top-1/2 right-3 -translate-y-1/2"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {error && (
              <p className="password-error mt-2 text-sm text-red-400">
                Senha incorreta. Tente novamente.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputPassword.trim()}
            className={`w-full cursor-pointer rounded-lg bg-black px-6 py-4 text-sm font-semibold text-white ${
              isLoading || !inputPassword.trim()
                ? "cursor-not-allowed opacity-50"
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
