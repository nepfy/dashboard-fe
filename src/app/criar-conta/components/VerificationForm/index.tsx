import React from "react";
import Lock from "#/components/icons/Lock";
import { TextField } from "#/components/Inputs";

type VerificationFormProps = {
  code: string;
  setCode: (code: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
};

const VerificationForm: React.FC<VerificationFormProps> = ({
  code,
  setCode,
  onSubmit,
}) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2 relative">
        <Lock className="absolute right-4 bottom-2" width="20" height="20" />
        <TextField
          label="Code"
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
        className="w-full py-3 px-4 bg-[var(--color-primary-light-400)] text-white rounded-[var(--radius-s)] font-medium hover:bg-[var(--color-primary-light-500)] transition-colors mt-4 h-[54px]"
      >
        Verificar
      </button>
    </form>
  );
};

export default VerificationForm;
