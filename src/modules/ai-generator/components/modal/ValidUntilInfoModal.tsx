import Modal from "#/modules/ai-generator/components/modal/Modal";
import { ValidUntilIcon } from "../icons/ValidUntilIcon";

export function ValidUntilInfoModal({
  isModalOpen,
  onClose,
}: {
  isModalOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isModalOpen} onClose={onClose} showCloseButton={false}>
      <div className="font-satoshi px-0 md:px-3">
        <p className="text-primary-light-400 text-[24px]">Senha da proposta</p>
        <div className="my-6">
          <ValidUntilIcon />
        </div>

        <p className="text-white-neutral-light-900 mb-6 text-sm font-semibold">
          Escolha até quando esta proposta será válida.
        </p>

        <p className="text-white-neutral-light-900 mb-8 text-sm">
          Após essa data, ela será arquivada automaticamente e o cliente não
          poderá mais acessá-la. Você pode mudar a data a qualquer momento.
        </p>
      </div>
    </Modal>
  );
}
