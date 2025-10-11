import { db } from "#/lib/db";
import { eq } from "drizzle-orm";
import { getTemplateSchemas } from "./template-tables";
import type { TemplateType } from "./template-tables";

export async function fetchMinimalTemplateData(projectId: string) {
  const schemas = getTemplateSchemas("minimal");

  // Get main section data first
  const [
    introduction,
    aboutUs,
    clients,
    expertise,
    plans,
    termsConditions,
    faq,
    footer,
  ] = await Promise.all([
    db.select().from(schemas.introduction).where(eq(schemas.introduction.projectId, projectId)),
    db.select().from(schemas.aboutUs).where(eq(schemas.aboutUs.projectId, projectId)),
    db.select().from(schemas.clients).where(eq(schemas.clients.projectId, projectId)),
    db.select().from(schemas.expertise).where(eq(schemas.expertise.projectId, projectId)),
    db.select().from(schemas.plans).where(eq(schemas.plans.projectId, projectId)),
    db.select().from(schemas.termsConditions).where(eq(schemas.termsConditions.projectId, projectId)),
    db.select().from(schemas.faq).where(eq(schemas.faq.projectId, projectId)),
    db.select().from(schemas.footer).where(eq(schemas.footer.projectId, projectId)),
  ]);

  // Get sub-tables data based on parent IDs
  const [
    introductionPhotos,
    aboutUsTeam,
    aboutUsMarquee,
    clientsList,
    expertiseTopics,
    plansList,
    termsConditionsList,
    faqList,
    footerMarquee,
  ] = await Promise.all([
    introduction[0] ? db.select().from(schemas.introductionPhotos).where(eq(schemas.introductionPhotos.introductionId, introduction[0].id)) : [],
    aboutUs[0] ? db.select().from(schemas.aboutUsTeam).where(eq(schemas.aboutUsTeam.aboutUsId, aboutUs[0].id)) : [],
    aboutUs[0] ? db.select().from(schemas.aboutUsMarquee).where(eq(schemas.aboutUsMarquee.aboutUsId, aboutUs[0].id)) : [],
    clients[0] ? db.select().from(schemas.clientsList).where(eq(schemas.clientsList.clientsSectionId, clients[0].id)) : [],
    expertise[0] ? db.select().from(schemas.expertiseTopics).where(eq(schemas.expertiseTopics.expertiseId, expertise[0].id)) : [],
    plans[0] ? db.select().from(schemas.plansList).where(eq(schemas.plansList.plansSectionId, plans[0].id)) : [],
    termsConditions[0] ? db.select().from(schemas.termsConditionsList).where(eq(schemas.termsConditionsList.termsSectionId, termsConditions[0].id)) : [],
    faq[0] ? db.select().from(schemas.faqList).where(eq(schemas.faqList.faqSectionId, faq[0].id)) : [],
    footer[0] ? db.select().from(schemas.footerMarquee).where(eq(schemas.footerMarquee.footerId, footer[0].id)) : [],
  ]);

  // Get plan items for each individual plan
  const plansIncludedItems = plansList.length > 0 ? await Promise.all(
    plansList.map(plan =>
      db.select().from(schemas.plansIncludedItems).where(eq(schemas.plansIncludedItems.planId, plan.id))
    )
  ).then(results => results.flat()) : [];

  return {
    introduction: {
      section: introduction[0] || null,
      photos: introductionPhotos || [],
    },
    aboutUs: {
      section: aboutUs[0] || null,
      team: aboutUsTeam || [],
      marquee: aboutUsMarquee || [],
    },
    clients: {
      section: clients[0] || null,
      list: clientsList || [],
    },
    expertise: {
      section: expertise[0] || null,
      topics: expertiseTopics || [],
    },
    plans: {
      section: plans[0] || null,
      list: plansList || [],
      includedItems: plansIncludedItems || [],
    },
    termsConditions: {
      section: termsConditions[0] || null,
      list: termsConditionsList || [],
    },
    faq: {
      section: faq[0] || null,
      list: faqList || [],
    },
    footer: {
      section: footer[0] || null,
      marquee: footerMarquee || [],
    },
  };
}

export async function fetchFlashTemplateData(projectId: string) {
  const schemas = getTemplateSchemas("flash");

  // Get main sections
  const [
    introduction,
    aboutUs,
    team,
    expertise,
    results,
    clients,
    steps,
    cta,
    testimonials,
    investment,
    deliverables,
    plans,
    termsConditions,
    faq,
    footer,
  ] = await Promise.all([
    db.select().from(schemas.introduction).where(eq(schemas.introduction.projectId, projectId)),
    db.select().from(schemas.aboutUs).where(eq(schemas.aboutUs.projectId, projectId)),
    db.select().from(schemas.team).where(eq(schemas.team.projectId, projectId)),
    db.select().from(schemas.expertise).where(eq(schemas.expertise.projectId, projectId)),
    db.select().from(schemas.results).where(eq(schemas.results.projectId, projectId)),
    db.select().from(schemas.clients).where(eq(schemas.clients.projectId, projectId)),
    db.select().from(schemas.steps).where(eq(schemas.steps.projectId, projectId)),
    db.select().from(schemas.cta).where(eq(schemas.cta.projectId, projectId)),
    db.select().from(schemas.testimonials).where(eq(schemas.testimonials.projectId, projectId)),
    db.select().from(schemas.investment).where(eq(schemas.investment.projectId, projectId)),
    db.select().from(schemas.deliverables).where(eq(schemas.deliverables.projectId, projectId)),
    db.select().from(schemas.plans).where(eq(schemas.plans.projectId, projectId)),
    db.select().from(schemas.termsConditions).where(eq(schemas.termsConditions.projectId, projectId)),
    db.select().from(schemas.faq).where(eq(schemas.faq.projectId, projectId)),
    db.select().from(schemas.footer).where(eq(schemas.footer.projectId, projectId)),
  ]);

  // Get sub-tables
  const [
    introductionServices,
    teamMembers,
    expertiseTopics,
    resultsList,
    clientsList,
    stepsTopics,
    stepsMarquee,
    testimonialsList,
    deliverablesList,
    plansList,
    termsConditionsList,
    faqList,
    footerMarquee,
  ] = await Promise.all([
    introduction[0] ? db.select().from(schemas.introductionServices).where(eq(schemas.introductionServices.introductionId, introduction[0].id)) : [],
    team[0] ? db.select().from(schemas.teamMembers).where(eq(schemas.teamMembers.teamId, team[0].id)) : [],
    expertise[0] ? db.select().from(schemas.expertiseTopics).where(eq(schemas.expertiseTopics.expertiseId, expertise[0].id)) : [],
    results[0] ? db.select().from(schemas.resultsList).where(eq(schemas.resultsList.resultsId, results[0].id)) : [],
    clients[0] ? db.select().from(schemas.clientsList).where(eq(schemas.clientsList.clientsSectionId, clients[0].id)) : [],
    steps[0] ? db.select().from(schemas.stepsTopics).where(eq(schemas.stepsTopics.stepsId, steps[0].id)) : [],
    steps[0] ? db.select().from(schemas.stepsMarquee).where(eq(schemas.stepsMarquee.stepsId, steps[0].id)) : [],
    testimonials[0] ? db.select().from(schemas.testimonialsList).where(eq(schemas.testimonialsList.testimonialsId, testimonials[0].id)) : [],
    deliverables[0] ? db.select().from(schemas.deliverablesList).where(eq(schemas.deliverablesList.deliverablesId, deliverables[0].id)) : [],
    plans[0] ? db.select().from(schemas.plansList).where(eq(schemas.plansList.plansSectionId, plans[0].id)) : [],
    termsConditions[0] ? db.select().from(schemas.termsConditionsList).where(eq(schemas.termsConditionsList.termsSectionId, termsConditions[0].id)) : [],
    faq[0] ? db.select().from(schemas.faqList).where(eq(schemas.faqList.faqSectionId, faq[0].id)) : [],
    footer[0] ? db.select().from(schemas.footerMarquee).where(eq(schemas.footerMarquee.footerId, footer[0].id)) : [],
  ]);

  // Get plan items
  const plansIncludedItems = plansList.length > 0 ? await Promise.all(
    plansList.map(plan =>
      db.select().from(schemas.plansIncludedItems).where(eq(schemas.plansIncludedItems.planId, plan.id))
    )
  ).then(results => results.flat()) : [];

  return {
    introduction: {
      section: introduction[0] || null,
      services: introductionServices || [],
    },
    aboutUs: {
      section: aboutUs[0] || null,
    },
    team: {
      section: team[0] || null,
      members: teamMembers || [],
    },
    expertise: {
      section: expertise[0] || null,
      topics: expertiseTopics || [],
    },
    results: {
      section: results[0] || null,
      list: resultsList || [],
    },
    clients: {
      section: clients[0] || null,
      list: clientsList || [],
    },
    steps: {
      section: steps[0] || null,
      topics: stepsTopics || [],
      marquee: stepsMarquee || [],
    },
    cta: {
      section: cta[0] || null,
    },
    testimonials: {
      section: testimonials[0] || null,
      list: testimonialsList || [],
    },
    investment: {
      section: investment[0] || null,
    },
    deliverables: {
      section: deliverables[0] || null,
      list: deliverablesList || [],
    },
    plans: {
      section: plans[0] || null,
      list: plansList || [],
      includedItems: plansIncludedItems || [],
    },
    termsConditions: {
      section: termsConditions[0] || null,
      list: termsConditionsList || [],
    },
    faq: {
      section: faq[0] || null,
      list: faqList || [],
    },
    footer: {
      section: footer[0] || null,
      marquee: footerMarquee || [],
    },
  };
}

export async function fetchPrimeTemplateData(projectId: string) {
  const schemas = getTemplateSchemas("prime");

  // Get main sections
  const [
    introduction,
    aboutUs,
    team,
    expertise,
    results,
    clients,
    cta,
    steps,
    testimonials,
    investment,
    deliverables,
    plans,
    termsConditions,
    faq,
    footer,
  ] = await Promise.all([
    db.select().from(schemas.introduction).where(eq(schemas.introduction.projectId, projectId)),
    db.select().from(schemas.aboutUs).where(eq(schemas.aboutUs.projectId, projectId)),
    db.select().from(schemas.team).where(eq(schemas.team.projectId, projectId)),
    db.select().from(schemas.expertise).where(eq(schemas.expertise.projectId, projectId)),
    db.select().from(schemas.results).where(eq(schemas.results.projectId, projectId)),
    db.select().from(schemas.clients).where(eq(schemas.clients.projectId, projectId)),
    db.select().from(schemas.cta).where(eq(schemas.cta.projectId, projectId)),
    db.select().from(schemas.steps).where(eq(schemas.steps.projectId, projectId)),
    db.select().from(schemas.testimonials).where(eq(schemas.testimonials.projectId, projectId)),
    db.select().from(schemas.investment).where(eq(schemas.investment.projectId, projectId)),
    db.select().from(schemas.deliverables).where(eq(schemas.deliverables.projectId, projectId)),
    db.select().from(schemas.plans).where(eq(schemas.plans.projectId, projectId)),
    db.select().from(schemas.termsConditions).where(eq(schemas.termsConditions.projectId, projectId)),
    db.select().from(schemas.faq).where(eq(schemas.faq.projectId, projectId)),
    db.select().from(schemas.footer).where(eq(schemas.footer.projectId, projectId)),
  ]);

  // Get sub-tables
  const [
    introductionMarquee,
    teamMembers,
    expertiseTopics,
    resultsList,
    clientsList,
    stepsTopics,
    testimonialsList,
    deliverablesList,
    plansList,
    termsConditionsList,
    faqList,
  ] = await Promise.all([
    introduction[0] ? db.select().from(schemas.introductionMarquee).where(eq(schemas.introductionMarquee.introductionId, introduction[0].id)) : [],
    team[0] ? db.select().from(schemas.teamMembers).where(eq(schemas.teamMembers.teamId, team[0].id)) : [],
    expertise[0] ? db.select().from(schemas.expertiseTopics).where(eq(schemas.expertiseTopics.expertiseId, expertise[0].id)) : [],
    results[0] ? db.select().from(schemas.resultsList).where(eq(schemas.resultsList.resultsId, results[0].id)) : [],
    clients[0] ? db.select().from(schemas.clientsList).where(eq(schemas.clientsList.clientsSectionId, clients[0].id)) : [],
    steps[0] ? db.select().from(schemas.stepsTopics).where(eq(schemas.stepsTopics.stepsId, steps[0].id)) : [],
    testimonials[0] ? db.select().from(schemas.testimonialsList).where(eq(schemas.testimonialsList.testimonialsId, testimonials[0].id)) : [],
    deliverables[0] ? db.select().from(schemas.deliverablesList).where(eq(schemas.deliverablesList.deliverablesId, deliverables[0].id)) : [],
    plans[0] ? db.select().from(schemas.plansList).where(eq(schemas.plansList.plansSectionId, plans[0].id)) : [],
    termsConditions[0] ? db.select().from(schemas.termsConditionsList).where(eq(schemas.termsConditionsList.termsSectionId, termsConditions[0].id)) : [],
    faq[0] ? db.select().from(schemas.faqList).where(eq(schemas.faqList.faqSectionId, faq[0].id)) : [],
  ]);

  // Get plan items
  const plansIncludedItems = plansList.length > 0 ? await Promise.all(
    plansList.map(plan =>
      db.select().from(schemas.plansIncludedItems).where(eq(schemas.plansIncludedItems.planId, plan.id))
    )
  ).then(results => results.flat()) : [];

  return {
    introduction: {
      section: introduction[0] || null,
      marquee: introductionMarquee || [],
    },
    aboutUs: {
      section: aboutUs[0] || null,
    },
    team: {
      section: team[0] || null,
      members: teamMembers || [],
    },
    expertise: {
      section: expertise[0] || null,
      topics: expertiseTopics || [],
    },
    results: {
      section: results[0] || null,
      list: resultsList || [],
    },
    clients: {
      section: clients[0] || null,
      list: clientsList || [],
    },
    cta: {
      section: cta[0] || null,
    },
    steps: {
      section: steps[0] || null,
      topics: stepsTopics || [],
    },
    testimonials: {
      section: testimonials[0] || null,
      list: testimonialsList || [],
    },
    investment: {
      section: investment[0] || null,
    },
    deliverables: {
      section: deliverables[0] || null,
      list: deliverablesList || [],
    },
    plans: {
      section: plans[0] || null,
      list: plansList || [],
      includedItems: plansIncludedItems || [],
    },
    termsConditions: {
      section: termsConditions[0] || null,
      list: termsConditionsList || [],
    },
    faq: {
      section: faq[0] || null,
      list: faqList || [],
    },
    footer: {
      section: footer[0] || null,
    },
  };
}

export async function fetchTemplateData(template: TemplateType, projectId: string) {
  switch (template) {
    case "flash":
      return fetchFlashTemplateData(projectId);
    case "prime":
      return fetchPrimeTemplateData(projectId);
    case "minimal":
      return fetchMinimalTemplateData(projectId);
    default:
      throw new Error(`Template não suportado: ${template}`);
  }
}

