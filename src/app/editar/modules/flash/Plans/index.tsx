import Checkbox from "#/components/icons/Checkbox";
import StarIcon from "./StarIcon";
import { formatCurrencyDisplayNoCents } from "#/helpers/formatCurrency";

interface FlashPlansProps {
  hideSection: boolean;

  list: Array<{
    id: string;
    plansSectionId: string;
    title: string;
    description: string;
    price: string;
    planPeriod: string;
    buttonTitle: string;
    hideTitleField: boolean;
    hideDescription: boolean;
    hidePrice: boolean;
    hidePlanPeriod: boolean;
    hideButtonTitle: boolean;
    sortOrder: number;
    isTheBest: boolean;
    includedItems: Array<{
      id: string;
      planId: string;
      description: string;
      hideDescription: boolean;
      sortOrder: number;
    }>;
  }>;
}

const plansField = [
  {
    id: "1",
    title: "Essencial",
    description: "Identidade visual completa para iniciar sua nova fase.",
    price: "1500",
    planPeriod: "Mensal",
    isTheBest: false,
    buttonTitle: "Fechar plano",
    hideTitleField: false,
    hideDescription: false,
    hidePrice: false,
    hidePlanPeriod: false,
    hideButtonTitle: false,
    sortOrder: 1,
    includedItems: [
      {
        id: "1",
        description: "Logotipo exclusivo",
        hideDescription: false,
        sortOrder: 1,
      },
      {
        id: "2",
        description: "Tipografia personalizada",
        hideDescription: false,
        sortOrder: 2,
      },
      {
        id: "3",
        description: "Manual da marca avançado",
        hideDescription: false,
        sortOrder: 3,
      },
      {
        id: "4",
        description: "Campanha de lançamento visual",
        hideDescription: false,
        sortOrder: 4,
      },
    ],
  },
  {
    id: "2",
    title: "Professional",
    description: "Branding completo para posicionar e atrair pacientes.",
    price: "20500",
    planPeriod: "Anual",
    buttonTitle: "Fechar plano",
    hideTitleField: false,
    hideDescription: false,
    hidePrice: false,
    hidePlanPeriod: false,
    hideButtonTitle: false,
    sortOrder: 2,
    isTheBest: true,
    includedItems: [
      {
        id: "1",
        description: "Tudo do plano Essencial",
        hideDescription: false,
        sortOrder: 1,
      },
      {
        id: "2",
        description: "Campanha de lançamento visual",
        hideDescription: false,
        sortOrder: 2,
      },
      {
        id: "3",
        description: "Manual da marca avançado",
        hideDescription: false,
        sortOrder: 3,
      },
      {
        id: "4",
        description: "Campanha de lançamento visual",
        hideDescription: false,
        sortOrder: 4,
      },
      {
        id: "5",
        description: "Campanha de lançamento visual",
        hideDescription: false,
        sortOrder: 4,
      },
      {
        id: "6",
        description: "Campanha de lançamento visual",
        hideDescription: false,
        sortOrder: 4,
      },
    ],
  },
  {
    id: "3",
    title: "Premium Growth",
    description: "Solução completa e estratégica para expansão da clínica.",
    price: "100000",
    planPeriod: "Único",
    buttonTitle: "Fechar plano",
    hideTitleField: false,
    hideDescription: false,
    hidePrice: false,
    hidePlanPeriod: false,
    hideButtonTitle: false,
    sortOrder: 3,
    isTheBest: false,
    includedItems: [
      {
        id: "1",
        description: "Tudo do plano Professional",
        hideDescription: false,
        sortOrder: 1,
      },
      {
        id: "2",
        description: "Campanha de lançamento visual",
        hideDescription: false,
        sortOrder: 2,
      },
      {
        id: "3",
        description: "Manual da marca avançado",
        hideDescription: false,
        sortOrder: 3,
      },
      {
        id: "4",
        description: "Campanha de lançamento visual",
        hideDescription: false,
        sortOrder: 4,
      },
    ],
  },
];

export default function FlashPlans({ hideSection, list }: FlashPlansProps) {
  console.log(list);
  return (
    <div className="bg-black relative overflow-hidden">
      {!hideSection && (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-41 pt-10 lg:pt-22 pb-23 xl:pb-36 relative z-10">
          <div className="flex flex-wrap gap-6">
            {plansField?.map((item) => (
              <div
                key={item.id}
                className="w-full md:w-[310px] min-h-[600px] flex flex-col my-10 lg:my-0 relative"
              >
                {item.isTheBest && (
                  <div
                    className="absolute top-[-44px] left-0 w-[145px] h-[37px] flex items-center justify-center rounded-[4px] gap-2"
                    style={{
                      background:
                        "radial-gradient(125.86% 306.44% at 7.59% 24.32%, #000000 0%, #200D42 0.01%, #4F21A1 41.86%, #A46EDB 81.78%)",
                    }}
                  >
                    <StarIcon />
                    <p className="text-[#E6E6E6] text-[14px] font-semibold">
                      Melhor Oferta
                    </p>
                  </div>
                )}
                <div
                  className="rounded-[4px] p-6"
                  style={{
                    background: item.isTheBest
                      ? "radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)"
                      : "#111111",
                  }}
                >
                  {!item.hideTitleField && (
                    <p className="text-[#E6E6E6] text-[24px] font-bold">
                      {item.title}
                    </p>
                  )}
                  {!item.hideDescription && (
                    <p className="text-[#E6E6E6]/30 text-sm mb-4">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-baseline gap-4">
                    {!item.hidePrice && (
                      <p className="text-[#E6E6E6] text-[32px] font-medium">
                        {formatCurrencyDisplayNoCents(item.price)}
                      </p>
                    )}
                    {!item.hidePlanPeriod && (
                      <p className="text-[#E6E6E6]">/{item.planPeriod}</p>
                    )}
                  </div>
                </div>

                <div className="flex-grow">
                  <p className="text-[#E6E6E6] text-[12px] font-semibold mb-4 uppercase px-6 mt-8">
                    Incluso:
                  </p>
                  {item.includedItems?.map((includedItem) => (
                    <div
                      key={includedItem.id}
                      className="flex items-center gap-2 px-6 py-2"
                    >
                      <span className="w-4 h-4 flex items-start justify-center">
                        <Checkbox fill="rgba(230, 230, 230, 0.7)" />
                      </span>
                      {!includedItem.hideDescription && (
                        <p className="text-[#E6E6E6]/70 text-sm">
                          {includedItem.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {!item.hideButtonTitle && (
                  <button
                    className={`w-full py-4 rounded-full mt-8 font-semibold ${
                      item.isTheBest
                        ? "text-[#121212] bg-[#FBFBFB]"
                        : "text-[#FBFBFB] bg-[#121212]"
                    }`}
                  >
                    {item.buttonTitle}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
