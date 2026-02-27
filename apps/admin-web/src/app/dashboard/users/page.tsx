'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, UserCircle } from 'lucide-react';
// import { toast } from 'sonner'; // หรือใช้ alert ปกติถ้ายังไม่ได้ลง sonner

interface Profile {
  id: string;
  full_name: string | null;
  role: 'user' | 'caregiver' | 'admin';
  created_at: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .order('created_at', { ascending: false });

    if (!error) {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);

    if (error) {
      alert('ไม่สามารถเปลี่ยนสิทธิ์ได้: ' + error.message);
    } else {
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: newRole as 'user' | 'caregiver' | 'admin' } : u,
        ),
      );
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-primary text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">จัดการสิทธิ์และดูรายชื่อผู้ใช้งานในระบบ GonGin</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="ค้นหาชื่อหรือบทบาท..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ผู้ใช้งาน</TableHead>
              <TableHead>วันที่เข้าร่วม</TableHead>
              <TableHead>สิทธิ์การใช้งาน (Role)</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                  ไม่พบรายชื่อผู้ใช้งาน
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserCircle className="text-muted-foreground h-8 w-8" />
                      <div>
                        <div className="font-medium">{user.full_name || 'ไม่ระบุชื่อ'}</div>
                        <div className="text-muted-foreground font-mono text-xs">
                          {user.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString('th-TH')}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === 'admin'
                          ? 'destructive'
                          : user.role === 'caregiver'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {user.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="ml-auto w-[130px]">
                        <SelectValue placeholder="เปลี่ยนสิทธิ์" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="caregiver">Caregiver</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
