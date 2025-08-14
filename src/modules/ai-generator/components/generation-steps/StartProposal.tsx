import { Plus } from "lucide-react";
import { StartProposalIcon } from "../icons";

export function StartProposal({
  handleNextStep,
}: {
  handleNextStep: () => void;
}) {
  return (
    <section className="bg-white-neutral-light-200 flex items-center justify-center h-full p-4 box-border">
      <div className="w-[300px] sm:w-[366px] h-[436px]">
        <div className="gradient-border flex-1 overflow-hidden rounded-[14px] shadow-lg p-0.5">
          <div className="bg-white flex flex-col gap-6 p-6 rounded-[12px]">
            <h1 className="text-2xl font-medium text-white-neutral-light-800">
              Gerar proposta
            </h1>

            <div className="w-full h-[183px] rounded-[8px] flex items-center justify-center relative overflow-hidden">
              <StartProposalIcon />
            </div>

            <p className="text-white-neutral-light-500 text-start leading-normal text-sm font-satoshi font-light">
              Proposta gerada com apoio de IA, 100% personalizada pra você em
              poucos segundos.
            </p>

            <div className="w-full h-px bg-gray-200" />

            <div className="flex justify-start mt-2">
              <button
                onClick={handleNextStep}
                className="w-[201px] h-[40px] bg-gradient-to-br from-primary-light-300 to-primary-light-500 via-primary-light-500 hover:from-primary-light-600 hover:to-primary-light-400 text-white text-sm font-medium rounded-[10px] flex justify-center items-center gap-1 transition-all duration-200 transform shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Plus className="w-5 h-5" strokeWidth={1} />
                Gerar proposta com IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
