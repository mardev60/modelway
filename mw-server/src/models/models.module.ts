import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { FirebaseService } from '../services/firebase.service';

@Module({
  imports: [],
  controllers: [ModelsController],
  providers: [ModelsService, FirebaseService],
  exports: [ModelsService]
})

export class ModelsModule {}