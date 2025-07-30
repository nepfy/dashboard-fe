import type { CompleteProjectData } from "#/app/project/types/project";

export interface IntroSectionProps {
  data?: CompleteProjectData;
}

export interface MobileMenuProps {
  ctaButtonTitle?: string;
  color?: string | null;
}

export interface HeaderProps {
  companyName?: string | null;
  companyEmail?: string | null;
  ctaButtonTitle?: string | null;
  color?: string | null;
  isSmallHeight?: boolean;
  userPhone?: string | null;
}

export interface HeroProps {
  pageTitle?: string | null;
  createdAt?: Date | string | null;
  isSmallHeight?: boolean;
}

export interface ServicesFooterProps {
  services?: string | null;
  pageSubtitle?: string | null;
  ctaButtonTitle?: string | null;
  isSmallHeight?: boolean;
}
