"use client";

import { useState, useRef } from "react";
import EditSaveBottomBar from "#/components/EditSaveBottomBar";
import Header from "./components/Header";
import PersonalData from "./components/PersonalData";
import CompanyData from "./components/CompanyData";
import ChangePassword from "./components/ChangePassword";
import { useUserAccount } from "#/hooks/useUserAccount";

export default function Configurations() {
  const [activeTab, setActiveTab] = useState("Dados pessoais");
  const [isEditing, setIsEditing] = useState(false);
  const { isLoading } = useUserAccount();

  const personalDataRef = useRef<{
    handleSubmit: () => Promise<void>;
    handleCancel: () => void;
  }>(null);

  const companyDataRef = useRef<{
    handleSubmit: () => Promise<void>;
    handleCancel: () => void;
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
      // If we get here, it means the submit was successful
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
      // Keep edit mode active if there was an error
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

  // When changing tabs, exit edit mode
  const handleTabChange = (tab: string) => {
    if (isEditing) {
      handleCancel();
    }
    setActiveTab(tab);
  };

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
