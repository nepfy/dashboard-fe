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

export default function MobileMenu({ ctaButtonTitle }: MobileMenuProps) {
  const mobileButtonStyle = {
    borderRight: "1px solid",
    borderImageSource: `linear-gradient(0deg, #000000, #000000), radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`,
    borderImageSlice: 1,
  };

  return (
    <div className="mobile-menu-overlay fixed inset-0 bg-[#4F21A1] backdrop-opacity-1 z-100 opacity-0 invisible transition-all duration-300 overflow-hidden">
      <div className="flex flex-col h-screen overflow-y-auto">
        <div className="flex justify-end w-full py-6 px-4">
          <label
            htmlFor="hamburger-toggle"
            className="cursor-pointer hover:bg-white/10 rounded-full transition-colors mt-3"
            aria-label="Close menu"
          >
            <X
              className="text-white-neutral-light-100"
              size={42}
              absoluteStrokeWidth={true}
              strokeWidth={1}
            />
          </label>
        </div>

        <div className="flex flex-col items-center space-y-4 px-6 pb-6 flex-1">
          {MOBILE_MENU_ITEMS.map((item) => (
            <p
              key={item}
              className="font-semibold text-2xl text-white-neutral-light-100"
            >
              {item}
            </p>
          ))}

          <div className="mt-auto">
            <button
              className="font-semibold text-xs text-white-neutral-light-100 bg-black rounded-full w-30 h-14"
              style={mobileButtonStyle}
            >
              {ctaButtonTitle}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
