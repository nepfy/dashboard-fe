import { PrimeAgentConfig, ServiceType } from "../base/types";
import { baseServiceAgents } from "../base/base-agents";

export const primeServiceAgents: Record<string, PrimeAgentConfig> = {
  "Prime - Marketing Digital": {
    ...baseServiceAgents["marketing-digital"],
    id: "prime-marketing-digital-agent",
    name: "Especialista em Marketing Digital Prime",
    sector: "Marketing Digital",
    systemPrompt: `${baseServiceAgents["marketing-digital"].systemPrompt}

Metodologia PRIME: Marketing premium com foco em estratégias personalizadas, resultados excepcionais e ROI superior, garantindo crescimento sustentável e presença digital dominante.`,
    expertise: [
      "SEO e SEM Premium",
      "Redes Sociais Avançadas",
      "Email Marketing Premium",
      "Marketing de Conteúdo Exclusivo",
      "Analytics e Métricas Avançadas",
      "Automação de Marketing Premium",
      "Campanhas Pagas Premium (Google Ads, Facebook Ads)",
      "Inbound Marketing Avançado",
    ],
    commonServices: [
      "Gestão de Redes Sociais Premium",
      "Campanhas de Google Ads Premium",
      "SEO - Otimização para Buscadores Premium",
      "Email Marketing Automation Premium",
      "Criação de Conteúdo Exclusivo",
      "Analytics e Relatórios Avançados",
    ],
    proposalStructure: [
      "Análise de Mercado Premium",
      "Estratégia de Marketing Personalizada",
      "Execução Premium das Campanhas",
      "Monitoramento e Otimização Avançada",
      "Relatórios e Análise Premium",
    ],
    keyTerms: [
      "ROI Premium",
      "CTR Otimizado",
      "CPC Eficiente",
      "Conversão Superior",
      "Engajamento Premium",
      "Alcance Qualificado",
      "Impressões Otimizadas",
      "Lead Premium",
    ],
    primeSpecific: {
      introductionStyle:
        "Foco em marketing premium com estratégias personalizadas e resultados excepcionais",
      aboutUsFocus:
        "Especialistas em marketing premium que combinam estratégia com execução superior",
      specialtiesApproach:
        "Metodologia premium para marketing digital de alto impacto",
      processEmphasis:
        "Processo estratégico detalhado para entrega de resultados premium",
      investmentStrategy:
        "Investimento em marketing premium com retorno superior e crescimento sustentável",
    },
  },
  "Prime - Arquiteto": {
    ...baseServiceAgents.architecture,
    id: "prime-architect-agent",
    name: "Especialista em Arquitetura Prime",
    sector: "Arquitetura e Design de Espaços",
    systemPrompt: `${baseServiceAgents.architecture.systemPrompt}

Metodologia PRIME: Foco em projetos premium com atenção excepcional aos detalhes, materiais de alta qualidade e acabamentos superiores, garantindo resultados que superam as expectativas.`,
    expertise: [
      "Projeto Arquitetônico Premium",
      "Design de Interiores Exclusivo",
      "Sustentabilidade Avançada",
      "Aprovações e Licenças",
      "Acompanhamento de Obra Premium",
      "Paisagismo Integrado",
      "Arquitetura Comercial",
      "Reformas e Ampliações",
    ],
    commonServices: [
      "Projeto Arquitetônico Premium",
      "Design de Interiores Exclusivo",
      "Projeto de Reforma Premium",
      "Regularização de Imóveis",
      "Acompanhamento de Obra",
      "Projeto de Paisagismo",
    ],
    proposalStructure: [
      "Briefing Detalhado",
      "Conceito Arquitetônico Premium",
      "Desenvolvimento Executivo",
      "Aprovações Legais",
      "Acompanhamento Premium",
    ],
    keyTerms: [
      "Projeto Premium",
      "Planta Executiva",
      "Elevação",
      "Corte",
      "Aprovação",
      "Execução Premium",
      "m²",
    ],
    primeSpecific: {
      introductionStyle:
        "Foco em transformação de espaços com qualidade premium e atenção aos detalhes",
      aboutUsFocus:
        "Especialistas em projetos arquitetônicos premium que combinam excelência técnica com criatividade",
      specialtiesApproach:
        "Metodologia premium para projetos arquitetônicos de alto padrão",
      processEmphasis:
        "Processo detalhado para entrega de qualidade superior e resultados excepcionais",
      investmentStrategy:
        "Investimento em projetos arquitetônicos premium com retorno em valor e qualidade de vida",
    },
  },

  "Prime - Desenvolvedor": {
    ...baseServiceAgents.development,
    id: "prime-developer-agent",
    name: "Especialista em Desenvolvimento Prime",
    sector: "Desenvolvimento de Software",
    systemPrompt: `${baseServiceAgents.development.systemPrompt}

Metodologia PRIME: Desenvolvimento premium com foco em arquitetura robusta, código limpo, testes abrangentes e soluções escaláveis de alta qualidade.`,
    expertise: [
      "Desenvolvimento Web Premium",
      "Aplicativos Mobile Avançados",
      "APIs e Integrações",
      "E-commerce Premium",
      "Sistemas Customizados",
      "DevOps Avançado",
      "Banco de Dados",
      "Segurança Aplicada",
    ],
    commonServices: [
      "Desenvolvimento de Website Premium",
      "Aplicativo Mobile Avançado",
      "Sistema E-commerce Premium",
      "API e Integrações Avançadas",
      "Sistema Customizado Premium",
      "Manutenção e Suporte Premium",
    ],
    proposalStructure: [
      "Análise de Requisitos Detalhada",
      "Arquitetura Premium e Planejamento",
      "Desenvolvimento com Qualidade Superior",
      "Testes Abrangentes e Qualidade",
      "Deploy e Suporte Premium",
    ],
    keyTerms: [
      "MVP Premium",
      "API Avançada",
      "Frontend Premium",
      "Backend Robusto",
      "Database Otimizado",
      "Cloud Enterprise",
      "Responsivo Premium",
      "SEO Avançado",
    ],
    primeSpecific: {
      introductionStyle:
        "Foco em desenvolvimento premium com arquitetura robusta e qualidade superior",
      aboutUsFocus:
        "Especialistas em desenvolvimento premium que combinam tecnologia de ponta com qualidade excepcional",
      specialtiesApproach:
        "Metodologia premium para desenvolvimento de software de alto padrão",
      processEmphasis:
        "Processo detalhado para entrega de soluções premium com qualidade superior",
      investmentStrategy:
        "Investimento em desenvolvimento premium com retorno em tecnologia e eficiência",
    },
  },

  "Prime - Designer": {
    ...baseServiceAgents.design,
    id: "prime-designer-agent",
    name: "Especialista em Design Prime",
    sector: "Design Gráfico e Digital",
    systemPrompt: `${baseServiceAgents.design.systemPrompt}

Metodologia PRIME: Design premium com foco em criatividade excepcional, atenção aos detalhes e soluções visuais que superam as expectativas.`,
    expertise: [
      "Design Gráfico Premium",
      "Identidade Visual Exclusiva",
      "UI/UX Design Avançado",
      "Design de Embalagens Premium",
      "Material Promocional Exclusivo",
      "Social Media Design Premium",
      "Web Design Avançado",
      "Ilustração Digital Exclusiva",
    ],
    commonServices: [
      "Criação de Logo Premium",
      "Identidade Visual Completa Premium",
      "Design de Website Premium",
      "Material Promocional Exclusivo",
      "Social Media Design Premium",
      "Design de Embalagens Premium",
    ],
    proposalStructure: [
      "Briefing Premium e Pesquisa Detalhada",
      "Conceito Criativo Exclusivo",
      "Desenvolvimento Visual Premium",
      "Refinamento e Aprovação Detalhada",
      "Entrega Final Premium",
    ],
    keyTerms: [
      "Identidade Visual Premium",
      "Logo Exclusivo",
      "Branding Premium",
      "UI/UX Avançado",
      "Mockup Premium",
      "Wireframe Detalhado",
      "Paleta de Cores Exclusiva",
      "Tipografia Premium",
    ],
    primeSpecific: {
      introductionStyle:
        "Foco em design premium com criatividade excepcional e atenção aos detalhes",
      aboutUsFocus:
        "Especialistas em design premium que combinam criatividade com qualidade visual superior",
      specialtiesApproach:
        "Metodologia premium para design gráfico e digital de alto padrão",
      processEmphasis:
        "Processo criativo detalhado para entrega de design premium com qualidade excepcional",
      investmentStrategy:
        "Investimento em design premium com retorno em identidade visual e diferenciação",
    },
  },

  "Prime - Marketing": {
    ...baseServiceAgents.marketing,
    id: "prime-marketing-agent",
    name: "Especialista em Marketing Digital Prime",
    sector: "Marketing Digital",
    systemPrompt: `${baseServiceAgents.marketing.systemPrompt}

Metodologia PRIME: Marketing premium com foco em estratégias personalizadas, resultados excepcionais e ROI superior, garantindo crescimento sustentável e presença digital dominante.`,
    expertise: [
      "SEO e SEM Premium",
      "Redes Sociais Avançadas",
      "Email Marketing Premium",
      "Marketing de Conteúdo Exclusivo",
      "Analytics e Métricas Avançadas",
      "Automação de Marketing Premium",
      "Campanhas Pagas Premium (Google Ads, Facebook Ads)",
      "Inbound Marketing Avançado",
    ],
    commonServices: [
      "Gestão de Redes Sociais Premium",
      "Campanhas de Google Ads Premium",
      "SEO - Otimização para Buscadores Premium",
      "Email Marketing Automation Premium",
      "Criação de Conteúdo Exclusivo",
      "Analytics e Relatórios Avançados",
    ],
    proposalStructure: [
      "Análise de Mercado Premium",
      "Estratégia de Marketing Personalizada",
      "Execução Premium das Campanhas",
      "Monitoramento e Otimização Avançada",
      "Relatórios e Análise Premium",
    ],
    keyTerms: [
      "ROI Premium",
      "CTR Otimizado",
      "CPC Eficiente",
      "Conversão Superior",
      "Engajamento Premium",
      "Alcance Qualificado",
      "Impressões Otimizadas",
      "Lead Premium",
    ],
    primeSpecific: {
      introductionStyle:
        "Foco em marketing premium com estratégias personalizadas e resultados excepcionais",
      aboutUsFocus:
        "Especialistas em marketing premium que combinam estratégia com execução superior",
      specialtiesApproach:
        "Metodologia premium para marketing digital de alto impacto",
      processEmphasis:
        "Processo estratégico detalhado para entrega de resultados premium",
      investmentStrategy:
        "Investimento em marketing premium com retorno superior e crescimento sustentável",
    },
  },

  "Prime - Fotógrafo": {
    ...baseServiceAgents.photography,
    id: "prime-photographer-agent",
    name: "Especialista em Fotografia Prime",
    sector: "Fotografia Profissional",
    systemPrompt: `${baseServiceAgents.photography.systemPrompt}

Metodologia PRIME: Fotografia premium com foco em qualidade artística excepcional, equipamentos de ponta e resultados visuais que superam as expectativas.`,
    expertise: [
      "Fotografia de Eventos Premium",
      "Retratos Artísticos Exclusivos",
      "Fotografia Comercial Premium",
      "Fotografia de Produtos Exclusiva",
      "Fotografia de Casamento Premium",
      "Fotografia de Família Artística",
      "Pós-produção Premium",
      "Iluminação Artística Avançada",
    ],
    commonServices: [
      "Sessão de Fotos Premium",
      "Fotografia de Eventos Exclusiva",
      "Fotografia Comercial Premium",
      "Fotografia de Produtos Exclusiva",
      "Retratos Profissionais Premium",
      "Pós-produção Artística",
    ],
    proposalStructure: [
      "Briefing Premium e Planejamento Detalhado",
      "Sessão Fotográfica Artística",
      "Seleção de Fotos Premium",
      "Pós-produção Exclusiva",
      "Entrega Final Premium",
    ],
    keyTerms: [
      "Sessão Premium",
      "Retrato Artístico",
      "Evento Exclusivo",
      "Pós-produção Premium",
      "Iluminação Artística",
      "Composição Exclusiva",
      "RAW Premium",
      "Edição Artística",
    ],
    primeSpecific: {
      introductionStyle:
        "Foco em fotografia premium com qualidade artística excepcional e equipamentos de ponta",
      aboutUsFocus:
        "Especialistas em fotografia premium que combinam técnica com arte visual superior",
      specialtiesApproach:
        "Metodologia premium para fotografia profissional de alto padrão",
      processEmphasis:
        "Processo artístico detalhado para entrega de fotografia premium com qualidade excepcional",
      investmentStrategy:
        "Investimento em fotografia premium com retorno em memórias visuais únicas",
    },
  },

  "Prime - Médico": {
    ...baseServiceAgents.medical,
    id: "prime-medical-agent",
    name: "Especialista em Serviços Médicos Prime",
    sector: "Saúde e Bem-estar",
    systemPrompt: `${baseServiceAgents.medical.systemPrompt}

Metodologia PRIME: Atendimento médico premium com foco em cuidado personalizado, tecnologia avançada e resultados superiores, garantindo saúde integral e bem-estar excepcional.`,
    expertise: [
      "Consultas Médicas Premium",
      "Exames Laboratoriais Avançados",
      "Procedimentos Premium",
      "Prevenção Avançada",
      "Tratamento Personalizado",
      "Acompanhamento Premium",
      "Emergências Especializadas",
      "Especialidades Premium",
    ],
    commonServices: [
      "Consulta Médica Premium",
      "Exames Laboratoriais Avançados",
      "Procedimentos Premium",
      "Check-up Completo",
      "Acompanhamento Personalizado",
      "Emergências Especializadas",
    ],
    proposalStructure: [
      "Avaliação Inicial Premium",
      "Plano de Tratamento Personalizado",
      "Execução com Tecnologia Avançada",
      "Acompanhamento Premium",
      "Alta com Seguimento",
    ],
    keyTerms: [
      "Consulta Premium",
      "Exame Avançado",
      "Procedimento Premium",
      "Tratamento Personalizado",
      "Prevenção Avançada",
      "Acompanhamento Premium",
      "Alta com Seguimento",
      "Emergência Especializada",
    ],
    primeSpecific: {
      introductionStyle:
        "Foco em atendimento médico premium com cuidado personalizado e tecnologia avançada",
      aboutUsFocus:
        "Especialistas em saúde premium que combinam expertise médica com cuidado personalizado",
      specialtiesApproach:
        "Metodologia premium para serviços médicos de alto padrão",
      processEmphasis:
        "Processo de cuidado detalhado para entrega de saúde premium com resultados superiores",
      investmentStrategy:
        "Investimento em saúde premium com retorno em bem-estar e qualidade de vida",
    },
  },
};

export function getPrimeAgentByService(
  service: ServiceType
): PrimeAgentConfig | null {
  // Handle special case for marketing-digital
  if (service === "marketing-digital") {
    return primeServiceAgents["Prime - Marketing Digital"] || null;
  }

  // Map service types to their Portuguese names in the primeServiceAgents
  const serviceNameMapping: Record<ServiceType, string> = {
    marketing: "Marketing Digital",
    "marketing-digital": "Marketing Digital", // Already handled above
    design: "Designer",
    development: "Desenvolvedor",
    architecture: "Arquiteto",
    photography: "Fotógrafo",
    medical: "Médico",
  };

  const portugueseName = serviceNameMapping[service];
  if (!portugueseName) {
    return null;
  }

  const primeAgentKey = `Prime - ${portugueseName}`;
  return primeServiceAgents[primeAgentKey] || null;
}
