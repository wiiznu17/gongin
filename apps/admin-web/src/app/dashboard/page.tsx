import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-primary text-3xl font-bold">Admin Dashboard</h1>
        <ThemeToggle />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="mb-2 font-semibold">จำนวนผู้ใช้ทั้งหมด</h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="mb-2 font-semibold">เคสเสี่ยงสูงวันนี้</h3>
          <p className="text-destructive text-2xl font-bold">12</p>
        </div>
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="mb-2 font-semibold">ความแม่นยำ AI เฉลี่ย</h3>
          <p className="text-2xl font-bold text-green-600">98.5%</p>
        </div>
      </div>
    </div>
  );
}
