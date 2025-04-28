"use client";

import { useState } from "react";
import Header from "./components/Header";
import PersonalData from "./components/PersonalData";

export default function Configurations() {
  const [activeTab, setActiveTab] = useState("Dados pessoais");

  const tabs = [
    "Dados pessoais",
    "Segurança",
    "Pagamento",
    "Notificações",
    "Integrações",
  ];

  return (
    <main className="relative w-full">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {activeTab === "Dados pessoais" && (
        <div className="p-7">
          <PersonalData />
        </div>
      )}
      {activeTab === "Segurança" && <div className="p-7"> Segurança </div>}
      {activeTab === "Pagamento" && <div className="p-7"> Pagamento </div>}
      {activeTab === "Notificações" && (
        <div className="p-7"> Notificações </div>
      )}
      {activeTab === "Integrações" && <div className="p-7"> Integrações </div>}
    </main>
  );
}
