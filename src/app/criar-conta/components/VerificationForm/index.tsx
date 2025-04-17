import React from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
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
  const router = useRouter();

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
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
      setError?.("Código incorreto.");
    }
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
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
        disabled={code.length !== 6}
        className={`w-full py-3 px-4 bg-[var(--color-primary-light-400)] text-white rounded-[var(--radius-s)] font-medium transition-colors mt-4 h-[54px]
        ${
          code.length !== 6
            ? "bg-gray-400 cursor-not-allowed"
            : "hover:bg-[var(--color-primary-light-500)] cursor-pointer"
        }
          `}
      >
        {!isLoaded ? <LoaderCircle className="animate-spin" /> : "Verificar"}
      </button>
      <div id="clerk-captcha" />
    </form>
  );
};

export default VerificationForm;
