import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/models.module';
import { ModelsModule } from './models/models.module';
import { PingModule } from './ping/ping.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://makiluspn:Uqkdyc8y80BEFe4p@modelway.ofy26.mongodb.net/mw_db?retryWrites=true&w=majority&appName=ModelWay'),
    ConfigModule.forRoot(),
    // MongooseModule.forRoot(
    //   'mongodb+srv://emmanuelniasse:fHyfq10zo2A7CaJ6@modelway.ofy26.mongodb.net/mw_db?retryWrites=true&w=majority&appName=ModelWay',
    // ),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?${process.env.MONGO_OPTIONS}`,
    ),
    ModelsModule,
    ProvidersModule,
    PingModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
