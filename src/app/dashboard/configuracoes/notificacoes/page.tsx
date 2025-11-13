"use client";

import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import DashboardPageHeader from "#/components/DashboardPageHeader";

interface NotificationPreferences {
  id: string;
  userId: string;
  emailEnabled: boolean;
  emailProposalViewed: boolean;
  emailProposalAccepted: boolean;
  emailProposalFeedback: boolean;
  emailProposalExpiring: boolean;
  emailPaymentReceived: boolean;
  inAppEnabled: boolean;
  inAppProposalViewed: boolean;
  inAppProposalAccepted: boolean;
  inAppProposalFeedback: boolean;
  inAppProposalExpiring: boolean;
  inAppPaymentReceived: boolean;
}

export default function NotificationSettings() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications/preferences");
      const data = await response.json();

      if (data.success) {
        setPreferences(data.preferences);
      } else {
        setError(data.error || "Erro ao carregar preferências");
      }
    } catch (err) {
      setError("Erro ao carregar preferências");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!preferences) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Preferências salvas com sucesso!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.error || "Erro ao salvar preferências");
      }
    } catch (err) {
      setError("Erro ao salvar preferências");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="text-primary-light-400 animate-spin" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Erro ao carregar preferências</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <DashboardPageHeader title="Configurações de Notificações">
        <button
          onClick={savePreferences}
          disabled={saving}
          className="bg-primary-light-400 hover:bg-primary-light-500 disabled:bg-gray-300 rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed"
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </DashboardPageHeader>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Email Notifications Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Notificações por Email
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Receba atualizações importantes por email
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={preferences.emailEnabled}
                onChange={(e) =>
                  updatePreference("emailEnabled", e.target.checked)
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            </label>
          </div>

          <div className="space-y-4">
            <NotificationPreferenceItem
              label="Proposta visualizada"
              description="Quando um cliente visualiza sua proposta"
              checked={preferences.emailProposalViewed}
              disabled={!preferences.emailEnabled}
              onChange={(checked) =>
                updatePreference("emailProposalViewed", checked)
              }
            />
            <NotificationPreferenceItem
              label="Proposta aceita"
              description="Quando um cliente aceita sua proposta"
              checked={preferences.emailProposalAccepted}
              disabled={!preferences.emailEnabled}
              onChange={(checked) =>
                updatePreference("emailProposalAccepted", checked)
              }
            />
            <NotificationPreferenceItem
              label="Feedback recebido"
              description="Quando um cliente deixa um feedback"
              checked={preferences.emailProposalFeedback}
              disabled={!preferences.emailEnabled}
              onChange={(checked) =>
                updatePreference("emailProposalFeedback", checked)
              }
            />
            <NotificationPreferenceItem
              label="Proposta expirando"
              description="Quando uma proposta está prestes a expirar"
              checked={preferences.emailProposalExpiring}
              disabled={!preferences.emailEnabled}
              onChange={(checked) =>
                updatePreference("emailProposalExpiring", checked)
              }
            />
            <NotificationPreferenceItem
              label="Pagamento recebido"
              description="Quando você recebe um pagamento"
              checked={preferences.emailPaymentReceived}
              disabled={!preferences.emailEnabled}
              onChange={(checked) =>
                updatePreference("emailPaymentReceived", checked)
              }
            />
          </div>
        </div>

        {/* In-App Notifications Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Notificações na Plataforma
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Receba notificações no painel da plataforma
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={preferences.inAppEnabled}
                onChange={(e) =>
                  updatePreference("inAppEnabled", e.target.checked)
                }
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            </label>
          </div>

          <div className="space-y-4">
            <NotificationPreferenceItem
              label="Proposta visualizada"
              description="Quando um cliente visualiza sua proposta"
              checked={preferences.inAppProposalViewed}
              disabled={!preferences.inAppEnabled}
              onChange={(checked) =>
                updatePreference("inAppProposalViewed", checked)
              }
            />
            <NotificationPreferenceItem
              label="Proposta aceita"
              description="Quando um cliente aceita sua proposta"
              checked={preferences.inAppProposalAccepted}
              disabled={!preferences.inAppEnabled}
              onChange={(checked) =>
                updatePreference("inAppProposalAccepted", checked)
              }
            />
            <NotificationPreferenceItem
              label="Feedback recebido"
              description="Quando um cliente deixa um feedback"
              checked={preferences.inAppProposalFeedback}
              disabled={!preferences.inAppEnabled}
              onChange={(checked) =>
                updatePreference("inAppProposalFeedback", checked)
              }
            />
            <NotificationPreferenceItem
              label="Proposta expirando"
              description="Quando uma proposta está prestes a expirar"
              checked={preferences.inAppProposalExpiring}
              disabled={!preferences.inAppEnabled}
              onChange={(checked) =>
                updatePreference("inAppProposalExpiring", checked)
              }
            />
            <NotificationPreferenceItem
              label="Pagamento recebido"
              description="Quando você recebe um pagamento"
              checked={preferences.inAppPaymentReceived}
              disabled={!preferences.inAppEnabled}
              onChange={(checked) =>
                updatePreference("inAppPaymentReceived", checked)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationPreferenceItemProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function NotificationPreferenceItem({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: NotificationPreferenceItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            disabled ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {label}
        </p>
        <p
          className={`text-sm ${
            disabled ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {description}
        </p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
      </label>
    </div>
  );
}

