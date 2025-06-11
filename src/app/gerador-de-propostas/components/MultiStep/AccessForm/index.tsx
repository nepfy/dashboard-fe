"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import QuestionIcon from "#/components/icons/QuestionIcon";
import { TextField } from "#/components/Inputs";
import Modal from "#/components/Modal";
import TitleDescription from "../../TitleDescription";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

export default function AccessForm() {
  const router = useRouter();
  const { prevStep, updateFormData, formData, templateType, currentProjectId } =
    useProjectGenerator();

  const [passwordModal, setPasswordModal] = useState(false);
  const [urlModal, setURLModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const pageUrl = formData?.step16?.pageUrl || "";
  const pagePassword = formData?.step16?.pagePassword || "";

  const handleBack = () => {
    prevStep();
  };

  const handleFinish = async () => {
    setErrors({});

    const pageUrl = formData?.step16?.pageUrl || "";
    const pagePassword = formData?.step16?.pagePassword || "";
    const newErrors: { [key: string]: string } = {};

    if (pageUrl.length === 0) {
      newErrors.pageUrl = "O campo 'URL personalizada' é obrigatório";
    } else if (pageUrl.length < 3) {
      newErrors.pageUrl = "A URL deve ter pelo menos 3 caracteres";
    }

    if (pagePassword.length === 0) {
      newErrors.pagePassword = "O campo 'Senha' é obrigatório";
    } else if (pagePassword.length < 6) {
      newErrors.pagePassword = "A senha deve ter pelo menos 6 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsFinishing(true);

      // Primeiro salva o projeto com os dados finais
      await finishProject();

      // Redireciona para o dashboard com parâmetro de sucesso
      const projectName = formData?.step1?.projectName || "Nova Proposta";
      router.push(
        `/dashboard?success=true&project=${encodeURIComponent(projectName)}`
      );
    } catch (error) {
      console.error("Erro ao finalizar projeto:", error);
      setErrors({
        general: "Erro ao finalizar o projeto. Tente novamente.",
      });
    } finally {
      setIsFinishing(false);
    }
  };

  const finishProject = async () => {
    try {
      const response = await fetch("/api/projects/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          templateType,
          projectId: currentProjectId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao finalizar projeto");
      }

      return result;
    } catch (error) {
      console.error("Erro ao finalizar projeto:", error);
      throw error;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData("step16", {
      ...formData?.step16,
      pageUrl: e.target.value,
    });

    if (errors.pageUrl) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.pageUrl;
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("step16", {
      ...formData?.step16,
      pagePassword: e.target.value,
    });

    if (errors.pagePassword) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.pagePassword;
        return newErrors;
      });
    }
  };

  const togglePasswordModal = () => {
    setPasswordModal(!passwordModal);
  };

  const toggleUrlModal = () => {
    setURLModal(!urlModal);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="p-7">
        <TitleDescription
          title="Acesso:"
          description="Personalize e proteja sua proposta com segurança"
        />

        <div className="mt-6 space-y-4 flex items-start justify-between gap-2 max-w-[560px]">
          <div className="flex-1">
            <p className="font-medium text-white-neutral-light-900 text-[14px] mb-2">
              Personalize a URL da proposta com o nome do seu cliente:
            </p>

            <div className="flex items-center justify-start gap-4">
              <span className="text-white-neutral-light-600">usuário-</span>

              <textarea
                placeholder="Digite o nome do seu cliente"
                value={pageUrl}
                onChange={handleUrlChange}
                className="w-full px-4 py-3 rounded-[var(--radius-s)] 
                          border border-white-neutral-light-300 
                          focus:outline-none focus:border-[var(--color-primary-light-400)]
                          bg-white-neutral-light-100 
                          placeholder:text-[var(--color-white-neutral-light-400)]  
                          text-white-neutral-light-800 max-w-[250px]"
                rows={isMobile ? 2 : 1}
                style={{ resize: "none" }}
              />

              <span className="text-white-neutral-light-600">.nepfy.com</span>
            </div>
            {errors?.pageUrl && (
              <div className="text-red-700 rounded-md text-sm font-medium">
                {errors?.pageUrl}
              </div>
            )}
          </div>

          <div className="mt-1 sm:mt-0" onClick={toggleUrlModal}>
            <QuestionIcon className="cursor-pointer" fill="#8B8895" />
          </div>
        </div>

        <div className="mt-6 space-y-4 flex items-start justify-between gap-2 max-w-[560px]">
          <TextField
            label="Crie uma senha para a sua proposta"
            id="pagePassword"
            inputName="pagePassword"
            type="password"
            placeholder="Digite uma senha para a sua proposta"
            value={pagePassword}
            onChange={handlePasswordChange}
            onClick={togglePasswordModal}
            info
            error={errors?.pagePassword}
          />
        </div>

        {errors?.general && (
          <div className="mt-4 text-red-700 rounded-md text-sm font-medium">
            {errors?.general}
          </div>
        )}
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex gap-2 p-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={isFinishing}
          className="flex items-center justify-center gap-1 w-[110px] h-[44px] 
                     px-4 py-2 text-sm font-medium border rounded-[12px] 
                     border-white-neutral-light-300 cursor-pointer button-inner 
                     text-white-neutral-light-900 hover:bg-white-neutral-light-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <button
          type="button"
          onClick={handleFinish}
          disabled={isFinishing}
          className="w-full sm:w-[100px] h-[44px] px-4 py-2 text-sm font-medium 
                     border rounded-[12px] bg-primary-light-500 button-inner-inverse 
                     border-white-neutral-light-300 cursor-pointer text-white-neutral-light-100
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {isFinishing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Finalizando
            </>
          ) : (
            "Finalizar"
          )}
        </button>
      </div>

      <Modal
        isOpen={urlModal}
        onClose={() => setURLModal(false)}
        title="URL da proposta"
      >
        <div className="p-6 text-[14px]">
          <p className="text-white-neutral-light-500 text-sm mb-4">
            Sua URL terá o formato:{" "}
            <span className="text-primary-light-500">
              usuario-cliente.nepfy.com
            </span>
          </p>

          <p className="text-white-neutral-light-500 mb-4">
            <span className="font-bold"> Nome de usuário:</span> Este é o seu
            identificador na plataforma e aparecerá em todas as suas propostas.
          </p>

          <p className="text-white-neutral-light-500 mb-4">
            • Exemplo:{" "}
            <span className="text-primary-light-500">joaosilva-cliente</span>
          </p>

          <p className="text-white-neutral-light-500 mb-4">
            <span className="font-bold"> Nome do cliente:</span> Essa parte
            identifica para quem a proposta está sendo enviada.
          </p>

          <p className="text-white-neutral-light-500 mb-4">
            • Exemplo: joaosilva-
            <span className="text-primary-light-500">odontopati</span>
          </p>

          <p className="text-white-neutral-light-500 font-bold mb-4">
            Regras para o nome do cliente:
          </p>
          <ul className="text-white-neutral-light-500 text-sm">
            <li>• Escolha um nome curto (até 10 caracteres).</li>
            <li>• Use apenas letras minúsculas.</li>
            <li>• Evite espaços, números ou caracteres especiais.</li>
            <li>
              • Não use o mesmo nome de cliente mais de uma vez (cada proposta
              deve ter uma URL única)
            </li>
          </ul>
        </div>
        <div className="w-full flex items-center justify-end">
          <Image
            src="/images/browserbar.jpg"
            alt="Imagem de um navegador com o link do cliente"
            width={352}
            height={32}
          />
        </div>
      </Modal>

      <Modal
        isOpen={passwordModal}
        onClose={() => setPasswordModal(false)}
        title="Senha da proposta"
      >
        <div className="p-6">
          <p className="text-white-neutral-light-500 font-bold mb-4">
            Essa senha será enviada ao seu cliente para que ele possa visualizar
            a proposta com segurança.
          </p>

          <p className="text-white-neutral-light-500 font-bold mb-4">
            Requisitos da senha:
          </p>

          <ul className="text-white-neutral-light-500 text-sm">
            <li>• Pelo menos 6 caracteres</li>
            <li>• Contém 1 letra maiúscula</li>
            <li>• Contém 1 número</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
}
