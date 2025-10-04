import Modal from "#/modules/ai-generator/components/modal/Modal";
import { PasswordIcon } from "#/modules/ai-generator/components/icons/PasswordIcon";

const rules = [
  {
    id: "1",
    description: "Pelo menos 6 caracteres.",
  },
  {
    id: "2",
    description: "Conter 1 letra maiúscula.",
  },
  {
    id: "3",
    description: "Conter 1 número.",
  },
];

export function PasswordModal({
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
        <p className="text-primary-light-400 text-[24px]">Senha da proposta</p>
        <div className="my-6">
          <PasswordIcon />
        </div>

        <p className="text-white-neutral-light-900 text-sm mb-6">
          Essa senha deve ser enviada por você ao cliente para acesso seguro à
          proposta. Você pode mudar a senha a qualquer momento.
        </p>

        <p className="text-white-neutral-light-900 text-sm font-semibold mb-2">
          Requisitos da senha:
        </p>
        <ul className="text-sm mb-6">
          {rules.map((rule) => (
            <li key={rule.id} className="flex items-center gap-2 my-0">
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
