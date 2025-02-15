import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTokenGuard } from './guards/api-token.guard';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { Response } from 'express';

@Controller('v1')
export class AppController {
  constructor(private appService: AppService) {}

  @Post('chat/completions')
  @UseGuards(ApiTokenGuard)
  async chatCompletions(
    @Body() body: any,
    @User() user: any,
    @Res() response: Response,
  ) {
    const { messages, model, stream = false } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return response.json({
        error: { message: 'The "messages" property must be a non-empty array.' },
      });
    }

    if (!model || typeof model !== 'string') {
      return response.json({
        error: { message: 'The "model" property is required and must be a string.' },
      });
    }

    const systemPrompt = messages
      .filter((msg) => msg.role === 'system')
      .map((msg) => msg.content)
      .join('\n');

    const userPrompt = messages
      .filter((msg) => msg.role === 'user')
      .map((msg) => msg.content)
      .join('\n');

    if (stream) {
      response.setHeader('Content-Type', 'text/event-stream');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('Connection', 'keep-alive');

      try {
        const stream = await this.appService.streamResponse({
          model,
          systemPrompt,
          userPrompt,
          userId: user.uid,
        });

        for await (const chunk of stream) {
          response.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
        response.end();
      } catch (error) {
        response.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        response.end();
      }
    } else {
      try {
        const result = await this.appService.callApi({
          model,
          systemPrompt,
          userPrompt,
          userId: user.uid,
        });
        response.json(result);
      } catch (error) {
        response.status(500).json({ error: error.message });
      }
    }
  }
}