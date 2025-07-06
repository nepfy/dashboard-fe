import { TextField } from "#/components/Inputs";
import ExpandIcon from "#/components/icons/ExpandIcon";
import Lock from "#/components/icons/Lock";
import TemplatePreviewWrapper from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function AccessPreview() {
  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-center items-center h-full p-8 overflow-y-scroll w-full">
        <p className="text-white-neutral-light-100 leading-relaxed text-xl font-bold mb-2">
          Inserir Senha
        </p>

        <p className="text-white-neutral-light-400 leading-relaxed text-sm mb-6">
          Por favor, insira a senha para visualizar a proposta
        </p>

        <div className="w-[330px] mb-2 relative">
          <TextField
            label="senha"
            disabled={true}
            placeholder="Insira a senha"
          />
          <Lock width="20" height="20" className=" absolute top-10 right-4" />
        </div>

        <button className="bg-white-neutral-light-900 text-white-neutral-light-100 rounded-lg w-[330px] h-[44px] text-sm font-medium">
          Visualizar a proposta
        </button>
      </div>

      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-lg border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
