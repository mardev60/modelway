import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { FirebaseService } from '../services/firebase.service';

@Module({
  imports: [],
  controllers: [ProvidersController],
  providers: [ProvidersService, FirebaseService],
})

export class ProvidersModule {}