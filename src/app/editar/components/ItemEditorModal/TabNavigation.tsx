"use client";

type TabType = "conteudo" | "imagem" | "organizar";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const tabs = [
    { id: "conteudo", label: "Conteúdo" },
    { id: "imagem", label: "Imagem" },
    { id: "organizar", label: "Organizar" },
  ];

  return (
    <div className="bg-white-neutral-light-200 mb-4 flex flex-shrink-0 justify-between rounded-[8px] p-[1px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as TabType)}
          className={`cursor-pointer rounded-[8px] border border-transparent px-4 py-3 text-sm font-medium transition-colors sm:px-5 ${
            activeTab === tab.id
              ? "bg-white-neutral-light-100 text-primary-light-500 border-white-neutral-light-300"
              : "hover:bg-white-neutral-light-300 bg-transparent text-[#6C747E]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
