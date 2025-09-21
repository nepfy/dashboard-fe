export function generateDefaultCompanyInfo(serviceId: string): string {
  const companyTemplates = {
    "marketing-digital":
      "Somos uma agência de marketing digital especializada em crescimento de negócios online. Com anos de experiência, ajudamos empresas a aumentar suas vendas através de estratégias digitais personalizadas. Nossa equipe é composta por especialistas em SEO, Google Ads, redes sociais e automação de marketing.",
    design:
      "Studio de design criativo focado em criar identidades visuais impactantes. Especializamos em branding, design de websites e material gráfico para startups e empresas em crescimento. Nossa missão é transformar ideias em experiências visuais memoráveis.",
    development:
      "Empresa de desenvolvimento de software especializada em aplicações web e mobile. Utilizamos tecnologias modernas para criar soluções escaláveis e eficientes. Nossa equipe é composta por desenvolvedores experientes em React, Node.js e React Native.",
    architecture:
      "Escritório de arquitetura especializado em projetos residenciais e comerciais. Combinamos funcionalidade, estética e sustentabilidade em todos os nossos projetos. Nossa experiência inclui aprovações, acompanhamento de obra e design de interiores.",
    photography:
      "Estúdio de fotografia profissional com experiência em diversos segmentos. Especializamos em fotografia corporativa, de produtos, eventos e retratos. Nossa equipe utiliza equipamentos de alta qualidade e técnicas avançadas de pós-produção.",
    medical:
      "Clínica médica especializada em atendimento personalizado e de qualidade. Oferecemos consultas, exames diagnósticos e procedimentos com foco na saúde e bem-estar dos pacientes. Nossa equipe médica é altamente qualificada e experiente.",
  };

  return (
    companyTemplates[serviceId as keyof typeof companyTemplates] ||
    companyTemplates["marketing-digital"]
  );
}

export function generateDefaultPlans(serviceId: string): string[] {
  const planTemplates = {
    "marketing-digital": ["basic", "premium"],
    design: ["logo", "complete"],
    development: ["web-app", "mobile-app"],
    architecture: ["project", "complete"],
    photography: ["session", "package"],
    medical: ["consultation", "checkup"],
  };

  return (
    planTemplates[serviceId as keyof typeof planTemplates] || [
      "basic",
      "premium",
    ]
  );
}

export function generateDefaultPlanDetails(
  serviceId: string,
  plans?: string[]
): string {
  if (plans && plans.length > 0) {
    const planNames = plans.map(
      (plan) => plan.charAt(0).toUpperCase() + plan.slice(1)
    );
    return `Planos ${planNames.join(", ")}: ${planNames
      .map(
        (plan) =>
          `Plano ${plan} com serviços personalizados e estratégias otimizadas para seu negócio`
      )
      .join(". ")}.`;
  }

  const planDetailsTemplates = {
    "marketing-digital":
      "Plano Basic: Gestão de redes sociais + Google Ads. Plano Premium: Estratégia completa incluindo SEO, email marketing e automação.",
    design:
      "Plano Logo: Criação de logotipo e aplicações básicas. Plano Complete: Identidade visual completa com manual de marca e material gráfico.",
    development:
      "Plano Web App: Desenvolvimento de aplicação web responsiva. Plano Mobile App: Aplicativo mobile nativo ou híbrido.",
    architecture:
      "Plano Project: Projeto arquitetônico básico. Plano Complete: Projeto completo com acompanhamento de obra.",
    photography:
      "Plano Session: Sessão fotográfica com edição básica. Plano Package: Pacote completo com múltiplas sessões e edição avançada.",
    medical:
      "Plano Consultation: Consulta médica especializada. Plano Checkup: Checkup completo com exames e laudos.",
  };

  return (
    planDetailsTemplates[serviceId as keyof typeof planDetailsTemplates] ||
    "Planos personalizados conforme necessidade do projeto."
  );
}

export function generatePlanOptionsByCount(
  serviceId: string,
  planCount: number
): string[] {
  const planTemplates = {
    "marketing-digital": {
      1: ["basic"],
      2: ["basic", "premium"],
      3: ["basic", "premium", "enterprise"],
    },
    design: {
      1: ["logo"],
      2: ["logo", "complete"],
      3: ["logo", "complete", "premium"],
    },
    development: {
      1: ["web-app"],
      2: ["web-app", "mobile-app"],
      3: ["web-app", "mobile-app", "full-stack"],
    },
    architecture: {
      1: ["project"],
      2: ["project", "complete"],
      3: ["project", "complete", "premium"],
    },
    photography: {
      1: ["session"],
      2: ["session", "package"],
      3: ["session", "package", "premium"],
    },
    medical: {
      1: ["consultation"],
      2: ["consultation", "checkup"],
      3: ["consultation", "checkup", "premium"],
    },
  };

  const servicePlans = planTemplates[serviceId as keyof typeof planTemplates];
  if (!servicePlans) {
    return (
      planTemplates["marketing-digital"][
        Math.min(
          planCount,
          3
        ) as keyof (typeof planTemplates)["marketing-digital"]
      ] || ["basic"]
    );
  }

  const validPlanCount = Math.max(1, Math.min(planCount, 3));
  return (
    servicePlans[validPlanCount as keyof typeof servicePlans] || servicePlans[1]
  );
}

export const serviceMapping: Record<string, string> = {
  "marketing-digital": "marketing-digital",
  designer: "designer", // Keep original name since agents exist as designer-*-agent
  desenvolvedor: "desenvolvedor", // Keep original name since agents exist as desenvolvedor-*-agent
  arquiteto: "arquiteto", // Keep original name since agents exist as arquiteto-*-agent
  fotografo: "fotógrafo", // Map to fotógrafo since agents exist as fotógrafo-*-agent
  fotógrafo: "fotógrafo", // Support both with and without accent
  medico: "médico", // Map to médico since agents exist as médico-*-agent
  medicos: "médico", // Alternative name
};

// Template-specific service mapping for flash and prime templates
export const flashServiceMapping: Record<string, string> = {
  "marketing-digital": "Flash - Marketing Digital",
  designer: "Flash - Designer",
  desenvolvedor: "Flash - Desenvolvedor",
  arquiteto: "Flash - Arquiteto",
  fotografo: "Flash - Fotógrafo",
  fotógrafo: "Flash - Fotógrafo", // Support both with and without accent
  medicos: "Flash - Médico",
};

export const primeServiceMapping: Record<string, string> = {
  "marketing-digital": "Prime - Marketing Digital",
  designer: "Prime - Designer",
  desenvolvedor: "Prime - Desenvolvedor",
  arquiteto: "Prime - Arquiteto",
  fotografo: "Prime - Fotógrafo",
  fotógrafo: "Prime - Fotógrafo", // Support both with and without accent
  medicos: "Prime - Médico",
};
