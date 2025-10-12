import DiamondIcon from "./iconsList/DiamondIcon";
import CircleIcon from "./iconsList/CircleIcon";
import BubblesIcon from "./iconsList/BubblesIcon";
import ClockIcon from "./iconsList/ClockIcon";
import GearIcon from "./iconsList/GearIcon";
import HexagonalIcon from "./iconsList/HexagonalIcon";
import SwitchIcon from "./iconsList/SwitchIcon";
import ThunderIcon from "./iconsList/ThunderIcon";
import GlobeIcon from "./iconsList/GlobeIcon";
import BellIcon from "./iconsList/BellIcon";
import BulbIcon from "./iconsList/BulbIcon";
import StarIcon from "./iconsList/StarIcon";
import HeartIcon from "./iconsList/HeartIcon";
import AwardIcon from "./iconsList/AwardIcon";
import CrownIcon from "./iconsList/CrownIcon";
import KeyIcon from "./iconsList/KeyIcon";
import EyeIcon from "./iconsList/EyeIcon";
import FolderIcon from "./iconsList/FolderIcon";
import PlayIcon from "./iconsList/PlayIcon";
import CubeIcon from "./iconsList/CubeIcon";

interface FlashExpertiseProps {
  hideSection: boolean;
  title: string;
  topics: Array<{
    id: string;
    expertiseId: string;
    title: string;
    description: string;
    hideTitleField: boolean;
    hideDescription: boolean;
    sortOrder: number;
    icon?: string; // Make this optional
  }>;
}

const iconMap = {
  DiamondIcon: <DiamondIcon fill="#ffffff" />,
  CircleIcon: <CircleIcon fill="#ffffff" />,
  BubblesIcon: <BubblesIcon fill="#ffffff" />,
  ClockIcon: <ClockIcon fill="#ffffff" />,
  GearIcon: <GearIcon fill="#ffffff" />,
  HexagonalIcon: <HexagonalIcon fill="#ffffff" />,
  SwitchIcon: <SwitchIcon fill="#ffffff" />,
  ThunderIcon: <ThunderIcon fill="#ffffff" />,
  GlobeIcon: <GlobeIcon fill="#ffffff" />,
  BellIcon: <BellIcon fill="#ffffff" />,
  BulbIcon: <BulbIcon fill="#ffffff" />,
  StarIcon: <StarIcon fill="#ffffff" />,
  HeartIcon: <HeartIcon fill="#ffffff" />,
  AwardIcon: <AwardIcon fill="#ffffff" />,
  CrownIcon: <CrownIcon fill="#ffffff" />,
  KeyIcon: <KeyIcon fill="#ffffff" />,
  EyeIcon: <EyeIcon fill="#ffffff" />,
  FolderIcon: <FolderIcon fill="#ffffff" />,
  PlayIcon: <PlayIcon fill="#ffffff" />,
  CubeIcon: <CubeIcon fill="#ffffff" />,
};

const topicsField = [
  {
    id: "1",
    expertiseId: "1",
    title: "Identidade visual médica",
    description:
      "Marcas exclusivas que transmitem credibilidade, confiança e reforçam seu posicionamento.",
    hideTitleField: false,
    hideDescription: false,
    sortOrder: 1,
    icon: "DiamondIcon",
  },
  {
    id: "2",
    expertiseId: "2",
    title: "Branding estratégico",
    description:
      "Posicionamento visual que conecta, atrai e fideliza pacientes, aumentando valor percebido.",
    hideTitleField: false,
    hideDescription: false,
    sortOrder: 1,
    icon: "CircleIcon",
  },
  {
    id: "3",
    expertiseId: "3",
    title: "Design para redes sociais",
    description:
      "Posts e artes que ampliam alcance, geram interação e fortalecem a presença digital.",
    hideTitleField: false,
    hideDescription: false,
    sortOrder: 1,
    icon: "BubblesIcon",
  },
  {
    id: "4",
    expertiseId: "4",
    title: "Direção de arte",
    description:
      "Visual consistente e impactante que comunica autoridade e diferencia sua marca no mercado.",
    hideTitleField: false,
    hideDescription: false,
    sortOrder: 1,
    icon: "BubblesIcon",
  },
  {
    id: "5",
    expertiseId: "5",
    title: "Design editorial",
    description:
      "Materiais impressos que educam, encantam e consolidam sua imagem como referência na área.",
    hideTitleField: false,
    hideDescription: false,
    sortOrder: 1,
    icon: "BubblesIcon",
  },
  {
    id: "6",
    expertiseId: "6",
    title: "Prototipagem visual",
    description:
      "Layouts funcionais que antecipam resultados e otimizam aprovações em cada etapa do projeto.",
    hideTitleField: false,
    hideDescription: false,
    sortOrder: 1,
    icon: "BubblesIcon",
  },
];

export default function FlashExpertise({
  hideSection,
  title,
  topics,
}: FlashExpertiseProps) {
  console.log(topics);

  const renderIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap];
  };

  return (
    <div className="bg-black overflow-hidden">
      {!hideSection && (
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 xl:px-0 pt-7 xl:pt-0">
          <div className="flex items-end pt-24 pl-5 lg:pl-10 border-l border-l-[#A0A0A0] max-w-[1100px] mb-16 lg:mb-43 mx-auto">
            <p className="text-[18px] lg:text-[48px] text-[#E6E6E6] h-full">
              <span className="font-bold block sm:inline">
                Nossas Especializações.
              </span>
              {title ||
                "Transformamos sua presença visual em ferramenta de crescimento, atraindo pacientes e aumentando receita com design estratégico."}
            </p>
          </div>

          <div className="flex flex-wrap justify-between gap-6 max-w-[1100px] mx-auto pb-32">
            {topicsField?.map((topic) => (
              <div
                key={topic.expertiseId}
                className="w-[260px]  text-white-neutral-light-100 text-[15px]"
              >
                <div className="text-white mb-2">
                  {typeof topic.icon === "string"
                    ? renderIcon(topic.icon)
                    : topic.icon}
                </div>
                {!topic.hideTitleField && (
                  <p className="font-semibold py-3">{topic.title}</p>
                )}
                {!topic.hideDescription && <p>{topic.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
