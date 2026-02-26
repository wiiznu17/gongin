import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze-food')
  @UseGuards(AuthGuard) //
  @UseInterceptors(FileInterceptor('image'))
  async analyzeFood(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.aiService.processFoodImage(file.buffer, req.user.id);
  }

  @Post('analyze-voice')
  @UseGuards(AuthGuard) //
  @UseInterceptors(FileInterceptor('audio'))
  async analyzeVoice(@UploadedFile() file: Express.Multer.File) {
    return this.aiService.processVoiceSymptom(file.buffer);
  }
}
