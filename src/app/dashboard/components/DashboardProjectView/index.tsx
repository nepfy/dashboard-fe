import Link from "next/link";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Sparkle from "#/components/icons/Sparkle";
import Stars from "#/components/icons/Stars";
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
  onStatusUpdate?: (projectId: string, status: string) => Promise<void>;
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
  onStatusUpdate,
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
    <div className="bg-white-neutral-light-100 rounded-2xs border-white-neutral-light-300 flex h-[170px] flex-col justify-between border p-6">
      <div className="flex items-center justify-between">
        <p className="text-white-neutral-light-900 font-medium">{title}</p>
        <Link href="/dashboard/propostas">
          <div className="border-white-neutral-light-300 bg-white-neutral-light-200 flex h-[32px] w-[32px] items-center justify-center rounded-[10px] border">
            {icon}
          </div>
        </Link>
      </div>

      <div>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="mb-2 h-8 w-16 rounded bg-gray-200"></div>
            <div className="h-4 w-24 rounded bg-gray-200"></div>
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
    <div className="h-full">
      <h2 className="text-white-neutral-light-800 text-2xl font-medium">
        Olá, {`${userData?.firstName}`}!
      </h2>
      <p className="text-white-neutral-light-500 font-sm">
        Visão geral do seu pipeline de venda
      </p>

      <div className="rounded-2xs bg-primary-light-300 relative my-4 flex h-[220px] w-full flex-col justify-between gap-4 p-6">
        <p className="text-white-neutral-light-100 max-w-[390px] text-2xl font-medium">
          Gere uma proposta <br /> completa e visualmente
          <br /> impactante
        </p>

        <div className="flex w-full flex-wrap items-center justify-start gap-2">
          <Link href="/gerar-proposta" className={BUTTON_CLASS}>
            <Sparkle width="18" height="18" fill="#1C1A22" />
            Criar Propostas
          </Link>
        </div>

        <Stars className="absolute top-0 right-0" />
      </div>

      {isMobile ? (
        <div className="slider-container relative mt-4 w-full">
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
        <div className="mt-4 grid grid-cols-2 gap-4">
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
        onStatusUpdate={onStatusUpdate}
        onBulkDuplicate={onBulkDuplicate}
      />
    </div>
  );
}
