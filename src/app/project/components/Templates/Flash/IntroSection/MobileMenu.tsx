import { useState } from "react";
import { X } from "lucide-react";

interface MobileMenuProps {
  ctaButtonTitle?: string | null;
  color?: string | null;
}

const MOBILE_MENU_ITEMS = [
  { label: "Sobre nós", id: "business" },
  { label: "Time", id: "team" },
  { label: "Especialização", id: "expertise" },
  { label: "Nossos resultados", id: "results" },
  { label: "Clientes", id: "clients" },
  { label: "Processo", id: "process" },
  { label: "Depoimentos", id: "testimonial" },
  { label: "Investimento", id: "investment" },
  { label: "Entregas", id: "deliveries" },
  { label: "Planos", id: "plans" },
  { label: "Termos e Condições", id: "terms" },
  { label: "Perguntas Frequentes", id: "faq" },
];

export default function MobileMenu({ ctaButtonTitle, color }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const targetPosition = element.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 2500; // 2.5 seconds for slower scroll
      let start: number | null = null;

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutCubic(
          timeElapsed,
          startPosition,
          distance,
          duration
        );
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };

      requestAnimationFrame(animation);
    }
    closeMenu();
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1 cursor-pointer z-[99999]"
        aria-label="Toggle menu"
      >
        <span
          className={`w-8 h-[1px] bg-white-neutral-light-100 transition-all duration-300`}
        />
        <span
          className={`w-8 h-[1px] bg-white-neutral-light-100 transition-all duration-300 mb-2 mt-1`}
        />
        <span
          className={`w-8 h-[1px] bg-white-neutral-light-100 transition-all duration-300`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[9999] overflow-y-auto transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          backgroundColor: color || "#000000",
        }}
      >
        <div className="flex justify-end w-full pt-10 pr-6">
          <button
            onClick={closeMenu}
            className="cursor-pointer hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X
              className="text-white-neutral-light-100"
              size={42}
              absoluteStrokeWidth={true}
              strokeWidth={1}
            />
          </button>
        </div>
        <div
          className={`flex flex-col justify-start items-center h-full transition-all duration-500 ease-in-out transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col justify-center items-center space-y-3 pb-4">
            {MOBILE_MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-semibold text-lg text-white-neutral-light-100 text-center hover:text-white/80 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}

            <div className="mt-auto pt-4">
              <button className="font-semibold text-xs text-white-neutral-light-100 bg-black rounded-full px-6 py-4">
                {ctaButtonTitle}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
