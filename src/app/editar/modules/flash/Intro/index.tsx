interface FlashIntroProps {
  name: string;
  email: string;
  buttonTitle: string;
  title: string;
  validity: Date | string;
  subtitle: string;
  hideSubtitle: boolean;
  services: Array<{
    id: string;
    introductionId: string;
    serviceName: string;
    hideService: boolean;
    sortOrder: number;
  }>;
}

export default function FlashIntro({
  name,
  email,
  buttonTitle,
  title,
  validity,
  subtitle,
  hideSubtitle,
  services = [
    {
      id: "1",
      introductionId: "1",
      serviceName: "Identidade Visual Médica",
      hideService: false,
      sortOrder: 1,
    },
    {
      id: "2",
      introductionId: "1",
      serviceName: "Branding para Clínicas",
      hideService: false,
      sortOrder: 2,
    },
    {
      id: "3",
      introductionId: "1",
      serviceName: "Direção de arte estratégica",
      hideService: false,
      sortOrder: 3,
    },
    {
      id: "4",
      introductionId: "1",
      serviceName: "Design que atrai pacientes",
      hideService: false,
      sortOrder: 4,
    },
  ],
}: FlashIntroProps) {
  return (
    <div className="relative px-6 lg:px-12 py-11 overflow-hidden">
      <div
        style={{
          width: "120%",
          height: "100%",
          background:
            "radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)",

          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          overflow: "hidden",
        }}
      />
      <nav className="flex justify-between items-center text-[#E6E6E6] max-w-[1440px] mx-auto">
        <p className="text-lg lg:text-base font-semibold lg:font-normal">
          {name || "MICH Design"}{" "}
        </p>
        <div className="hidden lg:flex gap-12 items-center">
          <p>{email || "contato@michdesign.com"}</p>
          <p className="rounded-full bg-black p-5">
            {buttonTitle || "Iniciar Projeto"}
          </p>
        </div>

        <button
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
      </nav>

      <div className="pt-30 lg:pt-60 mb-24 lg:mb-0 lg:pb-39 xl:pl-30 max-w-[1440px] mx-auto">
        <h1 className="text-[32px] xl:text-[72px] text-[#E6E6E6] max-w-[1120px] pb-4">
          {title || "Transforme sua clínica em referência na dermatologia"}
        </h1>
        <p className="font-bold text-sm text-[#E6E6E6]">
          Proposta válida até -{" "}
          <span className="font-normal text-[#E6E6E6]/40">
            {validity instanceof Date
              ? validity.toDateString()
              : validity || "30 de Outubro de 2025"}
          </span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-end gap-4 max-w-[1440px] mx-auto">
        <div className="pt-22 pl-4 lg:pl-8 border-l border-l-[#A0A0A0] w-full lg:w-1/2 order-2 lg:order-1">
          {services?.map((service) => (
            <div key={service.id}>
              <p className="text-sm text-[#E6E6E6]">{service.serviceName}</p>
            </div>
          ))}
        </div>
        {!hideSubtitle && (
          <div className="pt-22 pl-4 lg:pl-8 border-l border-l-[#A0A0A0] w-full lg:w-1/2 order-1 lg:order-2">
            <p className="text-[18px] text-[#E6E6E6] max-w-[400px]">
              {subtitle ||
                "Branding exclusivo que fortalece sua marca, atrai pacientes e gera retorno financeiro sólido."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
