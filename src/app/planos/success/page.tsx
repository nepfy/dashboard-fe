"use client";

import { StripeStatusPage } from "#/components/stripe-status-page";

export default function StripeSuccessPage() {
  return (
    <StripeStatusPage
      type="success"
      title="Assinatura ativa"
      description="Pagamento confirmado. Recebemos o evento do Stripe, o backend atualizou sua assinatura e você será levado ao dashboard em alguns segundos."
      buttonText="Ir para Dashboard"
      buttonHref="/dashboard"
      showConfetti={true}
    />
  );
}
