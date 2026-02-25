import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Global() // แนะนำให้ทำเป็น Global เพื่อให้ Guard เรียกใช้ได้ง่าย
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService], // ต้อง export ออกมา
})
export class SupabaseModule {}