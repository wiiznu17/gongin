'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Database, Users, CheckCircle, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Database, label: 'Interaction Rules', href: '/dashboard/rules' },
  { icon: Users, label: 'User Management', href: '/dashboard/users' },
  { icon: CheckCircle, label: 'Verification', href: '/dashboard/verification' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-card flex h-full w-64 flex-col border-r">
      <div className="p-6">
        <h2 className="text-primary text-2xl font-bold tracking-tight">GonGin Admin</h2>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                'h-11 w-full justify-start gap-3',
                pathname === item.href
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'hover:bg-accent',
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-destructive w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
