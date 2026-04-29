import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0C12] text-white">
      <Sidebar />
      <main className="ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
