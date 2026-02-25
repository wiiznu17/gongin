import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //
    SupabaseModule, //
    AiModule, // เพิ่ม AiModule เข้าไปในรายการ imports
  ],
  controllers: [AppController], //
  providers: [AppService], //
})
export class AppModule {}
