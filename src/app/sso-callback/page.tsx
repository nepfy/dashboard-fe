"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";

export default function SsoCallbackPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">
          Processando sua autenticação
        </h1>
        <p className="text-lg">
          Por favor, aguarde enquanto redirecionamos você...
        </p>
        <div className="mt-8 flex justify-center">
          <div className="flex h-64 items-center justify-center">
            <LoaderCircle className="text-primary-light-400 animate-spin" />
          </div>
        </div>

        <AuthenticateWithRedirectCallback
          signInFallbackRedirectUrl="/app"
          signUpFallbackRedirectUrl="/app"
        />
      </div>
    </div>
  );
}
