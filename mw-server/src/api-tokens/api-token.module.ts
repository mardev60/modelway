import { Module } from '@nestjs/common';
import { ApiTokenController } from 'src/api-tokens/api-token.controller';
import { ApiTokenService } from './api-token.service';
import { FirebaseService } from '../services/firebase.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ApiTokenController],
  providers: [ApiTokenService, FirebaseService],
  exports: [ApiTokenService]
})
export class ApiTokenModule {} 