"use client";

import { useState, useEffect } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import IntroSlider from "#/components/IntroSlider";
import FormHeader from "#/app/onboarding/components/FormHeader";
import {
  evaluatePasswordStrength,
  PasswordStrength,
} from "#/app/criar-conta/helpers/evaluatePassword";
import { validateEmail } from "./helpers/validateEmail";
import SignUpForm from "#/app/criar-conta/components/SignUpForm";
import VerificationForm from "#/app/criar-conta/components/VerificationForm";

export default function CreateAccount() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Form state
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: "none",
    score: 0,
  });

  // Verification state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  // Error handling
  const [error, setError] = useState("");

  // Evaluate password strength when password changes
  useEffect(() => {
    setPasswordStrength(evaluatePasswordStrength(password));
  }, [password]);

  const isFormValid = () => {
    return (
      emailAddress.trim() !== "" &&
      validateEmail(emailAddress) &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword &&
      passwordStrength.strength !== "fraca" &&
      termsAccepted
    );
  };

  const isEmailValid =
    emailAddress.trim() === "" || validateEmail(emailAddress);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !isFormValid()) return;

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
        setError("Um erro ocorreu, tente novamente mais tarde.");
      }
    }
  };

  if (!isLoaded)
    return (
      <div className="grid place-items-center pt-20 pb-10 sm:pb-0 sm:pt-0 sm:min-h-screen">
        Loading
      </div>
    );

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
              <SignUpForm
                emailAddress={emailAddress}
                setEmailAddress={setEmailAddress}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                passwordStrength={passwordStrength}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                termsAccepted={termsAccepted}
                setTermsAccepted={setTermsAccepted}
                onSubmit={handleSubmit}
                isFormValid={isFormValid}
                isEmailValid={isEmailValid}
              />
            ) : (
              <VerificationForm
                code={code}
                setCode={setCode}
                onSubmit={handleVerification}
              />
            )}

            {error && (
              <div className="px-6 py-3 bg-red-100 text-red-700 rounded-2xl border border-red-light-50">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
