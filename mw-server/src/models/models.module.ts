import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { FirebaseService } from '../services/firebase.service';
import { UsersModule } from '../users/users.module';
import { RoleGuard } from '../guards/role.guard';

@Module({
  imports: [UsersModule],
  controllers: [ModelsController],
  providers: [ModelsService, FirebaseService, RoleGuard],
  exports: [ModelsService]
})

export class ModelsModule {}