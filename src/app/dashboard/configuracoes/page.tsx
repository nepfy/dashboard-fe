"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import EditSaveBottomBar from "#/components/EditSaveBottomBar";
import Header from "./_components/_Header";
import PersonalData from "./_components/_PersonalData";
import CompanyData from "./_components/_CompanyData";
import ChangePassword from "./_components/_ChangePassword";
import { useUserAccount } from "#/hooks/useUserAccount";
import { useFeatureFlag } from "#/hooks/useFeatureFlag";
import { useStripeCustom } from "#/hooks/use-stripe";
import dynamic from "next/dynamic";

const NotificationSettings = dynamic(
  () => import("./notificacoes/page"),
  { ssr: false }
);
// import { Subscription } from "#/modules/subscription";

export default function Configurations() {
  const { isLoading } = useUserAccount();
  const { isEnabled: notificationsEnabled } = useFeatureFlag("notifications_system");
  const { subscriptionActive } = useStripeCustom();

  const [activeTab, setActiveTab] = useState("Dados pessoais");
  const [isEditing, setIsEditing] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const personalDataRef = useRef<{
    handleSubmit: () => Promise<void>;
    handleCancel: () => void;
    hasChanges: boolean;
  }>(null);

  const companyDataRef = useRef<{
    handleSubmit: () => Promise<void>;
    handleCancel: () => void;
    hasChanges: boolean;
  }>(null);

  const baseTabs = ["Dados pessoais", "Dados empresariais", "Segurança"];
  const tabs = notificationsEnabled
    ? [...baseTabs, "Notificações"]
    : baseTabs;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (activeTab === "Dados pessoais" && personalDataRef.current) {
        await personalDataRef.current.handleSubmit();
      } else if (activeTab === "Dados empresariais" && companyDataRef.current) {
        await companyDataRef.current.handleSubmit();
      }
      setSuccessMessage(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleCancel = () => {
    if (activeTab === "Dados pessoais" && personalDataRef.current) {
      personalDataRef.current.handleCancel();
    } else if (activeTab === "Dados empresariais" && companyDataRef.current) {
      companyDataRef.current.handleCancel();
    }
    setIsEditing(false);
  };

  const handleTabChange = (tab: string) => {
    if (isEditing) {
      handleCancel();
    }
    setSuccessMessage(false);
    setActiveTab(tab);
  };

  useEffect(() => {
    if (isEditing) {
      const interval = setInterval(() => {
        let currentHasChanges = false;

        if (activeTab === "Dados pessoais" && personalDataRef.current) {
          currentHasChanges = personalDataRef.current.hasChanges;
        } else if (
          activeTab === "Dados empresariais" &&
          companyDataRef.current
        ) {
          currentHasChanges = companyDataRef.current.hasChanges;
        }

        setFormChanged(currentHasChanges);
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isEditing, activeTab]);

  return (
    <main className="relative w-full">
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        tabs={tabs}
      />

  <section className="px-4 pb-6 sm:px-7">
    <div className="mx-auto flex max-w-5xl flex-col gap-5 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-indigo-600">
          Assinatura
        </p>
        <p className="text-lg font-semibold text-gray-900">
          {subscriptionActive ? "Assinatura ativa" : "Plano gratuito"}
        </p>
        <p className="text-sm text-gray-500">
          {subscriptionActive
            ? "Seu plano está atualizado. Veja os próximos recursos e faça upgrade quando quiser."
            : "Faça upgrade para acessar recursos premium e suporte prioritário."}
        </p>
      </div>
      <Link
        href="/planos"
        className="inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:w-auto"
      >
        Ver planos e atualizar
      </Link>
    </div>
  </section>

      {activeTab === "Dados pessoais" && (
        <>
          <div className="p-7">
            <PersonalData
              successMessage={successMessage}
              ref={personalDataRef}
              isEditing={isEditing}
            />
          </div>
          <EditSaveBottomBar
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isLoading}
            hasChanges={activeTab === "Dados pessoais" ? formChanged : false}
          />
        </>
      )}
      {activeTab === "Dados empresariais" && (
        <>
          <div className="p-7">
            <CompanyData
              successMessage={successMessage}
              ref={companyDataRef}
              isEditing={isEditing}
            />
          </div>
          <EditSaveBottomBar
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isLoading}
            hasChanges={
              activeTab === "Dados empresariais" ? formChanged : false
            }
          />
        </>
      )}
      {activeTab === "Segurança" && (
        <div className="p-7">
          <ChangePassword />
        </div>
      )}
      {activeTab === "Notificações" && <NotificationSettings />}
      {/* {activeTab === "Assinatura" && (
        <div className="p-7">
          <Subscription />
        </div>
      )} */}
    </main>
  );
}
