import Link from "next/link";
import Logo from "#/components/icons/Logo";

interface NavBarProps {
  desktopLogoColor?: string;
  mobileLogoColor?: string;
}

const Navbar: React.FC<NavBarProps> = ({
  desktopLogoColor = "#FAFAFB",
  mobileLogoColor = "#1C1A22",
}) => {
  return (
    <nav className="flex items-center justify-between px-8 h-20 bg-white-neutral-light-200 xl:bg-transparent border-b border-b-(--color-white-neutral-light-300) xl:border-b-0 fixed top-0 left-0 right-0 z-10">
      <Link href="/login">
        <Logo fill={desktopLogoColor} className="hidden xl:block" />
        <Logo fill={mobileLogoColor} className="xl:hidden" />
      </Link>
    </nav>
  );
};

export default Navbar;
