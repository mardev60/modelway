import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PingService } from './ping.service';
import { ModelsService } from 'src/models/models.service';
import { PingController } from './ping.controller';
import { FirebaseService } from '../services/firebase.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PingService, ModelsService, FirebaseService],
  controllers: [PingController]
})
export class PingModule {}
