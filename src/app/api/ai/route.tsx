import { NextRequest, NextResponse } from "next/server";
import {
  ProposalWorkflow,
  type ProposalWorkflowData,
} from "#/lib/ai/sequential-workflow";
import { getAgentByService } from "#/modules/ai-generator/agents";

// Service mapping from page IDs to agent IDs
const serviceMapping: Record<string, string> = {
  "marketing-digital": "marketing",
  designer: "design",
  desenvolvedor: "development",
  arquiteto: "architecture",
  fotografo: "photography",
  medicos: "medical",
};

// Extended interface for the page data
interface NepfyAIRequestData {
  selectedService: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  companyInfo?: string;
  selectedPlans?: string[];
  planDetails?: string;
  includeTerms?: boolean;
  includeFAQ?: boolean;
  templateType?: string;
  mainColor?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      selectedService,
      clientName,
      projectName,
      projectDescription,
      companyInfo,
      selectedPlans = [],
      planDetails = "",
      includeTerms = false,
      includeFAQ = false,
      templateType,
      mainColor,
    } = body as NepfyAIRequestData;

    // Validate required fields
    if (
      !selectedService ||
      !clientName ||
      !projectName ||
      !projectDescription
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map page service ID to agent service ID
    const agentServiceId = serviceMapping[selectedService];
    if (!agentServiceId) {
      return NextResponse.json(
        { error: `Service not found: ${selectedService}` },
        { status: 400 }
      );
    }

    // Validate if the service agent exists
    const agent = getAgentByService(agentServiceId);
    if (!agent) {
      return NextResponse.json(
        { error: `Agent not found for service: ${agentServiceId}` },
        { status: 400 }
      );
    }

    // Generate default company info if not provided
    const defaultCompanyInfo =
      companyInfo || generateDefaultCompanyInfo(agentServiceId);

    // Generate default plans if not provided
    const defaultPlans =
      selectedPlans.length > 0
        ? selectedPlans
        : generateDefaultPlans(agentServiceId);

    // Create workflow data object
    const workflowData: ProposalWorkflowData = {
      selectedService: agentServiceId,
      companyInfo: defaultCompanyInfo,
      clientName,
      projectName,
      projectDescription,
      selectedPlans: defaultPlans,
      planDetails: planDetails || generateDefaultPlanDetails(agentServiceId),
      includeTerms,
      includeFAQ,
    };

    // Try the full AI workflow first, fallback to dynamic generation if it fails
    const workflow = new ProposalWorkflow();
    let result;
    let generationType = "ai-workflow";

    try {
      // Attempt full AI workflow with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("AI timeout")), 25000); // 25 second timeout
      });

      const aiPromise = workflow.execute(workflowData);

      result = await Promise.race([aiPromise, timeoutPromise]);
      generationType = "ai-workflow";
    } catch (aiError) {
      console.error("Full AI Workflow Error:", aiError);

      // Fallback to dynamic generation with shorter timeout
      try {
        const dynamicTimeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error("Dynamic generation timeout")),
            15000
          ); // 15 second timeout
        });

        const dynamicPromise = workflow.generateLocalProposal(
          workflowData,
          agent,
          Date.now()
        );

        result = await Promise.race([dynamicPromise, dynamicTimeoutPromise]);
        generationType = "dynamic-generation";
      } catch (dynamicError) {
        console.error("Dynamic Generation Error:", dynamicError);

        // Final fallback to static templates only if AI completely fails
        const mockResult = generateMockProposal(
          agentServiceId,
          agent,
          clientName,
          projectName,
          projectDescription,
          defaultCompanyInfo,
          defaultPlans,
          planDetails || generateDefaultPlanDetails(agentServiceId),
          includeTerms,
          includeFAQ
        );
        result = mockResult;
        generationType = "static-template";
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        pageData: {
          templateType,
          mainColor,
          originalServiceId: selectedService,
        },
      },
      metadata: {
        service: agentServiceId,
        agent: agent.name,
        timestamp: new Date().toISOString(),
        mappedFrom: selectedService,
        generationType,
      },
    });
  } catch (error) {
    console.error("AI Route Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");

    if (service) {
      // Map page service ID to agent service ID
      const agentServiceId = serviceMapping[service] || service;

      // Return specific service agent information
      const agent = getAgentByService(agentServiceId);
      if (!agent) {
        return NextResponse.json(
          { error: `Service not found: ${service}` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          agent,
          availableServices: getAllServices(),
          serviceMapping,
        },
      });
    }

    // Return all available services
    return NextResponse.json({
      success: true,
      data: {
        availableServices: getAllServices(),
        serviceMapping,
        totalServices: Object.keys(getAllServices()).length,
      },
    });
  } catch (error) {
    console.error("AI Route Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper function to get all available services
function getAllServices() {
  return {
    "marketing-digital": "Marketing Digital",
    designer: "Design e Identidade Visual",
    desenvolvedor: "Desenvolvimento de Software",
    arquiteto: "Arquitetura e Design de Espaços",
    fotografo: "Fotografia Profissional",
    medicos: "Área da Saúde",
  };
}

// Helper function to generate default company info based on service
function generateDefaultCompanyInfo(serviceId: string): string {
  const companyTemplates = {
    marketing:
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
    companyTemplates.marketing
  );
}

// Helper function to generate default plans based on service
function generateDefaultPlans(serviceId: string): string[] {
  const planTemplates = {
    marketing: ["basic", "premium"],
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

// Helper function to generate default plan details based on service
function generateDefaultPlanDetails(serviceId: string): string {
  const planDetailsTemplates = {
    marketing:
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

// Mock proposal generator for fallback
function generateMockProposal(
  serviceId: string,
  agent: any,
  clientName: string,
  projectName: string,
  projectDescription: string,
  companyInfo: string,
  selectedPlans: string[],
  planDetails: string,
  includeTerms: boolean,
  includeFAQ: boolean
) {
  const serviceTemplates = {
    marketing: {
      title: `Proposta Marketing Digital - ${projectName}`,
      content: `# Proposta de Marketing Digital

## Apresentação

Olá ${clientName},

É com grande satisfação que apresentamos nossa proposta de marketing digital para o projeto "${projectName}".

## Sobre Nossa Empresa

${companyInfo}

## Entendimento do Projeto

${projectDescription}

## Nossa Abordagem

Desenvolvemos estratégias personalizadas baseadas em dados e resultados mensuráveis. Nossa metodologia inclui:

1. **Análise de Mercado**: Pesquisa completa do segmento e concorrência
2. **Estratégia Digital**: Planejamento focado em resultados
3. **Execução**: Implementação de campanhas otimizadas
4. **Monitoramento**: Acompanhamento contínuo de performance
5. **Otimização**: Ajustes baseados em dados reais

## Serviços Incluídos

${planDetails}

## Resultados Esperados

- Aumento de 150% no tráfego orgânico
- Melhoria de 200% na taxa de conversão
- ROI médio de 300% em campanhas pagas
- Crescimento sustentável da presença digital

## Investimento

**Plano Basic**: R$ 2.500/mês
**Plano Premium**: R$ 4.500/mês

*Pagamento mensal com contrato mínimo de 3 meses*

## Cronograma

- **Semana 1-2**: Análise e planejamento
- **Semana 3-4**: Implementação inicial
- **Mês 2-3**: Otimização e expansão
- **Mês 4+**: Manutenção e crescimento

## Próximos Passos

1. Aprovação da proposta
2. Assinatura do contrato
3. Início do projeto
4. Primeira reunião de alinhamento

Aguardamos seu retorno para iniciarmos esta parceria de sucesso!

Atenciosamente,
Equipe de Marketing Digital`,
      pricing: `## Investimento

**Plano Basic**: R$ 2.500/mês
- Gestão de redes sociais
- Campanhas Google Ads
- Relatórios mensais
- Suporte por email

**Plano Premium**: R$ 4.500/mês
- Tudo do plano Basic
- SEO completo
- Email marketing
- Automação de marketing
- Consultoria estratégica
- Suporte prioritário

*Pagamento mensal com contrato mínimo de 3 meses*`,
      timeline: `## Cronograma de Execução

**Fase 1 - Análise e Planejamento (2 semanas)**
- Análise de mercado e concorrência
- Definição de personas
- Estratégia de conteúdo
- Configuração de ferramentas

**Fase 2 - Implementação (4 semanas)**
- Criação de campanhas
- Otimização de canais
- Implementação de automações
- Primeiros ajustes

**Fase 3 - Otimização (2 meses)**
- Análise de resultados
- Ajustes de campanhas
- Expansão de estratégias
- Relatórios detalhados

**Fase 4 - Crescimento (Contínuo)**
- Manutenção de performance
- Novas estratégias
- Expansão de canais
- Otimização contínua`,
      terms: includeTerms
        ? `## Termos e Condições

1. **Prazo de Execução**: O projeto terá início após a aprovação e pagamento da primeira parcela.

2. **Pagamentos**: Mensais, vencendo no dia 5 de cada mês.

3. **Cancelamento**: Pode ser realizado com 30 dias de antecedência.

4. **Confidencialidade**: Todas as informações serão mantidas em sigilo.

5. **Propriedade Intelectual**: O conteúdo criado permanece propriedade da agência.

6. **Limitação de Responsabilidade**: Não nos responsabilizamos por resultados específicos de vendas.

7. **Alterações**: Mudanças no escopo podem gerar ajustes no valor.

8. **Comunicação**: Reuniões semanais via videoconferência.`
        : "",
      faq: includeFAQ
        ? `## Perguntas Frequentes

**Q: Quanto tempo leva para ver resultados?**
R: Resultados iniciais aparecem em 30-60 dias, mas o crescimento sustentável leva 3-6 meses.

**Q: Posso cancelar a qualquer momento?**
R: Sim, com 30 dias de antecedência conforme contratado.

**Q: Vocês trabalham com empresas de qualquer tamanho?**
R: Sim, adaptamos nossa estratégia para cada tipo de negócio.

**Q: Como medimos o sucesso?**
R: Através de métricas como tráfego, conversões, ROI e crescimento de vendas.

**Q: Oferecem suporte técnico?**
R: Sim, incluído em todos os planos com diferentes níveis de prioridade.`
        : "",
    },
    design: {
      title: `Proposta Design - ${projectName}`,
      content: `# Proposta de Design

## Apresentação

Olá ${clientName},

É com entusiasmo que apresentamos nossa proposta de design para o projeto "${projectName}".

## Sobre Nosso Studio

${companyInfo}

## Entendimento do Projeto

${projectDescription}

## Nossa Metodologia

1. **Briefing**: Entendimento profundo das necessidades
2. **Pesquisa**: Análise de mercado e concorrência
3. **Conceito**: Desenvolvimento de ideias criativas
4. **Criação**: Produção dos elementos visuais
5. **Aplicação**: Implementação em diferentes suportes
6. **Entrega**: Manual de marca e arquivos finais

## Serviços Incluídos

${planDetails}

## Entregáveis

- Logo em diferentes formatos (AI, EPS, PNG, JPG)
- Manual de identidade visual
- Aplicações da marca
- Arquivos de trabalho
- Suporte para implementação

## Investimento

**Plano Logo**: R$ 3.500
**Plano Complete**: R$ 8.500

*Pagamento: 50% na aprovação + 50% na entrega*

## Cronograma

- **Semana 1**: Briefing e pesquisa
- **Semana 2-3**: Desenvolvimento de conceitos
- **Semana 4**: Refinamento e aplicações
- **Semana 5**: Finalização e entrega

Aguardamos seu retorno para criarmos juntos uma identidade visual impactante!`,
      pricing: `## Investimento

**Plano Logo**: R$ 3.500
- Logo principal
- 3 variações do logo
- Arquivos em diferentes formatos
- 3 rodadas de alterações

**Plano Complete**: R$ 8.500
- Tudo do plano Logo
- Manual de identidade visual
- Aplicações em diferentes suportes
- Material gráfico completo
- 5 rodadas de alterações

*Pagamento: 50% na aprovação + 50% na entrega*`,
      timeline: `## Cronograma de Criação

**Fase 1 - Briefing e Pesquisa (1 semana)**
- Reunião de alinhamento
- Pesquisa de mercado
- Análise da concorrência
- Definição de conceitos

**Fase 2 - Desenvolvimento (2 semanas)**
- Criação de conceitos
- Desenvolvimento de logos
- Primeira apresentação
- Feedback e ajustes

**Fase 3 - Refinamento (1 semana)**
- Aplicações da marca
- Manual de identidade
- Segunda apresentação
- Ajustes finais

**Fase 4 - Finalização (1 semana)**
- Preparação de arquivos
- Manual completo
- Entrega final
- Suporte inicial`,
      terms: includeTerms
        ? `## Termos e Condições

1. **Prazo**: 5 semanas para entrega completa.

2. **Pagamento**: 50% na aprovação + 50% na entrega.

3. **Alterações**: Incluídas conforme plano contratado.

4. **Propriedade**: Direitos transferidos após pagamento integral.

5. **Arquivos**: Entregues em formatos editáveis e finais.

6. **Confidencialidade**: Projeto mantido em sigilo.

7. **Cancelamento**: Reembolso proporcional ao trabalho realizado.`
        : "",
      faq: includeFAQ
        ? `## Perguntas Frequentes

**Q: Quantas alterações estão incluídas?**
R: Depende do plano: Logo (3 alterações), Complete (5 alterações).

**Q: Posso usar o logo em qualquer lugar?**
R: Sim, após o pagamento integral você tem total liberdade de uso.

**Q: Vocês fazem aplicações da marca?**
R: Sim, incluídas no plano Complete.

**Q: Como funciona o processo de aprovação?**
R: Apresentamos conceitos, você escolhe e refinamos até a aprovação final.

**Q: Oferecem suporte após a entrega?**
R: Sim, incluído por 30 dias após a entrega final.`
        : "",
    },
  };

  const template =
    serviceTemplates[serviceId as keyof typeof serviceTemplates] ||
    serviceTemplates.marketing;

  return {
    steps: [
      {
        id: "analysis",
        name: "Análise de Requisitos",
        description: "Análise detalhada das necessidades do cliente",
        agent: agent.name,
        input: { clientName, projectName, projectDescription },
        output: "Análise completa realizada com sucesso",
      },
      {
        id: "structure",
        name: "Estruturação da Proposta",
        description: "Definição da estrutura e organização do conteúdo",
        agent: agent.name,
        input: "Análise anterior",
        output: "Estrutura definida com seções organizadas",
      },
      {
        id: "content",
        name: "Geração de Conteúdo",
        description: "Criação do conteúdo principal da proposta",
        agent: agent.name,
        input: "Estrutura definida",
        output: "Conteúdo completo gerado",
      },
    ],
    finalProposal: {
      title: template.title,
      outline: "Estrutura definida pelos agentes anteriores",
      content: template.content,
      pricing: template.pricing,
      timeline: template.timeline,
      terms: template.terms,
      faq: template.faq,
    },
    metadata: {
      totalSteps: 3,
      executionTime: 1500,
      model: "mock-generator",
    },
  };
}
