"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import GoogleLogo from "#/components/icons/GoogleLogo";

import Lock from "#/components/icons/Lock";
import MailEnvelope from "#/components/icons/MailEnvelope";
import { TextField, CheckboxInput } from "#/components/Inputs";
import IntroSlider from "#/components/IntroSlider";
import FormHeader from "#/app/onboarding/components/FormHeader";

export default function CreateAccount() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      const signUpUser = await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);

      if (signUpUser.status === "complete") {
        setActive({ session: signUpUser.createdSessionId });
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
      if (
        err instanceof Error &&
        "errors" in err &&
        Array.isArray(err.errors)
      ) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({
          session: completeSignUp.createdSessionId,
        });
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
      if (
        err instanceof Error &&
        "errors" in err &&
        Array.isArray(err.errors)
      ) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  if (!isLoaded) <div> Loading </div>;

  return (
    <div className="grid place-items-center pt-20 pb-10 sm:pb-0 sm:pt-0 sm:min-h-screen">
      <div className="grid xl:grid-cols-2 w-full min-h-screen">
        <IntroSlider
          title="Gere propostas"
          description="Prepare uma proposta visualmente cativante e bem estruturada."
        />

        <div className="flex items-center justify-center p-8 sm:p-20 pb-0 sm:pb-20">
          <div className="w-full max-w-[480px] space-y-8">
            <FormHeader
              title="Criar conta"
              description="Entre para a Nepfy e revolucione a forma como você apresenta suas propostas!"
            />
            {!pendingVerification ? (
              <>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2 relative">
                    <MailEnvelope
                      className="absolute right-4 bottom-2"
                      width="20"
                      height="20"
                    />
                    <TextField
                      label="Email"
                      inputName="emailAddress"
                      id="email"
                      type="email"
                      placeholder="Adicione seu email"
                      onChange={(e) => setEmailAddress(e.target.value)}
                      value={emailAddress}
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <button
                      type="button"
                      className="absolute right-4 bottom-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye width="20" height="20" />
                      ) : (
                        <EyeOff width="20" height="20" />
                      )}
                    </button>

                    <TextField
                      label="Senha"
                      inputName="password"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <button
                      type="button"
                      className="absolute right-4 bottom-2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <Eye width="20" height="20" />
                      ) : (
                        <EyeOff width="20" height="20" />
                      )}
                    </button>
                    <TextField
                      label="Confirme a senha"
                      inputName="confirmPassword"
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckboxInput
                      id="terms"
                      label={
                        <>
                          Li e concordo com os{" "}
                          <Link href="/termos-de-uso">
                            <p className="text-[var(--color-primary-light-400)] hover:underline inline-block">
                              Termos de uso
                            </p>
                          </Link>
                          .
                        </>
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[var(--color-primary-light-400)] text-white rounded-[var(--radius-s)] font-medium hover:bg-[var(--color-primary-light-500)] transition-colors mt-4 h-[54px]"
                  >
                    Criar conta
                  </button>
                </form>

                <div className="text-center text-[var(--color-white-neutral-light-500)]">
                  Já possui uma conta?{" "}
                  <Link href="/">
                    <p className="text-[var(--color-primary-light-400)] hover:underline inline-block font-medium">
                      Faça login
                    </p>
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--color-white-neutral-light-300)]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--color-white-neutral-light-200)] text-[var(--color-white-neutral-light-500)]">
                      ou
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-3 px-4 bg-[var(--color-white-neutral-light-100)] text-[var(--color-white-neutral-light-800)] rounded-[var(--radius-s)] font-medium border border-[var(--color-white-neutral-light-300)] hover:bg-[var(--color-white-neutral-light-200)] transition-colors flex items-center justify-center gap-2"
                >
                  <GoogleLogo />
                  Continuar com o Google
                </button>
              </>
            ) : (
              <form className="space-y-6" onSubmit={handleVerification}>
                <div className="space-y-2 relative">
                  <Lock
                    className="absolute right-4 bottom-2"
                    width="20"
                    height="20"
                  />
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
              </form>
            )}

            {error && <div> Um alerta de Erro </div>}
          </div>
        </div>
      </div>
    </div>
  );
}
