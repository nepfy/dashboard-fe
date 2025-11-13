import {
  TemplateConfig,
  TemplateFieldConstraint,
  TemplateSectionConfig,
} from "../../agents/base/template-constraints";

const exact = (limit: number): TemplateFieldConstraint => ({
  id: "",
  limit,
  mode: "exact",
});

const max = (limit: number): TemplateFieldConstraint => ({
  id: "",
  limit,
  mode: "max",
});

function withMeta(
  constraint: TemplateFieldConstraint,
  id: string,
  label: string,
  description?: string
): TemplateFieldConstraint {
  return {
    ...constraint,
    id,
    label,
    description,
  };
}

function section(
  sectionConfig: TemplateSectionConfig,
  description?: string
): TemplateSectionConfig {
  return description
    ? {
        ...sectionConfig,
        description,
      }
    : sectionConfig;
}

export const primeTemplateConfigV1: TemplateConfig = {
  version: "1.0.0",
  templateType: "prime",
  structure: [
    {
      id: "introduction",
      title: "Introdução",
      description: "Abertura impactante com CTA e benefícios-chave.",
    },
    {
      id: "aboutUs",
      title: "Sobre Nós",
      description:
        "Apresentação institucional com foco em diferenciais premium.",
    },
    {
      id: "team",
      title: "Equipe",
      description:
        "Equipe dedicada com papéis e especialidades complementares.",
    },
    {
      id: "specialties",
      title: "Especialidades",
      description:
        "Competências principais estruturadas em tópicos detalhados.",
    },
    {
      id: "steps",
      title: "Processo",
      description: "Metodologia prime com etapas claras e orientadas a valor.",
    },
    {
      id: "scope",
      title: "Escopo",
      description: "Resumo consolidado do escopo do projeto.",
    },
    {
      id: "investment",
      title: "Investimento",
      description: "Planos, entregáveis e valores estruturados.",
    },
    {
      id: "terms",
      title: "Termos e Condições",
      description: "Condições contratuais opcionais.",
    },
    {
      id: "faq",
      title: "FAQ",
      description: "Perguntas frequentes para reduzir objeções.",
    },
    {
      id: "footer",
      title: "Rodapé",
      description: "Call to action final e dados de contato.",
    },
  ],
  sections: {
    introduction: section(
      {
        id: "introduction",
        label: "Introdução",
        fields: {
          title: withMeta(
            exact(60),
            "title",
            "Título",
            "Frase imperativa, inclusiva e direta."
          ),
          subtitle: withMeta(
            exact(100),
            "subtitle",
            "Subtítulo",
            "Benefício principal com foco em transformação e lucro."
          ),
          validity: withMeta(
            max(30),
            "validity",
            "Validade",
            "Texto curto indicando prazo de validade."
          ),
          buttonText: withMeta(
            max(25),
            "buttonText",
            "Texto do Botão",
            "CTA concisa orientada à ação."
          ),
        },
        collections: {
          services: {
            id: "services",
            label: "Serviços em destaque",
            itemType: "string",
            exactItems: 4,
            stringItem: withMeta(
              exact(30),
              "service",
              "Serviço",
              "Descrição curta do serviço/diferencial."
            ),
          },
        },
      },
      "Apresentação inicial com benefícios e CTA."
    ),
    aboutUs: section(
      {
        id: "aboutUs",
        label: "Sobre Nós",
        fields: {
          title: withMeta(
            exact(155),
            "title",
            "Título principal",
            "Frase premium destacando posicionamento e valor."
          ),
          supportText: withMeta(
            exact(70),
            "supportText",
            "Texto de apoio",
            "Frase curta que gera proximidade e confiança."
          ),
          subtitle: withMeta(
            exact(250),
            "subtitle",
            "Descrição",
            "Parágrafo sobre metodologia, diferenciais e impacto gerado."
          ),
        },
      },
      "Contexto institucional detalhado."
    ),
    team: section(
      {
        id: "team",
        label: "Equipe",
        fields: {
          title: withMeta(
            exact(60),
            "title",
            "Título",
            "Headline sobre atuação colaborativa."
          ),
          subtitle: withMeta(
            exact(120),
            "subtitle",
            "Subtítulo",
            "Descrição sobre senioridade e abordagem da equipe."
          ),
        },
      },
      "Apresenta a equipe responsável pela entrega."
    ),
    specialties: section(
      {
        id: "specialties",
        label: "Especialidades",
        fields: {
          title: withMeta(
            exact(180),
            "title",
            "Título",
            "Frase destacando expertise combinada."
          ),
        },
        collections: {
          topics: {
            id: "topics",
            label: "Especialidades",
            itemType: "object",
            exactItems: 9,
            fields: {
              title: withMeta(
                exact(60),
                "title",
                "Título",
                "Nome da especialidade."
              ),
              description: withMeta(
                exact(140),
                "description",
                "Descrição",
                "Detalhe sobre como a especialidade gera valor."
              ),
            },
          },
        },
      },
      "Lista estruturada de áreas de atuação."
    ),
    steps: section(
      {
        id: "steps",
        label: "Processo",
        fields: {
          introduction: withMeta(
            exact(120),
            "introduction",
            "Introdução",
            "Resumo do fluxo de trabalho prime."
          ),
          title: withMeta(
            max(80),
            "title",
            "Título",
            "Headline da etapa (permite texto fixo)."
          ),
        },
        collections: {
          topics: {
            id: "topics",
            label: "Etapas",
            itemType: "object",
            exactItems: 6,
            fields: {
              title: withMeta(
                exact(45),
                "title",
                "Nome da etapa",
                "Título curto com ação principal."
              ),
              description: withMeta(
                exact(260),
                "description",
                "Descrição",
                "Explica atividades, entregas e diferenciais da fase."
              ),
            },
          },
        },
      },
      "Passo a passo detalhado do processo prime."
    ),
    scope: section(
      {
        id: "scope",
        label: "Escopo",
        fields: {
          content: withMeta(
            exact(400),
            "content",
            "Texto",
            "Parágrafo consolidando escopo e entregas principais."
          ),
        },
      },
      "Escopo textual enxuto e objetivo."
    ),
    investment: section(
      {
        id: "investment",
        label: "Investimento",
        fields: {
          title: withMeta(
            exact(95),
            "title",
            "Título",
            "Frase sobre visão estratégica do investimento."
          ),
        },
        collections: {
          deliverables: {
            id: "deliverables",
            label: "Entregáveis",
            itemType: "object",
            fields: {
              title: withMeta(
                exact(35),
                "title",
                "Título",
                "Nome do entregável."
              ),
              description: withMeta(
                exact(350),
                "description",
                "Descrição",
                "Detalhamento do entregável principal."
              ),
            },
          },
          plans: {
            id: "plans",
            label: "Planos",
            itemType: "object",
            exactItems: 3,
            fields: {
              title: withMeta(
                exact(25),
                "title",
                "Nome do plano",
                "Nome curto do plano."
              ),
              description: withMeta(
                exact(110),
                "description",
                "Descrição",
                "Explica cobertura e benefícios do plano."
              ),
              value: withMeta(
                max(11),
                "value",
                "Valor",
                "Valor no formato R$X.XXX."
              ),
            },
            collections: {
              topics: {
                id: "topics",
                label: "Itens incluídos",
                itemType: "string",
                minItems: 4,
                maxItems: 6,
                stringItem: withMeta(
                  max(50),
                  "topic",
                  "Item",
                  "Benefício ou entrega adicional."
                ),
              },
            },
          },
        },
      },
      "Planos com entregáveis e diferenciais."
    ),
    terms: section(
      {
        id: "terms",
        label: "Termos e Condições",
        collections: {
          items: {
            id: "items",
            label: "Termos",
            itemType: "object",
            fields: {
              title: withMeta(exact(35), "title", "Título", "Título do termo."),
              description: withMeta(
                exact(200),
                "description",
                "Descrição",
                "Conteúdo do termo."
              ),
            },
          },
        },
      },
      "Termos contratuais (opcional)."
    ),
    faq: section(
      {
        id: "faq",
        label: "FAQ",
        collections: {
          items: {
            id: "items",
            label: "Perguntas frequentes",
            itemType: "object",
            exactItems: 8,
            fields: {
              question: withMeta(
                exact(120),
                "question",
                "Pergunta",
                "Pergunta recorrente do cliente."
              ),
              answer: withMeta(
                exact(320),
                "answer",
                "Resposta",
                "Resposta detalhada e orientada a valor."
              ),
            },
          },
        },
      },
      "Perguntas e respostas estratégicas."
    ),
    footer: section(
      {
        id: "footer",
        label: "Rodapé",
        fields: {
          callToAction: withMeta(
            exact(60),
            "callToAction",
            "Call to Action",
            "Frase final incentivando fechamento."
          ),
          contactInfo: withMeta(
            exact(150),
            "contactInfo",
            "Contato",
            "Informações de contato em frase única."
          ),
        },
      },
      "Encerramento com CTA e contato."
    ),
  },
};
