import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * จุดเริ่มต้นของแอปพลิเคชัน
 *
 * ฟังก์ชัน bootstrap นี้มีหน้าที่สร้างคอนเท็กซ์ Nest
 * ปรับใช้การกำหนดค่าระดับโลก เปิดใช้งานการแชร์ทรัพยากรข้ามต้นทาง
 * และเริ่มตัวฟัง HTTP ที่พอร์ตที่กำหนด ในโปรเจ็กต์ระดับโปรดักชัน
 * เรายังลงทะเบียน global validation pipe และใช้ logger
 * เพื่อช่วยในการวินิจฉัยข้อผิดพลาดด้วย
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // สร้างแอป Nest จากโมดูลราก
  const app = await NestFactory.create(AppModule);

  // เปิดใช้งาน CORS เพื่อให้ frontend (หรือไคลเอนต์อื่น ๆ)
  // สามารถสื่อสารกับ API ได้ ในการตั้งค่าที่ซับซ้อนกว่า
  // คุณอาจกำหนด whitelist ของต้นทางที่อนุญาตแทนการอนุญาต '*'
  app.enableCors();

  // ใช้การตรวจสอบข้อมูลระดับโลกเพื่อแปลงและตรวจสอบ
  // ตัวข้อมูลที่เข้ามาตาม DTO ที่ตกแต่งด้วย class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // สามารถตั้ง prefix ระดับโลกสำหรับ route ทั้งหมดได้
  // app.setGlobalPrefix('api');

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);

  logger.log(`เซิร์ฟเวอร์กำลังฟังที่พอร์ต ${port}`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error('ไม่สามารถเริ่มแอปพลิเคชันได้', err.stack);
  process.exit(1);
});
