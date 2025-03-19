import Logo from "#/components/icons/Logo";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-8 h-20 border-b border-b-(--color-white-neutral-light-300) sm:border-b-0 absolute top-0 left-0 right-0 z-10">
      <Logo fill="#1C1A22" />
    </nav>
  );
};

export default Navbar;
