"use client";

import { useState, useEffect } from "react";
import { TextField } from "#/components/Inputs";
import PasswordInput from "#/components/Inputs/PasswordInput";
import RenderPasswordStrengthMeter from "#/components/RenderPassword";
import WarningIcon from "#/components/icons/WarningIcon";

import {
  evaluatePasswordStrength,
  PasswordStrength,
} from "#/helpers/evaluatePassword";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: "none",
    score: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setPasswordStrength(evaluatePasswordStrength(password));
    setError("");
  }, [password]);

  return (
    <div className="max-w-[595px] bg-white-neutral-light-100 border border-white-neutral-light-300 rounded-[12px] p-6 mb-[64px] sm:mb-[100px]">
      <p className="text-white-neutral-light-900 font-medium leading-[18px] mb-3">
        Segurança da conta
      </p>

      <form onSubmit={() => console.log("form")}>
        <div className="pb-2">
          <TextField
            label="Email"
            inputName="emailAddress"
            id="email"
            type="email"
            placeholder="Digite o email cadastrado"
            onChange={() => console.log("email")}
          />
        </div>

        <div className="py-2 flex flex-col sm:flex-row justify-center items-center">
          <div className="py-2 w-full sm:w-1/2 sm:pr-2">
            <PasswordInput
              label="Senha"
              id="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
            />

            <div className="w-[112px]">
              <RenderPasswordStrengthMeter
                password={password}
                passwordStrength={passwordStrength}
              />
            </div>
          </div>
          <div className="py-2 w-full sm:w-1/2">
            <PasswordInput
              label="Confirme a senha"
              id="confirmPassword"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPassword={showConfirmPassword}
              toggleShowPassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          </div>
        </div>
        <div className="flex items-center justify-start flex-wrap mt-4 mb-5">
          <button
            type="submit"
            className="h-[44px] text-white rounded-[var(--radius-s)] font-medium transition-colors cursor-pointer bg-[var(--color-primary-light-400)] hover:bg-[var(--color-primary-light-500)] button-inner-inverse px-5 m-2 sm:m-0 sm:mr-2"
          >
            Salvar alterações
          </button>

          <button
            type="submit"
            className="w-[95px] h-[44px] border border-white-neutral-light-300 button-inner bg-white-neutral-light-100 rounded-xs flex items-center justify-center m-2 sm:m-0"
          >
            Cancelar
          </button>
        </div>
        {error && (
          <div className="px-6 py-3 bg-red-100 text-red-700 rounded-2xs border border-red-light-50 flex">
            <WarningIcon className="mr-3" fill="#D00003" /> {error}
          </div>
        )}
      </form>
    </div>
  );
}
