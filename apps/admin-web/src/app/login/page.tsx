'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันสำหรับการ Login ด้วย Google
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen w-full">
      {/* ธีมท็อกเกิลมุมขวาบน */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* ฝั่งซ้าย: กราฟิกและข้อความต้อนรับ */}
      <div className="bg-secondary/30 relative hidden w-1/2 flex-col justify-center overflow-hidden p-12 lg:flex">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-primary mb-4 text-5xl font-bold tracking-tight">
            Welcome to our <br /> Admin Community
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            ระบบจัดการและตรวจสอบความปลอดภัยด้านอาหาร (GonGin) สำหรับบุคลากรทางการแพทย์และผู้ดูแลระบบ
          </p>
        </div>

        {/* กล่องสำหรับใส่รูปภาพ 3D หรือภาพประกอบ (Placeholder) */}
        <div className="from-primary/20 border-primary/10 relative mt-8 flex h-[400px] w-full items-center justify-center rounded-xl border bg-gradient-to-tr to-transparent">
          <span className="text-muted-foreground">พื้นที่สำหรับภาพประกอบ (3D Illustration)</span>
        </div>
      </div>

      {/* ฝั่งขวา: ฟอร์ม Login */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              เข้าสู่ระบบด้วยอีเมลหรือบัญชี Google ของคุณ
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-primary text-sm font-medium hover:underline">
                    Recovery Password
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-secondary/50"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="keep-login" />
              <Label htmlFor="keep-login" className="text-sm font-normal">
                Keep me login
              </Label>
            </div>

            <Button
              className="text-md shadow-primary/25 h-12 w-full shadow-lg"
              disabled={isLoading}
            >
              SIGN IN
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant="outline"
              className="bg-secondary/50 hover:bg-secondary h-12 border-none"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {/* Google SVG Icon */}
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
