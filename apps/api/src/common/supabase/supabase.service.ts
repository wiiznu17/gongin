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
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_ANON_KEY'),
    );
    return this.clientInstance;
  }

  // ใช้สำหรับงานที่ต้องการสิทธิ์ Admin (เช่น การเข้าถึงทุก Profile)
  get adminClient() {
    return createClient(
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }
}
