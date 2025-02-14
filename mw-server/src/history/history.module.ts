import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { FirebaseService } from '../services/firebase.service';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, FirebaseService],
  exports: [HistoryService]
})
export class HistoryModule {} 