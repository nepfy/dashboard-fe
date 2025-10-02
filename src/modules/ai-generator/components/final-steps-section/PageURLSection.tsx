// Constants
const MAX_URL_LENGTH = 20;

interface PageURLSectionProps {
  userName: string;
  originalPageUrl: string;
  setOriginalPageUrl: (url: string) => void;
  clearError: (field: string) => void;
  isLoading?: boolean;
}

export function PageURLSection({
  userName,
  originalPageUrl,
  setOriginalPageUrl,
  clearError,
  isLoading = false,
}: PageURLSectionProps) {
  return (
    <>
      <p className="bg-[#E8E2FD4D] rounded-[8px] p-3 mb-4 text-sm mt-6 border border-[#E8E2FD]">
        Personalize a URL da proposta com o nome do seu cliente:
      </p>

      <div className="flex items-center justify-start gap-4 font-satoshi">
        <span className="text-white-neutral-light-600 flex items-center">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white-neutral-light-600 border-t-transparent mr-1 font-satoshi" />
          ) : (
            `${userName}-`
          )}
        </span>

        <textarea
          placeholder="Digite o nome do seu cliente"
          value={originalPageUrl}
          onChange={(e) => {
            setOriginalPageUrl(e.target.value);
            clearError("originalPageUrl");
          }}
          className={`w-full px-4 py-3 rounded-[var(--radius-s)] 
                    border border-white-neutral-light-300 
                    focus:outline-none focus:border-[var(--color-primary-light-400)]
                    placeholder:text-[var(--color-white-neutral-light-400)]  
                    max-w-[250px] font-satoshi
          ${
            isLoading
              ? "bg-white-neutral-light-300 text-white-neutral-light-500 cursor-not-allowed"
              : "bg-white-neutral-light-100 text-white-neutral-light-800"
          }`}
          rows={isLoading ? 2 : 1}
          style={{ resize: "none" }}
          maxLength={MAX_URL_LENGTH}
          disabled={isLoading}
        />

        <span className="text-white-neutral-light-600">.nepfy.com</span>
      </div>
      <div className="mt-2 flex justify-end">
        <div
          className={`text-xs font-satoshi ${
            originalPageUrl.length >= 18
              ? "text-red-500"
              : "text-white-neutral-light-500"
          }`}
        >
          {originalPageUrl.length} / {MAX_URL_LENGTH}
        </div>
      </div>
    </>
  );
}
