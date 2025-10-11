import * as flashTables from "#/lib/db/schema/templates/flash";
import * as primeTables from "#/lib/db/schema/templates/prime";
import * as minimalTables from "#/lib/db/schema/templates/minimal";

export const VALID_TEMPLATES = ["flash", "prime", "minimal"] as const;
export type TemplateType = (typeof VALID_TEMPLATES)[number];

export function isValidTemplate(template: string): template is TemplateType {
  return VALID_TEMPLATES.includes(template as TemplateType);
}

// Helper to get template-specific table schemas
export function getTemplateSchemas(template: TemplateType) {
  switch (template) {
    case "flash":
      return {
        introduction: flashTables.flashTemplateIntroductionTable,
        introductionServices: flashTables.flashTemplateIntroductionServicesTable,
        aboutUs: flashTables.flashTemplateAboutUsTable,
        team: flashTables.flashTemplateTeamTable,
        teamMembers: flashTables.flashTemplateTeamMembersTable,
        expertise: flashTables.flashTemplateExpertiseTable,
        expertiseTopics: flashTables.flashTemplateExpertiseTopicsTable,
        results: flashTables.flashTemplateResultsTable,
        resultsList: flashTables.flashTemplateResultsListTable,
        clients: flashTables.flashTemplateClientsTable,
        clientsList: flashTables.flashTemplateClientsListTable,
        steps: flashTables.flashTemplateStepsTable,
        stepsTopics: flashTables.flashTemplateStepsTopicsTable,
        stepsMarquee: flashTables.flashTemplateStepsMarqueeTable,
        cta: flashTables.flashTemplateCtaTable,
        testimonials: flashTables.flashTemplateTestimonialsTable,
        testimonialsList: flashTables.flashTemplateTestimonialsListTable,
        investment: flashTables.flashTemplateInvestmentTable,
        deliverables: flashTables.flashTemplateDeliverablesTable,
        deliverablesList: flashTables.flashTemplateDeliverablesListTable,
        plans: flashTables.flashTemplatePlansTable,
        plansList: flashTables.flashTemplatePlansListTable,
        plansIncludedItems: flashTables.flashTemplatePlansIncludedItemsTable,
        termsConditions: flashTables.flashTemplateTermsConditionsTable,
        termsConditionsList: flashTables.flashTemplateTermsConditionsListTable,
        faq: flashTables.flashTemplateFaqTable,
        faqList: flashTables.flashTemplateFaqListTable,
        footer: flashTables.flashTemplateFooterTable,
        footerMarquee: flashTables.flashTemplateFooterMarqueeTable,
      };
    case "prime":
      return {
        introduction: primeTables.primeTemplateIntroductionTable,
        introductionMarquee: primeTables.primeTemplateIntroductionMarqueeTable,
        aboutUs: primeTables.primeTemplateAboutUsTable,
        team: primeTables.primeTemplateTeamTable,
        teamMembers: primeTables.primeTemplateTeamMembersTable,
        expertise: primeTables.primeTemplateExpertiseTable,
        expertiseTopics: primeTables.primeTemplateExpertiseTopicsTable,
        results: primeTables.primeTemplateResultsTable,
        resultsList: primeTables.primeTemplateResultsListTable,
        clients: primeTables.primeTemplateClientsTable,
        clientsList: primeTables.primeTemplateClientsListTable,
        cta: primeTables.primeTemplateCtaTable,
        steps: primeTables.primeTemplateStepsTable,
        stepsTopics: primeTables.primeTemplateStepsTopicsTable,
        testimonials: primeTables.primeTemplateTestimonialsTable,
        testimonialsList: primeTables.primeTemplateTestimonialsListTable,
        investment: primeTables.primeTemplateInvestmentTable,
        deliverables: primeTables.primeTemplateDeliverablesTable,
        deliverablesList: primeTables.primeTemplateDeliverablesListTable,
        plans: primeTables.primeTemplatePlansTable,
        plansList: primeTables.primeTemplatePlansListTable,
        plansIncludedItems: primeTables.primeTemplatePlansIncludedItemsTable,
        termsConditions: primeTables.primeTemplateTermsConditionsTable,
        termsConditionsList: primeTables.primeTemplateTermsConditionsListTable,
        faq: primeTables.primeTemplateFaqTable,
        faqList: primeTables.primeTemplateFaqListTable,
        footer: primeTables.primeTemplateFooterTable,
      };
    case "minimal":
      return {
        introduction: minimalTables.minimalTemplateIntroductionTable,
        introductionPhotos: minimalTables.minimalTemplateIntroductionPhotosTable,
        aboutUs: minimalTables.minimalTemplateAboutUsTable,
        aboutUsTeam: minimalTables.minimalTemplateAboutUsTeamTable,
        aboutUsMarquee: minimalTables.minimalTemplateAboutUsMarqueeTable,
        clients: minimalTables.minimalTemplateClientsTable,
        clientsList: minimalTables.minimalTemplateClientsListTable,
        expertise: minimalTables.minimalTemplateExpertiseTable,
        expertiseTopics: minimalTables.minimalTemplateExpertiseTopicsTable,
        plans: minimalTables.minimalTemplatePlansTable,
        plansList: minimalTables.minimalTemplatePlansListTable,
        plansIncludedItems: minimalTables.minimalTemplatePlansIncludedItemsTable,
        termsConditions: minimalTables.minimalTemplateTermsConditionsTable,
        termsConditionsList: minimalTables.minimalTemplateTermsConditionsListTable,
        faq: minimalTables.minimalTemplateFaqTable,
        faqList: minimalTables.minimalTemplateFaqListTable,
        footer: minimalTables.minimalTemplateFooterTable,
        footerMarquee: minimalTables.minimalTemplateFooterMarqueeTable,
      };
  }
}

// Helper to get template display names
export function getTemplateDisplayName(template: TemplateType): string {
  const names: Record<TemplateType, string> = {
    flash: "Flash",
    prime: "Prime",
    minimal: "Minimal",
  };
  return names[template];
}

