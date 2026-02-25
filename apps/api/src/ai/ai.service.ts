import { Injectable } from '@nestjs/common';
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
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('GEMINI_API_KEY')!);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // ฟังก์ชันแปลง Buffer เป็น Part สำหรับ Gemini
  private bufferToGenerativePart(buffer: Buffer, mimeType: string): Part {
    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType,
      },
    };
  }

  async analyzeFood(imageBuffer: Buffer, userId: string) {
    // 1. วิเคราะห์วัตถุดิบจากภาพด้วย Gemini (Image Processing)
    const prompt =
      "ระบุวัตถุดิบและสมุนไพรในอาหารนี้อย่างละเอียดในรูปแบบ JSON: { 'ingredients': ['ชื่อภาษาไทย'] }";
    const imagePart = this.bufferToGenerativePart(imageBuffer, 'image/jpeg');

    const result = await this.model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const ingredients = JSON.parse(response.text()).ingredients;

    // 2. เริ่มระบบ RAG & Matching Engine
    return this.runMatchingEngine(ingredients, userId);
  }
  private async runMatchingEngine(ingredients: string[], userId: string) {
    // ชั้นที่ 1: ดึงรายการยาของผู้ใช้จากฐานข้อมูล
    const { data: userMedications } = await this.supabaseService.adminClient
      .from('medications')
      .select('generic_name, brand_name')
      .eq('user_id', userId);

    // ชั้นที่ 2: ค้นหาความเสี่ยงจาก Interaction Rules (RAG)
    const risks: any[] = [];
    if (userMedications) {
      for (const med of userMedications) {
        // ใช้ RPC match_interaction_rules ที่สร้างไว้ในเฟส 2 (Vector Search)
        // ในขั้นตอนนี้เราจะค้นหาว่าวัตถุดิบใดขัดกับยาตัวนี้ไหม
        const { data: matchedRules } = await this.supabaseService.adminClient.rpc(
          'match_interaction_rules',
          {
            query_text: med.generic_name, // ค้นหาความสัมพันธ์
            match_threshold: 0.5,
            match_count: 5,
          },
        );

        if (matchedRules) risks.push(...matchedRules);
      }
    }

    // สรุปผลด้วย AI โดยใช้ Context จากฐานข้อมูล (Final Reasoning)
    const finalPrompt = `
      ผู้ป่วยทานยา: ${JSON.stringify(userMedications)}
      วัตถุดิบในอาหาร: ${ingredients.join(', ')}
      กฎความปลอดภัยจากฐานข้อมูล: ${JSON.stringify(risks)}
      
      ให้สรุปว่าอาหารนี้ปลอดภัยหรือไม่ พร้อมเหตุผลอ้างอิงจากข้อมูลยาที่ได้รับ
    `;

    const finalResult = await this.model.generateContent(finalPrompt);
    return {
      is_safe: !finalResult.response.text().includes('ไม่ปลอดภัย'),
      analysis: finalResult.response.text(),
      detected_ingredients: ingredients,
    };
  }
}
