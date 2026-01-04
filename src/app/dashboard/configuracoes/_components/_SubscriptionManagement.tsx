"use client";

import { useEffect, useState } from "react";
import { useStripeCustom } from "#/hooks/use-stripe";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface BillingInfo {
  hasActiveSubscription: boolean;
  currentPlan: {
    id: string;
    status: string;
    subscriptionType?: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
  } | null;
  paymentMethod: {
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  nextBillingDate: Date | null;
  invoices: Array<{
    id: string;
    number: string;
    status: string;
    amountPaid: number;
    amountDue: number;
    currency: string;
    created: Date;
    paidAt: Date | null;
    pdfUrl: string | null;
    hostedInvoiceUrl: string | null;
  }>;
}

interface StripeMetadata {
  subscriptionId?: string;
  subscriptionType?: string;
  subscriptionActive?: boolean;
  subscriptionDate?: string;
  customerId?: string;
  status?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string | null;
  trialStart?: string | null;
  trialEnd?: string | null;
}

export default function SubscriptionManagement() {
  const { subscriptionActive } = useStripeCustom();
  const { user } = useUser();
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  // Parse stripe metadata from Clerk
  const getStripeMetadata = (): StripeMetadata | null => {
    if (!user?.unsafeMetadata) return null;

    const metadata = user.unsafeMetadata as {
      stripe?: StripeMetadata | string;
    };
    const stripeData = metadata?.stripe;

    if (!stripeData) return null;

    if (typeof stripeData === "object" && stripeData !== null) {
      return stripeData as StripeMetadata;
    }

    if (typeof stripeData === "string") {
      try {
        return JSON.parse(stripeData) as StripeMetadata;
      } catch (error) {
        console.error("Error parsing stripe metadata:", error);
        return null;
      }
    }

    return null;
  };

  const stripeMetadata = getStripeMetadata();

  useEffect(() => {
    async function fetchBillingInfo() {
      setLoading(true);
      try {
        const res = await fetch("/api/stripe/billing-info");
        const data = await res.json();
        if (data.success) {
          setBillingInfo(data.data);
        }
      } catch (e) {
        console.error("Failed to fetch billing info:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchBillingInfo();
  }, []);

  const handleCancelSubscription = async () => {
    if (!stripeMetadata?.subscriptionId) return;

    if (
      !confirm(
        "Tem certeza que deseja cancelar sua assinatura? Ela permanecerá ativa até o final do período atual."
      )
    ) {
      return;
    }

    setCanceling(true);
    try {
      const response = await fetch("/api/sync/clerk-stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "cancel-subscription",
          subscriptionId: stripeMetadata.subscriptionId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh billing info
        const res = await fetch("/api/stripe/billing-info");
        const billingData = await res.json();
        if (billingData.success) {
          setBillingInfo(billingData.data);
        }
        // Reload user to get updated metadata
        window.location.reload();
      } else {
        alert("Erro ao cancelar assinatura. Tente novamente.");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("Erro ao cancelar assinatura. Tente novamente.");
    } finally {
      setCanceling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!stripeMetadata?.subscriptionId) return;

    setReactivating(true);
    try {
      const response = await fetch("/api/sync/clerk-stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reactivate-subscription",
          reactivateSubscriptionId: stripeMetadata.subscriptionId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh billing info
        const res = await fetch("/api/stripe/billing-info");
        const billingData = await res.json();
        if (billingData.success) {
          setBillingInfo(billingData.data);
        }
        // Reload user to get updated metadata
        window.location.reload();
      } else {
        alert("Erro ao reativar assinatura. Tente novamente.");
      }
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      alert("Erro ao reativar assinatura. Tente novamente.");
    } finally {
      setReactivating(false);
    }
  };

  const handleOpenPortal = async () => {
    setOpeningPortal(true);
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success && data.url) {
        window.open(data.url, "_blank");
      } else {
        alert("Erro ao abrir portal de pagamento. Tente novamente.");
      }
    } catch (error) {
      console.error("Error opening portal:", error);
      alert("Erro ao abrir portal de pagamento. Tente novamente.");
    } finally {
      setOpeningPortal(false);
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    // Check if the date is valid
    if (isNaN(d.getTime())) return "N/A";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  const formatCurrency = (amount: number, currency: string = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getCardBrandName = (brand: string) => {
    const brands: Record<string, string> = {
      visa: "Visa",
      mastercard: "Mastercard",
      amex: "American Express",
      discover: "Discover",
      jcb: "JCB",
      diners: "Diners Club",
      unionpay: "UnionPay",
    };
    return brands[brand.toLowerCase()] || brand;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; color: string; icon: React.ReactNode }
    > = {
      active: {
        label: "Ativa",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle2 className="h-4 w-4" />,
      },
      canceled: {
        label: "Cancelada",
        color: "bg-red-100 text-red-800",
        icon: <X className="h-4 w-4" />,
      },
      past_due: {
        label: "Vencida",
        color: "bg-yellow-100 text-yellow-800",
        icon: <AlertCircle className="h-4 w-4" />,
      },
      trialing: {
        label: "Em teste",
        color: "bg-blue-100 text-blue-800",
        icon: <AlertCircle className="h-4 w-4" />,
      },
    };

    const config = statusConfig[status.toLowerCase()] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
      icon: <AlertCircle className="h-4 w-4" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!subscriptionActive || !billingInfo?.hasActiveSubscription) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Plano Gratuito
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Você está usando o plano gratuito. Faça upgrade para acessar
            recursos premium.
          </p>
          <Link
            href="/planos"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Ver Planos
          </Link>
        </div>
      </div>
    );
  }

  const currentPlan = billingInfo.currentPlan;
  const willCancelAtPeriodEnd =
    currentPlan?.cancelAtPeriodEnd || stripeMetadata?.cancelAtPeriodEnd;

  return (
    <div className="space-y-6">
      {/* Current Subscription Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Assinatura Atual
              </h3>
              {currentPlan && getStatusBadge(currentPlan.status)}
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-900">Plano:</span>
                <span className="capitalize">
                  {currentPlan?.subscriptionType === "yearly" ||
                  stripeMetadata?.subscriptionType === "yearly"
                    ? "Anual"
                    : "Mensal"}
                </span>
              </div>

              {currentPlan && (
                <>
                  {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      Período atual:
                    </span>
                    <span>
                      {formatDate(
                        new Date(currentPlan.currentPeriodStart * 1000)
                      )}{" "}
                      -{" "}
                      {formatDate(
                        new Date(currentPlan.currentPeriodEnd * 1000)
                      )}
                    </span>
                  </div> */}

                  {billingInfo.nextBillingDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        Próxima cobrança:
                      </span>
                      <span>{formatDate(billingInfo.nextBillingDate)}</span>
                    </div>
                  )}
                </>
              )}

              {willCancelAtPeriodEnd && (
                <div className="mt-3 rounded-lg bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    <AlertCircle className="mr-1.5 inline h-4 w-4" />
                    Sua assinatura será cancelada ao final do período atual.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          {!willCancelAtPeriodEnd ? (
            <button
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              {canceling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Cancelar Assinatura
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleReactivateSubscription}
              disabled={reactivating}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-50"
            >
              {reactivating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reativando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Reativar Assinatura
                </>
              )}
            </button>
          )}

          <Link
            href="/planos?change=true"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50"
          >
            Alterar Plano
          </Link>

          <button
            onClick={handleOpenPortal}
            disabled={openingPortal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {openingPortal ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Abrindo...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Gerenciar Assinatura
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment Method Card */}
      {billingInfo.paymentMethod && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Método de Pagamento
          </h3>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
              <CreditCard className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {getCardBrandName(billingInfo.paymentMethod.brand)} ••••{" "}
                {billingInfo.paymentMethod.last4}
              </p>
              <p className="text-xs text-gray-500">
                Expira em{" "}
                {String(billingInfo.paymentMethod.expMonth).padStart(2, "0")}/
                {billingInfo.paymentMethod.expYear}
              </p>
            </div>
            <button
              onClick={handleOpenPortal}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Alterar
            </button>
          </div>
        </div>
      )}

      {/* Invoices Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Faturas</h3>
          <button
            onClick={handleOpenPortal}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Ver todas
          </button>
        </div>

        {billingInfo.invoices.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            Nenhuma fatura encontrada.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {billingInfo.invoices.slice(0, 5).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.number || `Fatura #${invoice.id.slice(-8)}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(invoice.created)} •{" "}
                      {getStatusBadge(invoice.status)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(invoice.amountPaid, invoice.currency)}
                    </p>
                    {invoice.status === "paid" && invoice.paidAt && (
                      <p className="text-xs text-gray-500">
                        Pago em {formatDate(invoice.paidAt)}
                      </p>
                    )}
                  </div>
                  {invoice.pdfUrl && (
                    <a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      PDF
                    </a>
                  )}
                  {invoice.hostedInvoiceUrl && (
                    <a
                      href={invoice.hostedInvoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Ver
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
