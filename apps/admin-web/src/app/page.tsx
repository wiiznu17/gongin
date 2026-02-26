import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <h1 className="text-4xl font-bold tracking-tight">
        ยินดีต้อนรับสู่ <span className="text-primary">GonGin Admin</span>
      </h1>

      <p className="text-muted-foreground max-w-xl text-center text-lg">
        ระบบผู้ดูแลสำหรับแพทย์ เภสัชกร และแอดมิน เพื่อตรวจสอบความปลอดภัยด้านอาหารของผู้สูงอายุ
      </p>

      <div className="mt-8 flex gap-4">
        <Button size="lg">เข้าสู่ระบบด้วย Google</Button>
        <Button variant="outline" size="lg">
          ดูคู่มือการใช้งาน
        </Button>
      </div>
    </main>
  );
}
