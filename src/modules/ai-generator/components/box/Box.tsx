import { ArrowLeft } from "lucide-react";

export function Box({
  title,
  description,
  children,
  handleBack,
  handleNext,
  disabled,
  step,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  handleBack: () => void;
  handleNext: () => void;
  disabled: boolean;
  step?: string;
}) {
  return (
    <div
      className="w-full h-auto max-w-[624px] e1 rounded-[14px] flex items-start justify-start p-[1.5px] self-center mb-5 font-satoshi"
      style={{
        background: `linear-gradient(141.87deg, rgba(253, 253, 253, 0) 1.74%, rgba(172, 153, 243, 0.5) 50.87%, rgba(106, 75, 222, 0.5) 100%)`,
      }}
    >
      <div className="bg-white-neutral-light-200 rounded-[12px] p-3 md:p-6 w-full h-full">
        <h1 className="text-2xl font-medium text-primary-light-400 mb-2 font-satoshi">
          {title}
        </h1>
        <p className="text-white-neutral-light-800 leading-relaxed font-light font-satoshi">
          {description}
        </p>
        {children}

        <div className="border-t border-gray-200 mx-4 mt-8">
          <div className="w-full flex flex-col md:flex-row items-center gap-4 pt-4">
            <button
              onClick={handleBack}
              className="order-2 md:order-1 w-full md:w-auto cursor-pointer button-inner border border-white-neutral-light-300 flex items-center justify-center md:justify-start gap-2 px-6 py-3 text-white-neutral-light-900 hover:text-gray-800 transition-all duration-200 bg-white-neutral-light-100 hover:bg-white-neutral-light-200 rounded-[10px] group"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>

            <button
              onClick={handleNext}
              disabled={disabled}
              className={`order-1 md:order-2 w-full md:w-auto px-6 py-3.5 text-sm font-medium rounded-[12px] flex justify-center items-center gap-1 transition-all duration-200 transform shadow-lg hover:shadow-xl cursor-pointer ${
                disabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform"
              }`}
            >
              {step === "final_step" ? "Gerar proposta" : "Avançar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
