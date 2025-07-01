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
    const { value } = e.target;

    // Allow only letters and numbers
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");

    // Update the field using the existing handleChange method
    handleChange({ name: "userName", value: alphanumericValue });

    // Validate username length - require at least 3 characters
    if (alphanumericValue.length > 0 && alphanumericValue.length < 3) {
      setFieldError(
        "userName",
        "Nome de usuário deve ter no mínimo 3 caracteres"
      );
    } else {
      // Clear error if it exists and validation passes
      if (formErrors.userName) {
        setFieldError("userName", "");
      }
    }
  };

  useEffect(() => {
    enableNextStepUserName();
  }, [formData.usedBefore, enableNextStepUserName]);

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

      <div className="border border-yellow-light-200 bg-yellow-light-10 w-full h-auto sm:h-[88px] rounded-[12px] py-2 px-3 sm:py-[20px] sm:px-[24px] flex items-center justify-between mt-8">
        <div className="rounded-full warning-bg p-3 sm:p-2 w-[48px] h-[48px] flex items-center justify-center">
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
            <p className="text-white-neutral-light-500 font-bold text-sm mb-3">
              Seu nome de usuário é o seu identificador por aqui
            </p>
            <p className="text-white-neutral-light-500 text-sm mb-3">
              Ele será usado para criar um link exclusivo para cada proposta que
              você enviar, como:{" "}
              <span className="text-primary-light-500 text-sm">
                usuario-cliente.nepfy.com.
              </span>
            </p>
            <p className="text-white-neutral-light-500 text-sm mb-3">
              Para funcionar direitinho, siga essas orientações:
            </p>
            <p className="text-white-neutral-light-500 text-sm">
              &#8226; Escolha um nome curto (até 20 caracteres).
            </p>
            <p className="text-white-neutral-light-500 text-sm">
              &#8226; Use apenas letras
            </p>
            <p className="text-white-neutral-light-500 text-sm mb-3">
              &#8226; minúsculas. Evite espaços, números ou caracteres
              especiais.
            </p>
          </div>
          <div className="flex justify-end items-center w-full">
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
