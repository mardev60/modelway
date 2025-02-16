import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { User } from './decorators/user.decorator';
import { ApiTokenGuard } from './guards/api-token.guard';
import { QuotasService } from './quotas/quotas.service';

@Controller('v1')
export class AppController {
  constructor(
    private appService: AppService,
    private quotasService: QuotasService,
  ) {}

  @Post('chat/completions')
  @UseGuards(ApiTokenGuard)
  async chatCompletions(
    @Body() body: any,
    @User() user: any,
    @Res() response: Response,
  ) {
    // Vérifier les quotas avant de procéder
    const hasQuota = await this.quotasService.checkUserQuota(
      user.uid,
      body.model,
    );

    if (!hasQuota) {
      return response.status(429).json({
        error: { message: 'Quota dépassé. Veuillez réessayer plus tard.' },
      });
    }

    await this.quotasService.decrementQuota(user.uid, body.model);

    const { messages, model, stream = false } = body;

    if (!messages || !model) {
      return response.status(400).json({
        error: { message: 'Messages and model are required.' },
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
