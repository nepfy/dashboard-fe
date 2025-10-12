import CloseIcon from "#/components/icons/CloseIcon";
import Logo from "#/components/icons/Logo";
import MenuIcon from "#/components/icons/MenuIcon";

interface MobileNavigationProps {
  isMobileMenuOpen: boolean;
  onToggleMenu: () => void;
}

export default function MobileNavigation({
  isMobileMenuOpen,
  onToggleMenu,
}: MobileNavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 sm:hidden px-7 py-3 border-b border-b-white-neutral-light-300 bg-white-neutral-light-200 flex items-center justify-between h-[53px]">
      <Logo fill="#1C1A22" />

      <button
        onClick={onToggleMenu}
        className="flex items-center justify-center button-inner cursor-pointer"
      >
        {isMobileMenuOpen ? (
          <CloseIcon width="18" height="18" fill="#1C1A22" />
        ) : (
          <MenuIcon width="26" height="26" fill="#1C1A22" />
        )}
      </button>
    </nav>
  );
}
