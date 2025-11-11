import { useEffect, useState } from "react";
import Image from "next/image";

import Modal from "#/components/Modal";
import { TextField } from "#/components/Inputs";
import WarningIcon from "#/components/icons/WarningIcon";
import StepHeader from "#/app/onboarding/components/StepHeader";
import { useFormContext } from "#/app/onboarding/helpers/FormContext";

export default function UserNameStep() {
  const {
    formData,
    handleChange,
    enableNextStepUserName,
    setFieldError,
    formErrors,
  } = useFormContext();
  const [usernameModal, setUsernameModal] = useState(false);

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = rawValue.toLowerCase().replace(/[^a-z]/g, "");

    // Apply max length constraint before updating form state
    const truncatedValue = sanitizedValue.slice(0, 20);

    handleChange({ name: "userName", value: truncatedValue });

    const isTooShort = truncatedValue.length > 0 && truncatedValue.length < 3;
    setFieldError(
      "userName",
      isTooShort ? "Nome de usuário deve ter no mínimo 3 caracteres" : ""
    );
  };

  useEffect(() => {
    enableNextStepUserName();
  }, [formData.userName, formErrors.userName, enableNextStepUserName]);

  return (
    <div>
      <StepHeader
        title="Escolha seu nome de usuário"
        description="Esse será o nome que aparecerá no link das propostas que você criar. Ele ajuda a tornar seu perfil mais profissional e fácil de compartilhar com clientes e parceiros."
      />

      <div className="relative">
        <TextField
          id="userName"
          inputName="userName"
          label="Nome de usuário *"
          value={formData.userName}
          onChange={handleUserNameChange}
          onClick={() => setUsernameModal(!usernameModal)}
          placeholder="Digite seu nome de usuário"
          type="text"
          error={formErrors.userName}
          maxLength={20}
          showCharCount
          required
          info
        />
      </div>

      <div className="border-yellow-light-200 bg-yellow-light-10 mt-8 flex h-auto w-full items-center justify-between rounded-[12px] border px-3 py-2 sm:h-[88px] sm:px-[24px] sm:py-[20px]">
        <div className="warning-bg flex h-[48px] w-[48px] items-center justify-center rounded-full p-3 sm:p-2">
          <WarningIcon width="24" height="24" />
        </div>
        <p className="max-w-[404px] p-2 sm:p-2">
          <span className="text-white-neutral-light-800 font-bold">
            Atenção:
          </span>{" "}
          <span className="text-white-neutral-light-500">
            O nome de usuário não poderá ser alterado depois. Escolha com
            cuidado!
          </span>
        </p>
      </div>

      {usernameModal && (
        <Modal
          isOpen={usernameModal}
          onClose={() => setUsernameModal(false)}
          title="Nome de usuário"
        >
          <div className="p-6">
            <p className="text-white-neutral-light-500 mb-3 text-sm font-bold">
              Seu nome de usuário é o seu identificador por aqui
            </p>
            <p className="text-white-neutral-light-500 mb-3 text-sm">
              Ele será usado para criar um link exclusivo para cada proposta que
              você enviar, como:{" "}
              <span className="text-primary-light-500 text-sm">
                usuario-cliente.nepfy.com.
              </span>
            </p>
            <p className="text-white-neutral-light-500 mb-3 text-sm">
              Para funcionar direitinho, siga essas orientações:
            </p>
            <p className="text-white-neutral-light-500 text-sm">
              &#8226; Escolha um nome curto (até 20 caracteres).
            </p>
            <p className="text-white-neutral-light-500 text-sm">
              &#8226; Use apenas letras minúsculas.
            </p>
            <p className="text-white-neutral-light-500 mb-3 text-sm">
              &#8226; Evite espaços, números ou caracteres especiais.
            </p>
          </div>
          <div className="flex w-full items-center justify-end">
            <Image
              src="/images/browserbar.jpg"
              alt="Imagem de um navegador com o link do cliente"
              width={372}
              height={32}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
