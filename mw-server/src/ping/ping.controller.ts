import { Body, Controller, Post } from '@nestjs/common';
import { PingService } from './ping.service';

@Controller('ping')
export class PingController {
  constructor(private pingService: PingService) {}

  @Post()
  async root() {
    this.pingService.pingAllProviders();
  }
}