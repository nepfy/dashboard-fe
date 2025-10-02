"use client";

import { useState } from "react";
import { TextAreaField, CheckboxInput } from "#/components/Inputs";
import { Box } from "#/modules/ai-generator/components/box/Box";
import { CompanyInfoModal } from "#/modules/ai-generator/components/modal/CompanyInfoModal";

export function CompanyInfo({
  handleNext,
  handleBack,
  setCompanyInfo,
  companyInfo,
}: {
  handleNext: () => void;
  handleBack: () => void;
  setCompanyInfo: (info: string) => void;
  companyInfo: string;
}) {
  const [aboutCompany, setAboutCompany] = useState(companyInfo);
  const [saveDescriptionAsModel, setSaveDescriptionAsModel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(saveDescriptionAsModel);

  return (
    <section className="flex flex-col min-h-[calc(100vh-140px)] bg-white-neutral-light-200 justify-center items-start gap-10 font-satoshi">
      <Box
        title="Sobre você ou sua empresa"
        description="Desde a área de atuação até o que te diferencia no mercado."
        handleBack={handleBack}
        handleNext={() => {
          setCompanyInfo(aboutCompany);

          handleNext();
        }}
        disabled={!aboutCompany}
        info
        onInfoClick={() => setIsModalOpen(true)}
      >
        <div className="space-y-6 py-4">
          <TextAreaField
            id="description"
            textareaName="description"
            placeholder="Quanto mais detalhes você der, mais personalizada fica a proposta!"
            rows={9}
            value={aboutCompany}
            onChange={(e) => setAboutCompany(e.target.value)}
          />
        </div>

        <div className="space-y-9 mx-3">
          <CheckboxInput
            id="saveDescriptionAsModel"
            inputName="saveDescriptionAsModel"
            label="Salvar descrição como modelo para próximas propostas"
            onChange={(e) => setSaveDescriptionAsModel(e.target.checked)}
            textBlack
          />
        </div>
      </Box>

      <CompanyInfoModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </section>
  );
}
