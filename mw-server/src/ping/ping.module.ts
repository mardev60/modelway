import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PingService } from './ping.service';
import { ModelsService } from 'src/models/models.service';
import { DatabaseModule } from 'src/database/models.module';
import { PingController } from './ping.controller';

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot()],
  providers: [PingService, ModelsService],
  controllers: [PingController]
})
export class PingModule {}
