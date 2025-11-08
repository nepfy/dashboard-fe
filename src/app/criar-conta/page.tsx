"use client";

import { useState, useEffect } from "react";
import { useSignUp } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";

import Navbar from "#/components/Navbar";
import Footer from "#/components/Footer";
import IntroSlider from "#/components/IntroSlider";
import FormHeader from "#/app/onboarding/components/FormHeader";

import SignUpForm from "#/app/criar-conta/components/SignUpForm";
import VerificationForm from "#/app/criar-conta/components/VerificationForm";

import { evaluatePasswordStrength, PasswordStrength } from "#/helpers";
import { validateEmail } from "#/helpers/validateEmail";

export default function CreateAccount() {
  const { isLoaded, signUp } = useSignUp();

  // Form state
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    strength: "none",
    score: 0,
  });

  // Verification state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [emailCode, setEmailCode] = useState("");

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
      passwordStrength.strength !== "fraca"
    );
  };

  const isEmailValid =
    emailAddress.trim() === "" || validateEmail(emailAddress);

  const handleSubmit = async () => {
    if (!isLoaded || !signUp) {
      setError(
        "Serviço de autenticação não disponível. Tente novamente em alguns instantes."
      );
      return;
    }

    if (!isFormValid()) {
      setError(
        "Por favor, preencha todos os campos corretamente para criar sua conta."
      );
      return;
    }

    setError("");

    try {
      await signUp.create({
        emailAddress,
        password,
        legalAccepted: true,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
      setEmailCode("");
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        "errors" in err &&
        Array.isArray(err.errors)
      ) {
        if (err.errors[0].code === "form_password_pwned") {
          return setError(
            "Senha comprometida. Por favor, escolha outra senha."
          );
        }
      } else {
        return setError(
          "Um erro ocorreu. Por favor, tente novamente mais tarde"
        );
      }

      if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string" &&
        (err as { message: string }).message ===
          "That email address is taken. Please try another."
      ) {
        return setError("Email já cadastrado. Tente outro.");
      }

      setError("Um erro ocorreu., por favor, tente novamente mais tarde.");
    }
  };

  if (!isLoaded)
    return (
      <div className="grid place-items-center pt-20 pb-10 sm:min-h-screen sm:pt-0 sm:pb-0">
        <LoaderCircle className="animate-spin" />
      </div>
    );

  return (
    <div className="grid h-screen place-items-center pt-0 pb-0">
      <Navbar />
      <div className="relative flex h-full w-full items-center justify-center gap-0">
        <IntroSlider />

        <div className="mb-6 flex w-full items-center justify-center px-8 pt-[106px] sm:mb-0 sm:p-0 lg:w-1/2 lg:pt-0">
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
                isEmailValid={isEmailValid}
                onSubmit={handleSubmit}
                termsAccepted={true}
                isLoaded={isLoaded}
                setError={setError}
                error={error}
              />
            ) : (
              <VerificationForm
                code={emailCode}
                setCode={setEmailCode}
                setError={setError}
                isLoaded={isLoaded}
              />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
