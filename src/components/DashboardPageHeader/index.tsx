"use client";

interface DashboardPageHeaderProps {
  title: string;
  children: React.ReactNode;
}

export default function DashboardPageHeader({
  title,
  children,
}: DashboardPageHeaderProps) {
  return (
    <header className="w-full p-7 border-b border-white-neutral-light-300">
      <h3 className="mb-4 text-2xl font-medium text-white-neutral-light-900">
        {title}
      </h3>
      {children}
    </header>
  );
}
