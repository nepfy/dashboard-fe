import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 relative">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] h-screen relative">
        <Sidebar />

        <div className="flex flex-col h-screen overflow-scroll">
          <Navbar />
          <main className="flex-1 pt-6xl">{children}</main>
        </div>
      </div>
    </div>
  );
}
