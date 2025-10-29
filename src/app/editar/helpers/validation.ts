import {
  ExpertiseTopic,
  FAQItem,
  Plan,
  Result,
  StepTopic,
  TeamMember,
  TemplateData,
  Testimonial,
} from "#/types/template-data";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface FormErrors {
  [key: string]: string;
}

/**
 * Field-level validation for real-time validation
 */
export function validateField(
  sectionType: string,
  fieldName: string,
  value: unknown
): ValidationResult {
  switch (sectionType) {
    case "personalization":
      return validatePersonalizationField(fieldName, value);
    case "introduction":
      return validateIntroductionField(fieldName, value);
    case "plans":
      return validatePlansField(fieldName, value);
    case "team":
      return validateTeamField(fieldName, value);
    case "expertise":
      return validateExpertiseField(fieldName, value);
    case "steps":
      return validateStepsField(fieldName, value);
    case "results":
      return validateResultsField(fieldName, value);
    case "testimonials":
      return validateTestimonialsField(fieldName, value);
    case "faq":
      return validateFAQField(fieldName, value);
    case "footer":
      return validateFooterField(fieldName, value);
    default:
      return { isValid: true };
  }
}

/**
 * Section-level validation for modal validation
 */
export function validateSection(
  sectionType: string,
  data: TemplateData
): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  switch (sectionType) {
    case "personalization":
      return validatePersonalizationSection(data);
    case "introduction":
      return validateIntroductionSection(data);
    case "plans":
      return validatePlansSection(data);
    case "team":
      return validateTeamSection(data);
    case "expertise":
      return validateExpertiseSection(data);
    case "steps":
      return validateStepsSection(data);
    case "results":
      return validateResultsSection(data);
    case "testimonials":
      return validateTestimonialsSection(data);
    case "faq":
      return validateFAQSection(data);
    case "footer":
      return validateFooterSection(data);
    default:
      return { isValid: true, errors };
  }
}

// Personalization validation
function validatePersonalizationField(
  fieldName: string,
  value: unknown
): ValidationResult {
  switch (fieldName) {
    case "projectUrl":
      if (!value || (typeof value === "string" && value.length < 3)) {
        return {
          isValid: false,
          message: "URL deve ter pelo menos 3 caracteres",
        };
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(value as string)) {
        return {
          isValid: false,
          message:
            "URL deve conter apenas letras, números, hífens e underscores",
        };
      }
      return { isValid: true };

    case "pagePassword":
      if (!value || (typeof value === "string" && value.length < 6)) {
        return {
          isValid: false,
          message: "Senha deve ter pelo menos 6 caracteres",
        };
      }
      if (!/\d/.test(value as string)) {
        return {
          isValid: false,
          message: "Senha deve conter pelo menos um número",
        };
      }
      if (!/[A-Z]/.test(value as string)) {
        return {
          isValid: false,
          message: "Senha deve conter pelo menos uma letra maiúscula",
        };
      }
      return { isValid: true };

    case "mainColor":
      if (!value || !/^#[0-9A-Fa-f]{6}$/.test(value as string)) {
        return {
          isValid: false,
          message: "Cor deve ser um código hexadecimal válido",
        };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

function validatePersonalizationSection(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  const urlResult = validatePersonalizationField("projectUrl", data.projectUrl);
  if (!urlResult.isValid) errors.projectUrl = urlResult.message!;

  const passwordResult = validatePersonalizationField(
    "pagePassword",
    data.pagePassword
  );
  if (!passwordResult.isValid) errors.pagePassword = passwordResult.message!;

  const colorResult = validatePersonalizationField("mainColor", data.mainColor);
  if (!colorResult.isValid) errors.mainColor = colorResult.message!;

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Introduction validation
function validateIntroductionField(
  fieldName: string,
  value: unknown
): ValidationResult {
  switch (fieldName) {
    case "title":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Título é obrigatório" };
      }
      return { isValid: true };

    case "userName":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Nome do usuário é obrigatório" };
      }
      return { isValid: true };

    case "email":
      if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
        return { isValid: false, message: "Email deve ser válido" };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

function validateIntroductionSection(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  const titleResult = validateIntroductionField(
    "title",
    data.proposalData?.introduction?.title
  );
  if (!titleResult.isValid) errors.title = titleResult.message!;

  const userNameResult = validateIntroductionField(
    "userName",
    data.proposalData?.introduction?.userName
  );
  if (!userNameResult.isValid) errors.userName = userNameResult.message!;

  const emailResult = validateIntroductionField(
    "email",
    data.proposalData?.introduction?.email
  );
  if (!emailResult.isValid) errors.email = emailResult.message!;

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Plans validation
function validatePlansField(
  fieldName: string,
  value: unknown
): ValidationResult {
  switch (fieldName) {
    case "value":
      if (
        !value ||
        (typeof value === "string" && parseFloat(value as string) <= 0)
      ) {
        return { isValid: false, message: "Preço deve ser maior que zero" };
      }
      return { isValid: true };

    case "title":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Título do plano é obrigatório" };
      }
      return { isValid: true };

    case "description":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Descrição do plano é obrigatória" };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

function validatePlansSection(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  if (
    data.proposalData?.plans?.plansItems &&
    Array.isArray(data.proposalData?.plans?.plansItems as Plan[])
  ) {
    data.proposalData?.plans?.plansItems.forEach(
      (plan: Plan, index: number) => {
        const titleResult = validatePlansField("title", plan.title);
        if (!titleResult.isValid) {
          errors[`plan_${index}_title`] = titleResult.message!;
        }

        const valueResult = validatePlansField("value", plan.value);
        if (!valueResult.isValid) {
          errors[`plan_${index}_value`] = valueResult.message!;
        }

        const descResult = validatePlansField("description", plan.description);
        if (!descResult.isValid) {
          errors[`plan_${index}_description`] = descResult.message!;
        }
      }
    );
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Team validation
function validateTeamField(
  fieldName: string,
  value: unknown
): ValidationResult {
  switch (fieldName) {
    case "name":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Nome é obrigatório" };
      }
      return { isValid: true };

    case "image":
      if (value && !/\.(jpg|jpeg|png|webp)$/i.test(value as string)) {
        return {
          isValid: false,
          message: "Formato de imagem inválido (use jpg, png ou webp)",
        };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

function validateTeamSection(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  if (
    data.proposalData?.team?.members &&
    Array.isArray(data.proposalData?.team?.members)
  ) {
    data.proposalData?.team?.members.forEach(
      (member: TeamMember, index: number) => {
        const nameResult = validateTeamField("name", member.name);
        if (!nameResult.isValid) {
          errors[`member_${index}_name`] = nameResult.message!;
        }

        const imageResult = validateTeamField("image", member.image);
        if (!imageResult.isValid) {
          errors[`member_${index}_image`] = imageResult.message!;
        }
      }
    );
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Expertise validation
function validateExpertiseField(
  fieldName: string,
  value: unknown
): ValidationResult {
  switch (fieldName) {
    case "title":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return {
          isValid: false,
          message: "Título da especialização é obrigatório",
        };
      }
      return { isValid: true };

    case "description":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return {
          isValid: false,
          message: "Descrição da especialização é obrigatória",
        };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

function validateExpertiseSection(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  if (
    data.proposalData?.expertise?.topics &&
    Array.isArray(data.proposalData?.expertise?.topics)
  ) {
    data.proposalData?.expertise?.topics.forEach(
      (topic: ExpertiseTopic, index: number) => {
        const titleResult = validateExpertiseField("title", topic.title);
        if (!titleResult.isValid) {
          errors[`topic_${index}_title`] = titleResult.message!;
        }

        const descResult = validateExpertiseField(
          "description",
          topic.description
        );
        if (!descResult.isValid) {
          errors[`topic_${index}_description`] = descResult.message!;
        }
      }
    );
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Steps validation
function validateStepsField(
  fieldName: string,
  value: unknown
): ValidationResult {
  switch (fieldName) {
    case "title":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Título do passo é obrigatório" };
      }
      return { isValid: true };

    case "description":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Descrição do passo é obrigatória" };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

function validateStepsSection(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  if (
    data.proposalData?.steps?.topics &&
    Array.isArray(data.proposalData?.steps?.topics as StepTopic[])
  ) {
    data.proposalData?.steps?.topics.forEach(
      (topic: StepTopic, index: number) => {
        const titleResult = validateStepsField("title", topic.title);
        if (!titleResult.isValid) {
          errors[`step_${index}_title`] = titleResult.message!;
        }

        const descResult = validateStepsField("description", topic.description);
        if (!descResult.isValid) {
          errors[`step_${index}_description`] = descResult.message!;
        }
      }
    );
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Results validation
function validateResultsField(
  fieldName: string,
  value: unknown
): ValidationResult {
  switch (fieldName) {
    case "client":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Nome do cliente é obrigatório" };
      }
      return { isValid: true };

    case "investment":
      if (
        !value ||
        (typeof value === "string" && parseFloat(value as string) <= 0)
      ) {
        return {
          isValid: false,
          message: "Investimento deve ser maior que zero",
        };
      }
      return { isValid: true };

    case "roi":
      if (
        !value ||
        (typeof value === "string" && parseFloat(value as string) <= 0)
      ) {
        return { isValid: false, message: "ROI deve ser maior que zero" };
      }
      return { isValid: true };

    case "photo":
      if (value && !/\.(jpg|jpeg|png|webp)$/i.test(value as string)) {
        return { isValid: false, message: "Formato de imagem inválido" };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

function validateResultsSection(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  if (
    data.proposalData?.results?.items &&
    Array.isArray(data.proposalData?.results?.items)
  ) {
    data.proposalData?.results?.items.forEach((item: Result, index: number) => {
      const clientResult = validateResultsField("client", item.client);
      if (!clientResult.isValid) {
        errors[`result_${index}_client`] = clientResult.message!;
      }

      const investmentResult = validateResultsField(
        "investment",
        item.investment
      );
      if (!investmentResult.isValid) {
        errors[`result_${index}_investment`] = investmentResult.message!;
      }

      const roiResult = validateResultsField("roi", item.roi);
      if (!roiResult.isValid) {
        errors[`result_${index}_roi`] = roiResult.message!;
      }
    });
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Testimonials validation
function validateTestimonialsField(
  fieldName: string,
  value: unknown
): ValidationResult {
  switch (fieldName) {
    case "name":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Nome é obrigatório" };
      }
      return { isValid: true };

    case "testimonial":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Depoimento é obrigatório" };
      }
      return { isValid: true };

    case "photo":
      if (value && !/\.(jpg|jpeg|png|webp)$/i.test(value as string)) {
        return { isValid: false, message: "Formato de imagem inválido" };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

function validateTestimonialsSection(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  if (
    data.proposalData?.testimonials?.items &&
    Array.isArray(data.proposalData?.testimonials?.items)
  ) {
    data.proposalData?.testimonials?.items.forEach(
      (item: Testimonial, index: number) => {
        const nameResult = validateTestimonialsField("name", item.name);
        if (!nameResult.isValid) {
          errors[`testimonial_${index}_name`] = nameResult.message!;
        }

        const testimonialResult = validateTestimonialsField(
          "testimonial",
          item.testimonial
        );
        if (!testimonialResult.isValid) {
          errors[`testimonial_${index}_testimonial`] =
            testimonialResult.message!;
        }
      }
    );
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// FAQ validation
function validateFAQField(fieldName: string, value: unknown): ValidationResult {
  switch (fieldName) {
    case "question":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Pergunta é obrigatória" };
      }
      return { isValid: true };

    case "answer":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Resposta é obrigatória" };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

function validateFAQSection(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  if (
    data.proposalData?.faq?.items &&
    Array.isArray(data.proposalData?.faq?.items)
  ) {
    data.proposalData?.faq?.items.forEach((item: FAQItem, index: number) => {
      const questionResult = validateFAQField("question", item.question);
      if (!questionResult.isValid) {
        errors[`faq_${index}_question`] = questionResult.message!;
      }

      const answerResult = validateFAQField("answer", item.answer);
      if (!answerResult.isValid) {
        errors[`faq_${index}_answer`] = answerResult.message!;
      }
    });
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// Footer validation
function validateFooterField(
  fieldName: string,
  value: unknown
): ValidationResult {
  switch (fieldName) {
    case "callToAction":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Call to action é obrigatório" };
      }
      return { isValid: true };

    case "buttonTitle":
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        return { isValid: false, message: "Título do botão é obrigatório" };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}

function validateFooterSection(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  const ctaResult = validateFooterField(
    "callToAction",
    data.proposalData?.footer?.callToAction
  );
  if (!ctaResult.isValid) errors.callToAction = ctaResult.message!;

  const buttonResult = validateFooterField(
    "buttonTitle",
    data.buttonConfig?.buttonTitle
  );
  if (!buttonResult.isValid) errors.buttonTitle = buttonResult.message!;

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate entire project data
 */
export function validateProjectData(data: TemplateData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  // Validate basic project fields
  if (!data.projectName || data.projectName.trim().length === 0) {
    errors.projectName = "Nome do projeto é obrigatório";
  }

  if (!data.templateType) {
    errors.templateType = "Tipo de template é obrigatório";
  }

  if (!data.mainColor || !/^#[0-9A-Fa-f]{6}$/.test(data.mainColor)) {
    errors.mainColor = "Cor principal deve ser um código hexadecimal válido";
  }

  // Validate proposal data sections
  if (data.proposalData) {
    const proposalValidation = validateSection("introduction", data);
    if (!proposalValidation.isValid) {
      Object.assign(errors, proposalValidation.errors);
    }

    const plansValidation = validatePlansSection(data);
    if (!plansValidation.isValid) {
      Object.assign(errors, plansValidation.errors);
    }

    // Add more section validations as needed
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
