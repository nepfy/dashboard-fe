import { DatePicker } from "#/components/Inputs";

interface ValidUntilSectionProps {
  validUntil: string;
  setValidUntil: (date: string) => void;
  errors: string;
}

export function ValidUntilSection({
  validUntil,
  setValidUntil,
  errors,
}: ValidUntilSectionProps) {
  return (
    <>
      <p className="bg-[#E8E2FD4D] rounded-[8px] p-3 mb-4 text-sm mt-6 border border-[#E8E2FD]">
        Qual a validade desta proposta?
      </p>

      <div className="relative w-full lg:w-1/2">
        <DatePicker
          inputName="projectValidUntil"
          id="projectValidUntil"
          placeholder="Escolha uma data"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          error={errors}
          disabled={false}
        />
      </div>
    </>
  );
}
