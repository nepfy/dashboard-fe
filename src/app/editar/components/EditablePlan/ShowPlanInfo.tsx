export default function ShowPlanInfo({
  setShowPlanInfo,
}: {
  setShowPlanInfo: (show: boolean) => void;
}) {
  return (
    <div className="flex h-full flex-col items-stretch justify-center">
      <div className="text-white-neutral-light-900 h-[90%] text-sm">
        <div className="mb-6 flex w-full items-center justify-between border-b border-b-[#E0E3E9] pb-6">
          <span className="text-lg font-medium text-[#2A2A2A]">
            Definir seu melhor plano
          </span>
        </div>

        <p className="text-primary-light-400 mb-4 text-[16px] font-medium">
          Ative esta opção para destacar um dos seus planos como a melhor
          escolha.
        </p>
        <p className="text-white-neutral-light-900 mb-4 text-sm">
          O plano marcado vai ganhar mais evidência na página (com selo de
          destaque e estilo diferenciado), ajudando o cliente a perceber
          facilmente qual é a opção mais recomendada.
        </p>
        <p className="text-white-neutral-light-900 mb-4 text-sm">
          Use esse recurso para guiar a decisão do cliente e aumentar a taxa de
          conversão.
        </p>
      </div>

      <button
        onClick={() => {
          setShowPlanInfo(false);
        }}
        className={`flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700`}
      >
        Entendi
      </button>
    </div>
  );
}
