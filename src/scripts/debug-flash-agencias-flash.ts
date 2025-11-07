#!/usr/bin/env tsx

import "dotenv/config";

import type { FlashThemeData } from "#/modules/ai-generator/themes/flash";
import { FlashTemplateWorkflow } from "#/modules/ai-generator/themes/flash";

const testData: FlashThemeData = {
  selectedService: "agencias-consultoria",
  companyInfo: `Com mais de 10 anos de experiência no mercado, somos uma agência de marketing digital focada em gerar resultados reais. Atuamos com estratégia, criatividade e dados para impulsionar marcas, escalar negócios e construir presença digital sólida.
Ao longo da nossa trajetória, acumulamos diversos cases de sucesso em diferentes setores, sempre com o mesmo propósito: conectar marcas e pessoas de forma autêntica e eficiente.`,
  clientName: "Augusto Ferragens",
  projectName: "Site Institucional",
  projectDescription:
    "Desenvolvimento de um site institucional moderno, funcional e responsivo para apresentar a empresa, seus produtos e diferenciais. O objetivo é fortalecer a presença digital da marca, transmitir credibilidade e facilitar o contato e o relacionamento com novos clientes e parceiros comerciais.",
  clientDescription: undefined,
  selectedPlans: 2,
  planDetails: "",
  includeTerms: true,
  includeFAQ: true,
  templateType: "flash",
  mainColor: "#4F21A1",
  userName: "Caio ",
  userEmail: "alcantaracaiolucas@gmail.com",
};

async function main() {
  try {
    if (!process.env.TOGETHER_API_KEY) {
      throw new Error("Missing TOGETHER_API_KEY in environment variables.");
    }

    const workflow = new FlashTemplateWorkflow();
    const result = await workflow.execute(testData);

    if (!result.success || !result.proposal) {
      console.error("❌ Flash workflow failed:", result.error);
      process.exit(1);
    }

    const { introduction, aboutUs, team, terms } = result.proposal;

    console.log("✅ Flash workflow completed successfully.");

    if (team) {
      console.log("Team title:", team.title);
      console.log("Team title length:", team.title.length);
    } else {
      console.warn("⚠️ Team section not present in proposal output.");
    }

    if (introduction) {
      console.log("Introduction title length:", introduction.title.length);
      console.log("Introduction subtitle length:", introduction.subtitle.length);
      console.log(
        "Introduction services lengths:",
        introduction.services.map((service) => service.length)
      );
    }

    if (aboutUs) {
      console.log("AboutUs title length:", aboutUs.title.length);
      console.log("AboutUs supportText length:", aboutUs.supportText.length);
      console.log("AboutUs subtitle length:", aboutUs.subtitle.length);
    }

    if (terms) {
      console.log("Terms title length:", terms.title.length);
      console.log("Terms description length:", terms.description.length);
    }
  } catch (error) {
    console.error("❌ Error running Flash workflow script:", error);
    process.exit(1);
  }
}

void main();

