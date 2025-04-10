import React from "react";
import { LoaderCircle } from "lucide-react";
import Lock from "#/components/icons/Lock";
import { TextField } from "#/components/Inputs";
import { useSignUp } from "@clerk/nextjs";

type VerificationFormProps = {
  code: string;
  setCode: (code: string) => void;
  isLoaded?: boolean;
  setError?: (message: string) => void;
};

const VerificationForm: React.FC<VerificationFormProps> = ({
  code,
  setCode,
  isLoaded,
  setError,
}) => {
  const { signUp, setActive } = useSignUp();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp?.status !== "complete") {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp?.status === "complete") {
        await setActive?.({
          session: completeSignUp.createdSessionId,
        });
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
      if (
        err instanceof Error &&
        "errors" in err &&
        Array.isArray(err.errors)
      ) {
        setError?.(err.errors[0].message);
      } else {
        setError?.("Um erro ocorreu, tente novamente mais tarde.");
      }
    }
  };

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
      <div id="clerk-captcha" />
    </form>
  );
};

export default VerificationForm;
