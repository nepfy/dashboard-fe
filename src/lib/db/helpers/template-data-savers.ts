/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "#/lib/db";
import { getTemplateSchemas } from "./template-tables";
import type { TemplateType } from "./template-tables";

/**
 * Generic save function for template sections
 * Uses the Drizzle schema to automatically handle insert/update
 */
async function saveSection<T extends Record<string, unknown>>(
  table: any,
  data: T,
  conflictTarget: any
) {
  if (!data) return null;

  const result = await db
    .insert(table)
    .values(data)
    .onConflictDoUpdate({
      target: conflictTarget,
      set: {
        ...data,
        updated_at: new Date(),
      },
    })
    .returning();

  return (result as any)[0];
}

/**
 * Configuration mapping for each template
 * Maps data keys to table schemas
 */
type TemplateSaveConfig = {
  [key: string]: {
    table: any;
    conflictTarget: any;
    process?: (data: any, projectId: string) => any;
  };
};

function getMinimalSaveConfig(
  schemas: ReturnType<typeof getTemplateSchemas>
): TemplateSaveConfig {
  return {
    introduction: {
      table: schemas.introduction,
      conflictTarget: schemas.introduction.projectId,
      process: (data: any, projectId: string) => ({
        projectId,
        companyName: data.companyName,
        hideCompanyName: data.hideCompanyName || false,
        companyLogo: data.companyLogo,
        hideCompanyLogo: data.hideCompanyLogo || false,
        buttonTitle: data.buttonTitle,
        clientName: data.clientName,
        clientPhoto: data.clientPhoto,
        hideClientPhoto: data.hideClientPhoto || false,
        title: data.title,
        validity: new Date(data.validity),
      }),
    },
    aboutUs: {
      table: schemas.aboutUs,
      conflictTarget: schemas.aboutUs.projectId,
      process: (data: any, projectId: string) => ({
        projectId,
        hideSection: data.hideSection || false,
        validity: new Date(data.validity),
        title: data.title,
        subtitle: data.subtitle,
        hideSubtitle: data.hideSubtitle || false,
        mainDescription: data.mainDescription,
        hideMainDescription: data.hideMainDescription || false,
        additionalDescription1: data.additionalDescription1,
        hideAdditionalDescription1: data.hideAdditionalDescription1 || false,
        additionalDescription2: data.additionalDescription2,
        hideAdditionalDescription2: data.hideAdditionalDescription2 || false,
      }),
    },
    clients: {
      table: schemas.clients,
      conflictTarget: schemas.clients.projectId,
      process: (data: any, projectId: string) => ({
        projectId,
        hideSection: data.hideSection || false,
      }),
    },
    expertise: {
      table: schemas.expertise,
      conflictTarget: schemas.expertise.projectId,
      process: (data: any, projectId: string) => ({
        projectId,
        hideSection: data.hideSection || false,
        tagline: data.tagline,
        hideTagline: data.hideTagline || false,
        title: data.title,
        hideTitle: data.hideTitle || false,
      }),
    },
    plans: {
      table: schemas.plans,
      conflictTarget: schemas.plans.projectId,
      process: (data: any, projectId: string) => ({
        projectId,
        hideSection: data.hideSection || false,
        title: data.title,
        hideTitle: data.hideTitle || false,
        subtitle: data.subtitle || "",
      }),
    },
    termsConditions: {
      table: schemas.termsConditions,
      conflictTarget: schemas.termsConditions.projectId,
      process: (data: any, projectId: string) => ({
        projectId,
        hideSection: data.hideSection || false,
        title: data.title || "Termos e Condições",
      }),
    },
    faq: {
      table: schemas.faq,
      conflictTarget: schemas.faq.projectId,
      process: (data: any, projectId: string) => ({
        projectId,
        hideSection: data.hideSection || false,
      }),
    },
    footer: {
      table: schemas.footer,
      conflictTarget: schemas.footer.projectId,
      process: (data: any, projectId: string) => ({
        projectId,
        callToAction: data.callToAction || "Entre em contato conosco",
        validity: new Date(data.validity || new Date()),
        email: data.email || "contato@empresa.com",
        whatsapp: data.whatsapp || "+55 11 99999-9999",
      }),
    },
  };
}

/**
 * Save draft data for a template
 * Iterates through template data and saves each section using configuration
 */
export async function saveTemplateDraft(
  template: TemplateType,
  projectId: string,
  templateData: any
) {
  const schemas = getTemplateSchemas(template);

  // Get the save configuration for this template
  let config: TemplateSaveConfig;

  switch (template) {
    case "minimal":
      config = getMinimalSaveConfig(schemas);
      break;
    case "flash":
      // TODO: Implement flash save config
      throw new Error("Flash draft save not implemented yet");
    case "prime":
      // TODO: Implement prime save config
      throw new Error("Prime draft save not implemented yet");
    default:
      throw new Error(`Template não suportado: ${template}`);
  }

  // Save each section using the configuration
  const results: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(templateData)) {
    const sectionConfig = config[key];

    if (!sectionConfig || !value) continue;

    try {
      // Process the data if needed
      const processedData = sectionConfig.process
        ? sectionConfig.process(value, projectId)
        : { projectId, ...value };

      // Save the section
      results[key] = await saveSection(
        sectionConfig.table,
        processedData,
        sectionConfig.conflictTarget
      );
    } catch (error) {
      console.error(`Error saving ${key} section:`, error);
      throw error;
    }
  }

  return results;
}

/**
 * Save finish data for a template
 * Similar to draft but marks as finalized
 */
export async function saveTemplateFinish(
  template: TemplateType,
  projectId: string,
  templateData: any
) {
  // Same as draft for now - the difference is in the project status
  return saveTemplateDraft(template, projectId, templateData);
}
