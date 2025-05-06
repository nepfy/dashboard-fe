"use client";

import { useState } from "react";
import EditSaveBottomBar from "#/components/EditSaveBottomBar";
import Header from "./components/Header";
import PersonalData from "./components/PersonalData";
import CompanyData from "./components/CompanyData";
import ChangePassword from "./components/ChangePassword";

export default function Configurations() {
  const [activeTab, setActiveTab] = useState("Dados pessoais");

  const tabs = ["Dados pessoais", "Dados empresariais", "Segurança"];

  return (
    <main className="relative w-full">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {activeTab === "Dados pessoais" && (
        <>
          <div className="p-7">
            <PersonalData />
          </div>
          <EditSaveBottomBar />
        </>
      )}
      {activeTab === "Dados empresariais" && (
        <>
          <div className="p-7">
            <CompanyData />
          </div>
          <EditSaveBottomBar />
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
