import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
    </div>
  );
}
