import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('v1')
export class AppController {
  constructor(private appService: AppService) {}

  @Post('chat/completions')
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

    const validRoles = ['system', 'user', 'assistant'];

    const systemPrompt = messages.filter((msg) => msg.role === 'system').map((msg) => msg.content).join('\n');
    const userPrompt = messages.filter((msg) => msg.role === 'user').map((msg) => msg.content).join('\n');

    const lastUserMessage = messages.reverse().find((msg) => msg.role === 'user')?.content || 'No user message provided.';

    return this.appService.callApi({model, systemPrompt, userPrompt});
  }
}