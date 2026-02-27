'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ThemeToggle } from '@/components/theme-toggle';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Users, Activity, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dummy Data สำหรับกราฟ
const usageData = [
  { name: 'Mon', scans: 45, alerts: 5 },
  { name: 'Tue', scans: 52, alerts: 8 },
  { name: 'Wed', scans: 38, alerts: 3 },
  { name: 'Thu', scans: 65, alerts: 12 },
  { name: 'Fri', scans: 48, alerts: 7 },
  { name: 'Sat', scans: 25, alerts: 2 },
  { name: 'Sun', scans: 30, alerts: 4 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="text-muted-foreground">สรุปสถานะสุขภาพและความปลอดภัยรายสัปดาห์</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="1,284"
          icon={Users}
          description="+12% from last month"
        />
        <StatCard
          title="Total Food Scans"
          value="4,520"
          icon={Activity}
          description="+5.2% from last week"
        />
        <StatCard
          title="High Risk Alerts"
          value="24"
          icon={AlertCircle}
          description="Require immediate review"
          trend="destructive"
        />
        <StatCard
          title="Verified Rules"
          value="850"
          icon={CheckCircle2}
          description="Approved by pharmacists"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Graph Section */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
            <CardDescription>
              จำนวนการตรวจอาหารและการแจ้งเตือนความเสี่ยงใน 7 วันล่าสุด
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
                />
                <Bar dataKey="scans" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar
                  dataKey="alerts"
                  fill="var(--destructive)"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Alerts Table */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent High-Risk Cases</CardTitle>
            <CardDescription>เคสที่ AI ตรวจพบความเสี่ยงสูงและรอการยืนยัน</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Substance</TableHead>
                  <TableHead className="text-right">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <RiskRow name="สมชาย ใจดี" substance="กะทิ + ยาลดไขมัน" level="High" />
                <RiskRow
                  name="วิภา เรียนเก่ง"
                  substance="ใบกะเพรา + ยาละลายลิ่มเลือด"
                  level="Critical"
                />
                <RiskRow name="มานะ อดทน" substance="น้ำเกรพฟรุต + ยาความดัน" level="High" />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon: Icon, description, trend }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon
          className={cn('h-4 w-4', trend === 'destructive' ? 'text-destructive' : 'text-primary')}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}

function RiskRow({ name, substance, level }: any) {
  return (
    <TableRow>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell className="text-muted-foreground text-xs">{substance}</TableCell>
      <TableCell className="text-right">
        <Badge variant={level === 'Critical' ? 'destructive' : 'outline'} className="text-[10px]">
          {level}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
