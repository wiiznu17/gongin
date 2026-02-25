import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('analyze-food')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async analyzeFood(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.aiService.analyzeFood(file.buffer, req.user.id);
  }
}
