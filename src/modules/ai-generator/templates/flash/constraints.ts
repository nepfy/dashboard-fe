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

export const flashTemplateConfigV1: TemplateConfig = {
  version: "1.0.0",
  templateType: "flash",
  structure: [
    {
      id: "introduction",
      title: "Introdução",
      description: "Abertura concisa e energética com CTA imediato.",
    },
    {
      id: "aboutUs",
      title: "Sobre Nós",
      description:
        "Resumo direto sobre posicionamento, impacto e diferenciais.",
    },
    {
      id: "team",
      title: "Time",
      description: "Equipe essencial destacada em uma única frase.",
    },
    {
      id: "specialties",
      title: "Especialidades",
      description: "Tópicos enxutos apresentando competências principais.",
    },
    {
      id: "steps",
      title: "Processo",
      description: "Processo compacto com cinco etapas principais.",
    },
    {
      id: "scope",
      title: "Escopo",
      description: "Parágrafo único consolidando o escopo proposto.",
    },
    {
      id: "investment",
      title: "Investimento",
      description: "Planos e entregáveis com foco em agilidade e valor.",
    },
    {
      id: "terms",
      title: "Termos",
      description: "Termos opcionais em formato resumido.",
    },
    {
      id: "faq",
      title: "FAQ",
      description: "Perguntas frequentes para eliminar objeções rapidamente.",
    },
    {
      id: "footer",
      title: "Rodapé",
      description: "CTA objetivo e disclaimer informativo.",
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
            "Frase de impacto com energia e foco em ação."
          ),
          subtitle: withMeta(
            exact(100),
            "subtitle",
            "Subtítulo",
            "Resumo do diferencial em uma frase decisiva."
          ),
          validity: withMeta(
            max(30),
            "validity",
            "Validade",
            "Prazo ou condição de aprovação."
          ),
          buttonText: withMeta(
            max(20),
            "buttonText",
            "Texto do botão",
            "CTA muito curto orientado à ação."
          ),
        },
        collections: {
          services: {
            id: "services",
            label: "Serviços",
            itemType: "string",
            exactItems: 4,
            stringItem: withMeta(
              exact(30),
              "service",
              "Serviço",
              "Entrega ou benefício."
            ),
          },
        },
      },
      "Mensagem inicial direta e orientada a resultado."
    ),
    aboutUs: section(
      {
        id: "aboutUs",
        label: "Sobre Nós",
        fields: {
          title: withMeta(
            exact(155),
            "title",
            "Título",
            "Headline sobre posicionamento e impacto."
          ),
          supportText: withMeta(
            exact(70),
            "supportText",
            "Texto de apoio",
            "Frase curta gerando conexão imediata."
          ),
          subtitle: withMeta(
            exact(250),
            "subtitle",
            "Descrição",
            "Parágrafo mostrando credibilidade e diferenciação."
          ),
        },
      },
      "Apresentação rápida e objetiva."
    ),
    team: section(
      {
        id: "team",
        label: "Equipe",
        fields: {
          title: withMeta(
            exact(55),
            "title",
            "Título",
            "Frase única destacando o time."
          ),
        },
      },
      "Equipe em uma única linha."
    ),
    specialties: section(
      {
        id: "specialties",
        label: "Especialidades",
        fields: {
          title: withMeta(
            exact(140),
            "title",
            "Título",
            "Frase sobre a atuação multidisciplinar."
          ),
        },
        collections: {
          topics: {
            id: "topics",
            label: "Especialidades",
            itemType: "object",
            minItems: 6,
            maxItems: 9,
            fields: {
              title: withMeta(
                exact(50),
                "title",
                "Título",
                "Nome da especialidade."
              ),
              description: withMeta(
                exact(100),
                "description",
                "Descrição",
                "Resumo muito objetivo sobre a entrega."
              ),
            },
          },
        },
      },
      "Especialidades em formato enxuto."
    ),
    steps: section(
      {
        id: "steps",
        label: "Processo",
        fields: {
          introduction: withMeta(
            exact(100),
            "introduction",
            "Introdução",
            "Contexto geral sobre a abordagem."
          ),
          title: withMeta(max(60), "title", "Título", "Título fixo ou curto."),
        },
        collections: {
          topics: {
            id: "topics",
            label: "Etapas",
            itemType: "object",
            exactItems: 5,
            fields: {
              title: withMeta(
                exact(40),
                "title",
                "Nome da etapa",
                "Ação principal da fase."
              ),
              description: withMeta(
                exact(240),
                "description",
                "Descrição",
                "Resumo objetivo dos passos."
              ),
            },
          },
        },
      },
      "Processo reduzido com etapas fixas."
    ),
    scope: section(
      {
        id: "scope",
        label: "Escopo",
        fields: {
          content: withMeta(
            exact(350),
            "content",
            "Texto",
            "Parágrafo único conectando entregas e resultados."
          ),
        },
      },
      "Escopo sintético."
    ),
    investment: section(
      {
        id: "investment",
        label: "Investimento",
        fields: {
          title: withMeta(
            exact(85),
            "title",
            "Título",
            "Título com foco em ROI rápido."
          ),
        },
        collections: {
          deliverables: {
            id: "deliverables",
            label: "Entregáveis",
            itemType: "object",
            fields: {
              title: withMeta(
                max(30),
                "title",
                "Título",
                "Nome curto do entregável."
              ),
              description: withMeta(
                max(330),
                "description",
                "Descrição",
                "Resumo objetivo do entregável."
              ),
            },
          },
          plans: {
            id: "plans",
            label: "Planos",
            itemType: "object",
            maxItems: 3,
            fields: {
              title: withMeta(
                exact(20),
                "title",
                "Nome do plano",
                "Nome curto do plano."
              ),
              description: withMeta(
                exact(95),
                "description",
                "Descrição",
                "Descrição breve do plano."
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
                minItems: 3,
                maxItems: 6,
                stringItem: withMeta(
                  max(45),
                  "topic",
                  "Item",
                  "Entrega ou benefício objetivo."
                ),
              },
            },
          },
        },
      },
      "Investimento com foco em tomada de decisão rápida."
    ),
    terms: section(
      {
        id: "terms",
        label: "Termos",
        collections: {
          items: {
            id: "items",
            label: "Termos",
            itemType: "object",
            fields: {
              title: withMeta(exact(30), "title", "Título", "Nome do termo."),
              description: withMeta(
                exact(180),
                "description",
                "Descrição",
                "Detalhamento objetivo do termo."
              ),
            },
          },
        },
      },
      "Termos opcionais tecidos de forma direta."
    ),
    faq: section(
      {
        id: "faq",
        label: "FAQ",
        collections: {
          items: {
            id: "items",
            label: "Perguntas",
            itemType: "object",
            exactItems: 10,
            fields: {
              question: withMeta(
                exact(100),
                "question",
                "Pergunta",
                "Pergunta alinhada às principais objeções."
              ),
              answer: withMeta(
                exact(300),
                "answer",
                "Resposta",
                "Resposta objetiva e tranquilizadora."
              ),
            },
          },
        },
      },
      "FAQ com resposta rápida."
    ),
    footer: section(
      {
        id: "footer",
        label: "Rodapé",
        fields: {
          callToAction: withMeta(
            exact(35),
            "callToAction",
            "Call to Action",
            "Frase rápida incentivando ação."
          ),
          disclaimer: withMeta(
            exact(330),
            "disclaimer",
            "Disclaimer",
            "Informações complementares ou reforço de valor."
          ),
        },
      },
      "Encerramento e reforço de confiança."
    ),
  },
};
