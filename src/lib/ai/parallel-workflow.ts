import assert from "node:assert";
import Together from "together-ai";
import {
  getAgentByServiceAndTemplate,
  type AgentConfig,
} from "#/modules/ai-generator/agents";
import {
  ServiceType,
  TemplateType,
} from "#/modules/ai-generator/agents/base/types";

const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

const client = new Together({ apiKey });

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  agent: string;
  input: ProposalWorkflowData;
  output: string;
}

export interface ProposalWorkflowData {
  selectedService: string;
  companyInfo: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  selectedPlans: string[];
  planDetails: string;
  includeTerms: boolean;
  includeFAQ: boolean;
  templateType?: TemplateType;
  contextHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface WorkflowResult {
  steps: WorkflowStep[];
  finalProposal: {
    title: string;
    outline: string;
    content: string;
    pricing: string;
    timeline: string;
    terms: string;
    faq: string;
  };
  metadata: {
    totalSteps: number;
    executionTime: number;
    model: string;
  };
}

async function runLLM(
  userPrompt: string,
  model: string,
  systemPrompt?: string,
  contextHistory?: Array<{ role: "user" | "assistant"; content: string }>
) {
  const messages: { role: "system" | "user" | "assistant"; content: string }[] =
    [];

  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }

  // Add context history (last 3 messages) if provided
  if (contextHistory && contextHistory.length > 0) {
    const recentContext = contextHistory.slice(-3); // Last 3 messages
    messages.push(...recentContext);
  }

  messages.push({ role: "user", content: userPrompt });

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 0.9,
    frequency_penalty: 0.1,
    presence_penalty: 0.1,
  });

  const content = response.choices[0].message?.content;
  assert(typeof content === "string");
  return content;
}

export class ProposalWorkflow {
  private model = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";
  private steps: WorkflowStep[] = [];

  async execute(data: ProposalWorkflowData): Promise<WorkflowResult> {
    const startTime = Date.now();
    const template = data.templateType || "flash";

    console.log("🚀 Starting ProposalWorkflow execution...");

    const agent = await getAgentByServiceAndTemplate(
      data.selectedService as ServiceType,
      template
    );

    if (!agent) {
      const errorMsg = `Agent not found for service: ${data.selectedService} and template: ${template}`;
      console.error("❌ ProposalWorkflow Error:", errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const result = await this.runParallelGeneration(data, agent);

      const executionTime = Date.now() - startTime;

      console.log(
        "✅ ProposalWorkflow completed successfully in",
        executionTime,
        "ms"
      );
      return {
        steps: this.steps,
        finalProposal: result,
        metadata: {
          totalSteps: this.steps.length,
          executionTime,
          model: this.model,
        },
      };
    } catch (error) {
      console.error("❌ ProposalWorkflow Error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        duration: Date.now() - startTime,
      });
      throw error; // Re-throw to let the route handle fallback
    }
  }

  private async runParallelGeneration(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ) {
    const tasks = [
      {
        id: "content",
        name: "Conteúdo Principal",
        description: "Geração do conteúdo principal da proposta",
        task: () => this.generateContent(data, agent),
      },
      {
        id: "pricing",
        name: "Precificação",
        description: "Geração da seção de investimento e preços",
        task: () => this.generatePricing(data, agent),
      },
      {
        id: "timeline",
        name: "Cronograma",
        description: "Geração do cronograma de execução",
        task: () => this.generateTimeline(data, agent),
      },
    ];

    if (data.includeTerms) {
      tasks.push({
        id: "terms",
        name: "Termos e Condições",
        description: "Geração dos termos e condições",
        task: () => this.generateTerms(data, agent),
      });
    }

    if (data.includeFAQ) {
      tasks.push({
        id: "faq",
        name: "Perguntas Frequentes",
        description: "Geração das perguntas frequentes",
        task: () => this.generateFAQ(data, agent),
      });
    }

    const results = await Promise.allSettled(
      tasks.map(async (task) => {
        try {
          const result = await task.task();
          return { id: task.id, result, success: true };
        } catch (error) {
          console.error(`Task ${task.id} failed:`, error);
          return { id: task.id, result: null, success: false, error };
        }
      })
    );

    const proposalSections: Record<string, string> = {};

    results.forEach((result, index) => {
      const task = tasks[index];

      if (result.status === "fulfilled" && result.value.success) {
        proposalSections[task.id] = result.value.result || "";

        this.steps.push({
          id: task.id,
          name: task.name,
          description: task.description,
          agent: agent.name,
          input: data,
          output: result.value.result || "",
        });
      } else {
        const fallbackResult = this.getFallbackForTask(task.id, data, agent);
        proposalSections[task.id] = fallbackResult;

        this.steps.push({
          id: task.id,
          name: task.name,
          description: `${task.description} (fallback)`,
          agent: agent.name,
          input: data,
          output: fallbackResult,
        });
      }
    });

    return {
      title: `Proposta ${agent.sector} - ${data.projectName}`,
      outline: "Proposta gerada em paralelo com múltiplas seções",
      content:
        proposalSections.content || this.generateFallbackContent(data, agent),
      pricing: proposalSections.pricing || this.generateFallbackPricing(),
      timeline: proposalSections.timeline || this.generateFallbackTimeline(),
      terms:
        proposalSections.terms ||
        (data.includeTerms ? this.generateFallbackTerms() : ""),
      faq:
        proposalSections.faq ||
        (data.includeFAQ ? this.generateFallbackFAQ() : ""),
    };
  }

  private async generateContent(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): Promise<string> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Empresa: ${data.companyInfo}
- Planos: ${data.selectedPlans.join(", ")}

TAREFA: Crie uma proposta comercial profissional e persuasiva que inclua:

1. **Apresentação Personalizada**: Saudação personalizada ao cliente
2. **Sobre a Empresa**: Apresentação da empresa baseada nos dados fornecidos
3. **Entendimento do Projeto**: Demonstração de compreensão das necessidades específicas
4. **Metodologia**: Abordagem especializada para o setor ${agent.sector}
5. **Serviços Incluídos**: Detalhamento dos planos selecionados
6. **Resultados Esperados**: Benefícios específicos para este projeto
7. **Próximos Passos**: Call-to-action claro

Use linguagem profissional, persuasiva e específica do setor ${agent.sector}.
Inclua terminologias técnicas relevantes: ${agent.keyTerms.join(", ")}.
Foque nos resultados e benefícios para o cliente ${data.clientName}.

Formato: Markdown com títulos, listas e formatação profissional.`;

    try {
      const text = await runLLM(
        userPrompt,
        this.model,
        agent.systemPrompt,
        data.contextHistory
      );
      return text;
    } catch (error) {
      console.error("Content Generation Error:", error);
      throw error;
    }
  }

  private async generatePricing(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): Promise<string> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Planos: ${data.selectedPlans.join(", ")}
- Detalhes: ${data.planDetails}
- Modelo de Precificação: ${agent.pricingModel}

TAREFA: Crie uma seção de investimento profissional que inclua:

1. **Estrutura de Preços**: Valores realistas para cada plano
2. **Detalhamento dos Serviços**: O que está incluído em cada plano
3. **Formas de Pagamento**: Condições de pagamento adequadas ao setor
4. **Entregáveis**: O que o cliente receberá
5. **Garantias**: O que está garantido no contrato

Use o modelo de precificação: ${agent.pricingModel}
Considere os serviços comuns do setor: ${agent.commonServices.join(", ")}

Formato: Markdown com seções claras e valores em destaque.`;

    try {
      const text = await runLLM(
        userPrompt,
        this.model,
        agent.systemPrompt,
        data.contextHistory
      );
      return text;
    } catch (error) {
      console.error("Pricing Generation Error:", error);
      throw error;
    }
  }

  private async generateTimeline(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): Promise<string> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Planos: ${data.selectedPlans.join(", ")}
- Complexidade: Baseada na descrição do projeto

TAREFA: Crie um cronograma de execução realista que inclua:

1. **Fases do Projeto**: Divisão lógica em etapas
2. **Duração de Cada Fase**: Prazos realistas
3. **Entregáveis por Fase**: O que será entregue em cada etapa
4. **Marcos Importantes**: Pontos de verificação e aprovação
5. **Considerações Especiais**: Fatores que podem afetar o cronograma

Baseie-se na estrutura típica do setor: ${agent.proposalStructure.join(" → ")}

Formato: Markdown com fases bem definidas e cronograma visual.`;

    try {
      const text = await runLLM(
        userPrompt,
        this.model,
        agent.systemPrompt,
        data.contextHistory
      );
      return text;
    } catch (error) {
      console.error("Timeline Generation Error:", error);
      throw error;
    }
  }

  private async generateTerms(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): Promise<string> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${agent.sector}

TAREFA: Crie termos e condições específicos para ${agent.sector} incluindo:

1. **Prazo de Execução**: Condições de início e conclusão
2. **Pagamentos**: Formas e condições de pagamento
3. **Cancelamento**: Políticas de cancelamento
4. **Confidencialidade**: Proteção de informações
5. **Propriedade Intelectual**: Direitos sobre o trabalho
6. **Limitação de Responsabilidade**: Escopo de responsabilidades
7. **Alterações**: Processo para mudanças no escopo
8. **Comunicação**: Formas de comunicação e reuniões

Use linguagem clara mas juridicamente adequada para ${agent.sector}.
Considere as particularidades legais do setor.

Formato: Markdown com seções numeradas e linguagem clara.`;

    try {
      const text = await runLLM(
        userPrompt,
        this.model,
        agent.systemPrompt,
        data.contextHistory
      );
      return text;
    } catch (error) {
      console.error("Terms Generation Error:", error);
      throw error;
    }
  }

  private async generateFAQ(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): Promise<string> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${agent.sector}

TAREFA: Crie perguntas frequentes relevantes para ${agent.sector} incluindo:

1. **Prazos**: Questões sobre tempo de execução
2. **Pagamentos**: Dúvidas sobre formas de pagamento
3. **Alterações**: Processo de mudanças no projeto
4. **Suporte**: Tipos de suporte oferecido
5. **Resultados**: Expectativas de resultados
6. **Garantias**: O que está garantido
7. **Comunicação**: Como funciona o processo de comunicação

Baseie-se nos serviços comuns: ${agent.commonServices.join(", ")}
Use linguagem clara e direta.

Formato: Markdown com perguntas em negrito e respostas claras.`;

    try {
      const text = await runLLM(
        userPrompt,
        this.model,
        agent.systemPrompt,
        data.contextHistory
      );
      return text;
    } catch (error) {
      console.error("FAQ Generation Error:", error);
      throw error;
    }
  }

  private getFallbackForTask(
    taskId: string,
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): string {
    switch (taskId) {
      case "content":
        return this.generateFallbackContent(data, agent);
      case "pricing":
        return this.generateFallbackPricing();
      case "timeline":
        return this.generateFallbackTimeline();
      case "terms":
        return this.generateFallbackTerms();
      case "faq":
        return this.generateFallbackFAQ();
      default:
        return "Conteúdo não disponível";
    }
  }

  public async generateLocalProposal(
    data: ProposalWorkflowData,
    agent: AgentConfig,
    startTime: number
  ): Promise<WorkflowResult> {
    const executionTime = Date.now() - startTime;

    const proposal = await this.generateDynamicProposalByService(data, agent);

    return {
      steps: [
        {
          id: "dynamic-generation",
          name: "Geração Dinâmica",
          description:
            "Proposta gerada dinamicamente usando prompts especializados",
          agent: agent.name,
          input: data,
          output: "Proposta personalizada gerada com sucesso",
        },
      ],
      finalProposal: proposal,
      metadata: {
        totalSteps: 1,
        executionTime,
        model: "dynamic-template-generator",
      },
    };
  }

  private async generateDynamicProposalByService(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ) {
    const content = await this.generateDynamicContent(data, agent);
    const pricing = await this.generateDynamicPricing(data, agent);
    const timeline = await this.generateDynamicTimeline(data, agent);
    const terms = data.includeTerms
      ? await this.generateDynamicTerms(data, agent)
      : "";
    const faq = data.includeFAQ
      ? await this.generateDynamicFAQ(data, agent)
      : "";

    return {
      title: `Proposta ${agent.sector} - ${data.projectName}`,
      outline: "Estrutura especializada baseada no setor e dados do projeto",
      content,
      pricing,
      timeline,
      terms,
      faq,
    };
  }

  private async generateDynamicContent(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): Promise<string> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Empresa: ${data.companyInfo}
- Planos: ${data.selectedPlans.join(", ")}

TAREFA: Crie uma proposta comercial profissional e persuasiva que inclua:

1. **Apresentação Personalizada**: Saudação personalizada ao cliente
2. **Sobre a Empresa**: Apresentação da empresa baseada nos dados fornecidos
3. **Entendimento do Projeto**: Demonstração de compreensão das necessidades específicas
4. **Metodologia**: Abordagem especializada para o setor ${agent.sector}
5. **Serviços Incluídos**: Detalhamento dos planos selecionados
6. **Resultados Esperados**: Benefícios específicos para este projeto
7. **Próximos Passos**: Call-to-action claro

Use linguagem profissional, persuasiva e específica do setor ${agent.sector}.
Inclua terminologias técnicas relevantes: ${agent.keyTerms.join(", ")}.
Foque nos resultados e benefícios para o cliente ${data.clientName}.

Formato: Markdown com títulos, listas e formatação profissional.`;

    try {
      const text = await runLLM(
        userPrompt,
        this.model,
        agent.systemPrompt,
        data.contextHistory
      );
      return text;
    } catch (error) {
      console.error("Dynamic Content Generation Error:", error);
      return this.generateFallbackContent(data, agent);
    }
  }

  private async generateDynamicPricing(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): Promise<string> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Planos: ${data.selectedPlans.join(", ")}
- Detalhes: ${data.planDetails}
- Modelo de Precificação: ${agent.pricingModel}

TAREFA: Crie uma seção de investimento profissional que inclua:

1. **Estrutura de Preços**: Valores realistas para cada plano
2. **Detalhamento dos Serviços**: O que está incluído em cada plano
3. **Formas de Pagamento**: Condições de pagamento adequadas ao setor
4. **Entregáveis**: O que o cliente receberá
5. **Garantias**: O que está garantido no contrato

Use o modelo de precificação: ${agent.pricingModel}
Considere os serviços comuns do setor: ${agent.commonServices.join(", ")}

Formato: Markdown com seções claras e valores em destaque.`;

    try {
      const text = await runLLM(
        userPrompt,
        this.model,
        agent.systemPrompt,
        data.contextHistory
      );
      return text;
    } catch (error) {
      console.error("Dynamic Pricing Generation Error:", error);
      return this.generateFallbackPricing();
    }
  }

  private async generateDynamicTimeline(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): Promise<string> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Planos: ${data.selectedPlans.join(", ")}
- Complexidade: Baseada na descrição do projeto

TAREFA: Crie um cronograma de execução realista que inclua:

1. **Fases do Projeto**: Divisão lógica em etapas
2. **Duração de Cada Fase**: Prazos realistas
3. **Entregáveis por Fase**: O que será entregue em cada etapa
4. **Marcos Importantes**: Pontos de verificação e aprovação
5. **Considerações Especiais**: Fatores que podem afetar o cronograma

Baseie-se na estrutura típica do setor: ${agent.proposalStructure.join(" → ")}

Formato: Markdown com fases bem definidas e cronograma visual.`;

    try {
      const text = await runLLM(
        userPrompt,
        this.model,
        agent.systemPrompt,
        data.contextHistory
      );
      return text;
    } catch (error) {
      console.error("Dynamic Timeline Generation Error:", error);
      return this.generateFallbackTimeline();
    }
  }

  private async generateDynamicTerms(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): Promise<string> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${agent.sector}

TAREFA: Crie termos e condições específicos para ${agent.sector} incluindo:

1. **Prazo de Execução**: Condições de início e conclusão
2. **Pagamentos**: Formas e condições de pagamento
3. **Cancelamento**: Políticas de cancelamento
4. **Confidencialidade**: Proteção de informações
5. **Propriedade Intelectual**: Direitos sobre o trabalho
6. **Limitação de Responsabilidade**: Escopo de responsabilidades
7. **Alterações**: Processo para mudanças no escopo
8. **Comunicação**: Formas de comunicação e reuniões

Use linguagem clara mas juridicamente adequada para ${agent.sector}.
Considere as particularidades legais do setor.

Formato: Markdown com seções numeradas e linguagem clara.`;

    try {
      const text = await runLLM(
        userPrompt,
        this.model,
        agent.systemPrompt,
        data.contextHistory
      );
      return text;
    } catch (error) {
      console.error("Dynamic Terms Generation Error:", error);
      return this.generateFallbackTerms();
    }
  }

  private async generateDynamicFAQ(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): Promise<string> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${agent.sector}

TAREFA: Crie perguntas frequentes relevantes para ${agent.sector} incluindo:

1. **Prazos**: Questões sobre tempo de execução
2. **Pagamentos**: Dúvidas sobre formas de pagamento
3. **Alterações**: Processo de mudanças no projeto
4. **Suporte**: Tipos de suporte oferecido
5. **Resultados**: Expectativas de resultados
6. **Garantias**: O que está garantido
7. **Comunicação**: Como funciona o processo de comunicação

Baseie-se nos serviços comuns: ${agent.commonServices.join(", ")}
Use linguagem clara e direta.

Formato: Markdown com perguntas em negrito e respostas claras.`;

    try {
      const text = await runLLM(
        userPrompt,
        this.model,
        agent.systemPrompt,
        data.contextHistory
      );
      return text;
    } catch (error) {
      console.error("Dynamic FAQ Generation Error:", error);
      return this.generateFallbackFAQ();
    }
  }

  private generateFallbackContent(
    data: ProposalWorkflowData,
    agent: AgentConfig
  ): string {
    return `# Proposta ${agent.sector} - ${data.projectName}

## Apresentação

Olá ${data.clientName},

É com grande satisfação que apresentamos nossa proposta especializada em ${agent.sector} para o projeto "${data.projectName}".

## Sobre Nossa Empresa

${data.companyInfo}

## Entendimento do Projeto

${data.projectDescription}

## Nossa Abordagem

Desenvolvemos soluções personalizadas baseadas em nossa expertise em ${agent.sector}. Nossa metodologia inclui:

1. **Análise Especializada**: Compreensão profunda das necessidades
2. **Estratégia Customizada**: Planejamento focado em resultados
3. **Execução Profissional**: Implementação com qualidade
4. **Acompanhamento**: Monitoramento contínuo
5. **Otimização**: Ajustes baseados em feedback

## Serviços Incluídos

${data.planDetails}

## Resultados Esperados

- Soluções personalizadas para suas necessidades
- Qualidade profissional garantida
- Suporte especializado durante todo o processo
- Resultados mensuráveis e satisfatórios

## Próximos Passos

1. Aprovação da proposta
2. Assinatura do contrato
3. Início do projeto
4. Primeira reunião de alinhamento

Aguardamos seu retorno para iniciarmos esta parceria de sucesso!

Atenciosamente,
Equipe ${agent.sector}`;
  }

  private generateFallbackPricing(): string {
    return `## Investimento

**Plano Básico**: R$ 2.500
- Serviços essenciais do setor
- Suporte básico
- Entregáveis principais

**Plano Premium**: R$ 4.500
- Todos os serviços do plano básico
- Serviços avançados
- Suporte prioritário
- Entregáveis completos

*Pagamento: 50% na aprovação + 50% na entrega*

## Entregáveis

- Projeto completo conforme especificações
- Documentação técnica
- Suporte pós-entrega
- Garantia de qualidade`;
  }

  private generateFallbackTimeline(): string {
    return `## Cronograma de Execução

**Fase 1 - Planejamento (1 semana)**
- Análise de requisitos
- Definição de estratégia
- Cronograma detalhado

**Fase 2 - Desenvolvimento (2-3 semanas)**
- Execução do projeto
- Acompanhamento contínuo
- Ajustes conforme necessário

**Fase 3 - Finalização (1 semana)**
- Revisão final
- Ajustes finais
- Entrega do projeto

**Fase 4 - Suporte (30 dias)**
- Suporte pós-entrega
- Ajustes necessários
- Garantia de qualidade`;
  }

  private generateFallbackTerms(): string {
    return `## Termos e Condições

1. **Prazo**: O projeto terá início após aprovação e pagamento inicial.

2. **Pagamento**: 50% na aprovação + 50% na entrega.

3. **Alterações**: Mudanças no escopo podem gerar ajustes no valor.

4. **Confidencialidade**: Todas as informações serão mantidas em sigilo.

5. **Propriedade**: Direitos transferidos após pagamento integral.

6. **Cancelamento**: Pode ser realizado com 30 dias de antecedência.

7. **Comunicação**: Reuniões semanais para acompanhamento.`;
  }

  private generateFallbackFAQ(): string {
    return `## Perguntas Frequentes

**Q: Quanto tempo leva para concluir o projeto?**
R: O prazo varia conforme a complexidade, mas geralmente entre 4-6 semanas.

**Q: Posso fazer alterações durante o processo?**
R: Sim, alterações são possíveis e serão avaliadas caso a caso.

**Q: Como funciona o pagamento?**
R: 50% na aprovação da proposta e 50% na entrega final.

**Q: Oferecem suporte após a entrega?**
R: Sim, incluído por 30 dias após a entrega final.

**Q: O que está garantido no contrato?**
R: Qualidade profissional, prazos acordados e suporte durante todo o processo.`;
  }
}
