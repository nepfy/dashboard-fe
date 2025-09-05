import { StripeStatusPage } from "#/components/stripe-status-page";

export default function StripeSuccessPage() {
  return (
    <StripeStatusPage
      type="success"
      title="Compra realizada com sucesso!"
      description="Seu plano foi ativado e você já pode começar a aproveitar tudo que a Nepfy oferece."
      buttonText="Finalizar cadastro"
      buttonHref="/dashboard"
      showConfetti={true}
    />
  );
}
