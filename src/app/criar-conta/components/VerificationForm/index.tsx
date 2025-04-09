import React from "react";
import { LoaderCircle } from "lucide-react";
import Lock from "#/components/icons/Lock";
import { TextField } from "#/components/Inputs";

type VerificationFormProps = {
  code: string;
  setCode: (code: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoaded?: boolean;
};

const VerificationForm: React.FC<VerificationFormProps> = ({
  code,
  setCode,
  onSubmit,
  isLoaded,
}) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2 relative">
        <Lock className="absolute right-4 bottom-2" width="20" height="20" />
        <TextField
          label="Código"
          inputName="code"
          id="code"
          type="text"
          placeholder="Adicione o código recebido por email"
          onChange={(e) => setCode(e.target.value)}
          value={code}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-[var(--color-primary-light-400)] text-white rounded-[var(--radius-s)] font-medium hover:bg-[var(--color-primary-light-500)] transition-colors mt-4 h-[54px] cursor-pointer"
      >
        {!isLoaded ? <LoaderCircle className="animate-spin" /> : "Verificar"}
      </button>
    </form>
  );
};

export default VerificationForm;
