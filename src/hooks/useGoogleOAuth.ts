import { useCallback } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";

type ClerkErrorPayload = {
  code: string;
  message: string;
};

type ClerkApiError = {
  errors: ClerkErrorPayload[];
};

type AuthenticateWithGoogleOptions = {
  redirectUrlComplete: string;
  legalAccepted?: boolean;
  onError?: (message: string) => void;
};

const accountExistsCodes = new Set([
  "form_identifier_exists",
  "form_email_address_exists",
  "identifier_already_registered",
  "external_account_exists",
]);

const DEFAULT_ERROR_MESSAGE =
  "Ocorreu um erro ao conectar com Google. Tente novamente.";

const normalize = (value: string) => value.trim().toLowerCase();

const isClerkApiError = (error: unknown): error is ClerkApiError => {
  if (typeof error !== "object" || error === null || !("errors" in error)) {
    return false;
  }

  const { errors } = error as { errors: unknown };
  if (!Array.isArray(errors)) {
    return false;
  }

  return errors.every((item) => {
    if (typeof item !== "object" || item === null) {
      return false;
    }

    const payload = item as {
      code?: unknown;
      message?: unknown;
    };

    return (
      typeof payload.code === "string" && typeof payload.message === "string"
    );
  });
};

const shouldRetrySignIn = (error: ClerkApiError) =>
  error.errors.some(({ code, message }) => {
    if (accountExistsCodes.has(code)) {
      return true;
    }

    const normalizedMessage = normalize(message);
    return (
      normalizedMessage.includes("already exists") ||
      normalizedMessage.includes("já está em uso") ||
      normalizedMessage.includes("já existe") ||
      normalizedMessage.includes("already has an account")
    );
  });

export const useGoogleOAuth = () => {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

  const isReady = Boolean(signIn) && Boolean(signUp) && isSignInLoaded && isSignUpLoaded;

  const authenticateWithGoogle = useCallback(
    async ({
      redirectUrlComplete,
      legalAccepted,
      onError,
    }: AuthenticateWithGoogleOptions) => {
      if (!isReady || !signIn || !signUp) {
        onError?.(
          "Serviço de autenticação não disponível. Tente novamente em alguns instantes."
        );
        return;
      }

      const baseConfig = {
        strategy: "oauth_google" as const,
        redirectUrl: "/sso-callback",
        redirectUrlComplete,
      };

      try {
        await signUp.authenticateWithRedirect({
          ...baseConfig,
          ...(typeof legalAccepted === "boolean" ? { legalAccepted } : {}),
        });
        return;
      } catch (signUpError) {
        if (isClerkApiError(signUpError) && shouldRetrySignIn(signUpError)) {
          try {
            await signIn.authenticateWithRedirect(baseConfig);
            return;
          } catch (signInError) {
            onError?.(DEFAULT_ERROR_MESSAGE);
            console.error(signInError);
            return;
          }
        }

        const fallbackMessage =
          isClerkApiError(signUpError) && signUpError.errors[0]?.message
            ? signUpError.errors[0].message
            : DEFAULT_ERROR_MESSAGE;
        onError?.(fallbackMessage);
        console.error(signUpError);
      }
    },
    [isReady, signIn, signUp]
  );

  return {
    authenticateWithGoogle,
    isReady,
  };
};

