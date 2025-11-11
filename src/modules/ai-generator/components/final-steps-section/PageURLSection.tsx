import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Label } from "#/components/Label";
import { getProjectBaseDomain } from "#/lib/subdomain";
import { URLModal } from "#/modules/ai-generator/components/modal/URLModal";

// Constants
const MAX_URL_LENGTH = 20;
const MIN_URL_LENGTH = 3;
const CHECK_DELAY_MS = 400;

interface PageURLSectionProps {
  userName: string;
  originalPageUrl: string;
  setOriginalPageUrl: (url: string) => void;
  clearError: (field: string) => void;
  isLoading?: boolean;
  isPublished: boolean;
  errorMessage?: string;
  onValidationStateChange?: (state: {
    isChecking: boolean;
    isDuplicate: boolean;
    message?: string;
  }) => void;
  skipInitialValidation?: boolean;
}

export function PageURLSection({
  userName,
  originalPageUrl,
  setOriginalPageUrl,
  clearError,
  isLoading = false,
  isPublished,
  errorMessage,
  onValidationStateChange,
  skipInitialValidation = false,
}: PageURLSectionProps) {
  const projectBaseDomain = getProjectBaseDomain();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState<
    string | undefined
  >();
  const [internalError, setInternalError] = useState<string | undefined>();
  const validationCallbackRef = useRef(onValidationStateChange);
  const [hasUserEdited, setHasUserEdited] = useState(!skipInitialValidation);

  useEffect(() => {
    validationCallbackRef.current = onValidationStateChange;
  }, [onValidationStateChange]);

  const disabled = isLoading || isPublished;

  const sanitizeInput = (input: string) =>
    input.toLowerCase().replace(/[^a-z]/g, "");

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setOriginalPageUrl(sanitizedValue);
    clearError("originalPageUrl");
    if (!hasUserEdited) {
      setHasUserEdited(true);
    }
  };

  const combinedError = useMemo(() => {
    return duplicateMessage || internalError || errorMessage || "";
  }, [duplicateMessage, internalError, errorMessage]);

  useEffect(() => {
    if (disabled) {
      setIsChecking(false);
      setDuplicateMessage(undefined);
      setInternalError(undefined);
      validationCallbackRef.current?.({
        isChecking: false,
        isDuplicate: false,
      });
      return;
    }

    if (!hasUserEdited) {
      return;
    }

    if (!originalPageUrl || originalPageUrl.length < MIN_URL_LENGTH) {
      setIsChecking(false);
      setDuplicateMessage(undefined);
      setInternalError(undefined);
      validationCallbackRef.current?.({
        isChecking: false,
        isDuplicate: false,
      });
      return;
    }

    let isActive = true;
    const controller = new AbortController();
    setIsChecking(true);
    setInternalError(undefined);
    validationCallbackRef.current?.({
      isChecking: true,
      isDuplicate: false,
    });

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/projects/check-url?projectUrl=${encodeURIComponent(
            originalPageUrl
          )}`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: { success: boolean; exists?: boolean } =
          await response.json();

        if (!isActive) {
          return;
        }

        if (!data.success) {
          setDuplicateMessage(undefined);
          setInternalError("Não foi possível validar a URL");
          validationCallbackRef.current?.({
            isChecking: false,
            isDuplicate: false,
            message: "Não foi possível validar a URL",
          });
          return;
        }

        const exists = Boolean(data.exists);

        if (exists) {
          setDuplicateMessage("Você já está usando essa URL em outra proposta");
          setInternalError(undefined);
        } else {
          setDuplicateMessage(undefined);
          setInternalError(undefined);
        }

        validationCallbackRef.current?.({
          isChecking: false,
          isDuplicate: exists,
          message: exists
            ? "Você já está usando essa URL em outra proposta"
            : undefined,
        });
      } catch (err) {
        if (!isActive || err instanceof DOMException) {
          return;
        }

        console.error("Error validating project URL", err);
        setDuplicateMessage(undefined);
        setInternalError("Não foi possível validar a URL");
        validationCallbackRef.current?.({
          isChecking: false,
          isDuplicate: false,
          message: "Não foi possível validar a URL",
        });
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    }, CHECK_DELAY_MS);

    return () => {
      isActive = false;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [originalPageUrl, disabled, hasUserEdited]);

  return (
    <div className="mb-6">
      <Label
        htmlFor="originalPageUrl"
        info
        onClick={() => setIsModalOpen(true)}
      >
        Personalize a URL da proposta com o nome do seu cliente:
      </Label>

      <div className="font-satoshi flex items-center justify-start gap-4">
        <span className="text-white-neutral-light-600 flex items-center">
          {isLoading ? (
            <div className="border-white-neutral-light-600 font-satoshi mr-1 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          ) : (
            `${userName}-`
          )}
        </span>

        <textarea
          placeholder="lojasxyz"
          value={originalPageUrl}
          onChange={handleInputChange}
          className={`border-white-neutral-light-300 font-satoshi w-full max-w-[250px] rounded-[var(--radius-s)] border px-4 py-3 placeholder:text-[var(--color-white-neutral-light-400)] focus:border-[var(--color-primary-light-400)] focus:outline-none ${
            disabled
              ? "bg-white-neutral-light-300 text-white-neutral-light-500 cursor-not-allowed"
              : combinedError
                ? "bg-white-neutral-light-100 text-white-neutral-light-800 border-red-500 focus:border-red-500"
                : "bg-white-neutral-light-100 text-white-neutral-light-800"
          }`}
          rows={isLoading ? 2 : 1}
          style={{ resize: "none" }}
          maxLength={MAX_URL_LENGTH}
          disabled={disabled}
          aria-invalid={combinedError ? "true" : "false"}
        />

        <span className="text-white-neutral-light-600">
          .{projectBaseDomain}
        </span>
      </div>

      <div className="h-[18px]">
        <div className="text-white-neutral-light-500 mt-2 text-xs">
          {isChecking && !combinedError ? (
            <span>Verificando disponibilidade...</span>
          ) : null}
        </div>

        {combinedError ? (
          <div className="mt-2 text-xs text-red-500" role="alert">
            {combinedError}
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex justify-end">
        <div
          className={`font-satoshi text-xs ${
            originalPageUrl?.length >= 18
              ? "text-red-500"
              : "text-white-neutral-light-500"
          }`}
        >
          {originalPageUrl?.length} / {MAX_URL_LENGTH}
        </div>
      </div>

      <URLModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
