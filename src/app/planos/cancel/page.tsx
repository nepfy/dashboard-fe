import { StripeStatusPage } from "#/components/stripe-status-page";

export default function StripeCancelPage() {
  return (
    <StripeStatusPage
      type="cancel"
      title="Pagamento cancelado"
      description="Sua compra foi cancelada. Você pode tentar novamente quando quiser ou escolher um plano diferente."
      buttonText="Voltar aos planos"
      buttonHref="/planos"
      showConfetti={false}
    />
  );
}
