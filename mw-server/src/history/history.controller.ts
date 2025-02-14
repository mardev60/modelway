import { Controller, Get, Delete, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/decorators/user.decorator';

@Controller('history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async findAll(@User() user: any) {
    return this.historyService.findAllByUserId(user.uid);
  }

  @Delete()
  async deleteAll(@User() user: any) {
    return this.historyService.deleteByUserId(user.uid);
  }

  @Get('recent-models')
  async getRecentModels(@User() user: any) {
    return this.historyService.getRecentlyUsedModels(user.uid);
  }
} 