import Modal from "#/modules/ai-generator/components/modal/Modal";
import { MoneyIcon } from "#/modules/ai-generator/components/icons/MoneyIcon";

export function PricingModal({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}) {
  return (
    <Modal
      showCloseButton={false}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    >
      <div className="font-satoshi flex flex-col items-center justify-center px-0 md:px-3">
        <p className="text-primary-light-400 text-[24px]">
          Ofereça mais planos para potencializar suas vendas
        </p>
        <div className="my-6">
          <MoneyIcon />
        </div>
        <p className="text-white-neutral-light-900 text-sm">
          <span className="mb-6 block">
            Ter mais de um plano disponível permite que você atenda diferentes
            perfis de clientes e aumente suas chances de fechar negócios.
          </span>
          <span className="mb-6 block">
            Além disso, oferecer opções variadas incentiva o cliente a escolher
            um pacote com mais benefícios, aumentando o valor final do contrato.
          </span>
          <span className="mb-6 block">
            Por isso, recomendamos criar ao menos dois ou três planos, com
            serviços e preços distintos, para que o cliente possa escolher o que
            melhor atende às suas necessidades.
          </span>
        </p>
      </div>
    </Modal>
  );
}
