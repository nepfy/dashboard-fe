"use client";

interface TabNavigationProps {
  activeTab: "imagem" | "organizar";
  onTabChange: (tab: "imagem" | "organizar") => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="bg-white-neutral-light-200 mb-4 flex flex-shrink-0 justify-between rounded-[10px] p-[1px]">
      <button
        onClick={() => onTabChange("imagem")}
        className={`w-full cursor-pointer rounded-[10px] border border-transparent px-4 py-3 text-sm font-medium transition-colors sm:px-5 ${
          activeTab === "imagem"
            ? "bg-white-neutral-light-100 text-primary-light-500 border-white-neutral-light-300"
            : "hover:bg-white-neutral-light-300 bg-transparent text-[#6C747E]"
        }`}
      >
        Imagem
      </button>
      <button
        onClick={() => onTabChange("organizar")}
        className={`w-full cursor-pointer rounded-[10px] border border-transparent px-4 py-3 text-sm font-medium transition-colors sm:px-5 ${
          activeTab === "organizar"
            ? "bg-white-neutral-light-100 text-primary-light-500 border-white-neutral-light-300"
            : "hover:bg-white-neutral-light-300 bg-transparent text-[#6C747E]"
        }`}
      >
        Organizar
      </button>
    </div>
  );
}
