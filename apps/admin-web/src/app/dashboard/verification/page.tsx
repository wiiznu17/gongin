'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { Textarea } from '@/components/ui/textarea'; // ถ้ายังไม่ได้ลง ให้ใช้ <textarea> ปกติได้
import { Loader2, CheckCircle, XCircle, MessageSquare, User } from 'lucide-react';

interface FoodLog {
  id: string;
  user_id: string;
  image_url: string;
  analyzed_ingredients: string[] | null;
  risk_level: string;
  ai_feedback: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles: { full_name: string };
}

export default function VerificationPage() {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState<{ [key: string]: string }>({});

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('food_logs')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });

    if (!error) setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('food_logs')
      .update({
        status: status,
        pharmacist_comment: comment[id] || '',
        // verified_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', id);

    if (!error) {
      setLogs(logs.map((l) => (l.id === id ? { ...l, status } : l)));
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-primary text-3xl font-bold">Verification Workflow</h1>
        <p className="text-muted-foreground">
          ตรวจสอบความแม่นยำของ AI และยืนยันความปลอดภัยให้ผู้ใช้
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          {logs.map((log) => (
            <Card key={log.id} className={log.status !== 'pending' ? 'opacity-60' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-2">
                    <User className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {log.profiles?.full_name || 'Unknown User'}
                    </CardTitle>
                    <CardDescription>
                      {new Date(log.created_at).toLocaleString('th-TH')}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    log.risk_level === 'high' || log.risk_level === 'critical'
                      ? 'destructive'
                      : 'outline'
                  }
                >
                  AI Risk: {log.risk_level?.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                {/* ข้อมูลที่ AI วิเคราะห์ */}
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold">
                      <MessageSquare className="h-4 w-4" /> AI Feedback
                    </h4>
                    <ScrollArea className="text-muted-foreground h-32 text-sm">
                      {log.ai_feedback}
                    </ScrollArea>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Ingredients Detected:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(log.analyzed_ingredients) ? (
                        log.analyzed_ingredients.map((ing: string, i: number) => (
                          <Badge key={i} variant="secondary">
                            {ing}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">ไม่มีข้อมูลส่วนประกอบ</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ส่วนการตรวจสอบของเภสัชกร */}
                <div className="flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold">Pharmacist Note:</h4>
                    <textarea
                      className="bg-background focus:ring-primary min-h-[100px] w-full rounded-md border p-3 text-sm outline-none focus:ring-1"
                      placeholder="ระบุข้อเสนอแนะหรือแก้ไขข้อมูลที่ AI วิเคราะห์ผิด..."
                      value={comment[log.id] || ''}
                      onChange={(e) => setComment({ ...comment, [log.id]: e.target.value })}
                      disabled={log.status !== 'pending'}
                    />
                  </div>

                  <div className="flex gap-3">
                    {log.status === 'pending' ? (
                      <>
                        <Button
                          className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                          onClick={() => handleVerify(log.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4" /> Confirm AI
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1 gap-2"
                          onClick={() => handleVerify(log.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4" /> Reject & Correct
                        </Button>
                      </>
                    ) : (
                      <div className="text-muted-foreground w-full rounded-md border py-2 text-center font-semibold italic">
                        Verified as: {log.status.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
