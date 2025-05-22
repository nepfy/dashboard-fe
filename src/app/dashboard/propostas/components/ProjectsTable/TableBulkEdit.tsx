import { useEffect, useState } from "react";

import SelectInput from "#/components/Inputs/SelectInput";
import Archive from "#/components/icons/Archive";
import CopyIcon from "#/components/icons/CopyIcon";

const BASE_STYLE = `
px-4 py-2 w-[120px] h-[48px] 
flex items-center justify-center gap-1 
text-white-neutral-light-900 text-sm font-medium 
rounded-[var(--radius-s)] cursor-pointer 
bg-white-neutral-light-100 hover:bg-white-neutral-light-200 
border border-white-neutral-light-300 button-inner
`;

const options = [
  {
    value: "enviada",
    label: "Enviada",
  },
  {
    value: "aprovada",
    label: "Aprovada",
  },
  {
    value: "negociacao",
    label: "Em negociação",
  },
  {
    value: "rascunho",
    label: "Rascunho",
  },
  {
    value: "expirada",
    label: "Expirada",
  },
  {
    value: "rejeitada",
    label: "Rejeitada",
  },
];

export default function TableBulkEdit() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`bg-white-neutral-light-100 e0 py-3 sm:py-0 px-4 rounded-[10px] w-full min-h-[78px] transition-all duration-400 ease-in-out flex items-center justify-start sm:justify-center gap-2 flex-wrap mb-2 sm:flex-nowrap ${
        isVisible ? "opacity-100 " : "opacity-0 "
      }`}
    >
      <SelectInput
        className="h-[49px]"
        options={options}
        placeholder="Atualizar status"
      />
      <button className="px-4 py-2 h-[48px] text-sm font-medium text-white rounded-[var(--radius-s)] cursor-pointer bg-primary-light-400 hover:bg-primary-light-500 border border-primary-light-25 button-inner-inverse">
        Atualizar
      </button>

      <button className={BASE_STYLE}>
        <Archive width="16px" height="16px" />
        Arquivar
      </button>

      <button className={BASE_STYLE}>
        <CopyIcon width="16px" height="16px" />
        Duplicar
      </button>

      <button className={BASE_STYLE}>Deselecionar</button>
    </div>
  );
}
