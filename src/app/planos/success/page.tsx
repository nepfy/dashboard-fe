"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StripeStatusPage } from "#/components/stripe-status-page";

export default function StripeSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <StripeStatusPage
      type="success"
      title="Compra realizada com sucesso!"
      description="Seu plano foi ativado e você já pode começar a aproveitar tudo que a Nepfy oferece. Redirecionando para o dashboard..."
      buttonText="Ir para Dashboard"
      buttonHref="/dashboard"
      showConfetti={true}
    />
  );
}
