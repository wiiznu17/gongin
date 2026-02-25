import { createClient, SupabaseClient } from '@supabase/supabase-js';

// หมายเหตุ: ในอนาคตเมื่อเราทำ Database Schema เสร็จแล้ว 
// เราจะเอา Database Types มาใส่ตรง <any> นี้
let supabase: SupabaseClient | null = null;

export const getSupabaseClient = (url: string, key: string) => {
  if (!supabase) {
    supabase = createClient(url, key);
  }
  return supabase;
};