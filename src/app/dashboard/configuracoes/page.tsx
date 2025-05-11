"use client";

import { useState, useRef, useEffect } from "react";
import EditSaveBottomBar from "#/components/EditSaveBottomBar";
import Header from "./components/Header";
import PersonalData from "./components/PersonalData";
import CompanyData from "./components/CompanyData";
import ChangePassword from "./components/ChangePassword";
import { useUserAccount } from "#/hooks/useUserAccount";

export default function Configurations() {
  const { isLoading } = useUserAccount();

  const [activeTab, setActiveTab] = useState("Dados pessoais");
  const [isEditing, setIsEditing] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

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
    setActiveTab(tab);
  };

  useEffect(() => {
    if (isEditing) {
      // Check for changes every 200ms when in edit mode
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

        // Force a re-render if the change state is different
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
            <PersonalData ref={personalDataRef} isEditing={isEditing} />
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
            <CompanyData />
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
    </main>
  );
}
