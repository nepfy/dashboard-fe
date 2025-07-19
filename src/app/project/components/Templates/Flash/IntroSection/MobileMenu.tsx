import { useState } from "react";
import { X } from "lucide-react";

interface MobileMenuProps {
  ctaButtonTitle?: string | null;
}

const MOBILE_MENU_ITEMS = [
  "Sobre nós",
  "Time",
  "Especialização",
  "Nossos resultados",
  "Clientes",
  "Processo",
  "Depoimentos",
  "Investimento",
  "Entregas",
  "Planos",
  "Termos e Condições",
  "Perguntas Frequentes",
];

const ctaButtonClasses =
  "font-semibold text-xs text-white-neutral-light-100 bg-black rounded-full";

const mobileButtonStyle = {
  borderRight: "1px solid",
  borderImageSource: `linear-gradient(0deg, #000000, #000000), radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`,
  borderImageSlice: 1,
};

export default function MobileMenu({ ctaButtonTitle }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1 cursor-pointer z-50"
        aria-label="Toggle menu"
      >
        <span
          className={`w-8 h-[1px] bg-white-neutral-light-100 transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`w-8 h-[1px] bg-white-neutral-light-100 transition-all duration-300 mb-2 mt-1 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`w-8 h-[1px] bg-white-neutral-light-100 transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-[#4F21A1] z-[9999] overflow-y-auto transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`flex flex-col h-full min-h-screen transition-all duration-500 ease-in-out transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end w-full py-4 px-4 flex-shrink-0">
            <button
              onClick={closeMenu}
              className="cursor-pointer hover:bg-white/10 rounded-full transition-colors mt-5 p-1"
              aria-label="Close menu"
            >
              <X
                className="text-white-neutral-light-100"
                size={32}
                absoluteStrokeWidth={true}
                strokeWidth={1}
              />
            </button>
          </div>

          <div className="flex flex-col items-center space-y-3 px-4 pb-4 flex-1">
            {MOBILE_MENU_ITEMS.map((item) => (
              <p
                key={item}
                className="font-semibold text-lg text-white-neutral-light-100 text-center"
              >
                {item}
              </p>
            ))}

            <div className="mt-auto pt-4">
              <button
                className={`${ctaButtonClasses} p-6`}
                style={mobileButtonStyle}
              >
                {ctaButtonTitle}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
