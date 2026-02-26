import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { SupabaseService } from '../common/supabase/supabase.service';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    // ตั้งค่า Gemini Integration
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('GEMINI_API_KEY')!);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // แปลง Buffer เป็นรูปแบบที่ Gemini รับได้
  private toGenerativePart(buffer: Buffer, mimeType: string): Part {
    return {
      inlineData: { data: buffer.toString('base64'), mimeType },
    };
  }

  async processFoodImage(imageBuffer: Buffer, userId: string) {
    try {
      // 1. Image Processing: ให้ AI วิเคราะห์วัตถุดิบจากรูปภาพ
      const prompt = 'วิเคราะห์ภาพอาหารนี้ แล้วระบุวัตถุดิบหลักและสมุนไพรออกมาเป็นรายการภาษาไทย';
      const imagePart = this.toGenerativePart(imageBuffer, 'image/jpeg');
      const result = await this.model.generateContent([prompt, imagePart]);
      const ingredientsText = result.response.text();

      // 2. RAG System & Medical Matching: ค้นหาความเสี่ยงร่วมกับยาของผู้ใช้
      return await this.medicalMatchingEngine(ingredientsText, userId);
    } catch (error) {
      console.error('Error processing food image:', error);
      throw new InternalServerErrorException('AI Processing failed');
    }
  }

  async processVoiceSymptom(audioBuffer: Buffer) {
    // 1. Voice Processing: แปลงเสียงเป็นข้อความและอาการป่วย
    const prompt = 'จากไฟล์เสียงนี้ สรุปอาการป่วยของผู้ใช้และประวัติการกินเป็นข้อความภาษาไทย';
    const audioPart = this.toGenerativePart(audioBuffer, 'audio/wav'); // หรือ mimeType อื่น
    const result = await this.model.generateContent([prompt, audioPart]);
    return { analysis: result.response.text() };
  }

  private async medicalMatchingEngine(ingredients: string, userId: string) {
    // ดึงรายการยาของผู้ใช้จากฐานข้อมูล
    const { data: userMeds } = await this.supabaseService.adminClient
      .from('medications')
      .select('generic_name, brand_name')
      .eq('user_id', userId);

    // Layer 1: Hard-coded Rules (RAG) - ค้นหาข้อห้ามจากฐานข้อมูล interaction_rules
    // ใช้ RPC สำหรับ Vector Search ที่ตั้งไว้ในเฟส 2
    const risksFound: any[] = [];
    if (userMeds) {
      for (const med of userMeds) {
        const { data } = await this.supabaseService.adminClient.rpc('match_interaction_rules', {
          query_text: med.generic_name,
          match_threshold: 0.5,
          match_count: 3,
        });
        if (data) risksFound.push(...data);
      }
    }

    // Layer 2: AI Reasoning - ส่งข้อมูลทั้งหมดให้ AI วิเคราะห์ความปลอดภัยซ้อนอีกชั้น
    const finalPrompt = `
      วัตถุดิบที่ตรวจเจอ: ${ingredients}
      รายการยาที่ผู้ใช้ทาน: ${JSON.stringify(userMeds)}
      กฎข้อห้ามทางการแพทย์ที่พบ: ${JSON.stringify(risksFound)}
      คำแนะนำ: ให้วิเคราะห์ความเสี่ยงว่าอาหารนี้ปลอดภัยสำหรับผู้ป่วยรายนี้หรือไม่ พร้อมให้เหตุผล
    `;

    const finalResult = await this.model.generateContent(finalPrompt);
    return {
      safe: !finalResult.response.text().includes('ไม่ปลอดภัย'),
      analysis: finalResult.response.text(),
      risks_from_db: risksFound,
    };
  }
}
