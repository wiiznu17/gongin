import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // เพิ่ม
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './common/supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // เพิ่มการตั้งค่า Config
    SupabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}