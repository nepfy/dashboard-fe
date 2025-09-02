import React, { useState } from "react";

interface FAQStepProps {
  handleNext: ({
    includeTerms,
    includeFAQ,
  }: {
    includeTerms: boolean;
    includeFAQ: boolean;
  }) => void;
  handleBack: () => void;
}

export const FAQStep: React.FC<FAQStepProps> = ({ handleNext, handleBack }) => {
  const [includeTerms, setIncludeTerms] = useState(false);
  const [includeFAQ, setIncludeFAQ] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "2rem",
        maxWidth: 600,
        margin: "0 auto",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      }}
    >
      <h2
        style={{
          color: "#6C3EF5",
          fontWeight: 600,
          fontSize: 24,
          marginBottom: 8,
        }}
      >
        Termos e Dúvidas
      </h2>
      <p style={{ color: "#444", marginBottom: 28 }}>
        Tire dúvidas e informe o essencial. Geramos com IA, mas você pode editar
        depois.
      </p>
      <div style={{ marginBottom: 18 }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={includeTerms}
            onChange={() => setIncludeTerms((v) => !v)}
            style={{ marginRight: 8 }}
          />
          Adicionar Termos e Condições
        </label>
        <label
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <input
            type="checkbox"
            checked={includeFAQ}
            onChange={() => setIncludeFAQ((v) => !v)}
            style={{ marginRight: 8 }}
          />
          Adicionar Perguntas Frequentes
        </label>
      </div>
      <hr style={{ margin: "24px 0" }} />
      <div style={{ display: "flex", justifyContent: "flex-start", gap: 12 }}>
        <button
          type="button"
          onClick={handleBack}
          style={{
            background: "#fff",
            color: "#444",
            border: "1px solid #E0E0E0",
            borderRadius: 8,
            padding: "8px 20px",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{ fontSize: 18, lineHeight: 1, display: "inline-block" }}
          >
            ←
          </span>
          Voltar
        </button>
        <button
          type="button"
          onClick={() => handleNext({ includeTerms, includeFAQ })}
          style={{
            background: "#6C3EF5",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 28px",
            fontWeight: 500,
            cursor: "pointer",
            marginLeft: 8,
          }}
        >
          Avançar
        </button>
      </div>
    </div>
  );
};
