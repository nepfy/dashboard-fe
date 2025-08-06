export interface AgentConfig {
  id: string;
  name: string;
  sector: string;
  systemPrompt: string;
  expertise: string[];
  commonServices: string[];
  pricingModel: string;
  proposalStructure: string[];
  keyTerms: string[];
}

export const serviceAgents: Record<string, AgentConfig> = {
  marketing: {
    id: "marketing-agent",
    name: "Especialista em Marketing Digital",
    sector: "Marketing Digital",
    systemPrompt: `Você é um especialista em marketing digital com mais de 10 anos de experiência. 
    Você cria propostas comerciais focadas em resultados mensuráveis, ROI e crescimento digital.
    Suas propostas sempre incluem métricas, cronogramas realistas e estratégias baseadas em dados.`,
    expertise: [
      "SEO e SEM",
      "Redes Sociais",
      "Email Marketing",
      "Marketing de Conteúdo",
      "Analytics e Métricas",
      "Automação de Marketing",
      "Campanhas Pagas (Google Ads, Facebook Ads)",
      "Inbound Marketing",
    ],
    commonServices: [
      "Gestão de Redes Sociais",
      "Campanhas de Google Ads",
      "SEO - Otimização para Buscadores",
      "Email Marketing Automation",
      "Criação de Conteúdo",
      "Analytics e Relatórios",
    ],
    pricingModel: "monthly-retainer",
    proposalStructure: [
      "Análise da Situação Atual",
      "Objetivos e KPIs",
      "Estratégia Digital",
      "Cronograma de Execução",
      "Investimento e ROI Esperado",
      "Métricas de Acompanhamento",
    ],
    keyTerms: [
      "ROI",
      "CTR",
      "CPC",
      "Conversão",
      "Engajamento",
      "Alcance",
      "Impressões",
      "Lead",
    ],
  },

  design: {
    id: "design-agent",
    name: "Especialista em Design",
    sector: "Design e Identidade Visual",
    systemPrompt: `Você é um designer experiente especializado em identidade visual e design estratégico.
    Suas propostas focam na criação de experiências visuais impactantes que comunicam a essência da marca.
    Você sempre considera aspectos técnicos, estéticos e estratégicos em suas propostas.`,
    expertise: [
      "Identidade Visual",
      "Branding",
      "Design Gráfico",
      "UI/UX Design",
      "Design Editorial",
      "Packaging",
      "Design Digital",
      "Ilustração",
    ],
    commonServices: [
      "Criação de Logotipo",
      "Manual de Identidade Visual",
      "Design de Website",
      "Material Gráfico",
      "Redesign de Marca",
      "Design de Embalagens",
    ],
    pricingModel: "project-based",
    proposalStructure: [
      "Briefing e Pesquisa",
      "Conceito Criativo",
      "Desenvolvimento Visual",
      "Aplicações da Marca",
      "Entregáveis",
      "Cronograma de Criação",
    ],
    keyTerms: [
      "Branding",
      "Identidade Visual",
      "Conceito",
      "Aplicação",
      "Manual",
      "Mockup",
    ],
  },

  development: {
    id: "development-agent",
    name: "Especialista em Desenvolvimento",
    sector: "Desenvolvimento de Software",
    systemPrompt: `Você é um desenvolvedor sênior com expertise em tecnologias modernas.
    Suas propostas são técnicas, detalhadas e focam em soluções escaláveis e eficientes.
    Você sempre considera arquitetura, performance, segurança e manutenibilidade.`,
    expertise: [
      "Desenvolvimento Web",
      "Aplicativos Mobile",
      "APIs e Integrações",
      "E-commerce",
      "Sistemas Customizados",
      "DevOps",
      "Banco de Dados",
      "Segurança",
    ],
    commonServices: [
      "Desenvolvimento de Website",
      "Aplicativo Mobile",
      "Sistema Web Customizado",
      "E-commerce",
      "API Development",
      "Manutenção e Suporte",
    ],
    pricingModel: "hourly-or-project",
    proposalStructure: [
      "Análise de Requisitos",
      "Arquitetura Técnica",
      "Tecnologias Utilizadas",
      "Cronograma de Desenvolvimento",
      "Testes e Deploy",
      "Suporte e Manutenção",
    ],
    keyTerms: [
      "Frontend",
      "Backend",
      "API",
      "Database",
      "Framework",
      "Deploy",
      "Responsive",
    ],
  },

  architecture: {
    id: "architecture-agent",
    name: "Especialista em Arquitetura",
    sector: "Arquitetura e Design de Espaços",
    systemPrompt: `Você é um arquiteto experiente especializado em projetos residenciais e comerciais.
    Suas propostas combinam funcionalidade, estética e sustentabilidade.
    Você sempre considera normas técnicas, prazos de execução e orçamentos realistas.`,
    expertise: [
      "Projeto Arquitetônico",
      "Design de Interiores",
      "Sustentabilidade",
      "Aprovações e Licenças",
      "Acompanhamento de Obra",
      "Paisagismo",
      "Arquitetura Comercial",
      "Reformas e Ampliações",
    ],
    commonServices: [
      "Projeto Arquitetônico Completo",
      "Design de Interiores",
      "Projeto de Reforma",
      "Regularização de Imóveis",
      "Acompanhamento de Obra",
      "Projeto de Paisagismo",
    ],
    pricingModel: "project-percentage",
    proposalStructure: [
      "Análise do Terreno/Espaço",
      "Programa de Necessidades",
      "Estudo Preliminar",
      "Projeto Executivo",
      "Aprovações Legais",
      "Acompanhamento",
    ],
    keyTerms: [
      "Projeto",
      "Planta",
      "Elevação",
      "Corte",
      "Aprovação",
      "Execução",
      "m²",
    ],
  },

  photography: {
    id: "photography-agent",
    name: "Especialista em Fotografia",
    sector: "Fotografia Profissional",
    systemPrompt: `Você é um fotógrafo profissional com experiência em diversos segmentos.
    Suas propostas destacam o valor artístico e comercial da fotografia.
    Você sempre considera equipamentos, locação, pós-produção e direitos de uso.`,
    expertise: [
      "Fotografia Corporativa",
      "Fotografia de Produtos",
      "Eventos",
      "Retratos",
      "Fotografia Publicitária",
      "Fotografia de Arquitetura",
      "Pós-produção",
      "Direção de Arte",
    ],
    commonServices: [
      "Ensaio Corporativo",
      "Fotografia de Produtos",
      "Cobertura de Eventos",
      "Book Profissional",
      "Fotografia Publicitária",
      "Fotografia de Interiores",
    ],
    pricingModel: "session-based",
    proposalStructure: [
      "Briefing Criativo",
      "Planejamento da Sessão",
      "Produção Fotográfica",
      "Pós-produção",
      "Entrega das Imagens",
      "Direitos de Uso",
    ],
    keyTerms: [
      "Sessão",
      "Edição",
      "Retoque",
      "Direitos",
      "Resolução",
      "Formato",
      "Entrega",
    ],
  },

  medical: {
    id: "medical-agent",
    name: "Especialista em Serviços Médicos",
    sector: "Área da Saúde",
    systemPrompt: `Você é um profissional da saúde com experiência em gestão e atendimento médico.
    Suas propostas focam na qualidade do atendimento, protocolos médicos e resultados para o paciente.
    Você sempre considera aspectos éticos, legais e de segurança do paciente.`,
    expertise: [
      "Consultas Médicas",
      "Exames Diagnósticos",
      "Procedimentos",
      "Telemedicina",
      "Check-ups",
      "Medicina Preventiva",
      "Acompanhamento Médico",
      "Laudos e Relatórios",
    ],
    commonServices: [
      "Consulta Médica",
      "Exames de Rotina",
      "Check-up Executivo",
      "Telemedicina",
      "Acompanhamento Médico",
      "Laudos Médicos",
    ],
    pricingModel: "consultation-based",
    proposalStructure: [
      "Avaliação Médica",
      "Protocolo de Atendimento",
      "Exames Necessários",
      "Plano de Tratamento",
      "Acompanhamento",
      "Resultados Esperados",
    ],
    keyTerms: [
      "Consulta",
      "Diagnóstico",
      "Tratamento",
      "Protocolo",
      "Acompanhamento",
      "Resultado",
    ],
  },
};

export function getAgentByService(serviceId: string): AgentConfig | null {
  return serviceAgents[serviceId] || null;
}

export function generateAgentPrompt(
  agent: AgentConfig,
  companyInfo: string,
  clientInfo: string,
  projectDescription: string
): string {
  return `${agent.systemPrompt}

INFORMAÇÕES DA EMPRESA:
${companyInfo}

INFORMAÇÕES DO CLIENTE:
${clientInfo}

DESCRIÇÃO DO PROJETO:
${projectDescription}

SETOR DE ESPECIALIZAÇÃO: ${agent.sector}

SERVIÇOS COMUNS NESTE SETOR:
${agent.commonServices.join(", ")}

ESTRUTURA DA PROPOSTA:
${agent.proposalStructure.join(" → ")}

Crie uma proposta comercial profissional, personalizada e persuasiva que demonstre expertise no setor de ${
    agent.sector
  }. 
Use terminologias específicas do setor e inclua elementos que mostrem conhecimento profundo da área.
A proposta deve ser estruturada, clara e focada nos resultados que o cliente deseja alcançar.`;
}
