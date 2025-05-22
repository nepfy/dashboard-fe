import Link from "next/link";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useUserAccount } from "#/hooks/useUserAccount";

import ContractIcon from "#/components/icons/ContractIcon";
import FileIcon from "#/components/icons/FileIcon";
import CalculatorIcon from "#/components/icons/CalculatorIcon";

const BUTTON_CLASS = `p-3 h-[44px] w-full sm:w-[180px] 
font-medium cursor-pointer rounded-[var(--radius-s)]
flex items-center justify-between sm:justify-center sm:gap-1
bg-white-neutral-light-100 border border-white-neutral-light-300`;

const tutorialsList = [
  {
    id: 1,
    title: "Introdução a Nepfy",
    category: "Fundamentos",
  },
  {
    id: 2,
    title: "Criando Propostas",
    category: "Fundamentos",
  },
  {
    id: 3,
    title: "Definindo Preços",
    category: "Fundamentos",
  },
  {
    id: 4,
    title: "Gerando Contratos",
    category: "Fundamentos",
  },
  {
    id: 5,
    title: "Alterando Propostas",
    category: "Fundamentos",
  },
  {
    id: 6,
    title: "Dicas e Truques",
    category: "Fundamentos",
  },
];

export default function DashboardStartProjectView() {
  const { userData } = useUserAccount();

  // Slider settings
  const sliderSettings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.2,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <div>
      <h2 className="text-white-neutral-light-800 text-2xl font-medium">
        Pronto para criar propostas incríveis, {`${userData?.firstName}`}? 🚀
      </h2>

      <div className="my-4 rounded-2xs lootie-bg w-full h-[400px] sm:h-[300px] p-6 flex flex-col justify-between gap-4">
        <p className="text-white-neutral-light-100 text-2xl font-medium max-w-[390px]">
          Inicie sua jornada, crie propostas, defina preços e feche contratos
          com facilidade.
        </p>

        <div className="w-full flex items-center justify-end gap-2 flex-wrap">
          <Link href="/gerador-de-contratos" className={BUTTON_CLASS}>
            <ContractIcon width="24" height="24" />
            Gerar Contratos
          </Link>
          <Link href="/gerador-de-propostas" className={BUTTON_CLASS}>
            <FileIcon width="24" height="24" />
            Criar Propostas
          </Link>
          <Link href="/dashboard/calculadora" className={BUTTON_CLASS}>
            <CalculatorIcon width="24" height="24" />
            Calcular Projeto
          </Link>
        </div>
      </div>

      <div>
        <p className="text-white-neutral-light-900 text-lg font-semibold mb-5">
          Tutoriais
        </p>

        <div className="slider-container relative w-full">
          <Slider {...sliderSettings}>
            {tutorialsList.map((tutorial) => (
              <div key={tutorial.id} className="px-2">
                <div className="w-full h-[140px] bg-primary-light-300 rounded-[12px] p-4 cursor-pointer text-white-neutral-light-200">
                  {tutorial.title}
                </div>
                <p className="text-white-neutral-light-900 font-medium text-sm p-2">
                  {tutorial.title}
                  <span className="font-normal block">{tutorial.category}</span>
                </p>
              </div>
            ))}
          </Slider>
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-white-neutral-light-200 to-transparent" />
        </div>
      </div>
    </div>
  );
}
