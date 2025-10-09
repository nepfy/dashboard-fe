import { db } from "#/lib/db";
import {
  flashTemplateIntroductionTable,
  flashTemplateIntroductionServicesTable,
  flashTemplateAboutUsTable,
  flashTemplateTeamTable,
  flashTemplateExpertiseTable,
  flashTemplateExpertiseTopicsTable,
  flashTemplateClientsTable,
  flashTemplateStepsTable,
  flashTemplateStepsTopicsTable,
  flashTemplateTestimonialsTable,
  flashTemplateInvestmentTable,
  flashTemplateDeliverablesTable,
  flashTemplateDeliverablesListTable,
  flashTemplatePlansTable,
  flashTemplatePlansListTable,
  flashTemplatePlansIncludedItemsTable,
  flashTemplateTermsConditionsTable,
  flashTemplateTermsConditionsListTable,
  flashTemplateFaqTable,
  flashTemplateFaqListTable,
  flashTemplateFooterTable,
} from "#/lib/db/schema/templates/flash";
import {
  primeTemplateIntroductionTable,
  primeTemplateIntroductionMarqueeTable,
  primeTemplateAboutUsTable,
  primeTemplateTeamTable,
  primeTemplateExpertiseTable,
  primeTemplateExpertiseTopicsTable,
  primeTemplateResultsTable,
  primeTemplateClientsTable,
  primeTemplateCtaTable,
  primeTemplateStepsTable,
  primeTemplateStepsTopicsTable,
  primeTemplateTestimonialsTable,
  primeTemplateInvestmentTable,
  primeTemplateDeliverablesTable,
  primeTemplateDeliverablesListTable,
  primeTemplatePlansTable,
  primeTemplatePlansListTable,
  primeTemplatePlansIncludedItemsTable,
  primeTemplateTermsConditionsTable,
  primeTemplateTermsConditionsListTable,
  primeTemplateFaqTable,
  primeTemplateFaqListTable,
  primeTemplateFooterTable,
} from "#/lib/db/schema/templates/prime";
import { FlashWorkflowResult } from "#/modules/ai-generator/themes/flash";
import { PrimeWorkflowResult } from "#/modules/ai-generator/themes/prime";

export async function saveFlashTemplateData(
  projectId: string,
  aiResult: FlashWorkflowResult,
  requestData: {
    validUntil?: string;
    originalPageUrl?: string;
    pagePassword?: string;
  }
) {
  if (!aiResult.success || !aiResult.proposal) {
    throw new Error("Flash AI result is not successful");
  }

  const proposal = aiResult.proposal;

  // Save Introduction
  const [introduction] = await db
    .insert(flashTemplateIntroductionTable)
    .values({
      projectId,
      name: "Flash Template", // You might want to pass this from requestData
      email: requestData.originalPageUrl || "", // Use appropriate field
      buttonTitle: proposal.introduction.buttonText,
      title: proposal.introduction.title,
      validity: requestData.validUntil
        ? new Date(requestData.validUntil)
        : new Date(),
      subtitle: proposal.introduction.subtitle,
      hideSubtitle: false,
    })
    .returning();

  // Save Introduction Services
  if (
    proposal.introduction.services &&
    Array.isArray(proposal.introduction.services)
  ) {
    const servicesData = proposal.introduction.services.map(
      (service, index) => ({
        introductionId: introduction.id,
        serviceName: service,
        hideService: false,
        sortOrder: index,
      })
    );

    if (servicesData.length > 0) {
      await db
        .insert(flashTemplateIntroductionServicesTable)
        .values(servicesData);
    }
  }

  // Save About Us
  await db.insert(flashTemplateAboutUsTable).values({
    projectId,
    hideSection: false,
    title: proposal.aboutUs.title,
    supportText: proposal.aboutUs.supportText,
    subtitle: proposal.aboutUs.subtitle,
  });

  // Save Team
  await db.insert(flashTemplateTeamTable).values({
    projectId,
    hideSection: false,
    title: proposal.team.title,
  });

  // Save Expertise
  const [expertise] = await db
    .insert(flashTemplateExpertiseTable)
    .values({
      projectId,
      hideSection: false,
      title: proposal.specialties.title,
    })
    .returning();

  if (
    proposal.specialties.topics &&
    Array.isArray(proposal.specialties.topics)
  ) {
    const expertiseTopicsData = proposal.specialties.topics.map(
      (topic, index) => ({
        expertiseId: expertise.id,
        title: topic.title,
        description: topic.description,
        hideTitleField: false,
        hideDescription: false,
        sortOrder: index,
      })
    );

    if (expertiseTopicsData.length > 0) {
      await db
        .insert(flashTemplateExpertiseTopicsTable)
        .values(expertiseTopicsData);
    }
  }

  // Save Steps
  const [steps] = await db
    .insert(flashTemplateStepsTable)
    .values({
      projectId,
      hideSection: false,
      title: proposal.steps.title,
    })
    .returning();

  if (proposal.steps.topics && Array.isArray(proposal.steps.topics)) {
    const stepsTopicsData = proposal.steps.topics.map((topic, index) => ({
      stepsId: steps.id,
      stepName: topic.title,
      stepDescription: topic.description,
      hideStepName: false,
      hideStepDescription: false,
      sortOrder: index,
    }));

    if (stepsTopicsData.length > 0) {
      await db.insert(flashTemplateStepsTopicsTable).values(stepsTopicsData);
    }
  }

  // Save Clients (empty for now, as AI doesn't generate this)
  await db.insert(flashTemplateClientsTable).values({
    projectId,
    hideSection: false,
  });

  // Save Testimonials (empty for now)
  await db.insert(flashTemplateTestimonialsTable).values({
    projectId,
    hideSection: false,
  });

  // Save Investment
  await db.insert(flashTemplateInvestmentTable).values({
    projectId,
    hideSection: false,
    title: proposal.investment.title,
  });

  // Save Deliverables
  const [deliverables] = await db
    .insert(flashTemplateDeliverablesTable)
    .values({
      projectId,
      hideSection: false,
      title: "Entregáveis",
    })
    .returning();

  if (
    proposal.investment.deliverables &&
    Array.isArray(proposal.investment.deliverables)
  ) {
    const deliverablesData = proposal.investment.deliverables.map(
      (deliverable, index) => ({
        deliverablesSectionId: deliverables.id,
        deliveryName: deliverable.title,
        deliveryContent: deliverable.description,
        hideDeliveryName: false,
        hideDeliveryContent: false,
        sortOrder: index,
      })
    );

    if (deliverablesData.length > 0) {
      await db
        .insert(flashTemplateDeliverablesListTable)
        .values(deliverablesData);
    }
  }

  // Save Plans
  const [plansSection] = await db
    .insert(flashTemplatePlansTable)
    .values({
      projectId,
      hideSection: false,
    })
    .returning();

  if (proposal.investment.plans && Array.isArray(proposal.investment.plans)) {
    for (const plan of proposal.investment.plans) {
      const [insertedPlan] = await db
        .insert(flashTemplatePlansListTable)
        .values({
          plansSectionId: plansSection.id,
          title: plan.title,
          description: plan.description,
          price: plan.value.replace(/[^\d,]/g, ""), // Extract number from currency string
          planPeriod: "one-time",
          buttonTitle: "Contratar",
          hideTitleField: false,
          hideDescription: false,
          hidePrice: false,
          hidePlanPeriod: false,
          hideButtonTitle: false,
          sortOrder: 0,
        })
        .returning();

      // Save plan topics
      if (plan.topics && Array.isArray(plan.topics)) {
        const topicsData = plan.topics.map((topic, index) => ({
          planId: insertedPlan.id,
          description: topic,
          hideDescription: false,
          sortOrder: index,
        }));

        if (topicsData.length > 0) {
          await db
            .insert(flashTemplatePlansIncludedItemsTable)
            .values(topicsData);
        }
      }
    }
  }

  // Save Terms & Conditions
  const [termsSection] = await db
    .insert(flashTemplateTermsConditionsTable)
    .values({
      projectId,
      title: proposal.terms?.[0]?.title || "Termos e Condições",
    })
    .returning();

  if (proposal.terms && Array.isArray(proposal.terms)) {
    const termsData = proposal.terms.map((term, index) => ({
      termsSectionId: termsSection.id,
      title: term.title,
      description: term.description,
      hideTitleField: false,
      hideDescription: false,
      sortOrder: index,
    }));

    if (termsData.length > 0) {
      await db.insert(flashTemplateTermsConditionsListTable).values(termsData);
    }
  }

  // Save FAQ
  const [faqSection] = await db
    .insert(flashTemplateFaqTable)
    .values({
      projectId,
      hideSection: false,
      title: "Perguntas Frequentes",
    })
    .returning();

  if (proposal.faq && Array.isArray(proposal.faq)) {
    const faqData = proposal.faq.map((item, index) => ({
      faqSectionId: faqSection.id,
      question: item.question,
      answer: item.answer,
      hideQuestion: false,
      hideAnswer: false,
      sortOrder: index,
    }));

    if (faqData.length > 0) {
      await db.insert(flashTemplateFaqListTable).values(faqData);
    }
  }

  // Save Footer
  await db.insert(flashTemplateFooterTable).values({
    projectId,
    hideSection: false,
    thankYouMessage: "Obrigado!",
    ctaMessage: proposal.footer.callToAction,
    disclaimer: proposal.footer.disclaimer,
    hideDisclaimer: false,
    validity: requestData.validUntil || new Date().toISOString(),
  });

  console.log("Flash template data saved successfully");
}

export async function savePrimeTemplateData(
  projectId: string,
  aiResult: PrimeWorkflowResult,
  requestData: {
    validUntil?: string;
    originalPageUrl?: string;
    pagePassword?: string;
  }
) {
  if (!aiResult.success || !aiResult.data) {
    throw new Error("Prime AI result is not successful");
  }

  const proposal = aiResult.data;

  // Save Introduction
  const [introduction] = await db
    .insert(primeTemplateIntroductionTable)
    .values({
      projectId,
      name: "Prime Template",
      validity: requestData.validUntil
        ? new Date(requestData.validUntil)
        : new Date(),
      email: requestData.originalPageUrl || "",
      title: proposal.introduction.title,
      subtitle: proposal.introduction.subtitle,
      buttonTitle: proposal.introduction.buttonText,
      photo: null,
      hidePhoto: true,
      memberName: null,
      hideMemberName: true,
    })
    .returning();

  // Save Introduction Services (Marquee)
  if (
    proposal.introduction.services &&
    Array.isArray(proposal.introduction.services)
  ) {
    const servicesData = proposal.introduction.services.map(
      (service, index) => ({
        introductionId: introduction.id,
        serviceName: service,
        hideService: false,
        sortOrder: index,
      })
    );

    if (servicesData.length > 0) {
      await db
        .insert(primeTemplateIntroductionMarqueeTable)
        .values(servicesData);
    }
  }

  // Save About Us
  await db.insert(primeTemplateAboutUsTable).values({
    projectId,
    hideSection: false,
    title: proposal.aboutUs.title,
    paragraph1: proposal.aboutUs.supportText,
    paragraph2: proposal.aboutUs.subtitle,
    hideParagraph1: false,
    hideParagraph2: false,
  });

  // Save Team
  await db.insert(primeTemplateTeamTable).values({
    projectId,
    hideSection: false,
    title: proposal.team.title,
    hideTitle: false,
  });

  // Save Expertise
  const [expertise] = await db
    .insert(primeTemplateExpertiseTable)
    .values({
      projectId,
      hideSection: false,
      title: proposal.specialties.title,
    })
    .returning();

  if (
    proposal.specialties.topics &&
    Array.isArray(proposal.specialties.topics)
  ) {
    const expertiseTopicsData = proposal.specialties.topics.map(
      (topic, index) => ({
        expertiseId: expertise.id,
        title: topic.title,
        description: topic.description,
        hideTitleField: false,
        hideDescription: false,
        sortOrder: index,
      })
    );

    if (expertiseTopicsData.length > 0) {
      await db
        .insert(primeTemplateExpertiseTopicsTable)
        .values(expertiseTopicsData);
    }
  }

  // Save Steps
  const [steps] = await db
    .insert(primeTemplateStepsTable)
    .values({
      projectId,
      hideSection: false,
      title: proposal.steps.title,
      hideTitle: false,
    })
    .returning();

  if (proposal.steps.topics && Array.isArray(proposal.steps.topics)) {
    const stepsTopicsData = proposal.steps.topics.map((topic, index) => ({
      stepsId: steps.id,
      stepName: topic.title,
      stepDescription: topic.description,
      hideStepName: false,
      hideStepDescription: false,
      sortOrder: index,
    }));

    if (stepsTopicsData.length > 0) {
      await db.insert(primeTemplateStepsTopicsTable).values(stepsTopicsData);
    }
  }

  // Save Clients (empty for now)
  await db.insert(primeTemplateClientsTable).values({
    projectId,
    hideSection: false,
  });

  // Save Results (empty for now)
  await db.insert(primeTemplateResultsTable).values({
    projectId,
    hideSection: false,
    title: "Resultados",
  });

  // Save CTA (empty for now - would need background image)
  await db.insert(primeTemplateCtaTable).values({
    projectId,
    hideSection: false,
    title: "Entre em contato",
    buttonTitle: "Falar com especialista",
    backgroundImage: "",
  });

  // Save Testimonials (empty for now)
  await db.insert(primeTemplateTestimonialsTable).values({
    projectId,
    hideSection: false,
  });

  // Save Investment
  await db.insert(primeTemplateInvestmentTable).values({
    projectId,
    hideSection: false,
    title: proposal.investment.title,
  });

  // Save Deliverables
  const [deliverables] = await db
    .insert(primeTemplateDeliverablesTable)
    .values({
      projectId,
      title: "Entregáveis",
    })
    .returning();

  if (
    proposal.investment.deliverables &&
    Array.isArray(proposal.investment.deliverables)
  ) {
    const deliverablesData = proposal.investment.deliverables.map(
      (deliverable, index) => ({
        deliverablesSectionId: deliverables.id,
        deliveryName: deliverable.title,
        deliveryContent: deliverable.description,
        hideDeliveryName: false,
        hideDeliveryContent: false,
        sortOrder: index,
      })
    );

    if (deliverablesData.length > 0) {
      await db
        .insert(primeTemplateDeliverablesListTable)
        .values(deliverablesData);
    }
  }

  // Save Plans
  const [plansSection] = await db
    .insert(primeTemplatePlansTable)
    .values({
      projectId,
      hideSection: false,
      title: "Planos",
    })
    .returning();

  if (proposal.investment.plans && Array.isArray(proposal.investment.plans)) {
    for (const plan of proposal.investment.plans) {
      const [insertedPlan] = await db
        .insert(primeTemplatePlansListTable)
        .values({
          plansSectionId: plansSection.id,
          title: plan.title,
          description: plan.description,
          price: plan.value.replace(/[^\d,]/g, ""),
          planPeriod: "one-time",
          buttonTitle: "Contratar",
          hideTitleField: false,
          hideDescription: false,
          hidePrice: false,
          hidePlanPeriod: false,
          hideButtonTitle: false,
          sortOrder: 0,
        })
        .returning();

      // Save plan topics
      if (plan.topics && Array.isArray(plan.topics)) {
        const topicsData = plan.topics.map((topic, index) => ({
          planId: insertedPlan.id,
          description: topic,
          hideDescription: false,
          sortOrder: index,
        }));

        if (topicsData.length > 0) {
          await db
            .insert(primeTemplatePlansIncludedItemsTable)
            .values(topicsData);
        }
      }
    }
  }

  // Save Terms & Conditions
  const [termsSection] = await db
    .insert(primeTemplateTermsConditionsTable)
    .values({
      projectId,
      hideSection: false,
      title: proposal.terms?.[0]?.title || "Termos e Condições",
    })
    .returning();

  if (proposal.terms && Array.isArray(proposal.terms)) {
    const termsData = proposal.terms.map((term, index) => ({
      termsSectionId: termsSection.id,
      title: term.title,
      description: term.description,
      hideTitleField: false,
      hideDescription: false,
      sortOrder: index,
    }));

    if (termsData.length > 0) {
      await db.insert(primeTemplateTermsConditionsListTable).values(termsData);
    }
  }

  // Save FAQ
  const [faqSection] = await db
    .insert(primeTemplateFaqTable)
    .values({
      projectId,
      hideSection: false,
      subtitle: "Perguntas Frequentes",
      hideSubtitle: false,
    })
    .returning();

  if (proposal.faq && Array.isArray(proposal.faq)) {
    const faqData = proposal.faq.map((item, index) => ({
      faqSectionId: faqSection.id,
      question: item.question,
      answer: item.answer,
      hideQuestion: false,
      hideAnswer: false,
      sortOrder: index,
    }));

    if (faqData.length > 0) {
      await db.insert(primeTemplateFaqListTable).values(faqData);
    }
  }

  // Save Footer
  await db.insert(primeTemplateFooterTable).values({
    projectId,
    thankYouTitle: "Obrigado!",
    thankYouMessage: proposal.footer.callToAction,
    disclaimer: proposal.footer.contactInfo,
    email: requestData.originalPageUrl || "",
    buttonTitle: proposal.introduction.buttonText,
    validity: requestData.validUntil
      ? new Date(requestData.validUntil)
      : new Date(),
    hideThankYouTitle: false,
    hideThankYouMessage: false,
    hideDisclaimer: false,
  });

  console.log("Prime template data saved successfully");
}
