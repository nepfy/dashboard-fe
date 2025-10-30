export default function ShowInfo({
  setShowInfo,
}: {
  setShowInfo: (show: boolean) => void;
}) {
  return (
    <div className="flex h-full flex-col items-stretch justify-center">
      <div className="text-white-neutral-light-900 h-[90%] text-sm">
        <div className="mb-6 flex w-full items-center justify-between border-b border-b-[#E0E3E9] pb-6">
          <span className="text-lg font-medium text-[#2A2A2A]">Botão</span>
        </div>

        <p className="text-primary-light-400 mb-4 text-[16px] font-medium">
          Você pode definir para onde o botão vai levar o usuário:
        </p>

        <ul className="mb-4">
          <li className="list-inside list-disc">
            Cole uma URL (ex: seu site, portfólio, rede social)
          </li>
          <li className="list-inside list-disc">
            Ou insira um número de WhatsApp (com DDD, ex: 11 99999-9999)
          </li>
        </ul>

        <p className="mb-4">
          Assim, quando alguém clicar no botão, será direcionado para o link ou
          abrirá uma conversa no WhatsApp.
        </p>
        <p className="mb-4">
          Certifique-se de inserir o endereço ou número corretamente para evitar
          erros de redirecionamento.
        </p>
      </div>
      <button
        onClick={() => {
          setShowInfo(false);
        }}
        className={`flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700`}
      >
        Entendi
      </button>
    </div>
  );
}
