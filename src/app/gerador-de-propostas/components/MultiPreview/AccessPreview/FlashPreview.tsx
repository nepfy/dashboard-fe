import { useState } from "react";
import { PasswordInput } from "#/components/Inputs";

interface PasswordSectionProps {
  mainColor?: string | null;
}

export default function PasswordSection({ mainColor }: PasswordSectionProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  return (
    <div
      className="w-full h-[700px] flex items-center justify-center px-6 password-section-enter password-section-enter-active"
      style={{
        background: `radial-gradient(120.7% 300.34% at 0 0, #000000 0%, #000000 0%, ${mainColor} 74.9%, ${mainColor} 81.78%)`,
      }}
    >
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-4">
          <h2 className="text-white-neutral-light-100 text-lg font-medium">
            Inserir Senha
          </h2>

          <p className="text-white-neutral-light-100 text-[12px] opacity-90">
            Por favor, insira a senha para visualizar a proposta
          </p>
        </div>

        <label
          htmlFor="password"
          className="text-white-neutral-light-100 text-[12px]"
        >
          Senha
        </label>
        <PasswordInput
          id="password"
          placeholder="Insira a senha"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold text-sm cursor-pointer -mt-10"
          disabled={true}
        >
          Acessar
        </button>
      </div>
    </div>
  );
}
