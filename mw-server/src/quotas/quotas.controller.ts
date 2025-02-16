import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { QuotasService } from './quotas.service';

@Controller('quotas')
@UseGuards(AuthGuard)
export class QuotasController {
  constructor(private readonly quotasService: QuotasService) {}

  @Get('check/:modelName')
  async checkQuota(@Req() request, @Param('modelName') modelName: string) {
    try {
      if (!request.user?.user_id) {
        console.error('No user ID found in request');
        return { remaining: 0 };
      }

      if (!modelName) {
        console.error('No model name provided');
        return { remaining: 0 };
      }

      const userId = request.user.user_id;

      const remaining = await this.quotasService.checkUserQuota(
        userId,
        modelName,
      );
      return { remaining };
    } catch (error) {
      console.error('Error checking quota:', error);
      console.error('Stack:', error.stack);
      return { remaining: 0 };
    }
  }
}
