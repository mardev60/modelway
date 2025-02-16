import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { User } from './decorators/user.decorator';
import { ApiTokenGuard } from './guards/api-token.guard';
import { AuthGuard } from './guards/auth.guard';
import { QuotasService } from './quotas/quotas.service';

@Controller('v1')
export class AppController {
  constructor(
    private appService: AppService,
    private quotasService: QuotasService,
  ) {}

  /*
   * Route pour que l'utilisateur souscrit puisse utiliser l'API ModelWay
   */
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
        error: {
          message: 'The "messages" property must be a non-empty array.',
        },
      });
    }

    if (!model || typeof model !== 'string') {
      return response.json({
        error: {
          message: 'The "model" property is required and must be a string.',
        },
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

  /*
   * Route pour que l'utilisateur connecté puisse tester un modèle depuis ModelWay avec un quota limité
   */
  @Post('chat/completions/test')
  @UseGuards(AuthGuard)
  async chatCompletionsTest(
    @Body() body: any,
    @User() user: any,
    @Res() response: Response,
  ) {
    const hasQuota = await this.quotasService.checkUserQuota(
      user.uid,
      body.model,
    );

    if (!hasQuota) {
      return response.status(429).json({
        error: { message: 'Quota dépassé. Veuillez réessayer plus tard.' },
      });
    }

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

    try {
      const result = await this.appService.callApi({
        model,
        systemPrompt,
        userPrompt,
        userId: user.uid,
      });
      await this.quotasService.decrementQuota(user.uid, body.model);
      response.json(result);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }
}
