import { FlashAgentConfig, ServiceType } from "../base/types";
import { baseServiceAgents } from "../base/base-agents";

export const flashServiceAgents: Record<string, FlashAgentConfig> = {
  "Flash - Arquiteto": {
    ...baseServiceAgents.architecture,
    id: "flash-architect-agent",
    name: "Especialista em Arquitetura Flash",
    sector: "Arquitetura e Design de Espaços",
    systemPrompt: `${baseServiceAgents.architecture.systemPrompt}

Metodologia FLASH: Foco em projetos rápidos, eficientes e de alta qualidade, com entrega em tempo recorde sem comprometer a excelência arquitetônica.`,
    expertise: [
      "Projeto Arquitetônico Flash",
      "Design de Interiores Rápido",
      "Sustentabilidade Aplicada",
      "Aprovações e Licenças",
      "Acompanhamento de Obra",
      "Paisagismo Integrado",
      "Arquitetura Comercial",
      "Reformas e Ampliações",
    ],
    commonServices: [
      "Projeto Arquitetônico Flash",
      "Design de Interiores Express",
      "Projeto de Reforma Rápida",
      "Regularização de Imóveis",
      "Acompanhamento de Obra",
      "Projeto de Paisagismo",
    ],
    proposalStructure: [
      "Briefing Rápido",
      "Conceito Arquitetônico",
      "Desenvolvimento Executivo",
      "Aprovações Legais",
      "Acompanhamento Flash",
    ],
    keyTerms: [
      "Projeto Flash",
      "Planta Executiva",
      "Elevação",
      "Corte",
      "Aprovação Rápida",
      "Execução Eficiente",
      "m²",
    ],
    flashSpecific: {
      introductionStyle:
        "Foco em transformação rápida de espaços com excelência arquitetônica",
      aboutUsFocus:
        "Especialistas em projetos arquitetônicos que combinam velocidade FLASH com qualidade superior",
      specialtiesApproach:
        "Metodologia ágil para projetos arquitetônicos de alto padrão",
      processEmphasis:
        "Processo otimizado para entrega rápida sem comprometer qualidade",
      investmentStrategy:
        "Investimento em projetos arquitetônicos com retorno imediato em valor do imóvel",
    },
  },

  "Flash - Desenvolvedor": {
    ...baseServiceAgents.development,
    id: "flash-developer-agent",
    name: "Especialista em Desenvolvimento Flash",
    sector: "Desenvolvimento de Software",
    systemPrompt: `${baseServiceAgents.development.systemPrompt}

Metodologia FLASH: Desenvolvimento ágil e eficiente com foco em MVP rápido, iterações contínuas e entrega de valor imediato.`,
    expertise: [
      "Desenvolvimento Web Flash",
      "Aplicativos Mobile Rápidos",
      "APIs e Integrações",
      "E-commerce Express",
      "Sistemas Customizados",
      "DevOps Otimizado",
      "Banco de Dados",
      "Segurança Aplicada",
    ],
    commonServices: [
      "Desenvolvimento de Website Flash",
      "Aplicativo Mobile Express",
      "Sistema E-commerce Flash",
      "API e Integrações Rápidas",
      "Sistema Customizado Express",
      "Manutenção e Suporte Flash",
    ],
    proposalStructure: [
      "Análise de Requisitos Rápida",
      "Arquitetura Flash e Planejamento",
      "Desenvolvimento Ágil",
      "Testes e Qualidade",
      "Deploy e Suporte Flash",
    ],
    keyTerms: [
      "MVP Flash",
      "API Rápida",
      "Frontend Flash",
      "Backend Eficiente",
      "Database Otimizado",
      "Cloud Flash",
      "Responsivo Rápido",
      "SEO Flash",
    ],
    flashSpecific: {
      introductionStyle:
        "Foco em desenvolvimento rápido com arquitetura eficiente e entrega ágil",
      aboutUsFocus:
        "Especialistas em desenvolvimento flash que combinam velocidade com qualidade",
      specialtiesApproach:
        "Metodologia ágil para desenvolvimento de software rápido e eficiente",
      processEmphasis:
        "Processo otimizado para entrega rápida sem comprometer qualidade",
      investmentStrategy:
        "Investimento em desenvolvimento flash com retorno rápido em funcionalidade",
    },
  },

  "Flash - Designer": {
    ...baseServiceAgents.design,
    id: "flash-designer-agent",
    name: "Especialista em Design Flash",
    sector: "Design Gráfico e Digital",
    systemPrompt: `${baseServiceAgents.design.systemPrompt}

Metodologia FLASH: Design rápido e eficiente com foco em criatividade ágil, soluções visuais impactantes e entrega expressa sem comprometer a qualidade.`,
    expertise: [
      "Design Gráfico Flash",
      "Identidade Visual Rápida",
      "UI/UX Design Express",
      "Design de Embalagens Flash",
      "Material Promocional Rápido",
      "Social Media Design Express",
      "Web Design Flash",
      "Ilustração Digital Rápida",
    ],
    commonServices: [
      "Criação de Logo Flash",
      "Identidade Visual Completa Express",
      "Design de Website Flash",
      "Material Promocional Rápido",
      "Social Media Design Express",
      "Design de Embalagens Flash",
    ],
    proposalStructure: [
      "Briefing Flash e Pesquisa Rápida",
      "Conceito Criativo Express",
      "Desenvolvimento Visual Flash",
      "Refinamento e Aprovação Rápida",
      "Entrega Final Express",
    ],
    keyTerms: [
      "Identidade Visual Flash",
      "Logo Rápido",
      "Branding Express",
      "UI/UX Flash",
      "Mockup Rápido",
      "Wireframe Express",
      "Paleta de Cores Flash",
      "Tipografia Rápida",
    ],
    flashSpecific: {
      introductionStyle:
        "Foco em design rápido com criatividade ágil e entrega expressa",
      aboutUsFocus:
        "Especialistas em design flash que combinam velocidade com criatividade",
      specialtiesApproach:
        "Metodologia ágil para design gráfico e digital rápido e eficiente",
      processEmphasis:
        "Processo criativo otimizado para entrega rápida sem comprometer qualidade",
      investmentStrategy:
        "Investimento em design flash com retorno rápido em identidade visual",
    },
  },

  "Flash - Marketing": {
    ...baseServiceAgents.marketing,
    id: "flash-marketing-agent",
    name: "Especialista em Marketing Digital Flash",
    sector: "Marketing Digital",
    systemPrompt: `${baseServiceAgents.marketing.systemPrompt}

Metodologia FLASH: Marketing ágil e eficiente com foco em resultados rápidos, estratégias otimizadas e ROI imediato, garantindo crescimento acelerado e presença digital impactante.`,
    expertise: [
      "SEO e SEM Flash",
      "Redes Sociais Rápidas",
      "Email Marketing Express",
      "Marketing de Conteúdo Flash",
      "Analytics e Métricas Rápidas",
      "Automação de Marketing Express",
      "Campanhas Pagas Flash (Google Ads, Facebook Ads)",
      "Inbound Marketing Rápido",
    ],
    commonServices: [
      "Gestão de Redes Sociais Flash",
      "Campanhas de Google Ads Express",
      "SEO - Otimização para Buscadores Flash",
      "Email Marketing Automation Express",
      "Criação de Conteúdo Rápida",
      "Analytics e Relatórios Flash",
    ],
    proposalStructure: [
      "Análise de Mercado Flash",
      "Estratégia de Marketing Rápida",
      "Execução Flash das Campanhas",
      "Monitoramento e Otimização Rápida",
      "Relatórios e Análise Flash",
    ],
    keyTerms: [
      "ROI Flash",
      "CTR Rápido",
      "CPC Eficiente",
      "Conversão Rápida",
      "Engajamento Flash",
      "Alcance Rápido",
      "Impressões Flash",
      "Lead Express",
    ],
    flashSpecific: {
      introductionStyle:
        "Foco em marketing rápido com estratégias ágeis e resultados imediatos",
      aboutUsFocus:
        "Especialistas em marketing flash que combinam velocidade com estratégia",
      specialtiesApproach:
        "Metodologia ágil para marketing digital de impacto rápido",
      processEmphasis:
        "Processo estratégico otimizado para entrega rápida de resultados",
      investmentStrategy:
        "Investimento em marketing flash com retorno rápido e crescimento acelerado",
    },
  },

  "Flash - Fotógrafo": {
    ...baseServiceAgents.photography,
    id: "flash-photographer-agent",
    name: "Especialista em Fotografia Flash",
    sector: "Fotografia Profissional",
    systemPrompt: `${baseServiceAgents.photography.systemPrompt}

Metodologia FLASH: Fotografia rápida e eficiente com foco em qualidade profissional, equipamentos otimizados e resultados visuais impactantes em tempo recorde.`,
    expertise: [
      "Fotografia de Eventos Flash",
      "Retratos Rápidos",
      "Fotografia Comercial Express",
      "Fotografia de Produtos Flash",
      "Fotografia de Casamento Rápida",
      "Fotografia de Família Express",
      "Pós-produção Flash",
      "Iluminação Rápida",
    ],
    commonServices: [
      "Sessão de Fotos Flash",
      "Fotografia de Eventos Express",
      "Fotografia Comercial Rápida",
      "Fotografia de Produtos Flash",
      "Retratos Profissionais Express",
      "Pós-produção Rápida",
    ],
    proposalStructure: [
      "Briefing Flash e Planejamento Rápido",
      "Sessão Fotográfica Express",
      "Seleção de Fotos Flash",
      "Pós-produção Rápida",
      "Entrega Final Express",
    ],
    keyTerms: [
      "Sessão Flash",
      "Retrato Rápido",
      "Evento Express",
      "Pós-produção Flash",
      "Iluminação Rápida",
      "Composição Express",
      "RAW Flash",
      "Edição Rápida",
    ],
    flashSpecific: {
      introductionStyle:
        "Foco em fotografia rápida com qualidade profissional e entrega expressa",
      aboutUsFocus:
        "Especialistas em fotografia flash que combinam velocidade com qualidade",
      specialtiesApproach:
        "Metodologia ágil para fotografia profissional rápida e eficiente",
      processEmphasis:
        "Processo fotográfico otimizado para entrega rápida sem comprometer qualidade",
      investmentStrategy:
        "Investimento em fotografia flash com retorno rápido em memórias visuais",
    },
  },

  "Flash - Médico": {
    ...baseServiceAgents.medical,
    id: "flash-medical-agent",
    name: "Especialista em Serviços Médicos Flash",
    sector: "Saúde e Bem-estar",
    systemPrompt: `${baseServiceAgents.medical.systemPrompt}

Metodologia FLASH: Atendimento médico rápido e eficiente com foco em cuidado ágil, tecnologia otimizada e resultados imediatos, garantindo saúde integral e bem-estar rápido.`,
    expertise: [
      "Consultas Médicas Flash",
      "Exames Laboratoriais Rápidos",
      "Procedimentos Express",
      "Prevenção Rápida",
      "Tratamento Ágil",
      "Acompanhamento Flash",
      "Emergências Rápidas",
      "Especialidades Express",
    ],
    commonServices: [
      "Consulta Médica Flash",
      "Exames Laboratoriais Rápidos",
      "Procedimentos Express",
      "Check-up Rápido",
      "Acompanhamento Flash",
      "Emergências Rápidas",
    ],
    proposalStructure: [
      "Avaliação Inicial Flash",
      "Plano de Tratamento Rápido",
      "Execução com Tecnologia Otimizada",
      "Acompanhamento Flash",
      "Alta Rápida",
    ],
    keyTerms: [
      "Consulta Flash",
      "Exame Rápido",
      "Procedimento Express",
      "Tratamento Ágil",
      "Prevenção Rápida",
      "Acompanhamento Flash",
      "Alta Rápida",
      "Emergência Express",
    ],
    flashSpecific: {
      introductionStyle:
        "Foco em atendimento médico rápido com cuidado ágil e tecnologia otimizada",
      aboutUsFocus:
        "Especialistas em saúde flash que combinam velocidade com expertise médica",
      specialtiesApproach:
        "Metodologia ágil para serviços médicos rápidos e eficientes",
      processEmphasis:
        "Processo de cuidado otimizado para entrega rápida de resultados",
      investmentStrategy:
        "Investimento em saúde flash com retorno rápido em bem-estar",
    },
  },
};

export function getFlashAgentByService(
  service: ServiceType
): FlashAgentConfig | null {
  const flashAgentKey = `Flash - ${
    service.charAt(0).toUpperCase() + service.slice(1)
  }`;
  return flashServiceAgents[flashAgentKey] || null;
}
