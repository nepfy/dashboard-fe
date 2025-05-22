import Link from "next/link";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import FileIcon from "#/components/icons/FileIcon";
import ProjectsView from "./components/ProjectView";

import { useUserAccount } from "#/hooks/useUserAccount";

const BUTTON_CLASS = `p-3 h-[44px] w-[180px] 
font-medium cursor-pointer rounded-[var(--radius-s)]
flex items-center justify-center gap-1
bg-white-neutral-light-100 border border-white-neutral-light-300`;

export default function DashboardProjectView() {
  const { userData } = useUserAccount();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const sliderSettings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1.1,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
  };

  const ProposalCard = ({
    title,
    count,
    value,
    icon,
  }: {
    title: string;
    count: number;
    value: string;
    icon: React.ReactNode;
  }) => (
    <div className="bg-white-neutral-light-100 rounded-2xs p-6 h-[170px] border border-white-neutral-light-300 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-white-neutral-light-900 font-medium">{title}</p>
        <Link href="/dashboard/propostas">
          <div className="border border-white-neutral-light-300 bg-white-neutral-light-200 rounded-[10px] w-[32px] h-[32px] flex items-center justify-center">
            {icon}
          </div>
        </Link>
      </div>

      <div>
        <p className="text-white-neutral-light-900 text-2xl font-medium">
          {count}
        </p>
        <p className="text-white-neutral-light-400 text-sm">
          Previsto: {value}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-white-neutral-light-800 text-2xl font-medium">
        Olá, {`${userData?.firstName}`}!
      </h2>
      <p className="text-white-neutral-light-500 font-sm">
        Visão geral do seu pipeline de venda
      </p>

      <div className="my-4 rounded-2xs lootie-bg w-full h-[300px] p-6 flex flex-col justify-between gap-4">
        <p className="text-white-neutral-light-100 text-2xl font-medium max-w-[390px]">
          Gere uma proposta completa e visualmente impactante
        </p>

        <div className="w-full flex items-center justify-start gap-2 flex-wrap">
          <Link href="/gerador-de-propostas" className={BUTTON_CLASS}>
            <FileIcon width="24" height="24" />
            Criar Propostas
          </Link>
        </div>
      </div>

      {isMobile ? (
        <div className="slider-container relative w-full mt-4">
          <Slider {...sliderSettings}>
            <div className="pr-4">
              <ProposalCard
                title="Propostas enviadas"
                count={25}
                value="R$ 2.500,00"
                icon={<ArrowUpRight size={20} />}
              />
            </div>

            <div className="pr-4">
              <ProposalCard
                title="Propostas aprovadas"
                count={25}
                value="R$ 2.500,00"
                icon={<CircleCheck size={20} />}
              />
            </div>
          </Slider>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <ProposalCard
            title="Propostas enviadas"
            count={25}
            value="R$ 2.500,00"
            icon={<ArrowUpRight size={20} />}
          />

          <ProposalCard
            title="Propostas aprovadas"
            count={25}
            value="R$ 2.500,00"
            icon={<CircleCheck size={20} />}
          />
        </div>
      )}

      <ProjectsView />
    </div>
  );
}
