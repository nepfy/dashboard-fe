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
import { ProjectsDataProps } from "#/app/dashboard/propostas/components/ProjectsTable/types";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DashboardProjectViewProps {
  projectsData: ProjectsDataProps[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  error: string | null;
  isInitialLoading: boolean;
  isPaginationLoading: boolean;
  isDuplicating?: boolean;
  statistics: {
    sentProjectsCount: number;
    approvedProjectsCount: number;
  } | null;
  onBulkStatusUpdate?: (projectIds: string[], status: string) => Promise<void>;
  onBulkDuplicate?: (projectIds: string[]) => Promise<void>;
}

const BUTTON_CLASS = `p-3 h-[44px] w-[180px] 
font-medium cursor-pointer rounded-[var(--radius-s)]
flex items-center justify-center gap-1
bg-white-neutral-light-100 border border-white-neutral-light-300`;

export default function DashboardProjectView({
  projectsData,
  pagination,
  onPageChange,
  error,
  isInitialLoading,
  isPaginationLoading,
  isDuplicating = false,
  statistics,
  onBulkStatusUpdate,
  onBulkDuplicate,
}: DashboardProjectViewProps) {
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
    isLoading = false,
  }: {
    title: string;
    count: number;
    value: string;
    icon: React.ReactNode;
    isLoading?: boolean;
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
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ) : (
          <>
            <p className="text-white-neutral-light-900 text-2xl font-medium">
              {count}
            </p>
            <p className="text-white-neutral-light-400 text-sm">
              Previsto: {value}
            </p>
          </>
        )}
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
                count={statistics?.sentProjectsCount || 0}
                value="Não calculado"
                icon={<ArrowUpRight size={20} />}
                isLoading={isInitialLoading}
              />
            </div>

            <div className="pr-4">
              <ProposalCard
                title="Propostas aprovadas"
                count={statistics?.approvedProjectsCount || 0}
                value="Não calculado"
                icon={<CircleCheck size={20} />}
                isLoading={isInitialLoading}
              />
            </div>
          </Slider>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <ProposalCard
            title="Propostas enviadas"
            count={statistics?.sentProjectsCount || 0}
            value="Não calculado"
            icon={<ArrowUpRight size={20} />}
            isLoading={isInitialLoading}
          />

          <ProposalCard
            title="Propostas aprovadas"
            count={statistics?.approvedProjectsCount || 0}
            value="Não calculado"
            icon={<CircleCheck size={20} />}
            isLoading={isInitialLoading}
          />
        </div>
      )}

      <ProjectsView
        projectsData={projectsData}
        pagination={pagination}
        onPageChangeAction={onPageChange}
        error={error}
        isPaginationLoading={isPaginationLoading}
        isDuplicating={isDuplicating}
        onBulkStatusUpdate={onBulkStatusUpdate}
        onBulkDuplicate={onBulkDuplicate}
      />
    </div>
  );
}
