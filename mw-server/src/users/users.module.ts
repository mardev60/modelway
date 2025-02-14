import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FirebaseService } from '../services/firebase.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, FirebaseService],
  exports: [UsersService],
})
export class UsersModule {} 