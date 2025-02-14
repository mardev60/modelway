import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { FirebaseService } from '../services/firebase.service';
import { UsersModule } from '../users/users.module';
import { RoleGuard } from '../guards/role.guard';

@Module({
  imports: [UsersModule],
  controllers: [ProvidersController],
  providers: [ProvidersService, FirebaseService, RoleGuard],
})

export class ProvidersModule {}