import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelsModule } from './models/models.module';
import { PingModule } from './ping/ping.module';
import { ProvidersModule } from './providers/providers.module';
import { UsersModule } from './users/users.module';
import { FirebaseService } from './services/firebase.service';
import { ApiTokenModule } from './api-tokens/api-token.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ModelsModule,
    ProvidersModule,
    PingModule,
    UsersModule,
    ApiTokenModule,
    HistoryModule
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
