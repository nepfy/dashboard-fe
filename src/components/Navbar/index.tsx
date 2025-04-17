import Logo from "#/components/icons/Logo";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-8 h-20 bg-white-neutral-light-200 xl:bg-transparent border-b border-b-(--color-white-neutral-light-300) xl:border-b-0 fixed top-0 left-0 right-0 z-10">
      <Logo fill="#FAFAFB" className="hidden xl:block" />
      <Logo fill="#1C1A22" className="xl:hidden" />
    </nav>
  );
};

export default Navbar;
