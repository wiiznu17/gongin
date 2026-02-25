import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private clientInstance: SupabaseClient;

  constructor(private configService: ConfigService) {}

  get client() {
    if (this.clientInstance) return this.clientInstance;

    this.clientInstance = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_ANON_KEY')!,
    );
    return this.clientInstance;
  }

  // ใช้สำหรับงานที่ต้องการสิทธิ์ Admin (เช่น การเข้าถึงทุก Profile)
  private adminInstance: SupabaseClient; // เพิ่มตัวแปรเก็บ instance

  get adminClient() {
    if (this.adminInstance) return this.adminInstance; // เช็ค cache

    this.adminInstance = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    return this.adminInstance;
  }
}
