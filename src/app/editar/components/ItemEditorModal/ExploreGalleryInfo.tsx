"use client";

interface ExploreGalleryInfoProps {
  onExploreGallery: () => void;
  onClose: () => void;
}

export default function ExploreGalleryInfo({
  onExploreGallery,
  onClose,
}: ExploreGalleryInfoProps) {
  return (
    <div
      className="bg-white-neutral-light-100 flex h-full w-full flex-col items-center justify-between pt-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-6 flex w-full flex-shrink-0 items-center justify-between border-b border-b-[#E0E3E9] pb-6">
        <span className="text-lg font-medium text-[#2A2A2A]">
          Explorar nossa galeria
        </span>
      </div>

      <div className="mb-14 flex flex-1 flex-col gap-2">
        <p className="text-primary-light-500 mb-4 font-medium">
          Aqui você encontra uma seleção de imagens gratuitas do Pexels, um dos
          maiores bancos de fotos do mundo.
        </p>

        <p className="text-white-neutral-light-900 text-sm font-normal">
          Use essas imagens livremente em seus projetos para deixar suas
          propostas mais visuais e atrativas.
          <span className="mb-2 block" />
          Todas as imagens seguem as regras de uso livre do Pexels. Não é
          necessário atribuir créditos, mas é sempre recomendado valorizar o
          trabalho dos fotógrafos.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <button
          onClick={onExploreGallery}
          className="flex w-full transform cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700"
        >
          Explorar galeria
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
