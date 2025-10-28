"use client";

interface UploadImageInfoProps {
  onUploadImage: () => void;
  onClose: () => void;
}

export default function UploadImageInfo({
  onUploadImage,
  onClose,
}: UploadImageInfoProps) {
  return (
    <div
      className="bg-white-neutral-light-100 flex h-[550px] w-full flex-col items-center justify-between pt-2 sm:h-[650px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-6 flex w-full flex-shrink-0 items-center justify-between border-b border-b-[#E0E3E9] pb-6">
        <span className="text-lg font-medium text-[#2A2A2A]">
          Adicionar nova imagem
        </span>
      </div>

      <div className="h-[90%]">
        <p className="text-primary-light-500 mb-4 font-medium">
          Faça upload de uma imagem do seu dispositivo para personalizar ainda
          mais seu projeto.
        </p>

        <p className="text-white-neutral-light-900 text-sm font-normal">
          Recomendamos usar arquivos em alta qualidade para garantir o melhor
          resultado visual.
        </p>

        <ul className="text-white-neutral-light-900 mt-4 text-sm font-normal">
          <li className="list-inside list-disc">
            Formatos aceitos: JPG ou PNG
          </li>
          <li className="list-inside list-disc">Tamanho máximo: 1 MB</li>
          <li className="list-inside list-disc">
            Certifique-se de ter os direitos de uso da imagem
          </li>
        </ul>
      </div>
      <div className="flex w-full flex-col gap-3">
        <button
          onClick={onUploadImage}
          className="flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
        >
          Adicionar imagem
        </button>
        <button
          onClick={onClose}
          className="bg-white-neutral-light-100 border-white-neutral-light-300 button-inner text-white-neutral-light-900 hover:bg-white-neutral-light-200 flex w-full transform cursor-pointer items-center justify-center rounded-[12px] border px-6 py-3.5 text-sm font-medium transition-all duration-200"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
