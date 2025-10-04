import Modal from "#/modules/ai-generator/components/modal/Modal";
import { URLIcon } from "#/modules/ai-generator/components/icons/URLIcon";

const rules = [
  {
    id: "1",
    description: "Escolha um nome curto (até 20 caracteres).",
  },
  {
    id: "2",
    description: "Use apenas letras minúsculas.",
  },
  {
    id: "3",
    description: "Evite espaços, números ou caracteres especiais.",
  },
  {
    id: "4",
    description:
      "Não use o mesmo nome de cliente mais de uma vez (cada proposta deve ter uma URL única)",
  },
];

export function URLModal({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}) {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      showCloseButton={false}
    >
      <div className="font-satoshi px-0 md:px-3">
        <p className="text-primary-light-400 text-[24px]">URL da proposta</p>
        <div className="my-6">
          <URLIcon />
        </div>

        <p className="text-white-neutral-light-900 text-sm mb-4 font-semibold">
          Sua URL terá o formato:{" "}
          <span className="text-primary-light-500">
            usuário-cliente.nepfy.com
          </span>
        </p>

        <p className="text-white-neutral-light-900 text-sm mb-4">
          Você pode editar enquanto a proposta estiver em rascunho. Após
          publicar, não será mais possível alterar.
        </p>

        <p className="text-white-neutral-light-900 text-sm font-semibold mb-2">
          Regras para o nome do cliente:
        </p>
        <ul className="text-sm mb-6">
          {rules.map((rule) => (
            <li key={rule.id} className="flex items-baseline gap-2 my-0">
              <span className="text-primary-light-500 text-[20px]">•</span>
              <span className="text-white-neutral-light-900">
                {rule.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
