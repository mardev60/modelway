import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTokenGuard } from './guards/api-token.guard';
import { AuthGuard } from './guards/auth.guard';

@Controller('v1')
export class AppController {
  constructor(private appService: AppService) {}

  @Post('chat/completions')
  @UseGuards(ApiTokenGuard)
  async chatCompletions(@Body() body: any) {
    const { messages, model } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        error: { message: 'The "messages" property must be a non-empty array.' },
      };
    }

    if (!model || typeof model !== 'string') {
      return {
        error: { message: 'The "model" property is required and must be a string.' },
      };
    }

    const systemPrompt = messages
      .filter((msg) => msg.role === 'system')
      .map((msg) => msg.content)
      .join('\n');
    const userPrompt = messages
      .filter((msg) => msg.role === 'user')
      .map((msg) => msg.content)
      .join('\n');

    return this.appService.callApi({ model, systemPrompt, userPrompt });
  }
}