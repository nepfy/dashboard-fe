"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react";

import QuestionIcon from "#/components/icons/QuestionIcon";
import InfoIcon from "#/components/icons/InfoIcon";
import Modal from "#/components/Modal";
import TitleDescription from "../../TitleDescription";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

interface PasswordValidation {
  minLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
}

export default function AccessForm() {
  const router = useRouter();
  const { prevStep, updateFormData, formData, templateType, currentProjectId } =
    useProjectGenerator();

  const [passwordModal, setPasswordModal] = useState(false);
  const [urlModal, setURLModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFinishing, setIsFinishing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("usuário");
  const [isLoadingUserName, setIsLoadingUserName] = useState(true);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      minLength: false,
      hasNumber: false,
      hasUppercase: false,
    });

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Fetch user data to get userName
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUserName(true);
        const response = await fetch("/api/user-account", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (result.success && result.data?.userName) {
          setUserName(result.data.userName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Keep default "usuário" if fetch fails
      } finally {
        setIsLoadingUserName(false);
      }
    };

    fetchUserData();
  }, []);

  const pageUrl = formData?.step16?.pageUrl || "";
  const pagePassword = formData?.step16?.pagePassword || "";

  const validatePassword = (password: string): PasswordValidation => {
    return {
      minLength: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
    };
  };

  useEffect(() => {
    if (pagePassword) {
      const validation = validatePassword(pagePassword);
      setPasswordValidation(validation);
    }
  }, [pagePassword]);

  const isPasswordValid = (validation: PasswordValidation): boolean => {
    return (
      validation.minLength && validation.hasNumber && validation.hasUppercase
    );
  };

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
    } else if (!isPasswordValid(passwordValidation)) {
      newErrors.pagePassword =
        "A senha deve atender todos os requisitos de segurança";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsFinishing(true);

      const result = await finishProject();

      console.log("result", result);

      const projectName = formData?.step1?.projectName || "Nova Proposta";

      const baseUrl = `/dashboard?success=true&project=${encodeURIComponent(
        projectName
      )}`;
      const redirectUrl = result?.data?.id
        ? `${baseUrl}&projectId=${result?.data?.id}`
        : baseUrl;

      router.push(redirectUrl);
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

      return {
        success: true,
        data: result.data,
      };
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
    const newPassword = e.target.value;

    updateFormData("step16", {
      ...formData?.step16,
      pagePassword: newPassword,
    });

    // Valida a senha em tempo real
    const validation = validatePassword(newPassword);
    setPasswordValidation(validation);

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

  // Função para alternar visualização da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const ValidationIndicator = ({
    isValid,
    text,
  }: {
    isValid: boolean;
    text: string;
  }) => (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 flex items-center justify-center ${
          isValid ? "text-secondary-light-300" : "text-white-neutral-light-500"
        }`}
      >
        <Check size={10} />
      </div>
      <span
        className={`text-sm ${isValid ? "text-gray-700" : "text-gray-600"}`}
      >
        {text}
      </span>
    </div>
  );

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="p-7">
        <TitleDescription
          title="Acesso:"
          description="Personalize e proteja sua proposta com segurança"
        />

        <div className="mt-6 space-y-4 flex items-start justify-between gap-2 max-w-[560px] relative">
          <div className="w-full">
            <p
              className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center mb-2"
              style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
            >
              Personalize a URL da proposta com o nome do seu cliente:
            </p>

            <div className="flex items-center justify-start gap-4">
              <span className="text-white-neutral-light-600 flex items-center">
                {isLoadingUserName ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white-neutral-light-600 border-t-transparent mr-1"></div>
                ) : (
                  `${userName}-`
                )}
              </span>

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
                maxLength={20}
              />

              <span className="text-white-neutral-light-600">.nepfy.com</span>
            </div>

            <div className="mt-2 flex justify-end">
              <div
                className={`text-xs ${
                  pageUrl.length >= 18
                    ? "text-red-500"
                    : "text-white-neutral-light-500"
                }`}
              >
                {pageUrl.length} / 20
              </div>
            </div>
            {errors?.pageUrl && (
              <div className="text-red-700 rounded-md text-sm font-medium mt-2">
                {errors?.pageUrl}
              </div>
            )}
          </div>

          <div className="absolute right-2 top-2.5" onClick={toggleUrlModal}>
            <QuestionIcon className="cursor-pointer" fill="#8B8895" />
          </div>
        </div>

        <div className="mt-6 space-y-4 max-w-[560px]">
          <div className="flex items-start justify-between gap-2 relative">
            <div className="w-full">
              <label
                htmlFor="pagePassword"
                className="text-white-neutral-light-800 text-sm p-2 rounded-3xs font-medium flex justify-between items-center mb-2"
                style={{ backgroundColor: "rgba(107, 70, 245, 0.05)" }}
              >
                Crie uma senha para a sua proposta
              </label>

              <div className="relative">
                <input
                  id="pagePassword"
                  name="pagePassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite uma senha para a sua proposta"
                  value={pagePassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 pr-12 rounded-[var(--radius-s)] 
                            border border-white-neutral-light-300 
                            focus:outline-none focus:border-[var(--color-primary-light-400)]
                            bg-white-neutral-light-100 
                            placeholder:text-[var(--color-white-neutral-light-400)]  
                            text-white-neutral-light-800"
                />

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                           text-white-neutral-light-600 hover:text-white-neutral-light-800 
                           focus:outline-none transition-colors duration-200"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errors?.pagePassword && (
                <div className="text-red-700 rounded-md text-sm font-medium mt-2">
                  {errors?.pagePassword}
                </div>
              )}
            </div>

            <div
              className="absolute right-2 top-2.5"
              onClick={togglePasswordModal}
            >
              <QuestionIcon className="cursor-pointer" fill="#8B8895" />
            </div>
          </div>

          <div className="space-y-2">
            <ValidationIndicator
              isValid={passwordValidation.minLength}
              text="Pelo menos 6 caracteres"
            />
            <ValidationIndicator
              isValid={passwordValidation.hasNumber}
              text="1 número"
            />
            <ValidationIndicator
              isValid={passwordValidation.hasUppercase}
              text="1 letra maiúscula"
            />
          </div>
        </div>

        {errors?.general && (
          <div className="mt-4 text-red-700 rounded-md text-sm font-medium">
            {errors?.general}
          </div>
        )}
      </div>

      <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex items-center gap-2 p-6">
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
          disabled={
            isFinishing ||
            !pageUrl ||
            pageUrl.length < 3 ||
            !pagePassword ||
            !isPasswordValid(passwordValidation)
          }
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
        {errors?.general || errors?.pagePassword || errors?.pageUrl ? (
          <div className="bg-red-light-10 border border-red-light-50 rounded-2xs py-4 px-6 hidden xl:flex items-center justify-center gap-2 ">
            <InfoIcon fill="#D00003" />
            <p className="text-white-neutral-light-800 text-sm">
              Preencha todos os campos
            </p>
          </div>
        ) : null}
      </div>

      <Modal
        isOpen={urlModal}
        onClose={() => setURLModal(false)}
        title="URL da proposta"
        boldTitle
      >
        <div className="p-6 text-[14px]">
          <p className="text-white-neutral-light-900 text-sm mb-4">
            Sua URL terá o formato:{" "}
            <span className="text-primary-light-500">
              {userName}-cliente.nepfy.com
            </span>
          </p>

          <p className="text-white-neutral-light-900 mb-4">
            <span className="font-bold"> Nome de usuário:</span> Este é o seu
            identificador na plataforma e aparecerá em todas as suas propostas.
          </p>

          <p className="text-white-neutral-light-900 flex items-center gap-2 mb-4">
            <span className="text-primary-light-500 text-2xl"> • </span>
            <span>
              Exemplo:{" "}
              <span className="text-primary-light-500">{userName}</span>
              -cliente
            </span>
          </p>

          <p className="text-white-neutral-light-900 mb-4">
            <span className="font-bold"> Nome do cliente:</span> Essa parte
            identifica para quem a proposta está sendo enviada.
          </p>

          <p className="text-white-neutral-light-900 flex items-center gap-2 mb-4">
            <span className="text-primary-light-500 text-2xl"> • </span>
            <span>
              Exemplo: {userName}-
              <span className="text-primary-light-500">odontopati</span>
            </span>
          </p>

          <p className="text-white-neutral-light-900 font-bold mb-4">
            Regras para o nome do cliente:
          </p>
          <ul className="text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary-light-500 text-2xl"> • </span>{" "}
              <span className="text-white-neutral-light-900">
                {" "}
                Escolha um nome curto (até 20 caracteres).
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary-light-500 text-2xl"> • </span>{" "}
              <span className="text-white-neutral-light-900">
                {" "}
                Use apenas letras minúsculas.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary-light-500 text-2xl"> • </span>{" "}
              <span className="text-white-neutral-light-900">
                Não é permitido o uso de espaços, números ou caracteres
                especiais.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary-light-500 text-2xl"> • </span>{" "}
              <span className="text-white-neutral-light-900">
                Não use o mesmo nome de cliente mais de uma vez (cada proposta
                deve ter uma URL única)
              </span>
            </li>
          </ul>
        </div>
        <div className="w-full flex items-center justify-center">
          <Image
            src="/images/browserbar-project-generator.jpg"
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
        boldTitle
      >
        <div className="p-6">
          <p className="text-white-neutral-light-900 text-sm mb-4">
            Essa senha deve ser enviada por você ao cliente para acesso seguro à
            proposta
          </p>

          <p className="text-white-neutral-light-900 text-sm font-bold mb-4">
            Requisitos da senha:
          </p>

          <ul className="text-white-neutral-light-900 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary-light-500 text-2xl"> • </span>{" "}
              <span className="text-white-neutral-light-900">
                Pelo menos 6 caracteres
              </span>
            </li>

            <li className="flex items-center gap-2">
              <span className="text-primary-light-500 text-2xl"> • </span>{" "}
              <span className="text-white-neutral-light-900">
                Contém 1 letra maiúscula
              </span>
            </li>

            <li className="flex items-center gap-2">
              <span className="text-primary-light-500 text-2xl"> • </span>{" "}
              <span className="text-white-neutral-light-900">
                Contém 1 número
              </span>
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  );
}
