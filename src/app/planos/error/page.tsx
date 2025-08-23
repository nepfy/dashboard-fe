import { StripeStatusPage } from "#/components/stripe-status-page";

export default function StripeErrorPage() {
  return (
    <StripeStatusPage
      type="error"
      title="Erro no pagamento"
      description="Ocorreu um problema ao processar seu pagamento. Verifique seus dados e tente novamente ou entre em contato conosco."
      buttonText="Tentar novamente"
      buttonHref="/planos"
      showConfetti={false}
    />
  );
}
