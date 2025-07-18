export default function HamburgerButton() {
  return (
    <div className="lg:hidden hamburger-container">
      <label
        htmlFor="hamburger-toggle"
        className="flex flex-col justify-center items-center w-6 h-6 space-y-1 cursor-pointer z-50"
        aria-label="Toggle menu"
      >
        <span className="w-6 h-0.5 bg-white-neutral-light-100 transition-all duration-300 hamburger-line-1" />
        <span className="w-6 h-0.5 bg-white-neutral-light-100 transition-all duration-300 hamburger-line-2" />
        <span className="w-6 h-0.5 bg-white-neutral-light-100 transition-all duration-300 hamburger-line-3" />
      </label>
    </div>
  );
}
