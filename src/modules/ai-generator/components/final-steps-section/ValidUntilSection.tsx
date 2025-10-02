import { DatePicker } from "#/components/Inputs";
import { Label } from "#/components/Label";

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
      <Label htmlFor="projectValidUntil" info>
        Qual a validade desta proposta?
      </Label>

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
