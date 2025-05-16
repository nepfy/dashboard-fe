"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUserAccount } from "#/hooks/useUserAccount";
import Modal from "#/components/Modal";
import { TextField } from "#/components/Inputs";
import WarningIcon from "#/components/icons/WarningIcon";
import UpdatePasswordForm from "./_components/UpdatePasswordForm";

export default function ChangePassword() {
  const { userData } = useUserAccount();
  const [error, setError] = useState("");
  const [usernameModal, setUsernameModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  useEffect(() => {
    setError("");
  }, []);

  return (
    <div className="max-w-[595px] bg-white-neutral-light-100 border border-white-neutral-light-300 rounded-[12px] p-6 mb-[64px] sm:mb-[100px]">
      <p className="text-white-neutral-light-900 font-medium leading-[18px] mb-5">
        Segurança da conta
      </p>

      <div className="pb-4">
        <TextField
          label="Nome de usuário"
          inputName="username"
          id="username"
          type="text"
          placeholder=""
          onClick={() => setUsernameModal(!usernameModal)}
          value={userData?.userName}
          disabled
          info
        />
      </div>

      <div className="pb-2">
        <TextField
          label="Email"
          inputName="emailAddress"
          id="email"
          type="email"
          placeholder="Seu email"
          onClick={() => setEmailModal(!emailModal)}
          value={userData?.email}
          disabled
          info
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-end">
        <TextField
          label="Senha"
          inputName="password"
          id="password"
          type="text"
          onChange={() => console.log("password")}
          value="••••••••"
        />
        <button
          onClick={() => setPasswordModal(true)}
          className="w-full sm:w-[72px] h-[50px] border border-white-neutral-light-300 button-inner bg-white-neutral-light-100 rounded-xs ml-2 px-4 mb-2 cursor-pointer"
        >
          Editar
        </button>
      </div>
      {error && (
        <div className="px-6 py-3 bg-red-100 text-red-700 rounded-2xs border border-red-light-50 flex">
          <WarningIcon className="mr-3" fill="#D00003" /> {error}
        </div>
      )}
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
            <p className="text-white-neutral-light-500 text-sm ">
              Ele será usado para criar um link exclusivo para cada proposta que
              você enviar, como:
              <span className="text-primary-light-500 text-sm mb-3">
                usuario-cliente.nepfy.com.
              </span>
            </p>

            <p className="text-white-neutral-light-500 text-sm">
              Esse é o nome de usuário que você escolheu no momento do cadastro.
            </p>
            <p className="font-bold text-white-neutral-light-500 text-sm mb-3">
              Ele é único e não pode ser alterado depois.
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
      {emailModal && (
        <Modal
          isOpen={emailModal}
          onClose={() => setEmailModal(false)}
          title="Email de usuário"
        >
          <div className="p-6">
            <p className="text-white-neutral-light-500 font-bold text-sm mb-3">
              É através do seu email que você vai se autenticar na plataforma
            </p>
            <p className="text-white-neutral-light-500 text-sm mb-3">
              Ele é usado para validar o seu acesso e também para enviar as
              notificações importantes sobre sua conta.
            </p>
            <p className="font-bold text-white-neutral-light-500 text-sm mb-3">
              Seu email é único e também não pode ser alterado.
            </p>
          </div>
        </Modal>
      )}

      {passwordModal && (
        <Modal
          isOpen={passwordModal}
          onClose={() => setPasswordModal(false)}
          title="Alterar senha"
          footer={false}
        >
          <UpdatePasswordForm onCloseAction={setPasswordModal} />
        </Modal>
      )}
    </div>
  );
}
