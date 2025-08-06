import { Plus } from "lucide-react";
import Image from "next/image";

export function StartProposal({
  handleNextStep,
}: {
  handleNextStep: () => void;
}) {
  return (
    <section className="bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="gradient-border flex-1 p-[3px] overflow-hidden rounded-[26px] shadow-lg">
          <div className="bg-white rounded-xl p-8 flex flex-col gap-6">
            <h1 className="text-2xl font-medium text-black text-start font-satoshi leading-tight">
              Gerar proposta
            </h1>

            <div className="w-full h-64 bg-purple-600 rounded-xl flex items-center justify-center relative overflow-hidden">
              <Image
                src="/images/ai-generator/start-ai-flow.png"
                alt="Start AI Flow"
                fill
                className="object-cover"
                priority
              />
            </div>

            <p className="text-gray-500 text-start leading-normal text-base font-satoshi font-light">
              Proposta gerada com apoio de IA, 100% personalizada pra você em
              poucos segundos.
            </p>

            <div className="w-full h-px bg-gray-200" />

            <div className="flex justify-start mt-2">
              <button
                onClick={handleNextStep}
                className="bg-gradient-to-br from-primary-light-300 to-primary-light-500 via-primary-light-500 hover:from-primary-light-600 hover:to-primary-light-400 text-white font-semibold py-3 px-6 rounded-lg flex justify-center items-center gap-3 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Gerar proposta com IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
