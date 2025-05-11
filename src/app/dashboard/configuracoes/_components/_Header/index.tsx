import DashboardPageHeader from "#/components/DashboardPageHeader";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
}

export default function Header({ activeTab, setActiveTab, tabs }: HeaderProps) {
  return (
    <DashboardPageHeader title="Configurações">
      <div className="border border-white-neutral-light-300 bg-white-neutral-light-200 rounded-2xl mb-6 w-fit">
        <div className="flex flex-wrap items-center justify-center p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium rounded-xs cursor-pointer ${
                activeTab === tab
                  ? "text-primary-light-500 bg-white-neutral-light-100 e1"
                  : "text-white-neutral-light-800 hover:bg-white-neutral-light-200"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </DashboardPageHeader>
  );
}
