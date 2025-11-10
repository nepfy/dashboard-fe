"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SsoCallbackPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          Processando sua autenticação
        </h1>
        <p className="text-lg">
          Por favor, aguarde enquanto redirecionamos você...
        </p>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary-light-400)]"></div>
        </div>

        <AuthenticateWithRedirectCallback
          signInFallbackRedirectUrl="/app"
          signUpFallbackRedirectUrl="/app"
        />
      </div>
    </div>
  );
}
