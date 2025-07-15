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

// Types
interface PasswordValidation {
  minLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
}

interface FormErrors {
  pageUrl?: string;
  pagePassword?: string;
  general?: string;
}

// Constants
const MIN_URL_LENGTH = 3;
const MAX_URL_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 6;

// Component
export default function AccessForm() {
  const router = useRouter();
  const {
    prevStep,
    updateFormData,
    formData,
    templateType,
    currentProjectId,
    isEditMode,
  } = useProjectGenerator();

  // State
  const [modals, setModals] = useState({
    password: false,
    url: false,
  });
  const [ui, setUI] = useState({
    isMobile: false,
    isFinishing: false,
    showPassword: false,
    isLoadingUserName: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [userName, setUserName] = useState("usuário");
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      minLength: false,
      hasNumber: false,
      hasUppercase: false,
    });
  // Track the original pageUrl state when component loads
  const [originalPageUrl, setOriginalPageUrl] = useState<string>("");

  // Form data
  const pageUrl = formData?.step16?.pageUrl || "";
  const pagePassword = formData?.step16?.pagePassword || "";

  // Effects
  useEffect(() => {
    const handleResize = () => {
      setUI((prev) => ({ ...prev, isMobile: window.innerWidth < 768 }));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Set original pageUrl when component loads
  useEffect(() => {
    setOriginalPageUrl(formData?.step16?.pageUrl || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once when component mounts

  useEffect(() => {
    if (pagePassword) {
      const validation = validatePassword(pagePassword);
      setPasswordValidation(validation);
    }
  }, [pagePassword]);

  // Utility functions
  const validatePassword = (password: string): PasswordValidation => ({
    minLength: password.length >= MIN_PASSWORD_LENGTH,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
  });

  const isPasswordValid = (validation: PasswordValidation): boolean =>
    validation.minLength && validation.hasNumber && validation.hasUppercase;

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // API functions
  const fetchUserData = async () => {
    try {
      setUI((prev) => ({ ...prev, isLoadingUserName: true }));
      const response = await fetch("/api/user-account", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (result.success && result.data?.userName) {
        setUserName(result.data.userName);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setUI((prev) => ({ ...prev, isLoadingUserName: false }));
    }
  };

  const finishProject = async () => {
    const response = await fetch("/api/projects/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    return { success: true, data: result.data };
  };

  // Validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (pageUrl.length === 0) {
      newErrors.pageUrl = "O campo 'URL personalizada' é obrigatório";
    } else if (pageUrl.length < MIN_URL_LENGTH) {
      newErrors.pageUrl = "A URL deve ter pelo menos 3 caracteres";
    }

    if (pagePassword.length === 0) {
      newErrors.pagePassword = "O campo 'Senha' é obrigatório";
    } else if (!isPasswordValid(passwordValidation)) {
      newErrors.pagePassword =
        "A senha deve atender todos os requisitos de segurança";
    }

    return newErrors;
  };

  // Event handlers
  const handleBack = () => {
    prevStep();
  };

  const handleFinish = async () => {
    setErrors({});
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setUI((prev) => ({ ...prev, isFinishing: true }));
      const result = await finishProject();

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
      setErrors({ general: "Erro ao finalizar o projeto. Tente novamente." });
    } finally {
      setUI((prev) => ({ ...prev, isFinishing: false }));
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Fixed logic: Only allow changes when NOT in edit mode OR when in edit mode but original pageUrl was empty
    const shouldAllowChange =
      !isEditMode || (isEditMode && originalPageUrl.length === 0);

    if (shouldAllowChange) {
      const cleanValue = e.target.value.toLowerCase().replace(/[^a-z]/g, "");

      updateFormData("step16", {
        ...formData?.step16,
        pageUrl: cleanValue,
      });
    }
    clearError("pageUrl");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    updateFormData("step16", {
      ...formData?.step16,
      pagePassword: newPassword,
    });
    clearError("pagePassword");
  };

  // Modal handlers
  const toggleModal = (modalType: "password" | "url") => {
    setModals((prev) => ({
      ...prev,
      [modalType]: !prev[modalType],
    }));
  };

  const togglePasswordVisibility = () => {
    setUI((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  // Check if form is valid
  const isFormValid =
    pageUrl &&
    pageUrl.length >= MIN_URL_LENGTH &&
    pagePassword &&
    isPasswordValid(passwordValidation);

  return (
    <div className="h-full flex flex-col justify-between">
      <FormContent
        pageUrl={pageUrl}
        pagePassword={pagePassword}
        userName={userName}
        isEditMode={isEditMode}
        isMobile={ui.isMobile}
        isLoadingUserName={ui.isLoadingUserName}
        showPassword={ui.showPassword}
        errors={errors}
        passwordValidation={passwordValidation}
        onUrlChange={handleUrlChange}
        onPasswordChange={handlePasswordChange}
        onTogglePassword={togglePasswordVisibility}
        onToggleUrlModal={() => toggleModal("url")}
        onTogglePasswordModal={() => toggleModal("password")}
        originalPageUrl={originalPageUrl}
      />

      <FormFooter
        isFinishing={ui.isFinishing}
        isFormValid={isFormValid}
        hasErrors={Object.keys(errors).length > 0}
        onBack={handleBack}
        onFinish={handleFinish}
        errors={errors}
      />

      <FormModals
        modals={modals}
        userName={userName}
        onToggleUrlModal={() => toggleModal("url")}
        onTogglePasswordModal={() => toggleModal("password")}
      />
    </div>
  );
}

// Sub-components
interface FormContentProps {
  pageUrl: string;
  pagePassword: string;
  userName: string;
  isEditMode: boolean;
  isMobile: boolean;
  isLoadingUserName: boolean;
  showPassword: boolean;
  errors: FormErrors;
  passwordValidation: PasswordValidation;
  onUrlChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleUrlModal: () => void;
  onTogglePasswordModal: () => void;
  originalPageUrl: string;
}

function FormContent({
  pageUrl,
  pagePassword,
  userName,
  isEditMode,
  isMobile,
  isLoadingUserName,
  showPassword,
  errors,
  passwordValidation,
  onUrlChange,
  onPasswordChange,
  onTogglePassword,
  onToggleUrlModal,
  onTogglePasswordModal,
  originalPageUrl,
}: FormContentProps) {
  return (
    <div className="p-7">
      <TitleDescription
        title="Acesso:"
        description="Personalize e proteja sua proposta com segurança"
      />

      <URLSection
        pageUrl={pageUrl}
        userName={userName}
        isEditMode={isEditMode}
        isMobile={isMobile}
        isLoadingUserName={isLoadingUserName}
        error={errors.pageUrl}
        onUrlChange={onUrlChange}
        onToggleModal={onToggleUrlModal}
        originalPageUrl={originalPageUrl}
      />

      <PasswordSection
        pagePassword={pagePassword}
        showPassword={showPassword}
        error={errors.pagePassword}
        passwordValidation={passwordValidation}
        onPasswordChange={onPasswordChange}
        onTogglePassword={onTogglePassword}
        onToggleModal={onTogglePasswordModal}
      />

      {errors.general && (
        <div className="mt-4 text-red-700 rounded-md text-sm font-medium">
          {errors.general}
        </div>
      )}
    </div>
  );
}

interface URLSectionProps {
  pageUrl: string;
  userName: string;
  isEditMode: boolean;
  isMobile: boolean;
  isLoadingUserName: boolean;
  error?: string;
  onUrlChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onToggleModal: () => void;
  originalPageUrl: string;
}

function URLSection({
  pageUrl,
  userName,
  isEditMode,
  isMobile,
  isLoadingUserName,
  error,
  onUrlChange,
  onToggleModal,
  originalPageUrl,
}: URLSectionProps) {
  // Fixed logic: Disable field only when in edit mode AND original pageUrl had a value
  const isFieldDisabled = isEditMode && originalPageUrl.length > 0;

  return (
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
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white-neutral-light-600 border-t-transparent mr-1" />
            ) : (
              `${userName}-`
            )}
          </span>

          <textarea
            placeholder="Digite o nome do seu cliente"
            value={pageUrl}
            onChange={onUrlChange}
            className={`w-full px-4 py-3 rounded-[var(--radius-s)] 
                      border border-white-neutral-light-300 
                      focus:outline-none focus:border-[var(--color-primary-light-400)]
                      placeholder:text-[var(--color-white-neutral-light-400)]  
                      max-w-[250px]
            ${
              isFieldDisabled
                ? "bg-white-neutral-light-300 text-white-neutral-light-500 cursor-not-allowed"
                : "bg-white-neutral-light-100 text-white-neutral-light-800"
            }`}
            rows={isMobile ? 2 : 1}
            style={{ resize: "none" }}
            maxLength={MAX_URL_LENGTH}
            disabled={isFieldDisabled}
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
            {pageUrl.length} / {MAX_URL_LENGTH}
          </div>
        </div>

        {error && (
          <div className="text-red-700 rounded-md text-sm font-medium mt-2">
            {error}
          </div>
        )}
      </div>

      <div className="absolute right-2 top-2.5" onClick={onToggleModal}>
        <QuestionIcon className="cursor-pointer" fill="#8B8895" />
      </div>
    </div>
  );
}

interface PasswordSectionProps {
  pagePassword: string;
  showPassword: boolean;
  error?: string;
  passwordValidation: PasswordValidation;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleModal: () => void;
}

function PasswordSection({
  pagePassword,
  showPassword,
  error,
  passwordValidation,
  onPasswordChange,
  onTogglePassword,
  onToggleModal,
}: PasswordSectionProps) {
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
              onChange={onPasswordChange}
              className="w-full px-4 py-3 pr-12 rounded-[var(--radius-s)] 
                        border border-white-neutral-light-300 
                        focus:outline-none focus:border-[var(--color-primary-light-400)]
                        bg-white-neutral-light-100 
                        placeholder:text-[var(--color-white-neutral-light-400)]  
                        text-white-neutral-light-800"
            />

            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 
                       text-white-neutral-light-600 hover:text-white-neutral-light-800 
                       focus:outline-none transition-colors duration-200 cursor-pointer"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="text-red-700 rounded-md text-sm font-medium mt-2">
              {error}
            </div>
          )}
        </div>

        <div className="absolute right-2 top-2.5" onClick={onToggleModal}>
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
  );
}

interface FormFooterProps {
  isFinishing: boolean;
  isFormValid: string | boolean;
  hasErrors: boolean;
  onBack: () => void;
  onFinish: () => void;
  errors: FormErrors;
}

function FormFooter({
  isFinishing,
  isFormValid,
  hasErrors,
  onBack,
  onFinish,
}: FormFooterProps) {
  return (
    <div className="border-t border-t-white-neutral-light-300 w-full h-[130px] sm:h-[110px] flex items-center gap-2 p-6">
      <button
        type="button"
        onClick={onBack}
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
        onClick={onFinish}
        disabled={isFinishing || !isFormValid || hasErrors}
        className="w-full sm:w-[100px] h-[44px] px-4 py-2 text-sm font-medium 
                   border rounded-[12px] bg-primary-light-500 button-inner-inverse 
                   border-white-neutral-light-300 cursor-pointer text-white-neutral-light-100
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
      >
        {isFinishing ? "Finalizando" : "Finalizar"}
      </button>

      {hasErrors && (
        <div className="bg-red-light-10 border border-red-light-50 rounded-2xs py-4 px-6 hidden xl:flex items-center justify-center gap-2">
          <InfoIcon fill="#D00003" />
          <p className="text-white-neutral-light-800 text-sm">
            Preencha todos os campos
          </p>
        </div>
      )}
    </div>
  );
}

interface FormModalsProps {
  modals: { password: boolean; url: boolean };
  userName: string;
  onToggleUrlModal: () => void;
  onTogglePasswordModal: () => void;
}

function FormModals({
  modals,
  userName,
  onToggleUrlModal,
  onTogglePasswordModal,
}: FormModalsProps) {
  return (
    <>
      <Modal
        isOpen={modals.url}
        onClose={onToggleUrlModal}
        title="URL da proposta"
        boldTitle
      >
        <URLModalContent userName={userName} />
      </Modal>

      <Modal
        isOpen={modals.password}
        onClose={onTogglePasswordModal}
        title="Senha da proposta"
        boldTitle
      >
        <PasswordModalContent />
      </Modal>
    </>
  );
}

function URLModalContent({ userName }: { userName: string }) {
  return (
    <>
      <div className="p-6 text-[14px]">
        <p className="text-white-neutral-light-900 text-sm mb-4">
          Sua URL terá o formato:{" "}
          <span className="text-primary-light-500">
            {userName}-cliente.nepfy.com
          </span>
        </p>

        <p className="text-white-neutral-light-900 mb-2">
          <span className="font-bold">Nome de usuário:</span> Este é o seu
          identificador na plataforma e aparecerá em todas as suas propostas.
        </p>

        <p className="text-white-neutral-light-900 flex items-center gap-2 mb-2">
          <span className="text-primary-light-500 text-2xl">•</span>
          <span>
            Exemplo: <span className="text-primary-light-500">{userName}</span>
            -cliente
          </span>
        </p>

        <p className="text-white-neutral-light-900 mb-2">
          <span className="font-bold">Nome do cliente:</span> Essa parte
          identifica para quem a proposta está sendo enviada.
        </p>

        <p className="text-white-neutral-light-900 flex items-center gap-2 mb-2">
          <span className="text-primary-light-500 text-2xl">•</span>
          <span>
            Exemplo: {userName}-
            <span className="text-primary-light-500">odontologiapati</span>
          </span>
        </p>

        <p className="text-white-neutral-light-900 font-bold mb-2">
          Regras para o nome do cliente:
        </p>
        <ul className="text-sm">
          <li className="flex items-center gap-2">
            <span className="text-primary-light-500 text-2xl">•</span>
            <span className="text-white-neutral-light-900">
              Escolha um nome curto (até 20 caracteres).
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary-light-500 text-2xl">•</span>
            <span className="text-white-neutral-light-900">
              Use apenas letras minúsculas.
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary-light-500 text-2xl">•</span>
            <span className="text-white-neutral-light-900">
              Não é permitido o uso de espaços, números ou caracteres especiais.
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary-light-500 text-2xl">•</span>
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
    </>
  );
}

function PasswordModalContent() {
  return (
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
          <span className="text-primary-light-500 text-2xl">•</span>
          <span className="text-white-neutral-light-900">
            Pelo menos 6 caracteres
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-primary-light-500 text-2xl">•</span>
          <span className="text-white-neutral-light-900">
            Contém 1 letra maiúscula
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-primary-light-500 text-2xl">•</span>
          <span className="text-white-neutral-light-900">Contém 1 número</span>
        </li>
      </ul>
    </div>
  );
}
