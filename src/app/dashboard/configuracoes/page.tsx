"use client";

import { useState, useRef, useEffect } from "react";
import EditSaveBottomBar from "#/components/EditSaveBottomBar";
import Header from "./_components/_Header";
import PersonalData from "./_components/_PersonalData";
import CompanyData from "./_components/_CompanyData";
import ChangePassword from "./_components/_ChangePassword";
import { useUserAccount } from "#/hooks/useUserAccount";
// import { Subscription } from "#/modules/subscription";

export default function Configurations() {
  const { isLoading } = useUserAccount();

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

  const tabs = ["Dados pessoais", "Dados empresariais", "Segurança"];

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
      {/* {activeTab === "Assinatura" && (
        <div className="p-7">
          <Subscription />
        </div>
      )} */}
    </main>
  );
}
