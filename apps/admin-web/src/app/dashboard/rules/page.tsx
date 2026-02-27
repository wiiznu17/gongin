'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Loader2, Search } from 'lucide-react';

// 1. ปรับ Interface ให้ตรงกับ DB Schema
interface InteractionRule {
  id: string;
  substance_name: string;
  food_category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export default function RulesPage() {
  const [rules, setRules] = useState<InteractionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<InteractionRule | null>(null);

  const fetchRules = async () => {
    setLoading(true);
    // ใส่ orderBy เพื่อให้ข้อมูลเรียงตามวันที่สร้างล่าสุด
    const { data, error } = await supabase
      .from('interaction_rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setRules(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 3. ปรับชื่อคอลัมน์ให้ตรงกับ DB
    const payload = {
      substance_name: formData.get('substance_name') as string,
      food_category: formData.get('food_category') as string,
      severity: formData.get('severity') as string,
      description: formData.get('description') as string,
    };

    if (editingRule) {
      await supabase.from('interaction_rules').update(payload).eq('id', editingRule.id);
    } else {
      await supabase.from('interaction_rules').insert([payload]);
    }

    setIsDialogOpen(false);
    setEditingRule(null);
    fetchRules();
  };

  const deleteRule = async (id: string) => {
    if (confirm('ยืนยันการลบกฎนี้?')) {
      await supabase.from('interaction_rules').delete().eq('id', id);
      fetchRules();
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary text-3xl font-bold">Interaction Rules</h1>
          <p className="text-muted-foreground">จัดการข้อมูลข้อห้ามระหว่างยากับอาหาร/สมุนไพร</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingRule(null)}>
              <Plus className="h-4 w-4" /> เพิ่มกฎใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingRule ? 'แก้ไขกฎ' : 'เพิ่มกฎความปลอดภัยใหม่'}</DialogTitle>
                <DialogDescription>
                  ข้อมูลนี้จะถูกนำไปใช้ในระบบ AI เพื่อแจ้งเตือนผู้ใช้งาน
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="substance_name">ชื่อยา (Substance Name)</Label>
                  <Input
                    id="substance_name"
                    name="substance_name"
                    defaultValue={editingRule?.substance_name}
                    placeholder="เช่น Atorvastatin"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="food_category">ชื่ออาหาร/สมุนไพร</Label>
                  <Input
                    id="food_category"
                    name="food_category"
                    defaultValue={editingRule?.food_category}
                    placeholder="เช่น น้ำเกรพฟรุต, กะทิ"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="severity">ระดับความรุนแรง</Label>
                  <select
                    name="severity"
                    defaultValue={editingRule?.severity || 'low'}
                    className="border-input focus:ring-primary flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus:ring-1"
                  >
                    <option value="low">Low (ต่ำ)</option>
                    <option value="medium">Medium (ปานกลาง)</option>
                    <option value="high">High (สูง)</option>
                    <option value="critical">Critical (อันตรายมาก)</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">รายละเอียด</Label>
                  <Input
                    id="description"
                    name="description"
                    defaultValue={editingRule?.description}
                    placeholder="รายละเอียดผลกระทบ"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">
                  บันทึกข้อมูล
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="ค้นหายา หรืออาหาร/สมุนไพร..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ยา</TableHead>
              <TableHead>อาหาร/สมุนไพร</TableHead>
              <TableHead>ความรุนแรง</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
                </TableCell>
              </TableRow>
            ) : rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            ) : (
              rules
                .filter(
                  (r) =>
                    r.substance_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.food_category.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.substance_name}</TableCell>
                    <TableCell>{rule.food_category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          rule.severity === 'critical' || rule.severity === 'high'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {rule.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingRule(rule);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
